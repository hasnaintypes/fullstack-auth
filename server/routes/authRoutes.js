import express from "express";
import {
  logOut,
  signIn,
  signUp,
  verifyEmail,
  forgotPassword,
  resetPassword,
  checkAuth,
} from "../controllers/authControllers.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = express.Router();

// Routes
router.get("/check-auth", verifyToken, checkAuth);

router.post("/signup", signUp);

router.post("/signin", signIn);

router.post("/logout", logOut);

router.post("/verify-email", verifyEmail);

router.post("/forgot-password", forgotPassword);

router.post("/reset-password/:token", resetPassword);

export default router;
