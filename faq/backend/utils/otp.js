const nodemailer = require('nodemailer'); // Change to CommonJS
const dotenv = require('dotenv'); // Change to CommonJS
dotenv.config();

// Create a transporter for sending emails
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.GMAIL, // Your email
        pass: process.env.GPASS  // Your email password
    }
});

// Send OTP via email
const sendOTPEmail = async (email, otp) => {
    const mailOptions = {
        from: process.env.GMAIL,
        to: email,
        subject: 'Welcome please enter this OTP to verify your email address',
        text: `Your OTP code is ${otp}`
    };

    console.log('Sending OTP email with options:', mailOptions);

    try {
        await transporter.sendMail(mailOptions);
        console.log('OTP sent successfully');
    } catch (error) {
        console.error('Error sending OTP:', error);
        throw new Error('Error sending OTP');
    }
};

module.exports = {
    sendOTPEmail
};
