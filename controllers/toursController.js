import validator from "validator";
import Tour from "../models/toursController.js";
import catchAsyncError from "./../utils/catchAsyncError.js";
import CreateError from "./../utils/Errors.js";
import factory from "./handlerFactory.js";

export const isValidId = (req, res, next, id) => {
  if (!validator.isMongoId(id)) {
    return next(new CreateError(`Invalid mongo id`, 400));
  }
  next();
};

export const isTourExist = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  const tour = await Tour.findById(id);

  if (!tour) {
    return next(new CreateError(`No tour with this id`, 404));
  }

  next();
});

export const getAllTours = catchAsyncError(async (req, res, next) => {
  const tours = await Tour.find().populate("reviews");

  res.status(201).json({
    status: "success",
    result: tours.length,
    tours
  });
});

export const createTour = catchAsyncError(async (req, res, next) => {
  const tour = await Tour.create(req.body);

  res.status(201).json({
    status: "success",
    tour
  });
});

export const updateTour = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  const tour = await Tour.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    status: "success",
    tour
  });
});

export const getSingleTour = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  const tour = await Tour.findById(id).populate("reviews");

  res.status(200).json({
    status: "success",
    tour
  });
});

export const deleteTour = factory.deleteOne(Tour);

// export const deleteTour = catchAsyncError(async (req, res, next) => {
//   const { id } = req.params;

//   const tour = await Tour.findByIdAndDelete(id);

//   res.status(204).json();
// });
