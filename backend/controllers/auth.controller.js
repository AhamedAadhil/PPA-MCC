import bcryptjs from "bcryptjs";
import crypto from "crypto";

import { User } from "../models/user.model.js";
import { generatePPAID } from "../utils/generatePPAID.js";
import { generateVerificationToken } from "../utils/generateVerificationToken.js";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import {
  sendVerificationEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendResetSuccessEmail,
} from "../nodemailer/emails.js";

export const signup = async (req, res) => {
  const {
    _ppaid,
    email,
    password,
    fullname,
    batch,
    index,
    designation,
    country,
    phone,
    imgurl,
    role,
    tier,
    status,
    lastlogin,
    isVerified,
    resetPasswordToken,
    resetPasswordExpiresAt,
    verificationToken,
    verificationTokenExpiresAt,
  } = req.body;

  try {
    if (
      !email ||
      !password ||
      !fullname ||
      !batch ||
      !index ||
      !designation ||
      !country ||
      !phone
    ) {
      throw new Error("All fields are required");
    }

    // generate new PPA id only if it not exist
    let ppaId = _ppaid ? _ppaid.trim() : "";
    if (!ppaId) {
      ppaId = generatePPAID(country, index);
    }

    // check if user already exist with same email or index
    const userAlreadyExistWithEmailOrIndex = await User.findOne({
      $or: [{ email }, { index }],
    });
    if (userAlreadyExistWithEmailOrIndex) {
      return res
        .status(400)
        .json({ success: false, message: "User already exist!" });
    }

    // hash the password before save it in db
    const hashPassword = await bcryptjs.hash(password, 10);

    //generate verification code
    const verifyToken = generateVerificationToken();

    //  create new user
    const user = await new User({
      _ppaid: ppaId,
      email,
      password: hashPassword,
      fullname,
      batch,
      index,
      designation,
      country,
      phone,
      imgurl,
      role,
      tier,
      status,
      verificationToken: verifyToken,
      verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
    });
    await user.save();

    //generate jwt token
    generateTokenAndSetCookie(res, user._id);

    // send verification email to user
    await sendVerificationEmail(user.email, user.verificationToken);

    res.status(201).json({
      success: true,
      message: "User created successfully!",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials!" });
    }
    const isValidPassword = await bcryptjs.compare(password, user.password);
    if (!isValidPassword) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials!" });
    }
    if (user.status !== "ACTIVE") {
      return res
        .status(400)
        .json({ success: false, message: "Account not verified!" });
    }
    generateTokenAndSetCookie(res, user._id);
    user.lastlogin = new Date();
    await user.save();

    res.status(200).json({
      success: true,
      message: "Logged in successfully!",
      user: { ...user._doc, password: undefined },
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const logout = async (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logged out successfully", success: true });
};

export const verifyEmail = async (req, res) => {
  const { code } = req.body;
  try {
    const user = await User.findOne({
      verificationToken: code,
      verificationTokenExpiresAt: { $gt: Date.now() },
    });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired verification token",
      });
    }
    //  update user state to verified and disable verification tokens
    user.isVerified = true;
    user.status = "ACTIVE";
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;
    // save the user to db
    await user.save();
    // send welcome mail
    await sendWelcomeEmail(user.email, user.fullname);

    res.status(200).json({
      success: true,
      message: "Email Verified Successfully",
      user: { ...user._doc, password: undefined },
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found!" });
    }
    // generate a reset token
    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetTokenExpiresAt = Date.now() + 24 * 60 * 60 * 1000; //1 hour

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiresAt = resetTokenExpiresAt;

    await user.save();

    // send email
    await sendPasswordResetEmail(
      user.email,
      `${process.env.CLIENT_URL}/reset-password/${resetToken}`
    );
    res.status(200).json({
      success: true,
      message: "Password reset link sent to your email!",
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiresAt: { $gt: Date.now() },
    });
    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid or expired reset token", success: false });
    }
    // hash and update the password
    const hashedPassword = await bcryptjs.hash(password, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiresAt = undefined;
    await user.save();

    //  send email
    await sendResetSuccessEmail(user.email);

    return res
      .status(200)
      .json({ message: "Password reset successful!", success: true });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const checkAuth = async (req, res) => {
  try {
    const user = await User.findOne(req.userId);
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found!" });
    }
    return res
      .status(200)
      .json({ success: true, user: { ...user._doc, password: undefined } });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};
