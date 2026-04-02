const express = require('express');
const router = express.Router();
const { submitFeedback, getAllFeedback, getFeedbackByFaculty } = require('../controllers/feedbackController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', protect, authorize('student'), submitFeedback);
router.get('/', protect, authorize('admin'), getAllFeedback);
router.get('/faculty/:facultyId', protect, authorize('admin', 'faculty'), getFeedbackByFaculty);

module.exports = router;
