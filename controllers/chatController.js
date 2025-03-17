// controllers/chatController.js
const dayjs = require('dayjs');
const relativeTime = require('dayjs/plugin/relativeTime');
dayjs.extend(relativeTime);

const Message = require('../models/Message');
const { createClient } = require('redis');
const User = require('../models/User'); // Ensure this model exists
const ChatRoom = require('../models/ChatRoom');

// Create and connect the Memurai (Redis) client
const redisClient = createClient({ url: process.env.MEMURAI_URL });
redisClient.connect().catch(console.error);
// console.log('MEMURAI_URL_chat:', process.env.MEMURAI_URL);
/**
 * Handle when a user joins a room:
 * - Add the socket to the room.
 * - Add the user to the Redis set.
 * - Broadcast the updated online user list.
 */
exports.handleJoinRoom = async (data, socket, io) => {
  const { roomId, userObjId, userId, username, userAvatar, status } = data;
  // console.log(data);

  // Determine display name: use 'name' if available and not just whitespace; otherwise, use username
  const displayName = username && username.trim() !== "" ? username : userId;

  socket.join(roomId);
  // Create a user object with avatar and status (default avatar and status if not provided)
  const userObj = {
    id: userObjId,
    name: displayName,
    avatarUrl: userAvatar || "https://via.placeholder.com/150", // default avatar image
    status: status || "active", // status can be "active" or "away"
  };

  await redisClient.hSet(`chatroom:${roomId}:users`, userObjId, JSON.stringify(userObj));

  // Retrieve the updated list of online users from the Redis hash
  const usersHash = await redisClient.hGetAll(`chatroom:${roomId}:users`);
  const onlineUsers = Object.values(usersHash).map(u => JSON.parse(u));

  // Compute total participants: distinct sender.id from Message collection in this room
  const totalParticipantIds = await Message.distinct("sender.id", { roomId });
  // Convert ObjectIds in totalParticipantIds to strings
  const totalParticipantIdsStr = totalParticipantIds.map(id => id.toString());
  const totalCount = totalParticipantIds.length;

  // Determine away users: those in total participants but not in the online list
  const onlineIds = onlineUsers.map(u => u.id);
  // Now filter: awayIds are those not included in onlineIds
  const awayIds = totalParticipantIdsStr.filter(id => !onlineIds.includes(id));

  // console.log("away:", awayIds, onlineIds, totalParticipantIds);
  // Retrieve away users' details from the User collection (assuming each user document has name, avatar, etc.)
  const awayUsers = await User.find({ _id: { $in: awayIds } })
    .select("username name avatar")
    .lean();

  // Fetch room details from MongoDB (e.g., room title, description, and creator)
  const roomDetails = await ChatRoom.findById(roomId)
    .select('name description createdBy createdAt')
    .populate('createdBy', 'username') // Populates createdBy field with the creator's username
    .exec();

  const createdAtHuman = dayjs(roomDetails.createdAt).fromNow();

  // console.log(createdAtHuman);

  // console.log(roomId, userId, username, roomDetails);
  // Emit an update to all clients in the room with the latest online users and room details
  io.to(roomId).emit('roomUpdate', {
    onlineUsers, totalCount,
    awayUsers, roomDetails, createdAtHuman
  });
};

/**
 * Handle when a user leaves a room:
 * - Remove the socket from the room.
 * - Remove the user from the Redis set.
 * - Broadcast the updated online user list.
 */
exports.handleLeaveRoom = async (data, socket, io) => {
  try {
    const { roomId, userObjId } = data;
    socket.leave(roomId);

    // Remove the user from the Redis hash for this room
    await redisClient.hDel(`chatroom:${roomId}:users`, userObjId);

    // Get the updated list of online users from Redis
    const usersHash = await redisClient.hGetAll(`chatroom:${roomId}:users`);
    const onlineUsers = Object.values(usersHash).map(u => JSON.parse(u));


    const totalParticipantIds = await Message.distinct("sender.id", { roomId });
    const totalCount = totalParticipantIds.length;
    const onlineIds = onlineUsers.map(u => u.id);
    const awayIds = totalParticipantIds.filter(id => !onlineIds.includes(id));
    const awayUsers = await User.find({ _id: { $in: awayIds } })
      .select("username name avatar")
      .lean();


    // Fetch room details so the payload is consistent with joinRoom
    const roomDetails = await ChatRoom.findById(roomId)
      .select('name description createdBy')
      .populate('createdBy', 'username')
      .exec();

    io.to(roomId).emit("roomUpdate", {
      onlineUsers, totalCount,
      awayUsers, roomDetails
    });

  } catch (error) {
    console.error("Error in handleLeaveRoom:", error);
  }
};

/**
 * Handle an incoming chat message:
 * - Save the message to MongoDB.
 * - Broadcast the message to all room participants.
 */
exports.handleChatMessage = async (data, io) => {
  try {
    const newMsg = new Message({
      roomId: data.roomId,
      sender: {
        id: data.senderId,
        name: data.senderName,
        avatar: data.senderAvatar // may be undefined if not provided
      },
      message: data.message,
      replyTo: data.replyTo || null, // Include replyTo if provided
    });
    await newMsg.save();
    io.to(data.roomId).emit('newMessage', newMsg);
  } catch (error) {
    console.error('Error saving message:', error);
  }
};

/**
 * Handle the typing indicator:
 * - Notify others in the room that a user is typing.
 */
exports.handleTyping = (data, socket) => {
  socket.to(data.roomId).emit('typing', data.sender);
};

/**
 * Handle stop typing indicator:
 * - Notify others in the room that a user has stopped typing.
 */
exports.handleStopTyping = (data, socket) => {
  socket.to(data.roomId).emit('stopTyping', data.sender);
};

exports.handleMessageReaction = async (data, io) => {
  const { messageId, roomId, user, emoji } = data;
  try {
    const message = await Message.findById(messageId);
    // console.log(message);
    if (!message) return;

    // Check if this reaction already exists
    const existingReaction = message.reactions.find(
      (reaction) => reaction.user === user && reaction.emoji === emoji
    );

    if (existingReaction) {
      // Reaction already exists; do nothing (or optionally send a notification)
      return;
    }

    // Add the reaction if it doesn't exist
    message.reactions.push({ user, emoji });
    await message.save();

    // Broadcast the updated reaction for the message to all clients in the room
    io.to(roomId).emit("messageReactionUpdate", {
      messageId,
      reaction: { user, emoji, timestamp: Date.now() },
    });
  } catch (error) {
    console.error("Error handling message reaction:", error);
  }
};
