const express = require('express');
const multer = require('multer');
const { createQuestion, getAllQuestions, getQuestionById, updateQuestion, deleteQuestion } = require('../controllers/questionController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/create', verifyToken, isAdmin, upload.single('image'), createQuestion);
router.get('/', verifyToken, getAllQuestions);
router.get('/:id', getQuestionById);
router.put('/:id', updateQuestion);
router.delete('/:id', deleteQuestion);

module.exports = router;