const { check } = require('express-validator');

exports.startExamValidationRules = [
    check('examId')
        .trim()
        .notEmpty()
        .withMessage('Exam ID is required')
        .isMongoId()
        .withMessage('Invalid Exam ID format'),
];