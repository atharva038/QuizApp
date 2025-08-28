import React, {useEffect, useState} from "react";
import axios from "axios";
import {useParams, Link} from "react-router-dom";

export default function ResultDetail() {
  const {id} = useParams();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
    <div className="container mt-5">
      <div className="card shadow-sm">
        <div className="card-body">
          <h3 className="card-title mb-3">{result.quizId?.title || "Quiz"}</h3>
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
          <h5>Answers & Explanations:</h5>
          <ul className="list-group mb-3">
            {result.explanations
              ? result.explanations.map((exp, idx) => (
                  <li key={idx} className="list-group-item">
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
                    {exp.explanation && (
                      <div className="mt-2">
                        <strong>Explanation:</strong>{" "}
                        <span className="text-info">{exp.explanation}</span>
                      </div>
                    )}
                  </li>
                ))
              : result.quizId?.questions?.map((q, idx) => (
                  <li key={idx} className="list-group-item">
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
                  </li>
                ))}
          </ul>
          <Link to="/results" className="btn btn-secondary">
            Back to Results
          </Link>
        </div>
      </div>
    </div>
  );
}
