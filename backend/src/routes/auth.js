import express from "express";
import {register, login, getMe, logout} from "../controllers/authController.js";
import rateLimit from "express-rate-limit";
import {auth} from "../middleware/auth.js";

const router = express.Router();

// Only limit login/register
const loginRegisterLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 15,
  message: "Too many attempts, try again later",
});

router.post("/register", loginRegisterLimiter, register);
router.post("/login", loginRegisterLimiter, login);

// No limiter on these
router.get("/me", auth, getMe);
router.post("/logout", auth, logout);

export default router;
