import { Router } from "express";
import {
  forgotPassword,
  loginUser,
  signUpUser,
  resetPassword,
  changePassword,
  protectRoute,
  restrictedTo
} from "../controllers/authControllers.js";

import {
  updateMe,
  deleteMe,
  getAllUsers,
  getMe
} from "../controllers/usersControllers.js";

const router = Router();

router.post("/auth/sign-up", signUpUser);
router.post("/auth/login", loginUser);
router.post("/auth/forgot-password", forgotPassword);
router.patch("/auth/reset-password/:token", resetPassword);
router.patch("/auth/change-password", changePassword);

router.use(protectRoute);

router.get("/me", getMe);
router.get("/get-users", restrictedTo("admin"), getAllUsers);
router.patch("/update-user", updateMe);
router.delete("/delete-account", deleteMe);

export default router;
