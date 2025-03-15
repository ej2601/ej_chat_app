// middlewares/socketAuth.js
const jwt = require('jsonwebtoken');

// Secret key used to sign the token
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

module.exports = (socket, next) => {
  const token = socket.handshake.query.token;

  // If no token, reject the connection
  if (!token) {
    
    return next(new Error('Authentication error'));
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Attach user data to the socket object
    socket.userId = decoded.id;
    socket.username = decoded.username;
    console.log("socket middleware error :", decoded);
    next();
  } catch (err) {
    return next(new Error('Authentication error'));
  }
};
