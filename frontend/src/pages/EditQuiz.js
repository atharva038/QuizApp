import React, {useEffect, useState} from "react";
import axios from "axios";
import {useParams, useNavigate} from "react-router-dom";
import {FaEdit} from "react-icons/fa";

export default function EditQuiz() {
  const {id} = useParams();
  const [title, setTitle] = useState("");
  const [topic, setTopic] = useState("");
  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuiz = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await axios.get(
          `${
            process.env.REACT_APP_API_URL || "http://localhost:5000/api"
          }/quiz/${id}`
        );
        setTitle(res.data.title);
        setTopic(res.data.topic);
        setQuestions(res.data.questions);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load quiz");
      }
      setLoading(false);
    };
    fetchQuiz();
  }, [id]);

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
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${
          process.env.REACT_APP_API_URL || "http://localhost:5000/api"
        }/quiz/${id}`,
        {title, topic, questions},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSuccess("Quiz updated successfully!");
      setTimeout(() => navigate("/quizzes"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update quiz");
    }
  };

  if (loading)
    return <div className="container mt-5 text-center">Loading...</div>;
  if (error)
    return (
      <div className="container mt-5 alert alert-danger text-center">
        {error}
      </div>
    );

  return (
    <div className="container mt-5">
      <div
        className="card shadow-lg border-0 rounded-4 mx-auto"
        style={{maxWidth: 700}}
      >
        <div className="card-body p-4">
          <div className="text-center mb-4">
            <FaEdit className="text-warning mb-2" size={36} />
            <h3 className="fw-bold text-dark">Edit Quiz</h3>
            <p className="text-muted small">Update your quiz details below</p>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label fw-semibold">Title</label>
              <input
                type="text"
                className="form-control"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="Quiz title"
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
                placeholder="Quiz topic"
              />
            </div>
            <hr />
            <h5 className="mb-3">Questions</h5>
            {questions.map((q, idx) => (
              <div key={idx} className="mb-4 border rounded p-3 bg-light">
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
            <button
              type="button"
              className="btn btn-outline-primary mb-3"
              onClick={addQuestion}
            >
              Add Question
            </button>
            <button type="submit" className="btn btn-warning w-100">
              Update Quiz
            </button>
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
