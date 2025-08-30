import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import ChatMessage from "../models/ChatMessage.js";

const router = Router();

// GET messages in a room
router.get("/room/:roomId", requireAuth, async (req, res) => {
  const { roomId } = req.params;
  const msgs = await ChatMessage.find({ roomId }).sort({ createdAt: 1 }).limit(500);
  res.json({ messages: msgs });
});

// POST a message (REST fallback if not using websockets)
router.post("/room/:roomId", requireAuth, async (req, res) => {
  const { roomId } = req.params;
  const { text } = req.body;
  const msg = await ChatMessage.create({ roomId, from: req.user._id, text });
  res.status(201).json(msg);
});

export default router;