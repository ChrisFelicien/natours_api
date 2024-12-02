import mongoose from "mongoose";
import slugify from "slugify";
import User from "./usersModels.js";

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Tour must have a name"],
      min: [3, "Tour must have at least 3 characters"],
      unique: true
    },
    duration: {
      type: Number,
      required: [true, "please tour must have a duration"]
    },
    maxGroupSize: {
      type: Number,
      required: [true, "Please provide a max group size"]
    },
    difficulty: {
      type: String,
      required: [true, "Please provide a tour difficulty"],
      enum: ["easy", "medium", "difficult"]
    },
    ratingsAverage: {
      type: Number,
      default: 4.5
    },
    ratingsQuantity: {
      type: Number,
      default: 0
    },
    price: {
      type: Number,
      required: [true, "Tour must have a price"]
    },
    summary: {
      type: String,
      required: [true, "Please provide a tour summary"]
    },
    description: {
      type: String,
      required: [true, "please provide a tour description"]
    },
    imageCover: {
      type: String
    },
    images: { type: [String] },
    startDates: { type: [Date] },
    slug: {
      type: String
    },
    startLocation: {
      type: {
        type: String,
        default: "Point",
        enum: ["Point"]
      },
      coordinates: [Number],
      address: String,
      description: String
    },
    locations: [
      {
        type: {
          type: String,
          enum: "Point",
          default: "Point"
        },
        coordinates: [Number],
        description: String,
        address: String,
        day: Number
      }
    ],
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User"
      }
    ]
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

tourSchema.index({ price: 1, ratingsAverage: -1 });
tourSchema.index({ slug: 1 });

// virtual modal
tourSchema.virtual("reviews", {
  ref: "Review",
  foreignField: "tour",
  localField: "_id"
});

tourSchema.pre(/^find/, function (next) {
  this.populate({
    path: "guides",
    select: "-__v -updatedAt"
  });

  next();
});

tourSchema.pre("save", function (next) {
  this.slug = slugify(this.name, {
    replacement: "-",
    lower: true,
    trim: true
  });

  next();
});

const Tour = mongoose.model("Tour", tourSchema);

export default Tour;
