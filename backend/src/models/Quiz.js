import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  options: {
    type: [String], // ["A", "B", "C", "D"]
    validate: (v) => v.length >= 2,
    required: true,
  },
  correctAnswer: {
    type: String,
    required: true, // must match one of the options
  },
  explanation: {
    type: String,
    default: "",
  },
});

const quizSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    topic: {
      type: String,
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    questions: {
      type: [questionSchema],
      default: [],
    },
  },
  {timestamps: true}
);

export default mongoose.model("Quiz", quizSchema);
