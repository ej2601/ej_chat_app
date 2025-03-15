const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Registration Logic
const register = async (req, res) => {

  const { username, email, name, password } = req.body;

  try {
    // Check if user exists
    let userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) return res.status(400).json({ message: 'Username or email already in use' });

    // Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create New User
    const newUser = new User({ username, email, name, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'Registration successful! Please log in.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// New login function
const login = async (req, res) => {

  const { identifier, password } = req.body; // 'identifier' can be email or username
  try {
    // Find the user by email or username
    const user = await User.findOne({
      $or: [{ email: identifier }, { username: identifier }],
    });
    if (!user)
      return res.status(400).json({ message: 'Invalid credentials' });

    // Compare the provided password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: 'Invalid credentials' });

    // Generate a JSON Web Token (JWT)
    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '1h' }
    );

    console.log(user);

    // Prepare user details to return to the client (excluding sensitive data)
    const userDetails = {
      _id: user._id,
      username: user.username,
      email: user.email,
      name: user.name,
      avatar: user.avatar,
      status: 'active',
    };

    res.status(200).json({ message: 'Login successful', token, user: userDetails });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { register, login };