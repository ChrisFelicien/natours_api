import { Router } from "express";
import {
  forgotPassword,
  loginUser,
  signUpUser,
  resetPassword
} from "../controllers/authControllers.js";

const router = Router();

router.post("/auth/sign-up", signUpUser);
router.post("/auth/login", loginUser);
router.post("/auth/forgot-password", forgotPassword);
router.patch("/auth/reset-password/:token", resetPassword);

export default router;
