const express = require('express');

const jwt = require('jsonwebtoken');
const { register, login } = require('../controllers/authController'); // Import the controller
const validate = require('../middlewares/validate');
const { registerRules, loginRules } = require('../validators/authValidator');

const router = express.Router();

// Register and Login Route
router.post('/register', validate(registerRules), register);
router.post('/login', validate(loginRules), login);

module.exports = router;
