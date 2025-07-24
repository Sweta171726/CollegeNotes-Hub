const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) return res.status(401).json({ msg: "Access Denied" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(400).json({ msg: "Invalid Token" });
  }
};

const isAdmin = (req, res, next) => {
  if (!req.user.isAdmin) return res.status(403).json({ msg: "Admin only" });
  next();
};

module.exports = { verifyToken, isAdmin };
