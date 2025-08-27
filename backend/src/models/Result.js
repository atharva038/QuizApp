import mongoose from "mongoose";

const resultSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    quizId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
      required: true,
    },
    score: {
      type: Number,
      required: true,
    },
    responses: {
      type: [String], // user’s selected answers (by index order)
      default: [],
    },
  },
  {timestamps: true}
);

export default mongoose.model("Result", resultSchema);
