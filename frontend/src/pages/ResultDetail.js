import React, {useEffect, useState, useContext} from "react";
import axios from "axios";
import {useParams, Link} from "react-router-dom";
import {ThemeContext} from "../themeContext.js";

export default function ResultDetail() {
  const {id} = useParams();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const {theme} = useContext(ThemeContext);
  const darkMode = theme === "dark";

  useEffect(() => {
    const fetchResult = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await axios.get(
          `${
            process.env.REACT_APP_API_URL || "http://localhost:5000/api"
          }/result/${id}`,
          {
            withCredentials: true,
          }
        );
        setResult(res.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch result");
      }
      setLoading(false);
    };
    fetchResult();
  }, [id]);

  if (loading)
    return <div className="container mt-5 text-center">Loading...</div>;
  if (error)
    return (
      <div className="container mt-5 alert alert-danger text-center">
        {error}
      </div>
    );
  if (!result) return null;

  return (
    <div
      className={`container mt-5 result-detail-page ${
        darkMode ? "dark-mode text-light" : "light-mode text-dark"
      }`}
    >
      <div
        className={`card shadow-sm result-detail-card ${
          darkMode ? "dark-mode text-light" : "light-mode text-dark"
        }`}
      >
        <div className="card-body">
          <h3 className={`card-title mb-3 ${darkMode ? "text-light" : ""}`}>
            {result.quizId?.title || "Quiz"}
          </h3>
          <p>
            <strong>Topic:</strong> {result.quizId?.topic}
          </p>
          <p>
            <strong>Score:</strong> {result.score} / {result.responses.length}
          </p>
          <p>
            <strong>Date:</strong> {new Date(result.createdAt).toLocaleString()}
          </p>
          <hr />
          <h5 className={`${darkMode ? "text-light" : ""}`}>
            Answers & Explanations:
          </h5>
          <ul className="list-group mb-3">
            {/* Show explanations if present, else fallback to questions */}
            {result.explanations && result.explanations.length > 0
              ? result.explanations.map((exp, idx) => (
                  <li
                    key={idx}
                    className={`list-group-item ${
                      darkMode ? "bg-dark text-light border-secondary" : ""
                    }`}
                  >
                    <div>
                      <strong>Q{idx + 1}:</strong> {exp.question}
                    </div>
                    <div>
                      <strong>Your answer:</strong>{" "}
                      <span
                        className={
                          exp.userAnswer?.trim().toLowerCase() ===
                          exp.correctAnswer.trim().toLowerCase()
                            ? "text-success"
                            : "text-danger"
                        }
                      >
                        {exp.userAnswer || <em>Not answered</em>}
                      </span>
                    </div>
                    <div>
                      <strong>Correct answer:</strong> {exp.correctAnswer}
                    </div>
                    {exp.options && (
                      <div>
                        <strong>Options:</strong>{" "}
                        {exp.options.map((opt, i) => (
                          <span key={i} className="me-2">
                            {String.fromCharCode(65 + i)}. {opt}
                          </span>
                        ))}
                      </div>
                    )}
                    {exp.explanation && (
                      <div className="mt-2">
                        <strong>Explanation:</strong>{" "}
                        <span className="text-info">{exp.explanation}</span>
                      </div>
                    )}
                  </li>
                ))
              : result.quizId?.questions?.map((q, idx) => (
                  <li
                    key={idx}
                    className={`list-group-item ${
                      darkMode ? "bg-dark text-light border-secondary" : ""
                    }`}
                  >
                    <div>
                      <strong>Q{idx + 1}:</strong> {q.question}
                    </div>
                    <div>
                      <strong>Your answer:</strong>{" "}
                      <span
                        className={
                          result.responses[idx]?.trim().toLowerCase() ===
                          q.correctAnswer.trim().toLowerCase()
                            ? "text-success"
                            : "text-danger"
                        }
                      >
                        {result.responses[idx] || <em>Not answered</em>}
                      </span>
                    </div>
                    <div>
                      <strong>Correct answer:</strong> {q.correctAnswer}
                    </div>
                    <div>
                      <strong>Options:</strong>{" "}
                      {q.options.map((opt, i) => (
                        <span key={i} className="me-2">
                          {String.fromCharCode(65 + i)}. {opt}
                        </span>
                      ))}
                    </div>
                    {q.explanation && (
                      <div className="mt-2">
                        <strong>Explanation:</strong>{" "}
                        <span className="text-info">{q.explanation}</span>
                      </div>
                    )}
                  </li>
                ))}
          </ul>
          <Link
            to="/results"
            className={`btn btn-secondary${darkMode ? " text-light" : ""}`}
          >
            Back to Results
          </Link>
        </div>
      </div>
      {/* Scoped Styling */}
      <style jsx>{`
        .result-detail-page.light-mode {
          background: #f8f9fa;
          color: #212529;
        }
        .result-detail-page.dark-mode {
          background: #121212;
          color: #f1f1f1;
        }
        .result-detail-card.light-mode {
          background: #fff;
        }
        .result-detail-card.dark-mode {
          background: #1e1e1e;
          border: 1px solid #333;
        }
        .list-group-item.bg-dark {
          background: #2a2a2a;
          border: 1px solid #444;
          color: #f1f1f1;
        }
      `}</style>
    </div>
  );
}
