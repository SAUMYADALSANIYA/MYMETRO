const bcrypt = require("bcrypt");
const User = require("../models/user");

exports.changePassword = async (req, res) => {
  try{
    const adminId = req.user.id;
    const { oldPassword, newPassword } = req.body;
    const admin = await User.findById(adminId);
    if(!admin) return res.status(404).json({ message: "Admin not found" });
    const isMatch = await bcrypt.compare(oldPassword, admin.password);
    if(!isMatch) return res.status(400).json({ message: "Incorrect current password" });
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    admin.password = hashedPassword;
    await admin.save();
    res.json({ message: "Password updated successfully" });

  }
  catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
