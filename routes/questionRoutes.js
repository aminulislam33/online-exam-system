const express = require('express');
const { createQuestion, getAllQuestions, getQuestionById, updateQuestion, deleteQuestion } = require('../controllers/questionController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');
const router = express.Router();

// Only admins can create questions
router.post('/create', verifyToken, isAdmin, createQuestion);
router.get('/', verifyToken, getAllQuestions);
router.get('/:id', getQuestionById);
router.put('/:id', updateQuestion);
router.delete('/:id', deleteQuestion);

module.exports = router;