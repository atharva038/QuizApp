import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import rateLimit from "express-rate-limit";

import authRoutes from "./src/routes/auth.js";
import quizRoutes from "./src/routes/quiz.js";
import resultRoutes from "./src/routes/result.js";

dotenv.config();

const PORT = process.env.PORT || 5000;
const app = express();

// --- Security & Performance Middlewares ---
app.use(helmet()); // Adds secure headers
app.use(compression()); // Compress responses
app.use(morgan("combined")); // Logging requests

// --- CORS Setup ---
const allowedOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(",").map((o) => o.trim())
  : ["http://localhost:3000"];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); // allow mobile apps, curl, etc.
      if (allowedOrigins.includes(origin) || /\.vercel\.app$/.test(origin)) {
        callback(null, true);
      } else {
        console.warn(`🚫 CORS blocked request from origin: ${origin}`);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // allow cookies to be sent cross-site
  })
);

// --- Middleware ---
app.use(express.json());
app.use(cookieParser());

// --- Routes ---
app.use("/api/auth", authRoutes); // rate limit login/register
app.use("/api/quiz", quizRoutes);
app.use("/api/result", resultRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({status: "ok"});
});

// --- MongoDB connection ---
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1); // exit if DB fails to connect
  });

// --- Optional: Serve frontend build (if hosting backend + frontend together) ---
// import path from "path";
// app.use(express.static(path.join(process.cwd(), "frontend/build")));
// app.get("*", (req, res) => {
//   res.sendFile(path.join(process.cwd(), "frontend/build", "index.html"));
// });

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

export default app;
