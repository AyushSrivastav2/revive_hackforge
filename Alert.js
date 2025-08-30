import mongoose from "mongoose";
const schema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    level: { type: String, enum: ["info", "warn", "critical"], default: "info" },
    type: { type: String, default: "threshold" },
    message: { type: String, required: true },
    read: { type: Boolean, default: false }
  },
  { timestamps: true }
);
schema.index({ user: 1, createdAt: -1 });
export default mongoose.model("Alert", schema);