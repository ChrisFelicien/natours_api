import catchAsyncError from "../utils/catchAsyncError.js";
import CreateError from "./../utils/Errors.js";

const deleteOne = (Model) => {
  return catchAsyncError(async (req, res, next) => {
    const { id } = req.params;

    const document = await Model.findByIdAndDelete(id);

    if (!document) {
      return next(new CreateError(`No document with this ID`, 404));
    }
    res.status(204).json({
      message: "deleted"
    });
  });
};

const updateOne = (Model) => {
  return catchAsyncError(async (req, res, next) => {
    const { id } = req.params;

    const document = await Model.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidator: true
    });

    res.status(200).json({
      message: "success",
      document
    });
  });
};

const createOne = (Model) => {
  return catchAsyncError(async (req, res, next) => {
    const document = await Model.create(req.body);

    res.status(201).json({
      status: "success",
      tour
    });
  });
};

const getOne = (Model) => {
  return catchAsyncError(async (req, res, next) => {
    const { id } = req.params;
    const tour = await Tour.findById(id).populate("reviews");

    res.status(200).json({
      status: "success",
      tour
    });
  });
};

export default { deleteOne, updateOne, createOne, getOne };
