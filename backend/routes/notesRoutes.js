const express = require("express");
const multer = require("multer");
const { uploadNote, getNotes } = require("../controllers/notesController");
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

// Multer Config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// ✅ ROUTES
router.post("/upload", verifyToken, isAdmin, upload.single("file"), uploadNote);

// ✅ ADD THIS ROUTE
router.get("/all", getNotes);

module.exports = router;


