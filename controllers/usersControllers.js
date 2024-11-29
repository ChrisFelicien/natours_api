import catchAsyncError from "../utils/catchAsyncError.js";
import createError from "./../utils/Errors.js";
import User from "../models/usersModels.js";
import factory from "./handlerFactory.js";

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });

  return newObj;
};

export const getAllUsers = catchAsyncError(async (req, res, next) => {
  const users = await User.find();

  return res.status(200).json({
    status: "success",
    count: users.length,
    users
  });
});

export const updateMe = catchAsyncError(async (req, res, next) => {
  if (req.body.password || req.body.confirmPassword) {
    return next(new createError(`This route is not for update password`, 400));
  }

  const filteredBody = filterObj(req.body, "name", "email");

  const user = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    runValidators: true,
    new: true
  });

  res.status(200).json({
    status: "success",
    user
  });
});

export const deleteMe = catchAsyncError(async (req, res, next) => {
  const user = req.user;

  await User.findByIdAndUpdate(user._id, { active: false });

  res.status(204).json({
    status: "success",
    message: "User deleted"
  });
});

export const deleteUser = factory.deleteOne(User);
