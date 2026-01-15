import jwt from "jsonwebtoken";

const generateToken = (id) => {
  return jwt.sign({ id }, "JWT-SECRET_KEY", { expiresIn: "7d" });
};

export default generateToken;
