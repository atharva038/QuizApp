import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./src/routes/auth.js";
import quizRoutes from "./src/routes/quiz.js";
import resultRoutes from "./src/routes/result.js";

dotenv.config();

const PORT = process.env.PORT || 5000;
const app = express();

// --- CORS Setup ---
const allowedOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(",").map((o) => o.trim())
  : ["http://localhost:3000"];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl)
      if (!origin) return callback(null, true);

      // Check if origin is explicitly allowed or matches *.vercel.app
      if (allowedOrigins.includes(origin) || /\.vercel\.app$/.test(origin)) {
        callback(null, true);
      } else {
        console.warn(`🚫 CORS blocked request from origin: ${origin}`);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// Middleware
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/quiz", quizRoutes);
app.use("/api/result", resultRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({status: "ok"});
});

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });

// (Optional) Serve frontend build if needed
// import path from "path";
// app.use(express.static(path.join(process.cwd(), "frontend/build")));
// app.get("*", (req, res) => {
//   res.sendFile(path.join(process.cwd(), "frontend/build", "index.html"));
// });

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

export default app;
