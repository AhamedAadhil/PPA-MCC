import { sendEmail } from "./nodemailer.js";
import {
  PASSWORD_RESET_REQUEST_TEMPLATE,
  PASSWORD_RESET_SUCCESS_TEMPLATE,
  VERIFICATION_EMAIL_TEMPLATE,
  WELCOME_EMAIL_TEMPLATE,
} from "./emailTemplates.js";

export const sendVerificationEmail = async (email, verificationToken) => {
  try {
    //the body of the mail
    const message = VERIFICATION_EMAIL_TEMPLATE.replace(
      "{verificationCode}",
      verificationToken
    );

    //nodemailer on action
    const response = await sendEmail(
      email,
      "PPA MCC: Verify Your Email",
      message
    );
    console.log("Email sent successfully ", response);
  } catch (error) {
    console.error(error.message);
    throw new Error("Error sending verification email ", error.message);
  }
};

export const sendWelcomeEmail = async (email, name) => {
  try {
    //the body of the mail
    const message = WELCOME_EMAIL_TEMPLATE.replace("{clientName}", name);

    // nodemailer on action
    const response = await sendEmail(
      email,
      "PPA MCC: Welcome On Board",
      message
    );
    console.log("Welcome Email sent successfully", response);
  } catch (error) {
    console.error(error.message);
    throw new Error("Error sending verification email ", error.message);
  }
};

export const sendPasswordResetEmail = async (email, resetURL) => {
  try {
    // the body of the mail
    const message = PASSWORD_RESET_REQUEST_TEMPLATE.replace(
      "{resetURL}",
      resetURL
    );
    // nodemailer on action
    const response = await sendEmail(
      email,
      "PPA MCC:  Reset Your Password",
      message
    );
    console.log("Password reset email sent successfully", response);
  } catch (error) {
    console.error(error.message);
    throw new Error("Error sending verification email ", error.message);
  }
};

export const sendResetSuccessEmail = async (email) => {
  try {
    // the body of the mail
    const message = PASSWORD_RESET_SUCCESS_TEMPLATE;
    // nodemailer on action
    const response = await sendEmail(
      email,
      "PPA MCC:  Password Reset Successful",
      message
    );
    console.log("Password reset email sent successfully", response);
  } catch (error) {
    console.error(error.message);
    throw new Error("Error sending reset success email ", error.message);
  }
};
