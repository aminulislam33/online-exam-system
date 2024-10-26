const Question = require('../models/Question');

exports.createQuestion = async (req, res) => {
    const { text, options, type, category } = req.body;

    if (!text || !options || !type || !category) {
        return res.status(400).json({ error: "Please provide all required fields." });
    }

    try {
        const question = new Question({
            text,
            options,
            type,
            category
        });

        await question.save();
        res.status(201).json({ message: "Question created successfully", question });
    } catch (error) {
        res.status(500).json({ error: "Failed to create question" });
    }
};

exports.getAllQuestions = async (req, res) => {
    try {
        const questions = await Question.find(); // Fetch all questions
        res.status(200).json(questions); // Return the questions in the response
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
    const { questionText, options, correctAnswer } = req.body; // Adjust based on your schema
    try {
        const updatedQuestion = await Question.findByIdAndUpdate(id, { questionText, options, correctAnswer }, { new: true });
        if (!updatedQuestion) return res.status(404).json({ error: 'Question not found' });
        res.status(200).json(updatedQuestion);
    } catch (error) {
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