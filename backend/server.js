const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const notesRoutes = require("./routes/notesRoutes");

const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// ✅ API Routes
app.use("/api/auth", authRoutes);
app.use("/api/notes", notesRoutes);

// ✅ MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Error:", err.message));

// ✅ Serve frontend static files — FIXED ✅
// Serve static files from the frontend
app.use(express.static(path.join(__dirname, "frontend", "build")));

// Fix for Express 5 — use named wildcard path
app.get("/*path", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "build", "index.html"));
});


// ✅ Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(🚀 Server running on http://localhost:${PORT});
});
