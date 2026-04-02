const express = require('express');
const router = express.Router();
const { getMetrics, getMetricsByFaculty, createOrUpdateMetric } = require('../controllers/metricsController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', protect, authorize('admin'), getMetrics);
router.get('/faculty/:facultyId', protect, authorize('admin', 'faculty'), getMetricsByFaculty);
router.post('/', protect, authorize('admin'), createOrUpdateMetric);

module.exports = router;
