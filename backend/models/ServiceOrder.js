import mongoose from "mongoose";

const serviceOrderSchema = new mongoose.Schema(
  {
    ServiceID: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Service",
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
    Price: {
      type: Number,
      required: true,
      min: 1,
    },
    DeliveryTime: {
      type: String,
      required: true,
    },
    Message: {
      type: String,
      default: "",
      trim: true,
      maxlength: 1000,
    },
    Status: {
      type: String,
      required: true,
      enum: ["pending", "active", "completed", "cancelled"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

serviceOrderSchema.index({ ClientID: 1, createdAt: -1 });
serviceOrderSchema.index({ ProviderID: 1, createdAt: -1 });

const ServiceOrder = mongoose.model("ServiceOrder", serviceOrderSchema);

export default ServiceOrder;
