// routes/chatRooms.js
const express = require('express');
const router = express.Router();

const { getChatRooms, createChatRoom } = require('../controllers/chatRoomController');
const validate = require('../middlewares/validate');
const { roomCreationRules } = require('../validators/roomValidator');

// Authentication middleware (assumed to be implemented)
const authMiddleware = require('../middlewares/authMiddleware');

// GET all chat rooms
router.get('/', authMiddleware, getChatRooms);

// Create a new chat room
router.post(
  '/',
  authMiddleware,
  validate(roomCreationRules),
  createChatRoom
);

module.exports = router;
