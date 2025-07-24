const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const notesRoutes = require("./routes/notesRoutes");

const app = express();

// 🧪 Add easy testing routes here:
app.get("/", (req, res) => {
  res.send("🎉 Backend is running!");
});
app.get("/api/auth/signup", (req, res) => {
  res.send("🚫 Use POST to signup here.");
});

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/notes", notesRoutes);

// Connect to MongoDB and start server
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB Connected");
    app.listen(5001, () => console.log("Server running on port 5001"));
  })
  .catch((err) => console.log(err));