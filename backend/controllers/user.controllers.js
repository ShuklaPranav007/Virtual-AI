import User from "../models/user.model.js";
import uploadCloudinary from "../config/cloudinary.js";

export const getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json({ message: "Get current user error" });
    }
};

export const updateAssistant = async (req, res) => {
    try {
        const { assistantName, imageUrl } = req.body
        let assistantImage;
        if (req.file) {
            assistantImage = await uploadCloudinary(req.file.path)
        } else {
            assistantImage = imageUrl
        }
        const user = await User.findByIdAndUpdate(req.userId, { assistantName, assistantImage }, { new: true }).select("-password")
        return res.status(200).json(user)
    } catch (error) {
        return res.status(500).json({ message: "update Assistant user error" });
    }
}