const bcrypt = require('bcryptjs');
const User = require("../models/User");
const { handleError } = require('../utils/handleError');
const cloudinary = require('../config/cloudinary');

const fetchProfile = async (req,res)=>{
    try {
        const user = await User.findById(req.userId).select("-password");
        if(!user){
            return res.status(404).json({status: "error", message: "User not found"});
        }

        return res.status(200).json({status: "success", data: user});
    } catch (error) {
        handleError(res, error);
    }
};

const updateProfile = async (req, res) => {
    const { name, phone } = req.body;

    try {
        const updatedProfile = await User.findByIdAndUpdate(
            req.userId, 
            { name, phone },
            { new: true, runValidators: true }
        );

        if (!updatedProfile) {
            return res.status(404).json({ status: "error", message: "User not found" });
        }

        return res.status(200).json({
            status: "success", 
            message: "Profile updated successfully", 
            data: updatedProfile 
        });
    } catch (error) {
        return res.status(500).json({ status: "error", message: "Something went wrong", error: error.message });
    }
};

const changePassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;

    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ status: "error", message: "User not found" });
        }

        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ status: "error", message: "Incorrect current password" });
        }

        const isSamePassword = await bcrypt.compare(newPassword, user.password);
        if (isSamePassword) {
            return res.status(400).json({ status: "error", message: "New password cannot be the same as the old password" });
        }

        user.password = newPassword;
        await user.save();

        return res.status(200).json({ status: "success", message: "Password updated successfully" });
    } catch (error) {
        console.error("Error changing password:", error);
        return res.status(500).json({ status: "error", message: "Something went wrong. Please try again later." });
    }
};

const uploadPicture = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ status: "error", message: "No file provided for upload." });
        }
        
        const uploadResult = await cloudinary.uploader.upload(req.file.path, {
            folder: "ProfilePicture",
        });

        const updatedProfile = await User.findByIdAndUpdate(
            req.userId,
            { profilePicture: uploadResult.secure_url },
            { new: true }
        );
        
        if (!updatedProfile) {
            return res.status(404).json({ status: "error", message: "User not found." });
        }

        return res.status(200).json({
            status: "success",
            message: "Profile picture updated successfully.",
            user: updatedProfile
        });
    } catch (error) {
        console.error("Error uploading profile picture:", error);
        return res.status(500).json({
            status: "error",
            message: "Something went wrong. Please try again later."
        });
    }
};

module.exports = {
    fetchProfile,
    updateProfile,
    changePassword,
    uploadPicture,
}