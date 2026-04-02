const { Metric } = require('../models/index');

// @desc    Get all metrics
// @route   GET /api/metrics
// @access  Private (Admin)
const getMetrics = async (req, res) => {
    try {
        const metrics = await Metric.find({}).populate('facultyId', 'name email department');
        res.json(metrics);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get metrics for specific faculty
// @route   GET /api/metrics/faculty/:facultyId
// @access  Private (Admin/Faculty)
const getMetricsByFaculty = async (req, res) => {
    try {
        const metrics = await Metric.find({ facultyId: req.params.facultyId }).populate('facultyId', 'name');
        res.json(metrics);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create/Update metrics
// @route   POST /api/metrics
// @access  Private (Admin)
const createOrUpdateMetric = async (req, res) => {
    try {
        const { facultyId, semester, academicYear, teachingQualityScore, researchContribution, syllabusCompletion, attendanceCompliance, studentPassRate, innovativeTeaching, overallScore, evaluatedBy } = req.body;

        const metric = await Metric.findOneAndUpdate(
            { facultyId, semester, academicYear },
            { 
                teachingQualityScore, 
                researchContribution, 
                syllabusCompletion, 
                attendanceCompliance, 
                studentPassRate, 
                innovativeTeaching, 
                overallScore,
                evaluatedBy,
                evaluatedAt: Date.now()
            },
            { new: true, upsert: true }
        );

        res.status(201).json(metric);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    getMetrics,
    getMetricsByFaculty,
    createOrUpdateMetric
};
