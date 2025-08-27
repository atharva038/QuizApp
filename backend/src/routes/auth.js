// filepath: /Users/atharva_beast/Desktop/Coading/QuizApp/backend/src/routes/auth.js
import {Router} from "express";
import {register, login, getMe, logout} from "../controllers/authController.js";
import {auth} from "../middleware/auth.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", auth, getMe);
router.post("/logout", logout);

export default router;
