import Result from "../models/Result.js";
import Quiz from "../models/Quiz.js";

// (1) Get all results of a user
export const getUserResults = async (req, res) => {
  try {
    const results = await Result.find({userId: req.params.userId})
      .populate({
        path: "quizId",
        select: "title topic questions", // <-- include questions
      })
      .sort({createdAt: -1});

    res.json(results);
  } catch (error) {
    res.status(500).json({message: error.message});
  }
};

// (2) Get single result by ID
export const getResultById = async (req, res) => {
  try {
    const result = await Result.findById(req.params.id).populate({
      path: "quizId",
      select: "title topic questions", // <-- include questions
    });
    if (!result) return res.status(404).json({message: "Result not found"});

    res.json(result);
  } catch (error) {
    res.status(500).json({message: error.message});
  }
};
