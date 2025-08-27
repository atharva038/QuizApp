import React, {useEffect, useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";

export default function Quizzes() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState("");
  const navigate = useNavigate();

  // Get userId from JWT
  const token = localStorage.getItem("token");
  let userId = "";
  if (token) {
    try {
      userId = JSON.parse(atob(token.split(".")[1])).userId;
    } catch {}
  }

  useEffect(() => {
    const fetchQuizzes = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL || "http://localhost:5000/api"}/quiz`
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
        {
          headers: {Authorization: `Bearer ${token}`},
        }
      );
      setQuizzes(quizzes.filter((q) => q._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete quiz");
    }
    setDeleting("");
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center">Available Quizzes</h2>
      {loading && <div className="text-center">Loading...</div>}
      {error && <div className="alert alert-danger text-center">{error}</div>}
      <div className="row">
        {quizzes.map((quiz) => (
          <div className="col-md-6 col-lg-4 mb-4" key={quiz._id}>
            <div className="card h-100 shadow-sm">
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{quiz.title}</h5>
                <p className="card-text">
                  <strong>Topic:</strong> {quiz.topic}
                </p>
                <p className="card-text">
                  <strong>Questions:</strong> {quiz.questions.length}
                </p>
                <a
                  href={`/quizzes/${quiz._id}`}
                  className="btn btn-primary mt-auto"
                >
                  View Quiz
                </a>
                {/* Show Edit/Delete if user is creator */}
                {quiz.createdBy?._id === userId && (
                  <div className="mt-2 d-flex gap-2">
                    <button
                      className="btn btn-warning btn-sm"
                      onClick={() => navigate(`/quiz/edit/${quiz._id}`)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(quiz._id)}
                      disabled={deleting === quiz._id}
                    >
                      {deleting === quiz._id ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      {quizzes.length === 0 && !loading && !error && (
        <div className="text-center text-muted">No quizzes found.</div>
      )}
    </div>
  );
}
