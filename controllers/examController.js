const Exam = require('../models/Exam');
const Question = require('../models/Question');

exports.createExam = async (req, res) => {
    const { title, description, questions, duration, startTime, endTime } = req.body;
    if (!title || !questions || !startTime || !endTime || !duration) {
        return res.status(400).json({ status: "error", message: "All required fields must be provided" });
    }
    
    if (!Array.isArray(questions) || questions.length === 0) {
        return res.status(400).json({ status: "error", message: "At least one question must be provided" });
    }    

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

        return res.status(201).json({ status: "success", message: 'Exam created successfully' });
    } catch (error) {
        return res.status(500).json({ status: "error", message: 'Something went wrong. Please try again later.' });
    }
};

exports.getExams = async (req, res) => {
    try {
        const exams = await Exam.find().populate('questions');
        if(exams.length === 0){
            return res.status(404).json({status: "error", message: "Exams not found"});
        }
        return res.json({status: "success", data: {exams}});
    } catch (error) {
        return res.status(500).json({ status: "error", message: 'Something went wrong. Please try again later.' });
    }
};

exports.getExamById = async (req, res) => {
    const { id } = req.params;

    try {
        const exam = await Exam.findById(id).populate('questions');
        if (!exam) return res.status(404).json({ status: "error", message: "Exam not found" });
        return res.status(200).json({status: "success", data: {exam}});
    } catch (error) {
        return res.status(500).json({ status: "error", message: "Something went wrong. Please try again later." });
    }
};

exports.updateExam = async (req, res) => {
    const { id } = req.params;
    const { title, description, questions, duration, startTime, endTime } = req.body;

    try {
        const exam = await Exam.findByIdAndUpdate(id, { title, description, questions, duration, startTime, endTime }, { new: true });
        if (!exam) return res.status(404).json({ status: "error", message: "Exam not found" });
        return res.status(200).json({ status: "success", message: "Exam updated successfully" });
    } catch (error) {
        return res.status(500).json({ status: "error", message: "Something went wrong. Please try again later." });
    }
};

exports.deleteExam = async (req, res) => {
    const { id } = req.params;

    try {
        const exam = await Exam.findByIdAndDelete(id);
        if (!exam) return res.status(404).json({ status: "error", message: "Exam not found" });
        return res.status(200).json({ status: "success", message: "Exam deleted successfully" });
    } catch (error) {
        return res.status(500).json({ status: "error",  message: "Something went wrong. Please try again later." });
    }
};