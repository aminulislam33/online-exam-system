const Exam = require('../models/Exam');
const Question = require('../models/Question');

exports.createExam = async (req, res) => {
    const { title, description, questions, duration, startTime, endTime } = req.body;

    try {
        const newExam = new Exam({
            title,
            description,
            questions,
            duration,
            startTime,
            endTime,
            createdBy: req.userId,
        });
        await newExam.save();

        res.status(201).json({ message: 'Exam created successfully', exam: newExam });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create exam' });
    }
};

exports.getExams = async (req, res) => {
    try {
        const exams = await Exam.find().populate('questions');
        res.json(exams);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve exams' });
    }
};

exports.getExamById = async (req, res) => {
    const { id } = req.params;

    try {
        const exam = await Exam.findById(id).populate('questions'); // Populate questions
        if (!exam) return res.status(404).json({ error: "Exam not found" });
        res.status(200).json(exam);
    } catch (error) {
        res.status(500).json({ error: "Failed to retrieve exam" });
    }
};

exports.updateExam = async (req, res) => {
    const { id } = req.params;
    const { title, description, questions, duration, startTime, endTime } = req.body;

    try {
        const exam = await Exam.findByIdAndUpdate(id, { title, description, questions, duration, startTime, endTime }, { new: true });
        if (!exam) return res.status(404).json({ error: "Exam not found" });
        res.status(200).json({ message: "Exam updated successfully", exam });
    } catch (error) {
        res.status(500).json({ error: "Failed to update exam" });
    }
};

exports.deleteExam = async (req, res) => {
    const { id } = req.params;

    try {
        const exam = await Exam.findByIdAndDelete(id);
        if (!exam) return res.status(404).json({ error: "Exam not found" });
        res.status(200).json({ message: "Exam deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete exam" });
    }
};