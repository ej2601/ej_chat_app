// socketHandler.js
const chatController = require('./controllers/chatController');
const socketAuth = require('./middlewares/socketAuth');

module.exports = (io) => {

  // Apply the authentication middleware
  io.use(socketAuth);

  io.on('connection', (socket) => {
    console.log('New client connected: ' + socket.id);

    // When a user joins a room
    socket.on('joinRoom', async (data) => {
      await chatController.handleJoinRoom(data, socket, io);
    });

    // When a user leaves a room
    socket.on('leaveRoom', async (data) => {
      await chatController.handleLeaveRoom(data, socket, io);
    });

    // When a chat message is received
    socket.on('chatMessage', async (data) => {
      await chatController.handleChatMessage(data, io);
    });

    // New event for reacting to a message
    socket.on("messageReaction", async (data) => {
      await chatController.handleMessageReaction(data, io);
    });
    
    // Typing indicator events
    socket.on('typing', (data) => {
      chatController.handleTyping(data, socket);
    });

    socket.on('stopTyping', (data) => {
      chatController.handleStopTyping(data, socket);
    });

    // Handle disconnect (tab close, refresh, or unexpected disconnect)
    socket.on('disconnect', () => {
      if (socket.roomId && socket.userId) {
        removeUserFromRoom(socket.roomId, socket.userId);
        io.to(socket.roomId).emit('userLeft', { username: socket.userId });
        console.log(`${socket.userId} disconnected from room ${socket.roomId}`);
      }
    });
  });
};
