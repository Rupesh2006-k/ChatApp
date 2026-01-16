import cloudinary from "../libs/cloudinary.js";
import generateToken from "../libs/generateToken.js";
import UserModel from "../models/user.model.js";
import bcrypt from "bcryptjs";

// signup controller
export const signupController = async (req, res) => {
  try {
    const { fullName, email, password, bio } = req.body;
    if (!fullName || !email || !password || !bio) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        message: "User already exists",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await UserModel.create({
      fullName,
      email,
      password: hashedPassword,
      bio,
    });
    let token = generateToken(user._id);
    res.cookie("token", token);
    return res.status(201).json({
      success: true,
      message: "Signup successful",
      userData: user,
      token,
    });
  } catch (error) {
    console.error("Signup error:", error.message);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// login controller
export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User does not exist" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = generateToken(user._id);
    res.cookie("token", token);
    return res.status(200).json({
      success: true,
      message: "Login successful",
      userData: user,
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Controller to check if user is authenticated
export const checkAuth = (req, res) => {
  res.json({ success: true, user: req.user });
};

// Controller to update user profile details
export const updateProfile = async (req, res) => {
  try {
    let { fullName, bio, profilePic } = req.body;
    let userId = req.user._id;
    console.log(userId);

    let updatedUser;
    if (!profilePic) {
      updatedUser = await UserModel.findByIdAndUpdate(
        userId,
        { bio, fullName },
        { new: true }
      );
    } else {
      let upload = await cloudinary.uploader.upload(profilePic);
      updatedUser = await UserModel.findByIdAndUpdate(
        userId,
        {
          profilePic: upload.secure_url,
          bio,
          fullName,
        },
        { new: true }
      );
    }

    res.json({ success: true, user: updatedUser });
  } catch (error) {
    console.log(error.message);

    return res.json({ success: false, message: error.message });
  }
};
