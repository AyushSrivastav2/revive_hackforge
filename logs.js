import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import PatientLog from "../models/PatientLog.js";
import Alert from "../models/Alert.js";
import { predictPainSeries, weeklyHeatmap } from "../utils/predict.js";

const router = Router();

// Create/update today's log
router.post("/", requireAuth, async (req, res) => {
  const { pain, steps = 0, meds = [], notes, date } = req.body;
  const when = date ? new Date(date) : new Date();
  const doc = await PatientLog.findOneAndUpdate(
    { user: req.user._id, date: new Date(when.toDateString()) },
    { pain, steps, meds, notes, date: new Date(when.toDateString()) },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  // simple alert logic
  if (pain >= 8) {
    await Alert.create({
      user: req.user._id,
      level: "critical",
      type: "pain_spike",
      message: `High pain reported (${pain}/10)`
    });
  }

  res.status(201).json(doc);
});

// Get my logs + analytics
router.get("/", requireAuth, async (req, res) => {
  const logs = await PatientLog.find({ user: req.user._id }).sort({ date: 1 });
  const series = predictPainSeries(logs);
  const heat = weeklyHeatmap(logs);
  res.json({ logs, analytics: { series, heat } });
});

export default router;