import { MailtrapClient } from "mailtrap";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Mailtrap configuration
export const mailtrapClient = new MailtrapClient({
  endpoint: process.env.MAILTRAP_ENDPOINT,
  token: process.env.MAILTRAP_TOKEN,
});

// Email sender information
export const sender = {
  email: "hello@demomailtrap.com",
  name: "Hasnain",
};
