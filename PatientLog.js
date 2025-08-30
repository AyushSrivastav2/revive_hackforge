import mongoose from "mongoose";

const patientLogSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: Date, default: () => new Date() },
    pain: { type: Number, min: 0, max: 10, required: true },
    steps: { type: Number, min: 0, default: 0 },
    meds: [{ type: String }],
    notes: { type: String }
  },
  { timestamps: true }
);

patientLogSchema.index({ user: 1, date: 1 }, { unique: true });

export default mongoose.model("PatientLog", patientLogSchema);