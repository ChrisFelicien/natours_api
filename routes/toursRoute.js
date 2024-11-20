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

const router = Router();

router.route("/").get(getAllTours).post(createTour);
router.param("id", isValidId);

router
  .route("/:id")
  .patch(isTourExist, updateTour)
  .get(isTourExist, getSingleTour)
  .delete(isTourExist, deleteTour);

export default router;
