const { Course } = require('../models/index');

// @desc    Get all courses
// @route   GET /api/courses
// @access  Public
const getCourses = async (req, res, next) => {
    try {
        const courses = await Course.find();
        res.status(200).json(courses);
    } catch (error) {
        next(error);
    }
};

// @desc    Get course by ID
// @route   GET /api/courses/:id
// @access  Public
const getCourseById = async (req, res, next) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }
        res.status(200).json(course);
    } catch (error) {
        next(error);
    }
};

// @desc    Create a course
// @route   POST /api/courses
// @access  Private (Admin)
const createCourse = async (req, res, next) => {
    try {
        const { code, name, semester, credits, department } = req.body;
        const courseExists = await Course.findOne({ code });
        if (courseExists) {
            return res.status(400).json({ message: 'Course already exists' });
        }
        const course = await Course.create({ code, name, semester, credits, department });
        res.status(201).json(course);
    } catch (error) {
        next(error);
    }
};

module.exports = { getCourses, getCourseById, createCourse };
