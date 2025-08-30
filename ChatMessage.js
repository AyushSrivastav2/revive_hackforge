import mongoose from "mongoose";
const chatSchema = new mongoose.Schema(
  {
    roomId: { type: String, required: true },
    from: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true }
  },
  { timestamps: true }
);
chatSchema.index({ roomId: 1, createdAt: 1 });
export default mongoose.model("ChatMessage", chatSchema);