import { Router } from "express";
import { loginUser, signUpUser } from "../controllers/authControllers.js";

const router = Router();

router.post("/auth/sign-up", signUpUser);
router.post("/auth/login", loginUser);

export default router;
