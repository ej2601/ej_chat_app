// middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  // Retrieve the token from the Authorization header.
  // The header should be in the format: "Bearer <token>"
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).json({ message: "No token provided, authorization denied." });
  }
  
  // Extract token from the header
  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Token format is invalid." });
  }
  
  try {
    // Verify the token using the JWT_SECRET from your environment variables
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
    
    // Attach the decoded token (user information) to the request object
    req.user = decoded;
    
    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    console.error("Token verification failed:", error);
    return res.status(401).json({ message: "Token is not valid." });
  }
};

module.exports = authMiddleware;
