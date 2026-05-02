import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    ContractID: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Contract",
    },
    ReviewerID: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    Score: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    Comment: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const Review = mongoose.model("Review", reviewSchema);

export default Review;
