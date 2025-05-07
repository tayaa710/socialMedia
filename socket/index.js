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
      callback(new Error("Not allowed by CORS"));
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
        callback(new Error("Not allowed by CORS"));
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
  // Remove any existing entries for this user to avoid duplicates
  users = users.filter(user => user.userId !== userId);
  
  // Add the user with new socket ID
  users.push({ userId, socketId });
  console.log(`User ${userId} added with socket ${socketId}`);
  console.log("Current users:", users);
}

const removeUser = (socketId) => {
  const userToRemove = users.find(user => user.socketId === socketId);
  if (userToRemove) {
    console.log(`Removing user ${userToRemove.userId} with socket ${socketId}`);
  }
  users = users.filter(user => user.socketId !== socketId);
}

const getUser = (userId) => {
  return users.find(user => user.userId === userId);
}

io.on("connection", (socket) => {
  //When Connecting
  console.log("A user connected with socket ID:", socket.id);
  
  //Take userId and socketId from user
  socket.on("addUser", userId => {
    if (!userId) {
      console.warn("User ID missing in addUser event");
      return;
    }
    
    addUser(userId, socket.id);
    io.emit("getUsers", users);
  });

  //send and get message
  socket.on("sendMessage", ({ senderId, recieverId, text }) => {
    if (!senderId || !recieverId || !text) {
      console.warn("Missing required fields in sendMessage:", { senderId, recieverId, text });
      return;
    }
    
    const reciever = getUser(recieverId);
    if (reciever) {
      console.log(`Sending message from ${senderId} to ${recieverId}`);
      io.to(reciever.socketId).emit("getMessage", {
        senderId, 
        text
      });
    } else {
      console.warn(`Recipient ${recieverId} not found online. Message will be stored but not delivered immediately.`);
      // We could emit an event back to the sender to indicate the recipient is offline
      socket.emit("messageStatus", {
        status: "undelivered",
        message: "Recipient is offline. Message will be delivered when they come online."
      });
    }
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("A user disconnected with socket ID:", socket.id);
    removeUser(socket.id);
    io.emit("getUsers", users);
  });
  
  // Handle explicit disconnection (optional - for cleaner disconnects)
  socket.on("disconnected", () => {
    console.log("User explicitly disconnected:", socket.id);
    removeUser(socket.id);
    io.emit("getUsers", users);
  });
});

const PORT = process.env.PORT || 8900;
server.listen(PORT, () => {
  console.log(`Socket server running on port ${PORT}`);
});
