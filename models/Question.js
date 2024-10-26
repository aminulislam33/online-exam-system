const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
    },
    options: [
        {
            text: String,
            isCorrect: Boolean,
        },
    ],
    type: {
        type: String,
        enum: ['multiple-choice', 'true-false'],
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model('Question', questionSchema);