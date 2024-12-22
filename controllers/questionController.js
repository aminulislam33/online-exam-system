const cloudinary = require('cloudinary').v2;
const { text } = require('express');
const Question = require('../models/Question');

cloudinary.config({
    cloud_name: "dwr8472qb",
    api_key: "872674654568337",
    api_secret: "c3968uQj-l8n4EDCQaBjxrQC40g"
});

exports.createQuestion = async (req, res) => {
    const { text, options, type, category } = req.body;
    const imageFile = req.file;

    if (!text || !options || !type || !category) {
        return res.status(400).json({ error: "Please provide all required fields." });
    }

    try {
        const correctOption = options.find(option => option.isCorrect === true);
        if (!correctOption) {
            return res.status(400).json({ error: 'Correct answer must be one of the options.' });
        }

        let imageUrl = null;

        if (imageFile) {
            const uploadResult = await cloudinary.uploader.upload(imageFile.path, {
                folder: 'questions'
            });
            imageUrl = uploadResult.secure_url;
        }


        const question = new Question({
            text,
            options,
            type,
            category,
            image: imageUrl
        });

        await question.save();
        res.status(201).json({ message: "Question created successfully", question });
    } catch (error) {
        if (error.name === "ValidationError") {
            const errorMessages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ error: errorMessages.join(", ") });
        }
        console.error("Error creating question:", error);
        res.status(500).json({ error: "Failed to create question" });
    }
};

exports.getAllQuestions = async (req, res) => {
    try {
        const questions = await Question.find();
        res.status(200).json(questions);
    } catch (error) {
        res.status(500).json({ error: "Failed to retrieve questions" });
    }
};

exports.getQuestionById = async (req, res) => {
    const { id } = req.params;
    try {
        const question = await Question.findById(id);
        if (!question) return res.status(404).json({ error: 'Question not found' });
        res.status(200).json(question);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve question' });
    }
};

exports.updateQuestion = async (req, res) => {
    const { id } = req.params;
    const { questionText, type, category } = req.body;

    try {
        const question = await Question.findById(id);
        if (!question) return res.status(404).json({ error: 'Question not found' });

        let updateFields = {};

        updateFields = {
            ...(text && {text: questionText}),
            ...(type && {type}),
            ...(category && {category}),
        };

        const updatedQuestion = await Question.findByIdAndUpdate(id, updateFields, { new: true });

        if (!updatedQuestion) {
            return res.status(404).json({ error: 'Failed to update the question.' });
        }

        res.status(200).json({ message: 'Question updated successfully', updatedQuestion });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update question' });
    }
};

exports.deleteQuestion = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedQuestion = await Question.findByIdAndDelete(id);
        if (!deletedQuestion) return res.status(404).json({ error: 'Question not found' });
        res.status(200).json({ message: 'Question deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete question' });
    }
};