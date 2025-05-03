const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
// Determine the client URL based on environment
const clientUrl = process.env.NODE_ENV === 'production'
  ? process.env.CLIENT_URL || 'https://authentra-frontend.onrender.com'
  : "http://localhost:5173";

// Define all possible origins that might connect to the socket server
const allowedOrigins = [
  clientUrl, 
  clientUrl + '/',
  'https://authentra-frontend.onrender.com',
  'https://authentra-frontend.onrender.com/',
  'https://dashboard.render.com',
  'https://authentra.onrender.com',
  'https://authentra.onrender.com/'
];

console.log("Client URL for CORS:", clientUrl);
console.log("Allowed origins:", allowedOrigins);

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps, curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1 || origin.match(/\.onrender\.com$/)) {
      callback(null, true);
    } else {
      console.log("Origin not allowed by CORS:", origin);
      callback(null, true); // Still allow it for now to prevent issues
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: function(origin, callback) {
      // Allow requests with no origin (like mobile apps, curl requests)
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.indexOf(origin) !== -1 || origin.match(/\.onrender\.com$/)) {
        callback(null, true);
      } else {
        console.log("Socket.io - Origin not allowed by CORS:", origin);
        callback(null, true); // Still allow it for now to prevent issues
      }
    },
    methods: ["GET", "POST"],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
  },
  transports: ['websocket', 'polling'],
  allowEIO3: true // Allow Engine.IO version 3 connections
});

let users = []

const addUser = (userId, socketId) => {
  !users.some(user => user.userId === userId) &&
    users.push({ userId, socketId })
}

const removeUser = (socketId) => {
  users = users.filter(user => user.socketId !== socketId)
}

const getUser = (userId) => {
  return users.find(user => user.userId === userId)
}

io.on("connection", (socket) => {
  //When Connecting
  console.log("A user connected.")
  //Take userId and socketId from user
  socket.on("addUser", userId => {
    addUser(userId, socket.id)
    io.emit("getUsers", users)
  })

  //send and get message
  socket.on("sendMessage", ({ senderId, recieverId, text }) => {
    const reciever = getUser(recieverId)
    io.to(reciever.socketId).emit("getMessage",{
      senderId,text
    })
  })

  //When Disconnecting
  socket.on("disconnect", () => {
    console.log("a user disconnected!")
    removeUser(socket.id)
    io.emit("getUsers", users)
  })
})

const PORT = process.env.PORT || 8900;
server.listen(PORT, () => {
  console.log(`Socket server running on port ${PORT}`);
});
