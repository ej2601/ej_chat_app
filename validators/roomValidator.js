const { body } = require('express-validator');

const roomCreationRules = [
  body('name').notEmpty().withMessage('Room name is required'),
];

module.exports = { roomCreationRules };
