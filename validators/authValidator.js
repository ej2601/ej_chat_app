const { body } = require('express-validator');

const registerRules = [
  body('username').notEmpty().withMessage('Username is required'),
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Invalid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];

const loginRules = [
  body('identifier')
    .notEmpty()
    .withMessage('Email or username is required'),
  body('password').notEmpty().withMessage('Password is required'),
];

module.exports = { registerRules, loginRules };
