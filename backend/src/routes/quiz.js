import {Router} from "express";
import {auth} from "../middleware/auth.js";
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

/**
 * 🌍 Public Routes
 * Anyone can browse quizzes and view quiz details
 */

// Get all quizzes (public access)
router.get("/", getQuizzesPublic);

// Get quiz by ID (public access)
router.get("/:id", getQuizById);

export default router;
