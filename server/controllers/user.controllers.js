import User from '../models/org.models.js';

// Get user profile
export const getUserProfile = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.user.email }).select('-password');
        if (!user) return res.status(404).json({ message: "User not found" });

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

// Update user profile
export const updateUserProfile = async (req, res) => {
    try {
        const { email, org_name, org_type } = req.body;

        const user = await User.findOneAndUpdate(
            { email: req.user.email },
            { org_name, org_type },
            { new: true, select: "-password" }
        );

        if (!user) return res.status(404).json({ message: "User not found" });

        res.json({ message: "Profile updated successfully", user });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};
