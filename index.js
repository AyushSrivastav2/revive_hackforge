import http from "http";
import { Server as SocketIOServer } from "socket.io";
import app from "./app.js";
import connectDB from "./config/db.js";
import { verifySocket } from "./middleware/auth.js";
import ChatMessage from "./models/ChatMessage.js";

const PORT = process.env.PORT || 8080;

await connectDB();

const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: { origin: "*", methods: ["GET", "POST"] }
});

// Authenticated sockets, used for real-time chat
io.use(verifySocket);

io.on("connection", (socket) => {
  // Clients join a room by id
  socket.on("join-room", (roomId) => {
    socket.join(roomId);
  });

  socket.on("send-message", async ({ roomId, text }) => {
    const user = socket.user; // added by verifySocket
    if (!roomId || !text) return;
    const msg = await ChatMessage.create({
      roomId,
      from: user._id,
      text
    });
    io.to(roomId).emit("new-message", {
      _id: msg._id,
      roomId,
      from: user._id,
      text: msg.text,
      createdAt: msg.createdAt
    });
  });
});

server.listen(PORT, () => {
  console.log(`API ready on :${PORT}`);
});