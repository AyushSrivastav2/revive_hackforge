import { Router } from "express";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import PatientLog from "../models/PatientLog.js";
import DoctorPatient from "../models/DoctorPatient.js";
import { signToken } from "../middleware/auth.js";

const router = Router();

/**
 * Creates:
 *  - doctor: doctor@demo.io / pass: demo123
 *  - patient: patient@demo.io / pass: demo123
 *  - links them
 *  - seeds 21 days of logs
 * Returns both JWTs.
 */
router.post("/seed", async (_req, res) => {
  const pass = await bcrypt.hash("demo123", 12);

  let doctor = await User.findOne({ email: "doctor@demo.io" });
  if (!doctor) doctor = await User.create({ name: "Demo Doctor", email: "doctor@demo.io", role: "doctor", passwordHash: pass });

  let patient = await User.findOne({ email: "patient@demo.io" });
  if (!patient) patient = await User.create({ name: "Demo Patient", email: "patient@demo.io", role: "patient", passwordHash: pass });

  await DoctorPatient.findOneAndUpdate({ doctor: doctor._id, patient: patient._id }, {}, { upsert: true, new: true });

  // seed 21 days
  const today = new Date();
  const bulk = [];
  for (let i = 20; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const entryDate = new Date(d.toDateString()); // normalize
    bulk.push({
      updateOne: {
        filter: { user: patient._id, date: entryDate },
        update: {
          user: patient._id,
          date: entryDate,
          pain: Math.max(0, Math.min(10, Math.round(6 + (Math.random() * 4 - 2)))),
          steps: Math.floor(3000 + Math.random() * 6000),
          meds: ["ibuprofen"].slice(0, Math.random() > 0.5 ? 1 : 0)
        },
        upsert: true
      }
    });
  }
  if (bulk.length) await PatientLog.bulkWrite(bulk);

  const doctorToken = signToken(doctor);
  const patientToken = signToken(patient);

  res.json({
    doctor: { token: doctorToken, _id: doctor._id, name: doctor.name, email: doctor.email },
    patient: { token: patientToken, _id: patient._id, name: patient.name, email: patient.email }
  });
});

export default router;