import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
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
  }
});

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

const User = mongoose.model("User", userSchema);

export default User;
