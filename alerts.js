import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import Alert from "../models/Alert.js";

const router = Router();

router.get("/", requireAuth, async (req, res) => {
  const alerts = await Alert.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(50);
  res.json({ alerts });
});

router.post("/:id/read", requireAuth, async (req, res) => {
  const { id } = req.params;
  await Alert.findOneAndUpdate({ _id: id, user: req.user._id }, { read: true });
  res.json({ ok: true });
});

export default router;