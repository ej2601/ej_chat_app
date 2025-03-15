// models/ChatRoom.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ChatRoomSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
}, { timestamps: true });

module.exports = mongoose.model('ChatRoom', ChatRoomSchema);
