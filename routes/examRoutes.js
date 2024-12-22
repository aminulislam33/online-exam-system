const express = require('express');
const { createExam, getExams, getExamById, updateExam, deleteExam } = require('../controllers/examController');
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');
const router = express.Router();

router.use(verifyToken);
router.get('/', getExams);
router.get('/:id', getExamById);
router.use(isAdmin);
router.post('/create', createExam);
router.put('/:id', updateExam);
router.delete('/:id', deleteExam);

module.exports = router;