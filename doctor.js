import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import DoctorPatient from "../models/DoctorPatient.js";
import PatientLog from "../models/PatientLog.js";
import User from "../models/User.js";

const router = Router();

router.get("/patients", requireAuth, async (req, res) => {
  if (req.user.role !== "doctor") return res.status(403).json({ error: "Doctor only" });
  const links = await DoctorPatient.find({ doctor: req.user._id }).populate("patient", "name email");
  res.json({ patients: links.map(l => l.patient) });
});

router.get("/patient/:id/overview", requireAuth, async (req, res) => {
  if (req.user.role !== "doctor") return res.status(403).json({ error: "Doctor only" });
  const patient = await User.findById(req.params.id).select("name email role");
  const logs = await PatientLog.find({ user: req.params.id }).sort({ date: 1 });
  res.json({ patient, logs });
});

export default router;