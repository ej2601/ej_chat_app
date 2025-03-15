// controllers/profileController.js
const User = require('../models/User');

// GET /api/profile - Retrieve current user profile (without password)
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// PUT /api/profile - Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const { username, email, name, avatar } = req.body;
    const updateFields = { username, email, name };
    if (avatar) {
      updateFields.avatar = avatar;
    }
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updateFields },
      { new: true, runValidators: true }
    ).select("-password");

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};
