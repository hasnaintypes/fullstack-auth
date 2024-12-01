import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./db/connectDB.js";
import authRoutes from "./routes/authRoutes.js";
import cookieParser from "cookie-parser";
import cors from "cors"; // Import cors

// Load environment variables
dotenv.config();

// Initialize express
const app = express();

// CORS setup
const corsOptions = {
  origin: "http://localhost:5173", // Allow only this origin
  methods: ["GET", "POST", "PUT", "DELETE"], // Specify allowed methods
  credentials: true, // If you're using cookies or authentication
};

app.use(cors(corsOptions)); // Enable CORS with the options

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
