import User from "../models/user.model.js";
import uploadCloudinary from "../config/cloudinary.js";

/*
  GET CURRENT USER
*/
export const getCurrentUser = async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await User.findById(req.userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user);

  } catch (error) {
    console.error("getCurrentUser error:", error);
    return res.status(500).json({ message: "Get current user error" });
  }
};


/*
  UPDATE ASSISTANT
*/
export const updateAssistant = async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { assistantName, imageUrl } = req.body;

    let assistantImage;

    if (req.file) {
      assistantImage = await uploadCloudinary(req.file.path);
    } else {
      assistantImage = imageUrl;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.userId,
      { assistantName, assistantImage },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(updatedUser);

  } catch (error) {
    console.error("updateAssistant error:", error);
    return res.status(500).json({ message: "Update assistant error" });
  }
};