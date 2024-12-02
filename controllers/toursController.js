import validator from "validator";
import Tour from "../models/toursModel.js";
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

export const createTour = factory.createOne(Tour);

export const updateTour = factory.updateOne(Tour);

export const getSingleTour = factory.getOne(Tour);

export const deleteTour = factory.deleteOne(Tour);
