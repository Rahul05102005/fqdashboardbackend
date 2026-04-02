const express = require('express');
const router = express.Router();
const { getCourses, getCourseById, createCourse } = require('../controllers/courseController');
// For simplicity, we can add auth middleware later if needed
// router.get('/', getCourses);
// router.get('/:id', getCourseById);
// router.post('/', createCourse);

router.route('/')
    .get(getCourses)
    .post(createCourse);

router.route('/:id')
    .get(getCourseById);

module.exports = router;
