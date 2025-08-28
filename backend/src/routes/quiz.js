import {Router} from "express";
import {auth} from "../middleware/auth.js";
import Quiz from "../models/Quiz.js";
import {
  createQuiz,
  generateQuiz,
  getQuizzesPublic,
  getQuizById,
  attemptQuiz,
  editQuiz,
  deleteQuiz,
} from "../controllers/quizController.js";

const router = Router();

/**
 * 🔒 Authenticated Routes
 * Only logged-in users can create, generate, edit, delete, or attempt quizzes
 */

// Create quiz manually (auth required)
router.post("/", auth, createQuiz);

// Generate quiz using Gemini (auth required)
router.post("/generate", auth, generateQuiz);

// Attempt a quiz (auth required)
router.post("/:id/attempt", auth, attemptQuiz);

// Edit quiz (auth + must be creator or admin)
router.put("/:id", auth, editQuiz);

// Delete quiz (auth + must be creator or admin)
router.delete("/:id", auth, deleteQuiz);

// Get quizzes created by the authenticated user
router.get("/my", auth, async (req, res) => {
  try {
    const quizzes = await Quiz.find({createdBy: req.user.id}).populate(
      "createdBy",
      "username"
    );
    res.json(quizzes);
  } catch (error) {
    res.status(500).json({message: error.message});
  }
});

/**
 * 🌍 Public Routes
 * Anyone can browse quizzes and view quiz details
 */

// Get all quizzes (public access)
router.get("/", getQuizzesPublic);

// Get quiz by ID (public access)
router.get("/:id", getQuizById);

export default router;
