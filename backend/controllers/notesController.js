const Note = require("../models/Note");

// Upload a note
exports.uploadNote = async (req, res) => {
  const file = req.file;
  const { title, semester, year, branch, type } = req.body;

   console.log("📦 Received body:", req.body);
  console.log("📁 Received file:", req.file);

  // Validate input
  if (!file || !title || !semester || !year || !branch || !type) {
    return res.status(400).json({ msg: "All fields are required including file" });
  }

  // Construct file path
  const filePath = file.path.replace(/\\/g, "/"); // Cross-platform

  const newNote = new Note({
    title,
    semester,
    year,
    branch,
    type,
    fileUrl: filePath,
  });

  try {
    await newNote.save();
    console.log("✅ Note saved:", newNote);
    res.status(201).json({ msg: "Note uploaded successfully" });
  } catch (err) {
    console.error("❌ Upload error:", err);
    res.status(500).json({ msg: "Upload failed", error: err.message });
  }
};

// Fetch all notes or filter by branch & semester
exports.getNotes = async (req, res) => {
  const { branch, semester } = req.query;
  const filter = {};

  if (branch) filter.branch = branch;
  if (semester) filter.semester = semester;

  try {
    const notes = await Note.find(filter);
    res.json(notes);
  } catch (err) {
    console.error("❌ Fetch error:", err);
    res.status(500).json({ msg: "Error fetching notes" });
  }
};

