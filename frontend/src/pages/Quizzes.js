import React, {useEffect, useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";

export default function Quizzes() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuizzes = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await axios.get(
          `${
            process.env.REACT_APP_API_URL || "http://localhost:5000/api"
          }/quiz`,
          {withCredentials: true}
        );
        setQuizzes(res.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch quizzes");
      }
      setLoading(false);
    };
    fetchQuizzes();
  }, [deleting]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this quiz?")) return;
    setDeleting(id);
    try {
      await axios.delete(
        `${
          process.env.REACT_APP_API_URL || "http://localhost:5000/api"
        }/quiz/${id}`,
        {withCredentials: true}
      );
      setQuizzes(quizzes.filter((q) => q._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete quiz");
    }
    setDeleting("");
  };

  return (
    <div className="container my-5">
      <h2 className="text-center fw-bold mb-5">📚 Available Quizzes</h2>

      {loading && <div className="text-center">Loading...</div>}
      {error && <div className="alert alert-danger text-center">{error}</div>}

      <div className="row g-4">
        {quizzes.map((quiz) => (
          <div className="col-md-6 col-lg-4" key={quiz._id}>
            <div className="card shadow-lg border-0 h-100 quiz-card">
              <div className="card-body d-flex flex-column">
                <h5 className="card-title text-primary fw-bold">
                  {quiz.title}
                </h5>
                <p className="card-text mb-1">
                  <span className="badge bg-info text-dark">
                    Topic: {quiz.topic}
                  </span>
                </p>
                <p className="card-text text-muted mb-3">
                  {quiz.questions.length} Questions
                </p>

                <button
                  className="btn btn-outline-primary mt-auto"
                  onClick={() => navigate(`/quizzes/${quiz._id}`)}
                >
                  View Quiz
                </button>

                <div className="mt-3 d-flex gap-2">
                  <button
                    className="btn btn-warning btn-sm flex-fill"
                    onClick={() => navigate(`/quiz/edit/${quiz._id}`)}
                  >
                    ✏️ Edit
                  </button>
                  <button
                    className="btn btn-danger btn-sm flex-fill"
                    onClick={() => handleDelete(quiz._id)}
                    disabled={deleting === quiz._id}
                  >
                    {deleting === quiz._id ? "Deleting..." : "🗑️ Delete"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {quizzes.length === 0 && !loading && !error && (
        <div className="text-center text-muted mt-5">No quizzes found.</div>
      )}

      <style>{`
        .quiz-card {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .quiz-card:hover {
          transform: translateY(-5px);
          box-shadow: 0px 8px 20px rgba(0, 0, 0, 0.15);
        }
      `}</style>
    </div>
  );
}
