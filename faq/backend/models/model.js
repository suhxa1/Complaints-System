const mongoose=require("mongoose")

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    address: { // Change here
        type: String,
        required: false,
    },
    addresses: {
        type: [String],
        required: true,
        default: []
    },
    contactNo: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    lastLogin: {
        type: Date,
        default: Date.now
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    resetPasswordToken: String,
    resetPasswordExpiresAt: Date,
    otp: String, // Store OTP
    otpExpiresAt: Date // Store OTP expiration time
}, { timestamps: true });

 const User = mongoose.model('User', userSchema);
 module.exports = User;
