import React, {useEffect, useState, useContext} from "react";
import axios from "axios";
import {ThemeContext} from "../themeContext";

export default function Results() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const {theme} = useContext(ThemeContext);
  const darkMode = theme === "dark";

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await axios.get(
          `${
            process.env.REACT_APP_API_URL || "http://localhost:5000/api"
          }/result/user/me`,
          {withCredentials: true}
        );
        setResults(res.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch results");
      }
      setLoading(false);
    };
    fetchResults();
  }, []);

  return (
    <div
      className={`container-fluid min-vh-100 py-5 results-page ${
        darkMode ? "dark-mode" : "light-mode"
      }`}
    >
      <h2 className="mb-5 text-center results-title">Your Quiz Results</h2>

      {loading && <div className="text-center">Loading...</div>}
      {error && <div className="alert alert-danger text-center">{error}</div>}

      <div className="row justify-content-center">
        {results.map((result) => (
          <div className="col-md-6 col-lg-4 mb-4" key={result._id}>
            <div className="result-card h-100 shadow-sm">
              <div className="card-body d-flex flex-column">
                <h5 className="card-title fw-bold">
                  {result.quizId?.title || "Quiz"}
                </h5>
                <p className="card-text">
                  <strong>Topic:</strong>{" "}
                  <span className="fw-normal">
                    {result.quizId?.topic &&
                    result.quizId?.topic !== "undefined"
                      ? result.quizId.topic
                      : "General"}
                  </span>
                </p>
                <p className="card-text">
                  <strong>Score:</strong>{" "}
                  <span
                    className={
                      result.score >= result.responses.length / 2
                        ? "text-success fw-bold"
                        : "text-danger fw-bold"
                    }
                  >
                    {result.score}
                  </span>{" "}
                  / {result.responses.length}
                </p>
                <p
                  className={`card-text small ${
                    darkMode ? "text-light opacity-75" : "text-muted"
                  }`}
                >
                  <strong>Date:</strong>{" "}
                  {new Date(result.createdAt).toLocaleString()}
                </p>
                <a
                  href={`/results/${result._id}`}
                  className="btn btn-primary-custom mt-auto"
                >
                  View Details
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {results.length === 0 && !loading && !error && (
        <div className="text-center text-muted">No results found.</div>
      )}

      {/* Scoped Styling */}
      <style jsx>{`
        .results-page.light-mode {
          background: #f8f9fa;
          color: #212529;
        }
        .results-page.dark-mode {
          background: #121212;
          color: #f1f1f1;
        }

        .results-title {
          font-size: 2.2rem;
          font-weight: 700;
          position: relative;
          padding-bottom: 10px;
        }
        .results-title::after {
          content: "";
          display: block;
          width: 80px;
          height: 4px;
          margin: 0 auto;
          margin-top: 10px;
          background: linear-gradient(90deg, #6a11cb, #2575fc);
          border-radius: 3px;
        }

        .result-card {
          border-radius: 15px;
          padding: 18px;
          transition: transform 0.2s ease, box-shadow 0.2s ease,
            background 0.3s ease;
        }
        .light-mode .result-card {
          background: #fff;
          border: 1px solid #e0e0e0;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          color: #212529;
        }
        .dark-mode .result-card {
          background: #1e1e1e;
          border: 1px solid #333;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
          color: #f1f1f1;
        }
        .result-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25);
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
