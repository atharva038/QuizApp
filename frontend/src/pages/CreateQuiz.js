import React, {useState, useContext} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {FaPlusCircle, FaRobot} from "react-icons/fa";
import {ThemeContext} from "../themeContext.js";

export default function CreateQuiz() {
  const [title, setTitle] = useState("");
  const [topic, setTopic] = useState("");
  const [questions, setQuestions] = useState([
    {question: "", options: ["", "", "", ""], correctAnswer: ""},
  ]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [aiTopic, setAiTopic] = useState("");
  const [aiNumQuestions, setAiNumQuestions] = useState(5);
  const [aiLoading, setAiLoading] = useState(false);

  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";
  const {theme} = useContext(ThemeContext);
  const darkMode = theme === "dark";

  const handleQuestionChange = (idx, field, value) => {
    const updated = [...questions];
    if (
      field === "question" ||
      field === "correctAnswer" ||
      field === "explanation"
    ) {
      updated[idx][field] = value;
    } else {
      updated[idx].options[field] = value;
    }
    setQuestions(updated);
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {question: "", options: ["", "", "", ""], correctAnswer: ""},
    ]);
  };

  const removeQuestion = (idx) => {
    setQuestions(questions.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await axios.post(
        `${API_URL}/quiz`,
        {title, topic, questions},
        {withCredentials: true}
      );
      setSuccess("✅ Quiz created successfully!");
      setTimeout(() => navigate("/quizzes"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "❌ Failed to create quiz");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateAI = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setAiLoading(true);
    try {
      const res = await axios.post(
        `${API_URL}/quiz/generate`,
        {topic: aiTopic, numQuestions: aiNumQuestions},
        {withCredentials: true}
      );
      const aiQuestions = res.data.questions.map((q) => ({
        ...q,
        explanation: q.explanation || "No explanation provided.",
      }));
      setTitle(res.data.title);
      setTopic(res.data.topic);
      setQuestions(aiQuestions);
      setSuccess("🤖 AI generated quiz! Review and edit before saving.");
    } catch (err) {
      setError(err.response?.data?.message || "❌ AI generation failed");
    }
    setAiLoading(false);
  };

  return (
    <div
      className={`container mt-5 create-quiz-page ${
        darkMode ? "dark-mode" : "light-mode"
      }`}
    >
      <div className="card quiz-form-card shadow border-0 rounded-4 mx-auto">
        <div className="card-body p-4">
          {/* Header */}
          <div className="text-center mb-4">
            <FaPlusCircle
              className={`mb-2 ${darkMode ? "text-info" : "text-success"}`}
              size={38}
            />
            <h3 className="fw-bold">Create a New Quiz</h3>
            <p className="small opacity-75">
              Add questions manually or generate with AI
            </p>
          </div>

          {/* AI Quiz Generation */}
          <form className="mb-4" onSubmit={handleGenerateAI}>
            <div className="row align-items-end g-2">
              <div className="col-md-5">
                <input
                  type="text"
                  className="form-control"
                  value={aiTopic}
                  onChange={(e) => setAiTopic(e.target.value)}
                  placeholder="Topic for AI quiz"
                  required
                />
              </div>
              <div className="col-md-3">
                <input
                  type="number"
                  className="form-control"
                  value={aiNumQuestions}
                  onChange={(e) => setAiNumQuestions(Number(e.target.value))}
                  min={1}
                  max={20}
                  required
                  placeholder="No. of questions"
                />
              </div>
              <div className="col-md-4">
                <button
                  type="submit"
                  className="btn btn-primary-custom w-100"
                  disabled={aiLoading}
                >
                  <FaRobot className="me-2" />
                  {aiLoading ? "Generating..." : "Generate with AI"}
                </button>
              </div>
            </div>
          </form>

          {/* Manual Quiz Form */}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label fw-semibold">Title</label>
              <input
                type="text"
                className="form-control"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="Enter quiz title"
              />
            </div>
            <div className="mb-3">
              <label className="form-label fw-semibold">Topic</label>
              <input
                type="text"
                className="form-control"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                required
                placeholder="Enter quiz topic"
              />
            </div>

            <hr />
            <h5 className="mb-3 fw-bold text-secondary">Questions</h5>
            {questions.map((q, idx) => (
              <div key={idx} className="mb-4 question-box rounded-3 p-3">
                <div className="mb-2 d-flex justify-content-between align-items-center">
                  <label className="form-label fw-semibold mb-0">
                    Question {idx + 1}
                  </label>
                  {questions.length > 1 && (
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => removeQuestion(idx)}
                    >
                      Remove
                    </button>
                  )}
                </div>
                <input
                  type="text"
                  className="form-control mb-2"
                  value={q.question}
                  onChange={(e) =>
                    handleQuestionChange(idx, "question", e.target.value)
                  }
                  required
                  placeholder="Enter question"
                />
                <div className="row">
                  {q.options.map((opt, optIdx) => (
                    <div className="col-6 mb-2" key={optIdx}>
                      <input
                        type="text"
                        className="form-control"
                        value={opt}
                        onChange={(e) =>
                          handleQuestionChange(idx, optIdx, e.target.value)
                        }
                        required
                        placeholder={`Option ${String.fromCharCode(
                          65 + optIdx
                        )}`}
                      />
                    </div>
                  ))}
                </div>
                <input
                  type="text"
                  className="form-control mt-2"
                  value={q.correctAnswer}
                  onChange={(e) =>
                    handleQuestionChange(idx, "correctAnswer", e.target.value)
                  }
                  required
                  placeholder="Correct answer (must match one option)"
                />
                <input
                  type="text"
                  className="form-control mt-2"
                  value={q.explanation || ""}
                  onChange={(e) =>
                    handleQuestionChange(idx, "explanation", e.target.value)
                  }
                  placeholder="Explanation (optional)"
                />
              </div>
            ))}

            {/* Buttons */}
            <div className="d-flex justify-content-between mt-3">
              <button
                type="button"
                className="btn btn-outline-primary"
                onClick={addQuestion}
              >
                + Add Question
              </button>
              <button
                type="submit"
                className="btn btn-success-custom px-4"
                disabled={loading}
              >
                {loading ? "Creating..." : "Create Quiz"}
              </button>
            </div>

            {/* Alerts */}
            {error && (
              <div className="alert alert-danger mt-3 text-center py-2">
                {error}
              </div>
            )}
            {success && (
              <div className="alert alert-success mt-3 text-center py-2">
                {success}
              </div>
            )}
          </form>
        </div>
      </div>

      {/* Scoped Styling */}
      <style jsx>{`
        .create-quiz-page.light-mode {
          background: #f8f9fa;
          color: #212529;
        }
        .create-quiz-page.dark-mode {
          background: #121212;
          color: #f1f1f1;
        }
        .quiz-form-card {
          max-width: 750px;
          border-radius: 16px;
        }
        .quiz-form-card.light-mode {
          background: #fff;
        }
        .quiz-form-card.dark-mode {
          background: #1e1e1e;
          border: 1px solid #333;
        }
        .question-box {
          background: #f8f9fa;
        }
        .dark-mode .question-box {
          background: #2a2a2a;
          border: 1px solid #444;
        }

        .form-control {
          border-radius: 10px;
        }
        .dark-mode .form-control {
          background: #2c2c2c;
          border: 1px solid #555;
          color: #f1f1f1;
        }
        .dark-mode .form-control::placeholder {
          color: #aaa;
        }

        .btn-primary-custom {
          background: linear-gradient(45deg, #6a11cb, #2575fc);
          border: none;
          color: #fff;
          border-radius: 50px;
          font-weight: 600;
          padding: 10px 20px;
          transition: all 0.3s ease;
        }
        .btn-primary-custom:hover {
          transform: translateY(-2px);
          opacity: 0.95;
          box-shadow: 0 5px 15px rgba(37, 117, 252, 0.4);
        }

        .btn-success-custom {
          background: linear-gradient(45deg, #28a745, #218838);
          border: none;
          color: #fff;
          border-radius: 50px;
          font-weight: 600;
          padding: 10px 20px;
          transition: all 0.3s ease;
        }
        .btn-success-custom:hover {
          transform: translateY(-2px);
          opacity: 0.95;
          box-shadow: 0 5px 15px rgba(40, 167, 69, 0.4);
        }
      `}</style>
    </div>
  );
}
