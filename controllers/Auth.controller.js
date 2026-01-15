import bcrypt from "bcrypt";
import User from "../models/User.model.js";
import generateToken from "../utils/generateToken.js";

export const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({ username, email, password: hashed });
    res.json({ token: generateToken(user._id), user });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if(!user){
      return  res.status(401).json({ message: "User not found" });
    }

    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({ token: generateToken(user._id), user });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
