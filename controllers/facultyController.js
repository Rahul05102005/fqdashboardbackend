const { Faculty } = require('../models/index');
const User = require('../models/User');

// @desc    Get all faculty
// @route   GET /api/faculty
// @access  Private (Admin/Faculty)
// @desc    Get all faculty
// @route   GET /api/faculty
// @access  Private (Admin/Faculty)
const getFaculties = async (req, res) => {
    try {
        const faculties = await Faculty.find({})
            .populate('userId', 'name email role')
            .populate('coursesAssigned');
        res.json(faculties);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// @desc    Get single faculty
// @route   GET /api/faculty/:id
// @access  Private
const getFacultyById = async (req, res) => {
    try {
        const faculty = await Faculty.findById(req.params.id).populate('userId', 'name email role').populate('coursesAssigned');
        if (faculty) {
            res.json(faculty);
        } else {
            res.status(404).json({ message: 'Faculty not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create new faculty
// @route   POST /api/faculty
// @access  Private (Admin)
const createFaculty = async (req, res) => {
    try {
        let { userId, name, email, department, designation, qualification, experience, specialization, joiningDate, status, coursesAssigned } = req.body;

        // If no userId provided, create a new User account for the faculty
        if (!userId) {
            const userExists = await User.findOne({ email });
            if (userExists) {
                userId = userExists._id;
            } else {
                // In a real app we'd hash the password, but the User model might have a pre-save hook
                const newUser = await User.create({
                    name,
                    email,
                    password: 'faculty123', // Default password
                    role: 'faculty',
                    department: department || 'General'
                });
                userId = newUser._id;
            }
        }

        const faculty = new Faculty({
            userId,
            name,
            email,
            department,
            designation,
            qualification,
            experience,
            specialization: specialization || [],
            joiningDate: joiningDate || new Date(),
            status: status || 'active',
            coursesAssigned: coursesAssigned || []
        });

        const createdFaculty = await faculty.save();
        res.status(201).json(createdFaculty);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


// @desc    Update faculty
// @route   PUT /api/faculty/:id
// @access  Private (Admin/Faculty)
const updateFaculty = async (req, res) => {
    try {
        const faculty = await Faculty.findById(req.params.id);

        if (faculty) {
            faculty.name = req.body.name || faculty.name;
            faculty.department = req.body.department || faculty.department;
            faculty.designation = req.body.designation || faculty.designation;
            faculty.qualification = req.body.qualification || faculty.qualification;
            faculty.experience = req.body.experience || faculty.experience;
            faculty.specialization = req.body.specialization || faculty.specialization;
            faculty.status = req.body.status || faculty.status;
            faculty.coursesAssigned = req.body.coursesAssigned || faculty.coursesAssigned;

            const updatedFaculty = await faculty.save();
            res.json(updatedFaculty);
        } else {
            res.status(404).json({ message: 'Faculty not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete faculty
// @route   DELETE /api/faculty/:id
// @access  Private (Admin)
const deleteFaculty = async (req, res) => {
    try {
        const faculty = await Faculty.findById(req.params.id);

        if (faculty) {
            await faculty.deleteOne();
            res.json({ message: 'Faculty removed' });
        } else {
            res.status(404).json({ message: 'Faculty not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getFaculties,
    getFacultyById,
    createFaculty,
    updateFaculty,
    deleteFaculty
};
