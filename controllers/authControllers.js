import crypto from "crypto";
import jwt from "jsonwebtoken";
import User from "../models/usersModels.js";
import catchAsyncError from "./../utils/catchAsyncError.js";
import createError from "./../utils/Errors.js";
import sendEmail from "../utils/email.js";

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE_IN
  });
};

const createSendToken = (res, statusCode, user) => {
  const token = generateToken(user._id);

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
  };

  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

  res.cookie("jwt", token, cookieOptions);

  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    date: {
      user
    }
  });
};

export const signUpUser = catchAsyncError(async (req, res, next) => {
  const { name, email, password, confirmPassword } = req.body;

  const user = await User.create({ name, email, password, confirmPassword });

  createSendToken(res, 201, user);
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

  createSendToken(res, 201, user);
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

  const user = await User.findById(decoded.id).select("+role");

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

export const forgotPassword = catchAsyncError(async (req, res, next) => {
  // Get user from a givens email

  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new createError("No user find with this email", 404));
  }

  const resetToken = user.createResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/users/auth/reset-password/${resetToken}`;

  const message = `Forgot your password? please link the link you submit the new one ${resetUrl}\n if you didn't forget this, please ignore this message.`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Reset your password (valid 10min)",
      message
    });

    res.status(200).json({
      status: "success",
      message: "Token sent via email"
    });
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordTokenExpireIn = undefined;

    user.save({ validateBeforeSave: false });

    return next(
      new createError(
        "There was an error with sending the message. Try again later",
        500
      )
    );
  }
});

export const resetPassword = catchAsyncError(async (req, res, next) => {
  const { token: urlToken } = req.params;

  const hashedToken = crypto
    .createHash("sha256")
    .update(urlToken)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordTokenExpireIn: { $gt: Date.now() }
  });

  if (!user) {
    return next(new createError("Token is invalid or expired", 500));
  }

  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  user.passwordResetToken = undefined;
  user.passwordTokenExpireIn = undefined;

  await user.save();

  createSendToken(res, 201, user);
});

export const changePassword = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user._id).select("+password");

  const { password, newPassword, confirmNewPassword } = req.body;

  if (!(await user.checkPassword(password, user.password))) {
    return next(new createError("Please provide valid password", 401));
  }

  if (newPassword !== confirmNewPassword) {
    return next(new createError(`The two password should match`, 401));
  }

  user.password = newPassword;
  user.confirmPassword = confirmNewPassword;

  user.save();

  createSendToken(res, 201, user);
});
