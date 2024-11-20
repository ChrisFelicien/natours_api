import jwt from "jsonwebtoken";
import User from "../models/usersModels.js";
import catchAsyncError from "./../utils/catchAsyncError.js";
import createError from "./../utils/Errors.js";

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE_IN
  });
};

export const signUpUser = catchAsyncError(async (req, res, next) => {
  const { name, email, password, confirmPassword } = req.body;

  const user = await User.create({ name, email, password, confirmPassword });
  const token = generateToken(user._id);

  res.status(201).json({
    status: "success",
    token,
    user
  });
});

export const loginUser = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new createError(`Email and password are required`, 401));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.checkPassword(password, user.password))) {
    return next(new createError("Invalid email or password", 401));
  }

  const token = generateToken(user._id);

  res.status(200).json({
    status: "success",
    token,
    user
  });
});
