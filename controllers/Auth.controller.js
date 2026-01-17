import bcrypt from "bcrypt";
import User from "../models/User.model.js";
import generateToken from "../utils/generateToken.js";

// User Registration
export const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    // Check if user already exists
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User with this email already exists" });
    }

    // Hash password
    const hashed = await bcrypt.hash(password, 10);

    // Create new user
    const user = await User.create({ username, email, password: hashed });
    res.json({ token: generateToken(user._id), user });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// User Login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    // Find user by email
    const user = await User.findOne({ email });

    // If user not found
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    // If password matches
    if (user && isMatch) {
      res.json({ token: generateToken(user._id), user });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
