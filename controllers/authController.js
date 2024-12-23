const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { sendOTP } = require('./verifyEmail');

exports.signup = async (req, res) => {
    const { name, email, department, enrollmentNumber, semester, year, password } = req.body;
    if ( !name || !email || !password || !department || !enrollmentNumber || !semester || !year ) {
        return res.status(400).json({ status: "error", message: "Please provide all required fields." });
    }

    try {
        const existUser = await User.findOne({email});
        if(existUser){
            return res.status(409).json({status: "error", message: "Email is already exist"});
        }
        const newUser = new User({
            name,
            email,
            department,
            enrollmentNumber,
            semester,
            year,
            password
        });
        await newUser.save();
        res.status(201).json({ status: "success", message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ status: "error", message: "Something went wrong. Please try again later." });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ status: "error", message: "Please provide all required fields." });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ status: "error", message: 'Invalid email or password' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ status: "error", message: 'Invalid email or password' });

        const payload = { email: user.email, id: user._id, role: user.role };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
        return res.status(200).json({ status: "success", message: 'Login successful', token });
    } catch (error) {
        res.status(500).json({ status: "error", message: "Something went wrong. Please try again later." });
    }
};