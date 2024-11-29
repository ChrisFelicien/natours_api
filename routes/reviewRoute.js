import express from "express";
import {
  createReview,
  deleteReview,
  getAllReview
} from "../controllers/reviewController.js";
import { protectRoute, restrictedTo } from "../controllers/authControllers.js";

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(getAllReview)
  .post(protectRoute, restrictedTo("user"), createReview);

router.route("/:id").delete(deleteReview);

export default router;
