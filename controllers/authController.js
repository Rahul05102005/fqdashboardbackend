const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { Faculty } = require('../models/index');

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public (or Admin only depending on needs)
const registerUser = async (req, res) => {
    const { name, email, password, role, department } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
    }

        const user = await User.create({
            name,
            email,
            password,
            role,
            department
        });
        
        if (user) {
            // If user is a faculty, create a faculty profile
            if (role === 'faculty') {
                await Faculty.create({
                    userId: user._id,
                    name: user.name,
                    email: user.email,
                    department: department || 'General',
                    designation: 'Professor', // Default designation
                    joiningDate: new Date().toISOString(),
                    status: 'active'
                });
            }

            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    const { email, password, role } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        if (role && user.role !== role) {
            return res.status(403).json({ message: `Access denied. You are not registered as a ${role}.` });
        }
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            department: user.department,
            token: generateToken(user._id),
        });
    } else {
        res.status(401).json({ message: 'Invalid email or password' });
    }
};

// @desc    Get user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            department: user.department,
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

module.exports = { registerUser, loginUser, getMe };
