import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a name"],
      trim: true,
      lowercase: true
    },
    email: {
      type: String,
      required: [true, "Please provide a email"],
      lowercase: true,
      unique: true
    },
    role: {
      type: String,
      enum: ["user", "admin", "guide", "lead-guide"],
      default: "user"
    },
    active: {
      type: Boolean,
      default: true
    },
    photo: { type: String },
    password: {
      type: String,
      required: [true, "Please choose a password"],
      trim: true,
      minlength: 5,
      select: false
    },
    confirmPassword: {
      type: String,
      required: [true, "Confirm your password"],
      validate: {
        validator: function (val) {
          return val === this.password;
        },
        message: "The two password should match"
      }
    },
    passwordResetToken: String,
    passwordTokenExpireIn: Date
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  this.password = await bcrypt.hash(this.password, 12);
  this.confirmPassword = undefined;
  next();
});

userSchema.methods.checkPassword = async function (
  providePassword,
  correctPassword
) {
  return await bcrypt.compare(providePassword, correctPassword);
};

userSchema.methods.createResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.passwordTokenExpireIn = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model("User", userSchema);

export default User;
