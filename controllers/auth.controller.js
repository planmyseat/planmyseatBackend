import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import User from "../models/user.model.js";
import { sendOtpEmail } from "../utils/mailer.js";

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d",
                algorithm: "HS256",
                issuer: "planMySeat",
            }
        );

        if (!user.verified) {
            const otp = Math.floor(1000 + Math.random() * 9000).toString();
            const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 mins

            // Attach OTP to user model
            user.otp = otp;
            user.otpExpiresAt = expiresAt;

            // Send OTP
            await sendOtpEmail(email, otp);

            user.save()

            return res.status(200).json({
                verified: user.verified
            })
        }

        return res.status(200).json({
            token,
            user: {
                _id: user.id,
                name: user.name,
                email: user.email
            },
            verified: user.verified
        })

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
}

export const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Validate input
        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Check for existing user
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already in use' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user instance (but don't save yet)
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
        });

        // Generate 4-digit OTP
        const otp = Math.floor(1000 + Math.random() * 9000).toString();
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 mins

        // Attach OTP to user model
        newUser.otp = otp;
        newUser.otpExpiresAt = expiresAt;

        // Send OTP
        await sendOtpEmail(email, otp);

        // Save user only after OTP sent
        await newUser.save();

        // Send response
        return res.status(201).json({message: "Account created"});

    } catch (error) {
        console.error("Signup Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
    
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }
            
        const otp = Math.floor(1000 + Math.random() * 9000).toString();
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 mins
    
        // Attach OTP to user model
        user.otp = otp;
        user.otpExpiresAt = expiresAt;
        user.verified = false;

        // Send OTP
        await sendOtpEmail(email, otp);
    
        user.save();

        return res.status(200).json({message: "OTP Sent"});
    } catch (error) {
        console.error('Forgot Password error:', error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
}

export const verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Check if OTP is expired
        if (!user.otpExpiresAt || new Date() > user.otpExpiresAt) {
            return res.status(410).json({ message: 'OTP has been expired.' });
        }

        // Check if OTP matches
        if (user.otp !== otp) {
            return res.status(401).json({ message: 'Invalid OTP.' });
        }

        // Mark user as verified and clear OTP-related fields
        user.verified = true;
        user.otp = null;
        user.otpExpiresAt = null;

        await user.save();

        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d",
                algorithm: "HS256",
                issuer: "planMySeat",
            }
        );

        return res.status(200).json({
            token, user: {
                _id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (err) {
        console.error('OTP verification error:', err);
        return res.status(500).json({ message: 'Internal server error.' });
    }
};

export const resetPassword = async (req, res) => {
  try {
    const user = req.user;
    const { password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.findByIdAndUpdate(user._id, {
      password: hashedPassword,
    });

    return res.status(200).json({ message: 'Password has been reset successfully.' });
  } catch (error) {
    console.error('Reset password error:', error);
    return res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};
