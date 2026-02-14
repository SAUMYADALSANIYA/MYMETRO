const bcrypt = require("bcrypt");
const User = require("../models/user");
const Fare = require("../models/fare");

exports.changePassword = async (req, res) => {
  try{
    const adminId = req.user.id;
    const { oldPassword, newPassword } = req.body
    const admin = await User.findById(adminId);
    if(!admin){
      return res.status(404).json({ message: "Admin not found" });
    }
    if(admin.role !== "Admin"){
      return res.status(403).json({ message: "Access denied" });
    }
    const isMatch = await bcrypt.compare(oldPassword, admin.password);
    if(!isMatch){
      return res.status(400).json({ message: "Incorrect current password" });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    admin.password = hashedPassword;
    await admin.save();
    res.status(200).json({ message: "Password updated successfully" });
  }
  catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getFare = async (req, res) => {
  try{
    if(req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }
    let fare = await Fare.findOne();
    if (!fare) {
      fare = await Fare.create({
        p: 10,
        q: 20,
        r: 30,
        s: 40,
        t: 50
      });
    }
    res.status(200).json({
      p: fare.p,
      q: fare.q,
      r: fare.r,
      s: fare.s,
      t: fare.t
    });

  }
  catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateFare = async (req, res) => {
  try{
    if(req.user.role !== "Admin"){
      return res.status(403).json({ message: "Access denied" });
    }

    const { p, q, r, s, t } = req.body;
    if(p === undefined ||q === undefined ||r === undefined ||s === undefined ||t === undefined){
      return res.status(400).json({ message: "All fare values are required" });
    }

    let fare = await Fare.findOne();
    if(!fare){
      fare = new Fare({ p, q, r, s, t });
    }
    else {
      fare.p = p;
      fare.q = q;
      fare.r = r;
      fare.s = s;
      fare.t = t;
    }

    await fare.save();
    res.status(200).json({
      message: "Fare updated successfully",
      fare: {
        p: fare.p,
        q: fare.q,
        r: fare.r,
        s: fare.s,
        t: fare.t
      }
    });
  }
  catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
