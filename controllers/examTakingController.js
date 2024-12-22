const Exam = require('../models/Exam');
const Result = require('../models/Result');

exports.startExam = async (req, res) => {
    const { examId } = req.body;

    try {
        const exam = await Exam.findById(examId).populate('questions');
        if (!exam) return res.status(404).json({ error: "Exam not found" });

        const currentTime = new Date();

        if (currentTime < exam.startTime) {
            return res.status(403).json({ error: "The exam has not started yet." });
        }

        if (currentTime > exam.endTime) {
            return res.status(403).json({ error: "The exam has already ended." });
        }


        res.status(200).json({ exam });
    } catch (error) {
        res.status(500).json({ error: "Failed to start exam" });
    }
};

exports.submitExam = async (req, res) => {
    const { examId, answers } = req.body;
    const studentId = req.userId;

    try {
        const exam = await Exam.findById(examId).populate('questions');
        if (!exam) return res.status(404).json({ error: "Exam not found" });

        let score = 0;
        exam.questions.forEach(question => {
            const correctAnswer = question.options.find(option => option.isCorrect);
            const selectedAnswer = answers.find(answer => answer.questionId === question._id.toString());
            if (selectedAnswer && selectedAnswer.selectedOption === correctAnswer.text) {
                score++;
            }
        });

        const result = new Result({
            studentId,
            examId,
            score,
            answers: answers.map(answer => ({
                questionId: answer.questionId,
                selectedOption: answer.selectedOption
            }))
        });

        await result.save();

        res.status(200).json({ message: "Exam submitted successfully", score });
    } catch (error) {
        res.status(500).json({ error: "Failed to submit exam" });
    }
};