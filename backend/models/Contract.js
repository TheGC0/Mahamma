import mongoose from "mongoose";

const contractSchema = new mongoose.Schema(
  {
    ProposalID: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Proposal",
    },
    TaskID: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Task",
    },
    ClientID: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    ProviderID: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    AgreedAmount: {
      type: Number,
      required: true,
    },
    Status: {
      type: String,
      required: true,
      enum: ["active", "completed", "cancelled"],
      default: "active",
    },
    DeliveryDate: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Contract = mongoose.model("Contract", contractSchema);

export default Contract;
