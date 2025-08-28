import React, {useEffect, useState, useCallback, useContext} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {FaPlusCircle} from "react-icons/fa";
import QuizCard from "./QuizCard";
import {ThemeContext} from "../themeContext.js"; // <-- import ThemeContext

// --- Main MyQuizzes Component ---
export default function MyQuizzes() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();
  const {theme} = useContext(ThemeContext);
  const darkMode = theme === "dark";

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await axios.get(
          `${
            process.env.REACT_APP_API_URL || "http://localhost:5000/api"
          }/auth/me`,
          {withCredentials: true}
        );
        setUserId(res.data?.user?._id);
      } catch {
        setUserId(null);
      }
    };
    fetchMe();
  }, []);

  const fetchMyQuizzes = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(
        `${
          process.env.REACT_APP_API_URL || "http://localhost:5000/api"
        }/quiz/my`,
        {withCredentials: true}
      );
      setQuizzes(res.data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to fetch quizzes. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMyQuizzes();
  }, [fetchMyQuizzes]);

  const handleDelete = async (id) => {
    if (
      !window.confirm("Are you sure you want to permanently delete this quiz?")
    ) {
      return;
    }
    setDeletingId(id);
    try {
      await axios.delete(
        `${
          process.env.REACT_APP_API_URL || "http://localhost:5000/api"
        }/quiz/${id}`,
        {withCredentials: true}
      );
      setQuizzes((prevQuizzes) => prevQuizzes.filter((q) => q._id !== id));
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to delete quiz. Please try again."
      );
    } finally {
      setDeletingId(null);
    }
  };

  // --- Component Styles ---
  const styles = `
    .my-quizzes-container {
      max-width: 1140px;
      animation: fadeIn 0.5s ease-in-out;
      ${darkMode ? "color: #f1f1f1;" : ""}
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .quiz-card {
      border: 1px solid #e0e0e0;
      border-radius: 12px;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
      overflow: hidden;
      ${
        darkMode
          ? "background: #1e1e1e; color: #f1f1f1; border-color: #333;"
          : ""
      }
    }

    .quiz-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
    }

    .quiz-card .card-title {
      font-weight: 600;
      color: ${darkMode ? "#f1f1f1" : "#333"};
    }

    .quiz-card .btn {
      border-radius: 8px;
      font-weight: 500;
    }

    .loader {
      border: 5px solid #f3f3f3;
      border-top: 5px solid #3498db;
      border-radius: 50%;
      width: 50px;
      height: 50px;
      animation: spin 1s linear infinite;
      margin: 50px auto;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .empty-state {
      background-color: ${darkMode ? "#1a1a1a" : "#f8f9fa"};
      color: ${darkMode ? "#f1f1f1" : "#555"};
      padding: 50px;
      border-radius: 12px;
      margin-top: 30px;
      border: 1px dashed ${darkMode ? "#444" : "#ddd"};
    }

    .empty-state h3 {
      color: ${darkMode ? "#f1f1f1" : "#555"};
    }
  `;

  const renderContent = () => {
    if (loading) {
      return <div className="loader"></div>;
    }

    if (error) {
      return <div className="alert alert-danger text-center">{error}</div>;
    }

    if (quizzes.length === 0) {
      return (
        <div className="text-center empty-state">
          <h3>No Quizzes Yet!</h3>
          <p>It looks a bit empty here. Why not create your first quiz?</p>
          <button
            className="btn btn-success mt-3"
            onClick={() => navigate("/quiz/create")}
          >
            <FaPlusCircle className="me-2" />
            Create a New Quiz
          </button>
        </div>
      );
    }

    return (
      <div className="row">
        {quizzes.map((quiz) => (
          <QuizCard
            key={quiz._id}
            quiz={quiz}
            onDelete={handleDelete}
            isDeleting={deletingId === quiz._id}
            isOwner={quiz.createdBy?._id === userId}
          />
        ))}
      </div>
    );
  };

  return (
    <>
      <style>{styles}</style>
      <div
        className={`container my-quizzes-container mt-5${
          darkMode ? " bg-dark" : ""
        }`}
      >
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2
            className="mb-0"
            style={{color: darkMode ? "#f1f1f1" : undefined}}
          >
            My Quizzes 🧠
          </h2>
          <button
            className={`btn ${
              darkMode ? "btn-warning" : "btn-primary"
            } d-flex align-items-center`}
            onClick={() => navigate("/quiz/create")}
          >
            <FaPlusCircle className="me-2" />
            Create Quiz
          </button>
        </div>
        {renderContent()}
      </div>
    </>
  );
}
