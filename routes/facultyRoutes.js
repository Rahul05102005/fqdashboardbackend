const express = require('express');
const router = express.Router();
const { getFaculties, getFacultyById, createFaculty, updateFaculty, deleteFaculty } = require('../controllers/facultyController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', protect, getFaculties);
router.get('/:id', protect, getFacultyById);
router.post('/', protect, authorize('admin'), createFaculty);
router.put('/:id', protect, authorize('admin', 'faculty'), updateFaculty);
router.delete('/:id', protect, authorize('admin'), deleteFaculty);

module.exports = router;
