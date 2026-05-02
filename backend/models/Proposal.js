import mongoose from "mongoose";

const proposalSchema = new mongoose.Schema(
  {
    TaskID: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Task",
    },
    FreelancerID: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    BidAmount: {
      type: Number,
      required: true,
      min: 1,
    },
    EstimatedTime: {
      type: String,
      required: true,
    },
    CoverLetter: {
      type: String,
      required: true,
      trim: true,
      minlength: 20,
    },
    Status: {
      type: String,
      required: true,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

const Proposal = mongoose.model("Proposal", proposalSchema);

export default Proposal;
