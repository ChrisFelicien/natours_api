import Review from "../models/reviewModel.js";
import catchAsyncError from "../utils/catchAsyncError.js";
import factory from "./handlerFactory.js";

export const getAllReview = catchAsyncError(async (req, res, next) => {
  let filter = {};
  if (req.params.tourId) {
    filter.tour = req.params.tourId;
  }

  const review = await Review.find(filter);

  res.status(200).json({
    status: "success",
    results: review.length,
    review
  });
});

export const createReview = catchAsyncError(async (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;

  const newReview = await Review.create(req.body);

  res.status(201).json({
    status: "success",
    review: newReview
  });
});

export const deleteReview = factory.deleteOne(Review);
export const updateREview = factory.updateOne(Review);
