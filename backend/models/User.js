const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  rollNumber: { type: String, required: true, unique: true },
  branch: { type: String, required: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false }
});

module.exports = mongoose.model("User", userSchema);
