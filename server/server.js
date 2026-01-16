import dotenv from "dotenv";
dotenv.config();
// Core dependencies
import express from "express";
import http from "http";
import cors from "cors";

// Database connection
import connectDB from "./libs/db.js";
connectDB();

// Routes
import userRoute from "./routes/user.routes.js";
import messageRoute from "./routes/message.routes.js";

// Socket.io
import { Server } from "socket.io";
// Initialize express app
const app = express();

// Create HTTP server (required for socket.io)
const server = http.createServer(app);

// ---------------- SOCKET.IO SETUP ----------------

// Initialize socket.io with CORS enabled
export const io = new Server(server, {
  cors: {
    origin: "*", // allow all origins (dev only)
  },
});

// Store mapping of userId -> socketId for online users
export let userSocketMap = {};

// Handle socket connection
io.on("connection", (socket) => {
  // Get userId from query params during socket connection
  const userId = socket.handshake.query.userId;

  console.log("User connected:", userId);

  // If userId exists, store socket id against user id
  if (userId) {
    userSocketMap[userId] = socket.id;
  }

  // Send updated online users list to all clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // Handle socket disconnect
  socket.on("disconnect", () => {
    console.log("User disconnected:", userId);

    // Remove user from online users map
    delete userSocketMap[userId];

    // Emit updated online users list
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

// ---------------- EXPRESS MIDDLEWARES ----------------

// Parse incoming JSON requests
app.use(express.json({ limit: "10mb" }));

// Enable CORS for REST APIs
app.use(cors());

// Health check route
app.use("/api/status", (req, res) => {
  res.send("Server is live 🚀");
});

// API Routes
app.use("/api/auth", userRoute);
app.use("/api/messages", messageRoute);

// ---------------- SERVER START ----------------

if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 3000;

  server.listen(PORT, () => {
    console.log("Server is running on port:", PORT);
  });
}
