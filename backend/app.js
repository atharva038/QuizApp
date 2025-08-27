import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./src/routes/auth.js";
import quizRoutes from "./src/routes/quiz.js";
import resultRoutes from "./src/routes/result.js";

const PORT = process.env.PORT || 5000;

dotenv.config();

const app = express();

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);
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
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

// Production static file serving (optional, if serving frontend from backend)
// import path from "path";
// app.use(express.static(path.join(process.cwd(), "frontend/build")));
// app.get("*", (req, res) => {
//   res.sendFile(path.join(process.cwd(), "frontend/build", "index.html"));
// });

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
