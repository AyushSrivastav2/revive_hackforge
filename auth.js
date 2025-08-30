import { Router } from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";
import User from "../models/User.js";
import { signToken } from "../middleware/auth.js";

const router = Router();

const regSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(["patient", "doctor"]).optional()
});

router.post("/register", async (req, res) => {
  const body = regSchema.parse(req.body);
  const exists = await User.findOne({ email: body.email });
  if (exists) return res.status(409).json({ error: "Email already used" });
  const passwordHash = await bcrypt.hash(body.password, 12);
  const user = await User.create({
    name: body.name,
    email: body.email,
    role: body.role || "patient",
    passwordHash
  });
  const token = signToken(user);
  res.status(201).json({ token, user: { _id: user._id, name: user.name, email: user.email, role: user.role } });
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

router.post("/login", async (req, res) => {
  const body = loginSchema.parse(req.body);
  const user = await User.findOne({ email: body.email });
  if (!user) return res.status(401).json({ error: "Invalid credentials" });
  const ok = await bcrypt.compare(body.password, user.passwordHash);
  if (!ok) return res.status(401).json({ error: "Invalid credentials" });
  const token = signToken(user);
  res.json({ token, user: { _id: user._id, name: user.name, email: user.email, role: user.role } });
});

export default router;