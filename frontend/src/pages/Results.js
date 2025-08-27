import React, {useEffect, useState} from "react";
import axios from "axios";

export default function Results() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("token");
        // You need the userId to fetch results
        const userId = JSON.parse(atob(token.split(".")[1])).userId;
        const res = await axios.get(
          `${
            process.env.REACT_APP_API_URL || "http://localhost:5000/api"
          }/result/user/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
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
    <div className="container mt-5">
      <h2 className="mb-4 text-center">Your Quiz Results</h2>
      {loading && <div className="text-center">Loading...</div>}
      {error && <div className="alert alert-danger text-center">{error}</div>}
      <div className="row">
        {results.map((result) => (
          <div className="col-md-6 col-lg-4 mb-4" key={result._id}>
            <div className="card h-100 shadow-sm">
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{result.quizId?.title || "Quiz"}</h5>
                <p className="card-text">
                  <strong>Topic:</strong> {result.quizId?.topic}
                </p>
                <p className="card-text">
                  <strong>Score:</strong> {result.score} /{" "}
                  {result.responses.length}
                </p>
                <p className="card-text">
                  <strong>Date:</strong>{" "}
                  {new Date(result.createdAt).toLocaleString()}
                </p>
                <a
                  href={`/results/${result._id}`}
                  className="btn btn-outline-primary mt-auto"
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
    </div>
  );
}
