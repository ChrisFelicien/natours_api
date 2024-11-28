import Review from "../models/reviewModel.js";
import catchAsyncError from "../utils/catchAsyncError.js";

export const getAllReview = catchAsyncError(async (req, res, next) => {
  const review = await Review.find();

  res.status(200).json({
    status: "success",
    results: review.length,
    review
  });
});

export const createReview = catchAsyncError(async (req, res, next) => {
  const newReview = await Review.create(req.body);

  res.status(201).json({
    status: "success",
    review: newReview
  });
});
