import jwt from "jsonwebtoken";
import userModel from "../models/user.model.js";

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies?.token || req.headers?.token;

 
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. Token missing",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    let user = await userModel.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    req.user = user
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized. Invalid token",
    });
  }
};


