import React, {useEffect, useState, useCallback} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {FaPlusCircle} from "react-icons/fa";
import QuizCard from "./QuizCard";

export default function Quizzes() {
  const [quizzes, setQuizzes] = useState([]);
  const [filteredQuizzes, setFilteredQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("latest"); // latest or oldest
  const navigate = useNavigate();

  const fetchQuizzes = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL || "http://localhost:5000/api"}/quiz`,
        {withCredentials: true}
      );
      setQuizzes(res.data);
      setFilteredQuizzes(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch quizzes");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchQuizzes();
  }, [fetchQuizzes]);

  // Handle delete
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this quiz?")) return;
    setDeletingId(id);
    try {
      await axios.delete(
        `${
          process.env.REACT_APP_API_URL || "http://localhost:5000/api"
        }/quiz/${id}`,
        {withCredentials: true}
      );
      setQuizzes((prev) => prev.filter((q) => q._id !== id));
      setFilteredQuizzes((prev) => prev.filter((q) => q._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete quiz");
    } finally {
      setDeletingId(null);
    }
  };

  // Handle search
  useEffect(() => {
    const filtered = quizzes.filter((quiz) =>
      quiz.title.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredQuizzes(filtered);
  }, [search, quizzes]);

  // Handle sort
  useEffect(() => {
    setFilteredQuizzes((prev) =>
      [...prev].sort((a, b) => {
        if (sortOrder === "latest")
          return new Date(b.createdAt) - new Date(a.createdAt);
        else return new Date(a.createdAt) - new Date(b.createdAt);
      })
    );
  }, [sortOrder]);

  return (
    <div className="container my-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-center fw-bold mb-0">📚 Available Quizzes</h2>
        <button
          className="btn btn-primary d-flex align-items-center"
          onClick={() => navigate("/quiz/create")}
        >
          <FaPlusCircle className="me-2" />
          Create Quiz
        </button>
      </div>

      {/* Search and Sort */}
      <div className="row mb-4">
        <div className="col-md-6 mb-2">
          <input
            type="text"
            className="form-control"
            placeholder="Search by quiz title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="col-md-6 mb-2">
          <select
            className="form-select"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="latest">Sort by Latest</option>
            <option value="oldest">Sort by Oldest</option>
          </select>
        </div>
      </div>

      {loading && <div className="text-center">Loading...</div>}
      {error && <div className="alert alert-danger text-center">{error}</div>}

      {filteredQuizzes.length > 0 ? (
        <div className="row g-4">
          {filteredQuizzes.map((quiz) => (
            <QuizCard
              key={quiz._id}
              quiz={quiz}
              onDelete={handleDelete}
              isDeleting={deletingId === quiz._id}
              showActions={true}
            />
          ))}
        </div>
      ) : (
        !loading &&
        !error && (
          <div className="text-center text-muted mt-5">No quizzes found.</div>
        )
      )}
    </div>
  );
}
