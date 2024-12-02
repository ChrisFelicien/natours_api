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
router.route("/").get(getAllTours).post(createTour);
router.param("id", isValidId);

router
  .route("/:id")
  .patch(
    isTourExist,
    protectRoute,
    restrictedTo("admin", "lead-guide"),
    updateTour
  )
  .get(isTourExist, getSingleTour)
  .delete(
    protectRoute,
    restrictedTo("admin", "lead-guide"),
    isTourExist,
    deleteTour
  );

export default router;
