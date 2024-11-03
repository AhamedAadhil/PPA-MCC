import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    donorName: { type: String, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: "LKR", required: true },
    paymentMethod: { type: String, default: "CARD", required: true },
    transactionDate: { type: Date, default: Date.now, required: true },
    status: {
      type: String,
      default: "PENDING",
      enum: ["SUCCESS", "FAILED", "PENDING"],
      required: true,
    },
    purpose: { type: String, required: true },
    message: { type: String, default: "" },
    metadata: String, // Additional metadata
  },
  { timestamps: true }
);

export const Transaction = mongoose.model("Transaction", transactionSchema);
