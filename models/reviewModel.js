// reviews // Rating  // createdAt  // ref tour   // ref to user
import mongoose from "mongoose";

const reviewsSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, "Please provide a review"]
    },

    rating: {
      type: Number,
      required: [true, "Please provide a review note"],
      min: 1,
      max: 5
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: "Tour",
      required: [true, "Review must belong to a tour"]
    },

    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Review must belong to a user"]
    }
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true }, timestamps: true }
);

reviewsSchema.pre(/^find/, function (next) {
  this.populate({ path: "user", select: "name photo" });
  // .populate({
  //   path: "tour",
  //   select: "name "
  // });

  next();
});

const Review = mongoose.model("Review", reviewsSchema);
export default Review;
