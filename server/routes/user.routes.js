import express from "express";
import {
  checkAuth,
  loginController,
  signupController,
  updateProfile,
} from "../controllers/user.controller.js";
import { protectRoute } from "../middlewares/auth.js";

let router = express.Router();

router.post("/signup", signupController);
router.post("/login", loginController);
router.put("/update-profile",protectRoute,updateProfile)
router.get("/check", protectRoute, checkAuth);


export default router