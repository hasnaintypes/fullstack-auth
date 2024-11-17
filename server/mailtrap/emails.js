import {
  PASSWORD_RESET_REQUEST_TEMPLATE,
  PASSWORD_RESET_SUCCESS_TEMPLATE,
  VERIFICATION_EMAIL_TEMPLATE,
  WELCOME_EMAIL_TEMPLATE,
} from "./emailTemplates.js";
import { mailtrapClient, sender } from "./mailtrapConfig.js";

// Send verification email function:
// This function handles the process of sending verification email by performing the following actions:
// 1. Generate a verification token
// 2. Send the verification email to the user's email address
// 3. Log the response if the email is sent successfully
// 4. Handle any errors that occur during the process
export const sendVerificationEmail = async (email, verificationToken) => {
  const recipient = [{ email }];

  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "Verify your email",
      html: VERIFICATION_EMAIL_TEMPLATE.replace(
        "{verificationCode}",
        verificationToken
      ),
      category: "Email Verification",
    });

    console.log("Email sent successfully", response);
  } catch (error) {
    console.error(`Error sending verification`, error);
    throw new Error(`Error sending verification email: ${error}`);
  }
};

// Send welcome email function:
// This function handles the process of sending welcome email by performing the following actions:
// 1. Send the welcome email to the user's email address
// 2. Log the response if the email is sent successfully
// 3. Handle any errors that occur during the process
export const sendWelcomeEmail = async (email, name) => {
  const recipient = [{ email }];

  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "Welcome to AUTHQUEST",
      html: WELCOME_EMAIL_TEMPLATE.replace("{username}", name),
      category: "Welcome Email",
    });

    console.log("Welcome email sent successfully", response);
  } catch (error) {
    console.error(`Error sending welcome email`, error);

    throw new Error(`Error sending welcome email: ${error}`);
  }
};

// Send password reset email function:
// This function handles the process of sending password reset email by performing the following actions:
// 1. Send the password reset email to the user's email address
// 2. Log the response if the email is sent successfully
// 3. Handle any errors that occur during the process
export const sendPasswordResetEmail = async (email, resetURL) => {
  const recipient = [{ email }];

  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "Reset your password",
      html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
      category: "Password Reset",
    });
  } catch (error) {
    console.error(`Error sending password reset email`, error);

    throw new Error(`Error sending password reset email: ${error}`);
  }
};

// Send password reset success email function:
// This function handles the process of sending password reset success email by performing the following actions:
// 1. Send the password reset success email to the user's email address
// 2. Log the response if the email is sent successfully
// 3. Handle any errors that occur during the process
export const sendResetSuccessEmail = async (email, name) => {
  const recipient = [{ email }];

  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "Password Reset Successful",
      html: PASSWORD_RESET_SUCCESS_TEMPLATE.replace("{userName}", name),
      category: "Password Reset",
    });

    console.log("Password reset email sent successfully", response);
  } catch (error) {
    console.error(`Error sending password reset success email`, error);

    throw new Error(`Error sending password reset success email: ${error}`);
  }
};
