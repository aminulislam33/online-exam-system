const express = require('express');
const { startExam, submitExam } = require('../controllers/examTakingController');
const { verifyToken } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/start', verifyToken, startExam); // Start exam
router.post('/submit', verifyToken, submitExam); // Submit exam

module.exports = router;