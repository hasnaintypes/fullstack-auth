import express from "express";
import {
  logOut,
  signIn,
  signUp,
  verifyEmail,
} from "../controllers/authControllers.js";

const router = express.Router();

router.post("/signup", signUp);

router.post("/signin", signIn);

router.post("/logout", logOut);

router.post("/verify-email", verifyEmail);

export default router;
