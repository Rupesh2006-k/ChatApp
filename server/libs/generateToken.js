import jwt from "jsonwebtoken";

const generateToken = (userId) => {
  let token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
  return token;
};

export default generateToken;
