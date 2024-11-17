import { User } from "../models/userModel.js";
import bcryptjs from "bcryptjs";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";

// signUp Function:
// This function handles user registration by performing the following actions:
// - Validating the input data to ensure all required fields (email, name, password) are provided.
// - Checking if the user already exists in the database to prevent duplicate registrations.
// - Hashing the password securely before storing it in the database.
// - Generating a verification token and setting an expiration time for it.
// - Saving the user data (including the hashed password and verification token) to the database.
// - Generating and sending a JWT token to the client to authenticate the user immediately.
// - Returning a success response containing the user data, excluding sensitive information like the password.
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
      verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000, // Token expires in 24 hours
    });

    // Save the new user to the database
    await user.save();

    // Generate a JWT token and set it as a cookie for authentication
    generateTokenAndSetCookie(res, user._id);

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

// signIn Function:
// This function handles user login by performing the following actions:
// - Validating the input data to ensure the provided email and password are correct.
// - Checking if the user exists in the database by their email address.
// - Verifying that the provided password matches the stored hashed password.
// - Generating and sending a JWT token to the client if the login is successful.
// - Updating the user's last login timestamp and saving the changes to the database.
// - Returning a success response with the user's data, excluding sensitive information like the password.
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
