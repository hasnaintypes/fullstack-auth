# AuthQuest

Welcome to **AuthQuest**! This project is a learning-focused tutorial where I will build a complete authentication system using the **MERN stack** (MongoDB, Express, React, and Node.js). The primary goal of this project is to understand and implement key concepts like **login**, **logout**, **password recovery**, and **user session management**.

## What is AuthQuest?

AuthQuest is a full-stack authentication system built to help me learn and practice various authentication techniques. It covers essential features that most web applications need to manage users securely:

- **User registration and login**
- **Password recovery (Forgot password)**
- **User session management (login/logout)**
- **JWT (JSON Web Tokens) authentication**
- **Password hashing and secure storage**
- **Client-side state management for authentication**

This project will serve as a hands-on learning tool for mastering these concepts and applying them in a real-world context.

## Project Structure

The project is built using the **MERN stack**, which stands for:

- **MongoDB**: NoSQL database for storing user information and authentication data.
- **Express.js**: Web framework for Node.js that handles routing and server-side logic.
- **React.js**: Front-end framework to build the user interface and manage client-side interactions.
- **Node.js**: JavaScript runtime for executing the server-side code.

## Features

- **User Authentication**: Users can register, log in, and log out.
- **Password Reset**: Users can reset their password if they forget it by receiving an email with a reset link.
- **JWT Token**: Uses JSON Web Tokens for secure communication between the client and server.
- **Password Hashing**: User passwords are hashed and securely stored using bcrypt.

## Backend Setup

🛠️ **Backend Setup**  
🗄️ **Database Setup**  
🔐 **Signup Endpoint**  
📧 **Sending Verify Account Email**  
🔍 **Verify Email Endpoint**  
📄 **Building a Welcome Email Template**  
🚪 **Logout Endpoint**  
🔑 **Login Endpoint**  
🔄 **Forgot Password Endpoint**  
🔁 **Reset Password Endpoint**  
✔️ **Check Auth Endpoint**

## Frontend Setup

🌐 **Frontend Setup**  
📋 **Signup Page UI**  
🔓 **Login Page UI**  
✅ **Email Verification Page UI**  
📤 **Implementing Signup**  
📧 **Implementing Email Verification**  
🔒 **Protecting Our Routes**  
🔑 **Implementing Login**  
🏠 **Dashboard Page**  
🔄 **Implementing Forgot Password**

## Getting Started

To run this project locally, follow these steps:

### 1. Clone the repository

```bash
git clone https://github.com/Nainee99/AuthQuest.git
cd AuthQuest
```

### 2. Install Dependencies

- **Back-end**: Install dependencies in the backend folder.

```bash
cd server
npm install
```

- **Front-end**: Install dependencies in the frontend folder.

```bash
cd ../client
npm install
```

### 3. Set Up Environment Variables

In both the **frontend** and **backend**, create `.env` files and add the necessary environment variables (e.g., database URL, JWT secret, etc.).

Example for `.env` in backend:

```
MONGO_URI=your_mongo_uri
PORT=5000
JWT_SECRET=your_secret_key
NODE_ENV=development

MAILTRAP_TOKEN=your_mailtrap_token
MAILTRAP_ENDPOINT=https://send.api.mailtrap.io/
```

### 4. Run the Project

- **Back-end**: Start the server.

```bash
cd server
npm start
```

- **Front-end**: Run the React development server.

```bash
cd client
npm start
```

Now you should be able to open your browser and access the application locally at `http://localhost:5173`.

## Learning Goals

By the end of this project, I'll have a complete understanding of:

- **Full-stack authentication**: From user registration to secure password management.
- **Session management**: How to handle user sessions with JWTs and cookies.
- **Handling errors**: How to handle common authentication-related errors like invalid credentials or expired tokens.
- **Security best practices**: How to keep user data safe by hashing passwords and using HTTPS.

## Contributing

Since this project is intended for learning purposes, I welcome any suggestions, improvements, or contributions! If you have ideas or encounter issues, feel free to open an issue or submit a pull request.

## License

This project is open-source and available under the [MIT License](LICENSE).

## Acknowledgments

- **MERN Stack**: For providing a powerful, modern tech stack for building web applications.
- **JWT**: For providing a secure way to transmit user data across different parts of the application.
- **bcrypt**: For securely hashing passwords.

```

```
