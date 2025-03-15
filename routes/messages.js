// routes/messages.js
const express = require('express');
const router = express.Router();
const { getMessagesForRoom } = require('../controllers/messageController');

// GET /api/messages/:roomId - Fetch messages for a specific room
router.get('/:roomId', getMessagesForRoom);

module.exports = router;
