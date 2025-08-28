import React, {useEffect, useState, useRef, useContext} from "react";
import axios from "axios";
import {useParams, useNavigate} from "react-router-dom";
import {FaBrain} from "react-icons/fa";
import {ThemeContext} from "../themeContext.js";

export default function QuizDetail() {
  const {id} = useParams();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [timer, setTimer] = useState(0); // seconds left
  const [timerActive, setTimerActive] = useState(false);
  const navigate = useNavigate();
  const timerRef = useRef();
  const {theme} = useContext(ThemeContext);
  const darkMode = theme === "dark";

  useEffect(() => {
    const fetchQuiz = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await axios.get(
          `${
            process.env.REACT_APP_API_URL || "http://localhost:5000/api"
          }/quiz/${id}`,
          {
            withCredentials: true, // <-- use cookie-based auth
          }
        );
        setQuiz(res.data);
        setAnswers(new Array(res.data.questions.length).fill(""));
        // Set timer (e.g., 60 seconds per question)
        const seconds = (res.data.questions.length || 1) * 60;
        setTimer(seconds);
        setTimerActive(true);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch quiz");
      }
      setLoading(false);
    };
    fetchQuiz();
  }, [id]);

  // Timer countdown and auto-submit
  useEffect(() => {
    if (!timerActive || submitting || timer <= 0) return;
    timerRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setTimerActive(false);
          handleSubmitAuto();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
    // eslint-disable-next-line
  }, [timerActive, submitting, timer]);

  const handleSubmitAuto = async () => {
    setSubmitting(true);
    setError("");
    setSuccess("");
    try {
      const res = await axios.post(
        `${
          process.env.REACT_APP_API_URL || "http://localhost:5000/api"
        }/quiz/${id}/attempt`,
        {answers},
        {
          withCredentials: true, // <-- use cookie-based auth
        }
      );
      setSuccess(
        `Time's up! Your score: ${res.data.score} / ${res.data.total}`
      );
      setTimeout(() => navigate(`/results/${res.data.resultId}`), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit quiz");
    }
    setSubmitting(false);
  };

  const handleAnswerChange = (qIdx, value) => {
    const updated = [...answers];
    updated[qIdx] = value;
    setAnswers(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess("");
    clearInterval(timerRef.current);
    setTimerActive(false);
    try {
      const res = await axios.post(
        `${
          process.env.REACT_APP_API_URL || "http://localhost:5000/api"
        }/quiz/${id}/attempt`,
        {answers},
        {
          withCredentials: true, // <-- use cookie-based auth
        }
      );
      setSuccess(
        `Quiz submitted! Your score: ${res.data.score} / ${res.data.total}`
      );
      setTimeout(() => navigate(`/results/${res.data.resultId}`), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit quiz");
    }
    setSubmitting(false);
  };

  // Timer display helper
  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  if (loading)
    return <div className="container mt-5 text-center">Loading...</div>;
  if (error)
    return (
      <div className="container mt-5 alert alert-danger text-center">
        {error}
      </div>
    );
  if (!quiz) return null;

  return (
    <div
      className={`container mt-5 quiz-detail-page ${
        darkMode ? "dark-mode" : "light-mode"
      }`}
    >
      <div
        className={`card shadow-lg border-0 rounded-4 mx-auto quiz-detail-card ${
          darkMode ? "dark-mode" : "light-mode"
        }`}
        style={{maxWidth: 700}}
      >
        <div className="card-body p-4">
          <div className="text-center mb-4">
            <FaBrain
              className={darkMode ? "text-info mb-2" : "text-primary mb-2"}
              size={36}
            />
            <h3 className={`fw-bold ${darkMode ? "text-light" : "text-dark"}`}>
              {quiz.title}
            </h3>
            <p
              className={`small ${
                darkMode ? "text-light opacity-75" : "text-muted"
              }`}
            >
              Topic: {quiz.topic}
            </p>
            <div className="mb-2">
              <span
                className={`badge bg-warning ${
                  darkMode ? "text-dark" : "text-dark"
                } fs-6`}
              >
                Time Left: {formatTime(timer)}
              </span>
            </div>
          </div>
          <form onSubmit={handleSubmit}>
            {quiz.questions.map((q, idx) => (
              <div
                key={idx}
                className={`mb-4 border rounded p-3 ${
                  darkMode ? "bg-dark text-light border-secondary" : "bg-light"
                }`}
              >
                <div className="mb-2 fw-semibold">
                  Q{idx + 1}: {q.question}
                </div>
                <div className="row">
                  {q.options.map((opt, optIdx) => (
                    <div className="col-6 mb-2" key={optIdx}>
                      <div className="form-check">
                        <input
                          className={`form-check-input${
                            darkMode ? " custom-radio-dark" : ""
                          }`}
                          type="radio"
                          name={`q${idx}`}
                          id={`q${idx}opt${optIdx}`}
                          value={opt}
                          checked={answers[idx] === opt}
                          onChange={() => handleAnswerChange(idx, opt)}
                          required
                        />
                        <label
                          className={`form-check-label${
                            darkMode ? " text-light" : ""
                          }`}
                          htmlFor={`q${idx}opt${optIdx}`}
                        >
                          {String.fromCharCode(65 + optIdx)}. {opt}
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <button
              type="submit"
              className={`btn btn-success w-100 ${
                darkMode ? "text-light" : ""
              }`}
              disabled={submitting || timer <= 0}
            >
              {submitting ? "Submitting..." : "Submit Quiz"}
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
      {/* Scoped Styling */}
      <style jsx>{`
        .quiz-detail-page.light-mode {
          background: #f8f9fa;
          color: #212529;
        }
        .quiz-detail-page.dark-mode {
          background: #121212;
          color: #f1f1f1;
        }
        .quiz-detail-card.light-mode {
          background: #fff;
        }
        .quiz-detail-card.dark-mode {
          background: #1e1e1e;
          border: 1px solid #333;
        }
        .custom-radio-dark {
          background: #2c2c2c;
          border: 2px solid #aaa;
          color: #f1f1f1;
        }
        .custom-radio-dark:checked {
          background-color: #2575fc;
          border-color: #2575fc;
          box-shadow: 0 0 0 2px #6a11cb33;
        }
        .form-check-label.text-light {
          color: #f1f1f1;
        }
      `}</style>
    </div>
  );
}
