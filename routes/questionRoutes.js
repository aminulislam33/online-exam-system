const express = require('express');
const multer = require('multer');
const { createQuestion, getAllQuestions, getQuestionById, updateQuestion, deleteQuestion } = require('../controllers/questionController');
const { isAdmin } = require('../middlewares/authMiddleware');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.use(isAdmin);
router.post('/create', upload.single('image'), createQuestion);
router.get('/', getAllQuestions);
router.get('/:id', getQuestionById);
router.put('/:id', updateQuestion);
router.delete('/:id', deleteQuestion);

module.exports = router;