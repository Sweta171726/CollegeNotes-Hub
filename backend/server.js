const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const notesRoutes = require("./routes/notesRoutes");

const app = express();

// 🧪 Basic test route
app.get("/", (req, res) => {
  res.send("🎉 Backend is running!");
});

// 👉 Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads")); // For any uploaded files

// 👉 API Routes
app.use("/api/auth", authRoutes);
app.use("/api/notes", notesRoutes);

// 👉 Serve frontend (React build)
const frontendPath = path.join(__dirname, "frontend", "build");
app.use(express.static(frontendPath));

app.get("*", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

// 👉 Connect to MongoDB and start server
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ MongoDB Connected");
    const PORT = process.env.PORT || 5001;
    app.listen(PORT, () =>
      console.log(`🚀 Server running on http://localhost:${PORT}`)
    );
  })
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));


