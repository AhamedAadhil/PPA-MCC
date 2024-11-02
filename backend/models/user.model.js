import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    _ppaid: {
      type: String,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    fullname: {
      type: String,
      required: true,
    },
    batch: {
      type: String,
      required: true,
    },
    index: {
      type: String,
      required: true,
      unique: true,
    },
    designation: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    imgurl: {
      type: String,
      required: true,
      default:
        "https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_1280.png",
    },
    relations: [
      {
        name: { type: String, required: true },
        relationship: { type: String, required: true },
        index: { type: String, required: true },
        addedon: { type: Date, default: Date.now },
      },
    ],

    role: {
      type: String,
      enum: ["ADMIN-1", "ADMIN-0", "MEMBER"],
      default: "MEMBER",
    },
    tier: {
      type: String,
      enum: ["BRONZE", "SILVER", "GOLD", "PLATINUM", "DIAMOND"],
      default: "BRONZE",
    },
    status: {
      type: String,
      enum: ["PENDING", "HOLD", "ACTIVE"],
      default: "PENDING",
    },
    lastlogin: {
      type: Date,
      default: Date.now,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    resetPasswordToken: String,
    resetPasswordExpiresAt: Date,
    verificationToken: String,
    verificationTokenExpiresAt: Date,
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
