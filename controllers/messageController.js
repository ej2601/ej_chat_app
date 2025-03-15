// controllers/messageController.js
const Message = require('../models/Message');

/**
 * Controller function to fetch the last 50 messages for a specific room.
 * Returns messages in chronological order.
 */
exports.getMessagesForRoom = async (req, res) => {
  const roomId = req.params.roomId;
  try {
    const messages = await Message.find({ roomId })
      .sort({ timestamp: -1 })
      .limit(50)
      .exec();
    // Reverse messages to display them in chronological order
    res.status(200).json(messages.reverse());
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ message: 'Server error fetching messages' });
  }
};
