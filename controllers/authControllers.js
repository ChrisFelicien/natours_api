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

export const protectRoute = catchAsyncError(async (req, res, next) => {
  let token;
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer")) {
    return next(new createError(`Please login to proceed`, 400));
  }

  token = authorization.split(" ")?.[1];

  if (!token) {
    return next(new createError("Please provide token", 401));
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE_IN
  });

  const user = await User.findById(decoded.id);

  if (!user) {
    return next(
      new createError("User not found, please try to login again", 401)
    );
  }

  req.user = user;
  next();
});

export const restrictedTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new createError(
          "You do not have permission  to perform this action",
          403
        )
      );
    }

    next();
  };
};
