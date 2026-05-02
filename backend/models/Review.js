import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    ContractID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Contract",
    },
    ServiceOrderID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ServiceOrder",
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

reviewSchema.pre("validate", function (next) {
  if (!this.ContractID && !this.ServiceOrderID) {
    this.invalidate("ContractID", "Review must belong to a contract or service order");
  }

  if (this.ContractID && this.ServiceOrderID) {
    this.invalidate("ServiceOrderID", "Review cannot belong to both a contract and service order");
  }

  next();
});

const Review = mongoose.model("Review", reviewSchema);

export default Review;
