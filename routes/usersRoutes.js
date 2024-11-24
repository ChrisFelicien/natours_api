import { Router } from "express";
import {
  forgotPassword,
  loginUser,
  signUpUser,
  resetPassword,
  changePassword,
  protectRoute
} from "../controllers/authControllers.js";

import {
  updateMe,
  deleteMe,
  getAllUsers
} from "../controllers/usersControllers.js";

const router = Router();

router.get("/get-users", getAllUsers);
router.patch("/update-user", protectRoute, updateMe);
router.delete("/delete-account", protectRoute, deleteMe);
router.post("/auth/sign-up", signUpUser);
router.post("/auth/login", loginUser);
router.post("/auth/forgot-password", forgotPassword);
router.patch("/auth/reset-password/:token", resetPassword);
router.patch("/auth/change-password", protectRoute, changePassword);

export default router;
