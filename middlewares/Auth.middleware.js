import jwt from "jsonwebtoken";
import User from "../models/User.model.js";

// Protect routes middleware
const protect = async (req, res, next) => {
  // Get token from headers
  let token = req.headers.authorization?.split(" ")[1];

  // Check if token exists
  if (!token) return res.status(401).json({ message: "Token not found" });

  try {
    // Verify token
    const decoded = jwt.verify(token, "JWT-SECRET_KEY");
    // Attach user's data except password to request
    req.user = await User.findById(decoded.id).select("-password");
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
};

export default protect;
