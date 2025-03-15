const mongoose = require('mongoose');

// Dynamic avatar generator using Pravatar.
// Generates a random index between 1 and 70.
const getRandomAvatar = () => {
  const randomIndex = Math.floor(Math.random() * 70) + 1;
  return `https://i.pravatar.cc/150?img=${randomIndex}`;
};

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  name: { type: String },
  password: { type: String, required: true },
  avatar:   { type: String, default: getRandomAvatar },
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
