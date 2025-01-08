const bcryptjs = require("bcryptjs");
const  User  = require("../models/model.js"); // Change to require
const { generateOTP, generateToken } = require("../utils/generatetoken.js"); // Change to require
const { sendOTPEmail } = require("../utils/otp.js"); // Change to require

// Signup function (send OTP, don't save the user yet)
const signup = async (req, res) => {
    const { name, email, address, contactNo, password } = req.body;

    try {
        if (!name || !email || !address || !contactNo || !password) {
            throw new Error("All fields are required");
        }

        const userAlreadyExists = await User.findOne({ email });
        if (userAlreadyExists) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }

        const hashedPassword = await bcryptjs.hash(password, 10);
        const otp = generateOTP();
        const otpExpiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

        // Log session data
        console.log("Setting session data:", {
            name,
            email,
            address,
            contactNo,
            otp,
            otpExpiresAt,
        });

        req.session.tempUserData = {
            name,
            email,
            address,
            contactNo,
            password: hashedPassword,
            otp,
            otpExpiresAt,
        };

        await sendOTPEmail(email, otp);
        res.status(200).json({
            success: true,
            message: "OTP sent to your email. Please verify the OTP to complete the registration.",
        });
    } catch (error) {
        console.error("Error in signup:", error);
        res.status(400).json({ success: false, message: error.message });
    }
};

const verifySignup = async (req, res) => {
    const { email, otp } = req.body;

    try {
        // Log session data and request data
        const tempUserData = req.session.tempUserData;
        console.log("Session data:", tempUserData);
        console.log("Verification request:", { email, otp });

        if (!tempUserData || tempUserData.email !== email) {
            return res.status(400).json({ success: false, message: "Invalid email or session expired" });
        }

        if (otp !== tempUserData.otp) {
            return res.status(400).json({ success: false, message: "Invalid OTP" });
        }

        if (Date.now() > tempUserData.otpExpiresAt) {
            return res.status(400).json({ success: false, message: "OTP has expired" });
        }

        const newUser = new User({
            name: tempUserData.name,
            email: tempUserData.email,
            address: tempUserData.address,
            contactNo: tempUserData.contactNo,
            password: tempUserData.password,
            isVerified: true,
        });
        await newUser.save();
        generateToken(res, newUser._id);
        req.session.tempUserData = null;

        res.status(201).json({
            success: true,
            message: "Email verified successfully. You are now registered.",
        });
    } catch (error) {
        console.error("Error in verifySignup:", error);
        res.status(400).json({ success: false, message: error.message });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Validate required fields
        if (!email || !password) {
            throw new Error("Email and password are required");
        }

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid email or password" });
        }

        // Verify password
        const isMatch = await bcryptjs.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Invalid email or password" });
        }

        // Generate and send JWT token
        generateToken(res, user._id);

        res.status(200).json({
            success: true,
            message: "Logged in successfully",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                // Add any other user data you want to return
            },
        });
    } catch (error) {
        console.error("Error in login:", error);
        res.status(400).json({ success: false, message: error.message });
    }
};

const logout = async (req, res) => {
    try {
        // Clear user session or token here
        req.session = null; // If using express-session to manage sessions

        res.status(200).send("Logged out successfully");
    } catch (error) {
        res.status(500).send("Error logging out");
    }
};

module.exports = {
    signup,
    verifySignup,
    login,
    logout,
};
