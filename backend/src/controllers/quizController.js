import Quiz from "../models/Quiz.js";
import Result from "../models/Result.js";
import fetch from "node-fetch"; // Node < 18 only

// (1) Create Quiz manually
export const createQuiz = async (req, res) => {
  try {
    const {title, topic, questions} = req.body;

    if (!title || !topic || !questions || questions.length === 0) {
      return res.status(400).json({message: "Missing required fields"});
    }

    const quiz = await Quiz.create({
      title,
      topic,
      createdBy: req.user.id, // ✅ only authenticated users
      questions,
    });

    res.status(201).json(quiz);
  } catch (error) {
    res.status(500).json({message: error.message});
  }
};

// (2) Generate Quiz using Gemini API
export const generateQuiz = async (req, res) => {
  try {
    const {topic, numQuestions} = req.body;

    if (!topic || !numQuestions) {
      return res.status(400).json({message: "Topic and numQuestions required"});
    }

    const prompt = `Generate ${numQuestions} multiple-choice questions on ${topic}.
    Each question must have exactly 4 options and one correctAnswer.
    Return ONLY valid JSON (no markdown, no explanation) in this format:
    [
      { "question": "....", "options": ["A","B","C","D"], "correctAnswer": "B" }
    ]`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          contents: [{parts: [{text: prompt}]}],
        }),
      }
    );

    const data = await response.json();
    console.log("Gemini raw response:", JSON.stringify(data, null, 2));

    let text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      return res.status(500).json({message: "Gemini response invalid"});
    }

    text = text.replace(/```json|```/g, "").trim();

    let questions;
    try {
      questions = JSON.parse(text);
    } catch (e) {
      console.error("JSON parse error:", e.message);
      return res
        .status(500)
        .json({message: "Failed to parse Gemini response", raw: text});
    }

    const quiz = await Quiz.create({
      title: `${topic} Quiz`,
      topic,
      createdBy: req.user.id, // ✅ creator is authenticated user
      questions,
    });

    res.status(201).json(quiz);
  } catch (error) {
    res.status(500).json({message: error.message});
  }
};

// (3) Get all quizzes (public)
export const getQuizzesPublic = async (req, res) => {
  try {
    const quizzes = await Quiz.find().populate("createdBy", "username");
    res.json(quizzes);
  } catch (error) {
    res.status(500).json({message: error.message});
  }
};

// (4) Get single quiz by ID
export const getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({message: "Quiz not found"});
    res.json(quiz);
  } catch (error) {
    res.status(500).json({message: error.message});
  }
};

// (5) Attempt quiz
export const attemptQuiz = async (req, res) => {
  try {
    const {answers} = req.body;
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) return res.status(404).json({message: "Quiz not found"});

    let score = 0;
    quiz.questions.forEach((q, index) => {
      let userAnswer = answers[index];
      let correctAnswer = q.correctAnswer;

      if (["A", "B", "C", "D"].includes(userAnswer)) {
        const optionIndex = {A: 0, B: 1, C: 2, D: 3}[userAnswer];
        userAnswer = q.options[optionIndex];
      }

      if (
        userAnswer &&
        userAnswer.trim().toLowerCase() === correctAnswer.trim().toLowerCase()
      ) {
        score++;
      }
    });

    const result = await Result.create({
      userId: req.user.id,
      quizId: quiz._id,
      score,
      responses: answers,
    });

    res.json({score, total: quiz.questions.length, resultId: result._id});
  } catch (error) {
    res.status(500).json({message: error.message});
  }
};

// (6) Edit Quiz (only creator or admin)
export const editQuiz = async (req, res) => {
  try {
    const {title, topic, questions} = req.body;
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) return res.status(404).json({message: "Quiz not found"});

    // ✅ check ownership
    if (
      quiz.createdBy.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res
        .status(403)
        .json({message: "Not authorized to edit this quiz"});
    }

    quiz.title = title ?? quiz.title;
    quiz.topic = topic ?? quiz.topic;
    quiz.questions = questions ?? quiz.questions;

    await quiz.save();

    res.json({message: "Quiz updated successfully", quiz});
  } catch (error) {
    res.status(500).json({message: error.message});
  }
};

// (7) Delete Quiz (only creator or admin)
export const deleteQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) return res.status(404).json({message: "Quiz not found"});

    // ✅ check ownership
    if (
      quiz.createdBy.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res
        .status(403)
        .json({message: "Not authorized to delete this quiz"});
    }

    await quiz.deleteOne();
    res.json({message: "Quiz deleted successfully"});
  } catch (error) {
    res.status(500).json({message: error.message});
  }
};
