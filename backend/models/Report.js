import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    ReporterID: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    RespondentID: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    ContractID: { type: mongoose.Schema.Types.ObjectId, ref: "Contract" },
    Type: {
      type: String,
      enum: ["Dispute", "Quality Issue", "Payment Issue", "Misconduct", "Other"],
      required: true,
    },
    Description: { type: String, required: true, minlength: 20 },
    Severity: { type: String, enum: ["low", "medium", "high"], default: "medium" },
    Status: {
      type: String,
      enum: ["pending", "reviewing", "resolved"],
      default: "pending",
    },
    Resolution: { type: String },
  },
  { timestamps: true }
);

const Report = mongoose.model("Report", reportSchema);
export default Report;
