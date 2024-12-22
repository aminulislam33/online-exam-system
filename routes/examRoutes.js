const express = require('express');
const { createExam, getExams, getExamById, updateExam, deleteExam } = require('../controllers/examController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/create', verifyToken, isAdmin, createExam);
router.get('/', verifyToken, getExams);
router.get('/:id', verifyToken, getExamById);
router.put('/:id', verifyToken, isAdmin, updateExam);
router.delete('/:id', verifyToken, isAdmin, deleteExam);

module.exports = router;