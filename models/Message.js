// models/Message.js
const mongoose = require('mongoose');

const ReactionSchema = new mongoose.Schema({
  user: { type: String, required: true },
  emoji: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});


const MessageSchema = new mongoose.Schema({
  roomId: { type: mongoose.Schema.Types.ObjectId, ref: 'ChatRoom', required: true },
  sender: {
    id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    avatar: { type: String } // URL to the user's avatar image
  },

  message: { type: String, required: true },
  // Field to reference the message this is replying to (if any)
  replyTo: { type: mongoose.Schema.Types.ObjectId, ref: 'Message', default: null },
  // Reactions: an array of reactions
  reactions: [ReactionSchema],
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Message', MessageSchema);
