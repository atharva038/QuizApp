import {Router} from "express";
import {auth} from "../middleware/auth.js";
import {
  getUserResults,
  getResultById,
} from "../controllers/resultController.js";

const router = Router();

// Get all results for a user
router.get("/user/:userId", auth, getUserResults);

// Get single result by ID
router.get("/:id", auth, getResultById);

export default router;
