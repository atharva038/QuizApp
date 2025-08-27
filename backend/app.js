import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors"; // <-- Add this import
import authRoutes from "./src/routes/auth.js";
import quizRoutes from "./src/routes/quiz.js";
import resultRoutes from "./src/routes/result.js";

const PORT = process.env.PORT || 5000;

dotenv.config();

const app = express();

// Middleware
app.use(cors({origin: "http://localhost:3000", credentials: true})); // <-- Add this line
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/quiz", quizRoutes);
app.use("/api/result", resultRoutes);

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
