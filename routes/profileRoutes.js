const express = require('express');
const { changePassword, fetchProfile, updateProfile, uploadPicture } = require('../controllers/profileController');
const router = express.Router();

router.get('/', fetchProfile);
router.put('/update', updateProfile);
router.put('/change-password', changePassword);
router.post('/upload-picture', uploadPicture);

module.exports = router;