const { Feedback, Faculty } = require('../models/index');

// @desc    Submit feedback
// @route   POST /api/feedback
// @access  Private (Student)
const submitFeedback = async (req, res) => {
    try {
        const { facultyId, courseId, semester, academicYear, ratings, comments, isAnonymous } = req.body;

        const feedback = new Feedback({
            facultyId,
            courseId,
            studentId: req.user._id,
            semester,
            academicYear,
            ratings,
            comments,
            isAnonymous
        });

        const createdFeedback = await feedback.save();

        // Update overall faculty averageRating and totalFeedbacks
        const feedbacks = await Feedback.find({ facultyId });
        const total = feedbacks.length;
        
        // Calculate average of all categories for all feedbacks
        const allRatings = feedbacks.map(f => {
            const vals = Object.values(f.ratings);
            return vals.reduce((a, b) => a + b, 0) / vals.length;
        });
        const average = allRatings.reduce((acc, r) => acc + r, 0) / (total || 1);

        await Faculty.findByIdAndUpdate(facultyId, {
            averageRating: parseFloat(average.toFixed(2)),
            totalFeedbacks: total
        });


        res.status(201).json(createdFeedback);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get all feedback
// @route   GET /api/feedback
// @access  Private (Admin)
const getAllFeedback = async (req, res) => {
    try {
        const feedbacks = await Feedback.find({})
            .populate('facultyId', 'name email department')
            .populate('courseId', 'name code')
            .populate('studentId', 'name email');
        res.json(feedbacks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get feedback for specific faculty
// @route   GET /api/feedback/faculty/:facultyId
// @access  Private (Admin/Faculty)
const getFeedbackByFaculty = async (req, res) => {
    try {
        const feedbacks = await Feedback.find({ facultyId: req.params.facultyId })
            .populate('courseId', 'name code')
            .populate('studentId', 'name email');
        res.json(feedbacks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    submitFeedback,
    getAllFeedback,
    getFeedbackByFaculty
};
