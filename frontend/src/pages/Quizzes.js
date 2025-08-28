import React, {useEffect, useState, useCallback, useContext} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {FaPlusCircle} from "react-icons/fa";
import QuizCard from "./QuizCard";
import {ThemeContext} from "../themeContext"; // import context

export default function Quizzes() {
  const [quizzes, setQuizzes] = useState([]);
  const [filteredQuizzes, setFilteredQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("latest");
  const navigate = useNavigate();

  const {theme} = useContext(ThemeContext);
  const darkMode = theme === "dark";

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
    <div
      className={`container-fluid min-vh-100 py-5 quizzes-page ${
        darkMode ? "dark-mode" : "light-mode"
      }`}
    >
      <h2 className="mb-5 text-center quizzes-title">📚 Available Quizzes</h2>

      {/* Search + Sort + Create */}
      <div className="row mb-4 justify-content-center">
        <div className="col-md-4 mb-2">
          <input
            type="text"
            className={`form-control ${
              darkMode ? "bg-secondary text-light border-0" : ""
            }`}
            placeholder="Search by quiz title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="col-md-3 mb-2">
          <select
            className={`form-select ${
              darkMode ? "bg-secondary text-light border-0" : ""
            }`}
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="latest">Sort by Latest</option>
            <option value="oldest">Sort by Oldest</option>
          </select>
        </div>
        <div className="col-md-3 mb-2 text-md-end text-center">
          <button
            className="btn btn-primary-custom d-flex align-items-center justify-content-center w-100"
            onClick={() => navigate("/quiz/create")}
          >
            <FaPlusCircle className="me-2" />
            Create Quiz
          </button>
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
              darkMode={darkMode}
            />
          ))}
        </div>
      ) : (
        !loading &&
        !error && (
          <div className="text-center text-muted mt-5">No quizzes found.</div>
        )
      )}

      {/* Scoped Styling */}
      <style jsx>{`
        .quizzes-page.light-mode {
          background: #f8f9fa;
          color: #212529;
        }
        .quizzes-page.dark-mode {
          background: #121212;
          color: #f1f1f1;
        }

        .quizzes-title {
          font-size: 2.2rem;
          font-weight: 700;
          position: relative;
          padding-bottom: 10px;
        }
        .quizzes-title::after {
          content: "";
          display: block;
          width: 80px;
          height: 4px;
          margin: 0 auto;
          margin-top: 10px;
          background: linear-gradient(90deg, #6a11cb, #2575fc);
          border-radius: 3px;
        }

        .btn-primary-custom {
          background: linear-gradient(45deg, #6a11cb, #2575fc);
          border: none;
          color: #fff;
          border-radius: 50px;
          padding: 10px 20px;
          font-weight: 600;
          transition: all 0.3s ease;
          text-align: center;
        }
        .btn-primary-custom:hover {
          opacity: 0.95;
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(37, 117, 252, 0.4);
        }
      `}</style>
    </div>
  );
}
