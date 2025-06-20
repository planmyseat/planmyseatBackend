import User from "../models/user.model.js";

export const getProfile = async (req, res) => {
    try {
        const userId = req.user._id; 
        const user = await User.findById(userId).select('-password -otp -otpExpiresAt -_id -createdAt -createdAt -__v  -updatedAt'); // Exclude sensitive fields

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }   
}