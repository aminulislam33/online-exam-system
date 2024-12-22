const cloudinary = require('cloudinary').v2;
const { text } = require('express');
const Question = require('../models/Question');

cloudinary.config({
    cloud_name: "",
    api_key: "",
    api_secret: ""
});

exports.createQuestion = async (req, res) => {
    const { text, options, type, category } = req.body;
    const imageFile = req.file;

    if (!text || !options || !type || !category) {
        return res.status(400).json({ status: "error", message: "Please provide all required fields." });
    }

    try {
        const correctOption = options.find(option => option.isCorrect === true);
        if (!correctOption) {
            return res.status(400).json({ status: "error", message: 'Correct answer must be one of the options.' });
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
        return res.status(201).json({ status: "sucess", message: "Question created successfully", question });
    } catch (error) {
        if (error.name === "ValidationError") {
            const errorMessages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ status: "error" ,message: errorMessages.join(", ") });
        }
        console.error("Error creating question:", error);
        return res.status(500).json({ status: "error", message: "Something went wrong. Please try again later." });
    }
};

exports.getAllQuestions = async (req, res) => {
    try {
        const questions = await Question.find();
        return res.status(200).json({status: "success", questions});
    } catch (error) {
        return res.status(500).json({ status: "error", message: "Something went wrong. Please try again later." });
    }
};

exports.getQuestionById = async (req, res) => {
    const { id } = req.params;
    try {
        const question = await Question.findById(id);
        if (!question) return res.status(404).json({ status: "error", message: 'Question not found' });
        return res.status(200).json({status: "success", question});
    } catch (error) {
        return res.status(500).json({ status: "error", message: "Something went wrong. Please try again later." });
    }
};

exports.updateQuestion = async (req, res) => {
    const { id } = req.params;
    const { questionText, type, category } = req.body;

    try {
        const question = await Question.findById(id);
        if (!question) return res.status(404).json({ status: "error", message: 'Question not found' });

        let updateFields = {};

        updateFields = {
            ...(text && {text: questionText}),
            ...(type && {type}),
            ...(category && {category}),
        };

        const updatedQuestion = await Question.findByIdAndUpdate(id, updateFields, { new: true });

        if (!updatedQuestion) {
            return res.status(404).json({ status: "error", message: 'Failed to update the question.' });
        }

        return res.status(200).json({ status: "success", message: 'Question updated successfully', updatedQuestion });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: "error", message: 'Something went wrong. Please try again later.' });
    }
};

exports.deleteQuestion = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedQuestion = await Question.findByIdAndDelete(id);
        if (!deletedQuestion) return res.status(404).json({ status: "error", message: 'Question not found' });
        res.status(200).json({ status: "success", message: 'Question deleted successfully' });
    } catch (error) {
        res.status(500).json({ status: "error", message: 'Something went wrong. Please try again later.' });
    }
};