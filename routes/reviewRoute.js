import express from "express";
import { createReview, getAllReview } from "../controllers/reviewController.js";
import { protectRoute, restrictedTo } from "../controllers/authControllers.js";

const router = express.Router();

router
  .route("/")
  .get(getAllReview)
  .post(protectRoute, restrictedTo("user"), createReview);

export default router;
