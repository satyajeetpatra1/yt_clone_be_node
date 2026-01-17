import jwt from "jsonwebtoken";

const generateToken = (id) => {
  // Generate JWT token
  return jwt.sign({ id }, "JWT-SECRET_KEY", { expiresIn: "7d" });
};

export default generateToken;
