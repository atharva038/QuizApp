import React, {useState, useContext} from "react";
import axios from "axios";
import {FaSignInAlt} from "react-icons/fa";
import {useNavigate} from "react-router-dom";
import {ThemeContext} from "../themeContext.js"; // ✅ import theme

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const {theme} = useContext(ThemeContext);
  const darkMode = theme === "dark";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await axios.post(
        `${
          process.env.REACT_APP_API_URL || "http://localhost:5000/api"
        }/auth/login`,
        {email, password},
        {withCredentials: true}
      );
      setLoading(false);
      alert("✅ Login successful!");
      navigate("/quizzes");
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div
      className={`d-flex align-items-center justify-content-center vh-100 login-page ${
        darkMode ? "dark-mode" : "light-mode"
      }`}
    >
      <div
        className={`card shadow-lg border-0 rounded-4 login-card ${
          darkMode ? "dark-mode text-light" : "light-mode text-dark"
        }`}
        style={{width: "380px"}}
      >
        <div className="card-body p-4">
          {/* Header */}
          <div className="text-center mb-4">
            <FaSignInAlt
              className={`mb-2 ${darkMode ? "text-info" : "text-primary"}`}
              size={40}
            />
            <h3 className={`fw-bold ${darkMode ? "text-light" : ""}`}>
              Welcome Back
            </h3>
            <p className={`small opacity-75 ${darkMode ? "text-light" : ""}`}>
              Please login to continue
            </p>
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
              className={`btn btn-primary btn-lg w-100 rounded-3 ${
                darkMode ? "text-light" : ""
              }`}
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
            <small
              className={`fw-semibold ${
                darkMode ? "text-light" : "text-muted"
              }`}
            >
              Don’t have an account?{" "}
              <a
                href="/register"
                className={`text-decoration-none fw-semibold ${
                  darkMode ? "text-info" : "text-primary"
                }`}
              >
                Sign Up
              </a>
            </small>
          </div>
        </div>
      </div>

      {/* Scoped Styling */}
      <style>{`
        .login-page.light-mode {
          background: #f8f9fa;
          color: #212529;
        }
        .login-page.dark-mode {
          background: #121212;
          color: #f1f1f1;
        }

        .login-card.light-mode {
          background: #fff;
        }
        .login-card.dark-mode {
          background: #1e1e1e;
          border: 1px solid #333;
        }

        .form-control {
          border-radius: 10px;
        }
        .dark-mode .form-control {
          background: #2c2c2c;
          border: 1px solid #555;
          color: #f1f1f1;
        }
        .dark-mode .form-control::placeholder {
          color: #aaa;
        }
      `}</style>
    </div>
  );
}
