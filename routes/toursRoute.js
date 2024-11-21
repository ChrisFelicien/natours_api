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

const router = Router();

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

export default router;

//
