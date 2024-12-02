import express from "express";
import {
  createReview,
  deleteReview,
  getAllReview
} from "../controllers/reviewController.js";
import { protectRoute, restrictedTo } from "../controllers/authControllers.js";

const router = express.Router({ mergeParams: true });

router.use(protectRoute);

router.route("/").get(getAllReview).post(restrictedTo("user"), createReview);

router.route("/:id").delete(restrictedTo("admin", "user"), deleteReview);

export default router;
