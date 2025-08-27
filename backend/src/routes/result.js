import {Router} from "express";
import {auth} from "../middleware/auth.js";
import {
  getUserResults,
  getResultById,
} from "../controllers/resultController.js";

const router = Router();

// Get all results for the authenticated user
router.get("/user/me", auth, (req, res, next) => {
  req.params.userId = req.user.id;
  return getUserResults(req, res, next);
});

// Get all results for a specific user (admin or for future use)
router.get("/user/:userId", auth, getUserResults);

// Get single result by ID
router.get("/:id", auth, getResultById);

export default router;
