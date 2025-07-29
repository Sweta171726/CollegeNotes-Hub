const Note = require("../models/Note");

// Upload a note
exports.uploadNote = async (req, res) => {
  console.log("🔥 [UPLOAD API CALLED]");
  console.log("Headers:", req.headers);
  console.log("User (from verifyToken):", req.user);
  console.log("📦 Received body:", req.body);
  console.log("📁 Received file:", req.file);

  const file = req.file;
  const { title, semester, year, branch, type } = req.body;

  // Validate input
  if (!file) {
    console.warn("⚠️ No file received");
    return res.status(400).json({ msg: "File is required" });
  }
  if (!title || !semester || !year || !branch || !type) {
    console.warn("⚠️ Missing fields:", { title, semester, year, branch, type });
    return res.status(400).json({ msg: "All fields are required including file" });
  }

  // Construct file path (Render/Linux friendly)
  const filePath = file.path.replace(/\\/g, "/");

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
    console.log("✅ Note saved successfully:", newNote);
    res.status(201).json({ msg: "Note uploaded successfully", note: newNote });
  } catch (err) {
    console.error("❌ Upload error:", err);
    res.status(500).json({ msg: "Upload failed", error: err.message });
  }
};

// Fetch all notes or filter
exports.getNotes = async (req, res) => {
  const { branch, semester } = req.query;
  const filter = {};

  if (branch) filter.branch = branch;
  if (semester) filter.semester = semester;

  try {
    const notes = await Note.find(filter);
    console.log(`📥 Fetching notes, filter:`, filter, `Found: ${notes.length}`);
    res.json(notes);
  } catch (err) {
    console.error("❌ Fetch error:", err);
    res.status(500).json({ msg: "Error fetching notes" });
  }
};

