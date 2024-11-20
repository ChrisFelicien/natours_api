import mongoose from "mongoose";
import slugify from "slugify";

const tourSchema = new mongoose.Schema({
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
  }
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
