import React, {useState} from "react";
import axios from "axios";
import {FaSignInAlt} from "react-icons/fa";
import {useNavigate} from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await axios.post(
        `${
          process.env.REACT_APP_API_URL || "http://localhost:5000/api"
        }/auth/login`,
        {email, password}
      );
      setLoading(false);
      localStorage.setItem("token", res.data.token);
      alert("✅ Login successful!");
      navigate("/quizzes"); // <-- Redirect to quizzes
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
      <div
        className="card shadow-lg border-0 rounded-4"
        style={{width: "380px"}}
      >
        <div className="card-body p-4">
          {/* Header */}
          <div className="text-center mb-4">
            <FaSignInAlt className="text-primary mb-2" size={40} />
            <h3 className="fw-bold text-dark">Welcome Back</h3>
            <p className="text-muted small">Please login to continue</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label fw-semibold">Email</label>
              <input
                type="email"
                className="form-control form-control-lg"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">Password</label>
              <input
                type="password"
                className="form-control form-control-lg"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg w-100 rounded-3"
              disabled={loading}
            >
              {loading ? "🔄 Logging in..." : "Login"}
            </button>

            {error && (
              <div className="alert alert-danger mt-3 text-center py-2">
                {error}
              </div>
            )}
          </form>

          {/* Footer */}
          <div className="text-center mt-3">
            <small className="text-muted">
              Don’t have an account?{" "}
              <a href="/register" className="text-decoration-none fw-semibold">
                Sign Up
              </a>
            </small>
          </div>
        </div>
      </div>
    </div>
  );
}
