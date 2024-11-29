import { Router } from "express";
import {
  createTour,
  deleteTour,
  getAllTours,
  getSingleTour,
  isValidId,
  updateTour,
  isTourExist
} from "../controllers/toursController.js";
import { protectRoute, restrictedTo } from "../controllers/authControllers.js";
import reviewRouter from "./reviewRoute.js";

const router = Router();

router.use("/:tourId/reviews", reviewRouter);
router.route("/").get(protectRoute, getAllTours).post(createTour);
router.param("id", isValidId);

router
  .route("/:id")
  .patch(isTourExist, updateTour)
  .get(isTourExist, getSingleTour)
  .delete(
    protectRoute,
    restrictedTo("admin", "lead-guide"),
    isTourExist,
    deleteTour
  );

// router
//   .route("/:tourId/reviews")
//   .post(protectRoute, restrictedTo("user"), createReview);

export default router;

//
