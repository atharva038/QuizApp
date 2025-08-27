import React, {useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {FaPlusCircle, FaRobot} from "react-icons/fa";

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

  const handleQuestionChange = (idx, field, value) => {
    const updated = [...questions];
    if (field === "question" || field === "correctAnswer") {
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
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      await axios.post(
        `${API_URL}/quiz`,
        {title, topic, questions},
        {withCredentials: true} // ✅ send cookie-based session
      );
      setLoading(false);
      setSuccess("✅ Quiz created successfully!");
      setTimeout(() => navigate("/quizzes"), 1500);
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || "❌ Failed to create quiz");
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
        {withCredentials: true} // ✅ uses cookie
      );
      setTitle(res.data.title);
      setTopic(res.data.topic);
      setQuestions(res.data.questions);
      setSuccess("🤖 AI generated quiz! Review and edit before saving.");
    } catch (err) {
      setError(err.response?.data?.message || "❌ AI generation failed");
    }
    setAiLoading(false);
  };

  return (
    <div className="container mt-5">
      <div
        className="card shadow border-0 rounded-4 mx-auto"
        style={{maxWidth: 750}}
      >
        <div className="card-body p-4">
          {/* Header */}
          <div className="text-center mb-4">
            <FaPlusCircle className="text-success mb-2" size={38} />
            <h3 className="fw-bold text-dark">Create a New Quiz</h3>
            <p className="text-muted small">
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
                  className="btn btn-info w-100"
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
              <div key={idx} className="mb-4 border rounded-3 p-3 bg-light">
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
                className="btn btn-success px-4"
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
    </div>
  );
}
