const express = require('express');
const http = require('http');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const session = require('express-session');
const { RedisStore } = require('connect-redis');
const { createClient } = require('redis');
const { Server } = require('socket.io');
const authRoutes = require('./routes/auth'); // Your auth routes (login/register)
const chatRoomRoutes = require('./routes/chatRooms'); // New chat room routes
const messagesRoutes = require('./routes/messages');

const profileRoutes = require('./routes/profile');

dotenv.config();

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors({
    origin: [
        'https://ej-chat-app.vercel.app', // Your Vercel frontend URL
        'http://localhost:5173'                  // Local Vite dev server
      ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],        // Allow only GET and POST requests
    credentials: true                 // Allow cookies/sessions to be sent
}));

app.use(express.json());

// MongoDB Atlas Connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err));

// Memurai (Redis) Client
const redisClient = createClient({ url: process.env.MEMURAI_URL });
redisClient.connect().catch(console.error);

// Session Middleware
app.use(session({
    store: new RedisStore({ client: redisClient }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));

// Test Route
app.get('/', (req, res) => {
    res.send("Chat App Backend Running...");
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/chatrooms', chatRoomRoutes);
app.use('/api/messages', messagesRoutes);

app.use('/api/profile', profileRoutes);


// Set up Socket.IO server
const io = new Server(server, {
    cors: {
        origin: '*'  // Adjust this in production for security
    }
});

// Import the Socket.IO event handler
require('./socketHandler')(io);

// Start Server
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
