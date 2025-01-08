// Generate a random 6-digit OTP
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};
const jwt = require('jsonwebtoken');

// Generate JWT token and send it in a cookie
const generateToken = (res, userId) => {
    // Create JWT payload with user ID
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: '1h', // Token expiration time (1 hour)
    });

    // Set the token as an HTTP-only cookie to prevent XSS attacks
    res.cookie('token', token, {
        httpOnly: true,     // Make the cookie inaccessible to JavaScript
        secure: process.env.NODE_ENV === 'production', // Use secure cookies in production (HTTPS)
        sameSite: 'strict', // Ensure the cookie is sent only from the same domain
        maxAge: 3600000,    // 1 hour (in milliseconds)
    });

    console.log('JWT token generated and sent to user');
};

// Export the functions
module.exports = {
    generateOTP,
    generateToken
};
