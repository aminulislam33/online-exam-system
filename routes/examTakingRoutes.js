const express = require('express');
const { startExam, submitExam } = require('../controllers/examTakingController');
const router = express.Router();

router.post('/start', startExam);
router.post('/submit', submitExam);

module.exports = router;