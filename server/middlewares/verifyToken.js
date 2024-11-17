import jwt from "jsonwebtoken";

// Middleware to verify token
// If token is valid, it decodes the token and adds the userId to the request object
// If token is invalid, it returns 401 status code
// If token is not provided, it returns 401 status code
// If there is any error, it returns 500 status code
export const verifyToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token)
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized - no token provided" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded)
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized - invalid token" });

    req.userId = decoded.userId;
    next();
  } catch (error) {
    console.log("Error in verifyToken ", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
