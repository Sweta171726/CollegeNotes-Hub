const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
  title: String,
  semester: String,
  year: String,
  branch: String,
  type: String, // "Notes" or "PYQ"
  fileUrl: String,
  uploadedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Note", noteSchema);

