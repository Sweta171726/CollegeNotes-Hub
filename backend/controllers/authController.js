const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.signup = async (req, res) => {
    const { name,rollNumber, branch, password, isAdmin } = req.body;

  try {
    const userExists = await User.findOne({ rollNumber });
    if (userExists) return res.status(400).json({ msg: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ name,rollNumber, branch, password: hashed, isAdmin });


    await user.save();
    res.status(201).json({ msg: "Signup successful" });
  } catch (err) {
    res.status(500).json({ msg: "Error in signup" });
  }
};

exports.login = async (req, res) => {
  const { rollNumber, password } = req.body;
  try {
    const user = await User.findOne({ rollNumber });
    if (!user) return res.status(400).json({ msg: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.json({ token, user: {name: user.name,rollNumber: user.rollNumber, branch: user.branch, isAdmin: user.isAdmin } });
  } catch (err) {
    res.status(500).json({ msg: "Error in login" });
  }
};
