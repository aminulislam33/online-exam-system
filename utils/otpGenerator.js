const otpGenerator = require('otp-generator');

const generateOTP = () => {
    return otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
        digits: true,
    });
};

module.exports = generateOTP;