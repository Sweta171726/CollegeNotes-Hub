const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const notesRoutes = require("./routes/notesRoutes");

const app = express();

// ✅ Define allowed origins
const allowedOrigins = [
  "http://localhost:3000",
  "https://collegenotes-hub-300.onrender.com"
];

// ✅ CORS middleware
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// ✅ Middleware
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

// ✅ Serve frontend static files
app.use(express.static(path.join(__dirname, "frontend", "build")));

app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "build", "index.html"));
});

// ✅ Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
