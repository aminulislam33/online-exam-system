const express = require('express');
const { startExam, submitExam } = require('../controllers/examTakingController');
const { submitExamValidationRules } = require('../validationRules/validateExamSubmit');
const validate = require('../middlewares/validate');
const { startExamValidationRules } = require('../validationRules/validateExamStart');
const router = express.Router();

router.post('/start', startExamValidationRules, validate, startExam);
router.post('/submit', submitExamValidationRules, validate, submitExam);

module.exports = router;