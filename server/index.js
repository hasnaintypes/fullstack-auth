import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./db/connectDB.js";
import authRoutes from "./routes/authRoutes.js";
import cookieParser from "cookie-parser";

// Load environment variables
dotenv.config();

// Initialize express
const app = express();

// Use express.json() middleware to parse JSON requests
app.use(express.json());
app.use(cookieParser());

// Connect to the database
connectDB();

// Define routes for authentication
app.use("/api/auth", authRoutes);

// Define a route for the home page
const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => {
  console.log("Server is running on port " + PORT);
});
