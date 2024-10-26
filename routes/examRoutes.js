const express = require('express');
const { createExam, getExams, getExamById, updateExam, deleteExam } = require('../controllers/examController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/create', verifyToken, isAdmin, createExam);   // Only admins can create exams
router.get('/', verifyToken, getExams);                     // Students and admins can view exams
router.get('/:id', verifyToken, getExamById); // Get exam by ID
router.put('/:id', verifyToken, isAdmin, updateExam); // Update exam
router.delete('/:id', verifyToken, isAdmin, deleteExam); // Delete exam

module.exports = router;