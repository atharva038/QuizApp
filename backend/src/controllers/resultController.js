import Result from "../models/Result.js";
import Quiz from "../models/Quiz.js";

export const getUserResults = async (req, res) => {
  try {
    const results = await Result.find({userId: req.params.userId})
      .populate({
        path: "quizId",
        select: "title topic",
      })
      .sort({createdAt: -1});

    console.log("🔍 Results API Response:", JSON.stringify(results, null, 2));

    res.json(results);
  } catch (error) {
    res.status(500).json({message: error.message});
  }
};

// (2) Get single result by ID with explanations
export const getResultById = async (req, res) => {
  try {
    const result = await Result.findById(req.params.id).populate({
      path: "quizId",
      select: "title topic questions", // <-- include questions
    });
    if (!result) return res.status(404).json({message: "Result not found"});

    // Build explanations for each question
    const explanations = [];
    if (result.quizId && Array.isArray(result.quizId.questions)) {
      result.quizId.questions.forEach((q, idx) => {
        const userAnswer = result.responses[idx];
        const correctAnswer = q.correctAnswer;
        let explanation = "";
        if (
          userAnswer &&
          userAnswer.trim().toLowerCase() !== correctAnswer.trim().toLowerCase()
        ) {
          explanation = q.explanation || "No explanation provided.";
        }
        explanations.push({
          question: q.question,
          userAnswer,
          correctAnswer,
          options: q.options,
          explanation,
        });
      });
    }

    res.json({
      ...result.toObject(),
      explanations,
    });
  } catch (error) {
    res.status(500).json({message: error.message});
  }
};
