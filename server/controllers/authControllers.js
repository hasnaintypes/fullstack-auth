import { User } from "../models/userModel.js";
import bcryptjs from "bcryptjs";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import {
  sendVerificationEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendResetSuccessEmail,
} from "../mailtrap/emails.js";
import crypto from "crypto";

// signUp Function:
// This function handles user registration by performing the following actions:
// - Validating the input data to ensure all required fields (email, name, password) are provided.
// - Checking if the user already exists in the database to prevent duplicate registrations.
// - Hashing the password securely before storing it in the database.
// - Generating a verification token and setting an expiration time for it.
// - Sending a verification email to the user's email address.
// - Saving the user data (including the hashed password and verification token) to the database.
// - Generating and sending a JWT token to the client to authenticate the user immediately.
// - Returning a success response containing the user data, excluding sensitive information like the password.
// - Sending a failure response if any errors occur during the registration process.
export const signUp = async (req, res) => {
  const { email, name, password } = req.body;

  try {
    // Ensure all required fields (email, name, and password) are provided
    if (!email || !name || !password) {
      console.error("SignUp failed: Missing required fields");
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    // Check if the email already exists in the database
    const userAlreadyExists = await User.findOne({ email });
    if (userAlreadyExists) {
      console.warn(`SignUp failed: Email already exists - ${email}`);
      return res
        .status(400)
        .json({ success: false, message: "Email already exists" });
    }

    // Hash the password before saving it to the database
    const hashedPassword = await bcryptjs.hash(password, 12);

    // Generate a random verification token for email verification
    const verificationToken = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    // Create a new user object with the provided data and the generated verification token
    const user = new User({
      email,
      password: hashedPassword,
      name,
      verificationToken,
      verificationTokenExpires: Date.now() + 10 * 60 * 1000, // Token expires in 24 hours
    });

    // Save the new user to the database
    await user.save();

    // Generate a JWT token and set it as a cookie for authentication
    generateTokenAndSetCookie(res, user._id);

    // Send a verification email to the user with the verification token
    await sendVerificationEmail(user.email, verificationToken);

    // Respond with a success message and the user data (excluding the password)
    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: {
        ...user._doc,
        password: undefined, // Do not return the password in the response
      },
    });
  } catch (error) {
    // Log the error and respond with an internal server error message
    console.error("SignUp failed with error: ", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// verifyEmail Function:
// This function handles verifying a user's email address by performing the following actions:
// - Finding the user based on the provided verification code and ensuring it has not expired.
// - Marking the user as verified and removing the verification token fields from the database.
// - Sending a welcome email to the user after successful verification.
// - Returning a success response with the user data, excluding sensitive information like the password.
// - Sending a failure response if the verification code is invalid or expired.
export const verifyEmail = async (req, res) => {
  const { code } = req.body;
  try {
    // Find user with matching verificationToken and non-expired verificationTokenExpires
    const user = await User.findOne({
      verificationToken: code.trim(), // Sanitize the code input
      verificationTokenExpires: { $gt: Date.now() }, // Correct field name
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired verification code",
      });
    }

    // Mark user as verified and remove token fields
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();

    console.log("User verified successfully:", user);

    // Send welcome email
    await sendWelcomeEmail(user.email, user.name);

    // Respond with success
    res.status(200).json({
      success: true,
      message: "Email verified successfully",
      user: {
        ...user._doc,
        password: undefined, // Exclude password from response
      },
    });
  } catch (error) {
    console.error("Error in verifyEmail:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// signIn Function:
// This function handles user login by performing the following actions:
// - Validating the input data to ensure the provided email and password are correct.
// - Checking if the user exists in the database by their email address.
// - Verifying that the provided password matches the stored hashed password.
// - Generating and sending a JWT token to the client if the login is successful.
// - Updating the user's last login timestamp and saving the changes to the database.
// - Returning a success response with the user's data, excluding sensitive information like the password.
// - Sending a failure response if the user is not found or the password is incorrect.
export const signIn = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email in the database
    const user = await User.findOne({ email });
    if (!user) {
      console.warn(`SignIn failed: User not found for email - ${email}`);
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }

    // Compare the provided password with the stored hashed password
    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      console.warn(`SignIn failed: Invalid password for email - ${email}`);
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }

    // Generate a JWT token and set it as a cookie for authentication
    generateTokenAndSetCookie(res, user._id);

    // Update the user's last login timestamp
    user.lastLogin = new Date();
    await user.save();

    // Respond with a success message and the user data (excluding the password)
    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      user: {
        ...user._doc,
        password: undefined, // Do not return the password in the response
      },
    });
  } catch (error) {
    // Log the error and respond with an internal server error message
    console.error("SignIn failed with error: ", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// logOut Function:
// This function handles logging out a user by performing the following actions:
// - Clearing the authentication token stored in the cookies, effectively logging the user out.
// - Sending a success response with a message indicating the user has been logged out successfully.
// - Sending a failure response if any errors occur during the logout process.
export const logOut = async (req, res) => {
  try {
    // Clear the token cookie to log the user out
    res.clearCookie("token");

    // Send a response confirming the user has been logged out successfully
    res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    // Log the error and send a failure response
    console.error("LogOut failed with error: ", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// forgotPassword Function:
// This function handles the process of resetting a user's password by performing the following actions:
// - Sending a verification email to the user's email address with a password reset link.
// - Updating the user's password reset token and expiration time in the database.
// - Returning a success response with a message indicating that the password reset link has been sent.
// - Sending a failure response if the user is not found in the database.
export const forgotPassword = async (req, res) => {
  // get user based on email
  const { email } = req.body;
  try {
    // find user with matching email
    const user = await User.findOne({ email });
    // if no user, return error
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    // generate reset token
    const resetToken = crypto.randomBytes(20).toString("hex");
    // set reset token expiry
    const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // 1 hour

    // update user with reset token and expiry
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetTokenExpiresAt;

    // save user to database
    await user.save();

    // send email with reset token
    await sendPasswordResetEmail(
      user.email,
      `${process.env.CLIENT_URL}/reset-password/${resetToken}`
    );

    // return success response
    res.status(200).json({
      success: true,
      message: "Password reset link sent to your email",
    });
  } catch (error) {
    // return error response
    console.log("Error in forgotPassword ", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

// resetPassword Function:
// This function handles the process of resetting a user's password by performing the following actions:
// - Retrieving the user based on the provided password reset token and ensuring it has not expired.
// - Hashing the new password securely before updating the user's password in the database.
// - Sending a success email to the user after the password has been reset.
// - Returning a success response with a message indicating that the password has been reset successfully.
// - Sending a failure response if the password reset token is invalid or expired.
export const resetPassword = async (req, res) => {
  try {
    // get user based on token
    const { token } = req.params;
    const { password } = req.body;

    // find user with matching resetPasswordToken and non-expired resetPasswordExpires
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    // if no user, return error
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired reset token" });
    }

    // hash the new password
    const hashedPassword = await bcryptjs.hash(password, 10);
    // update user password and reset token fields
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    // save user
    await user.save();
    // send email
    await sendResetSuccessEmail(user.email, user.name);
    // return success response
    res
      .status(200)
      .json({ success: true, message: "Password reset successful" });
  } catch (error) {
    // Log the error and send a failure response
    console.log("Error in resetPassword ", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

// checkAuth Function:
// This function handles checking the authentication status of a user by performing the following actions:
// - Retrieving the user data based on the user ID extracted from the JWT token.
// - Sending a success response with the user data, excluding sensitive information like the password.
// - Sending a failure response if the user is not found in the database.
export const checkAuth = async (req, res) => {
  try {
    // Find the user by ID and exclude the password field
    const user = await User.findById(req.userId).select("-password");
    // If the user is not found, send a failure response
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }
    // Send a success response with the user data
    res.status(200).json({ success: true, user });
  } catch (error) {
    // Log the error and send a failure response
    console.log("Error in checkAuth ", error);
    res.status(400).json({ success: false, message: error.message });
  }
};
