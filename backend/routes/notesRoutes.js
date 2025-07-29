const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { uploadNote, getNotes } = require("../controllers/notesController");
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

// ✅ Ensure uploads folder exists
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

// ✅ Multer Config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});
const upload = multer({ storage });

// ✅ Debug Middleware
const debugUpload = (req, res, next) => {
  console.log("🛠️ [DEBUG] Upload Route Triggered");
  console.log("Headers:", req.headers.authorization);
  console.log("req.user:", req.user);
  console.log("req.body:", req.body);
  console.log("req.file:", req.file);
  next();
};

// ✅ Routes
router.post("/upload", verifyToken, isAdmin, upload.single("file"), debugUpload, uploadNote);
router.get("/all", getNotes);

module.exports = router;


