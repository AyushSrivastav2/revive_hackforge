import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import DoctorPatient from "../models/DoctorPatient.js";

const router = Router();

router.get("/", requireAuth, async (req, res) => {
  res.json({ user: req.user });
});

// Link a patient to a doctor
router.post("/assign", requireAuth, async (req, res) => {
  if (req.user.role !== "doctor") return res.status(403).json({ error: "Doctor only" });
  const { patientId } = req.body;
  const link = await DoctorPatient.findOneAndUpdate(
    { doctor: req.user._id, patient: patientId },
    {},
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
  res.json({ ok: true, link });
});

export default router;