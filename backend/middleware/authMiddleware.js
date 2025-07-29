const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    console.warn("⚠️ No Authorization header");
    return res.status(401).json({ msg: "Access Denied" });
  }

  console.log("🔑 Incoming Token:", authHeader);

  // Remove "Bearer " prefix if present
  const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : authHeader;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    console.log("✅ Token verified, user:", decoded);
    next();
  } catch (err) {
    console.error("❌ Invalid Token:", err.message);
    return res.status(400).json({ msg: "Invalid Token" });
  }
};

const isAdmin = (req, res, next) => {
  if (!req.user || !req.user.isAdmin) {
    console.warn("🚫 Admin check failed for user:", req.user);
    return res.status(403).json({ msg: "Admin only" });
  }
  next();
};

module.exports = { verifyToken, isAdmin };

