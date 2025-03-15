// controllers/chatRoomController.js
const ChatRoom = require('../models/ChatRoom');
const Message = require('../models/Message');

const dayjs = require('dayjs');
const relativeTime = require('dayjs/plugin/relativeTime');
dayjs.extend(relativeTime);

const { createClient } = require('redis');

// // Create and connect the Memurai (Redis) client
const redisClient = createClient({ url: process.env.MEMURAI_URL });
redisClient.connect().catch(console.error);

/**
 * Get all chat rooms and their active user count (from Redis)
 */
const getChatRooms = async (req, res) => {
  try {
    // Fetch all chat rooms from MongoDB and populate the creator's details
    const rooms = await ChatRoom.find({})
      .sort({ createdAt: -1 }) // Most recent first
      .populate('createdBy', 'name avatar')
      .exec();

    const roomsWithCount = await Promise.all(
      rooms.map(async (room) => {
        // Retrieve the full online user objects from Redis for this room
        const usersHash = await redisClient.hGetAll(`chatroom:${room._id}:users`);
        const onlineUsers = Object.values(usersHash).map(u => JSON.parse(u));
        // Active users: all online users
        const activeUserCount = onlineUsers.length;
        // Extract avatar URLs of active users
        const activeUserAvatars = onlineUsers.map(u => u.avatarUrl);
        // Compute total participants: distinct sender.id values in the Message collection for this room
        const totalParticipants = await Message.distinct("sender.id", { roomId: room._id });
        // Format the room's createdAt date to a human-readable relative time (e.g., "3 days ago")
        const createdAtHuman = dayjs(room.createdAt).fromNow();
        console.log("were",activeUserAvatars, onlineUsers, room.id);
        return {
          id: room._id,
          name: room.name,
          description: room.description,
          userCount: activeUserCount,
          userAvatars: activeUserAvatars.slice(0, 5),
          members: totalParticipants.length,
          createdBy: room.createdBy, // Contains the creator's name and avatar
          createdAt: createdAtHuman,
        };
      })
    );

    // console.log("Chat rooms fetched:", roomsWithCount);
    res.status(200).json(roomsWithCount);
  } catch (error) {
    console.error("Error fetching chat rooms:", error);
    res.status(500).json({ message: "Server error" });
  }
};


/**
 * Create a new chat room
 */
const createChatRoom = async (req, res) => {
  const { name, description } = req.body;
  const userId = req.user.id;
  // if (!name) return res.status(400).json({ message: "Room name is required" });

  try {
    const newRoom = new ChatRoom({ name, description, createdBy: userId });
    await newRoom.save();

    res.status(201).json({
      id: newRoom._id,
      name: newRoom.name,
      description: newRoom.description,
      userCount: 0,
    });
  } catch (error) {
    console.error("Error creating chat room:", error);
    res.status(500).json({ message: "Server error" });
  }
};


module.exports = { getChatRooms, createChatRoom };
