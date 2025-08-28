import React, {useState, useContext} from "react";
import axios from "axios";
import {FaUserPlus} from "react-icons/fa";
import {ThemeContext} from "../themeContext.js";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const {theme} = useContext(ThemeContext);
  const darkMode = theme === "dark";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const res = await axios.post(
        `${
          process.env.REACT_APP_API_URL || "http://localhost:5000/api"
        }/auth/register`,
        {username, email, password}
      );
      setLoading(false);
      setSuccess(res.data.message || "🎉 Registration successful!");
      setUsername("");
      setEmail("");
      setPassword("");
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div
      className={`d-flex align-items-center justify-content-center vh-100 register-page ${
        darkMode ? "dark-mode" : "light-mode"
      }`}
    >
      <div
        className={`card shadow-lg border-0 rounded-4 register-card ${
          darkMode ? "dark-mode text-light" : "light-mode text-dark"
        }`}
        style={{width: "400px"}}
      >
        <div className="card-body p-4">
          {/* Header */}
          <div className="text-center mb-4">
            <FaUserPlus
              className={`mb-2 ${darkMode ? "text-info" : "text-success"}`}
              size={40}
            />
            <h3 className={`fw-bold ${darkMode ? "text-light" : ""}`}>
              Create Account
            </h3>
            <p className={`small opacity-75 ${darkMode ? "text-light" : ""}`}>
              Join us and start quizzing 🚀
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label fw-semibold">Username</label>
              <input
                type="text"
                className="form-control form-control-lg"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder="Enter your username"
              />
            </div>

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
              className={`btn btn-success btn-lg w-100 rounded-3 ${
                darkMode ? "text-light" : ""
              }`}
              disabled={loading}
            >
              {loading ? "⏳ Registering..." : "Register"}
            </button>

            {/* Alerts */}
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

          {/* Footer */}
          <div className="text-center mt-3">
            <small
              className={`fw-semibold ${
                darkMode ? "text-light" : "text-muted"
              }`}
            >
              Already have an account?{" "}
              <a
                href="/login"
                className={`text-decoration-none fw-semibold ${
                  darkMode ? "text-info" : "text-success"
                }`}
              >
                Login here
              </a>
            </small>
          </div>
        </div>
      </div>

      {/* Scoped Styling */}
      <style jsx>{`
        .register-page.light-mode {
          background: #f8f9fa;
          color: #212529;
        }
        .register-page.dark-mode {
          background: #121212;
          color: #f1f1f1;
        }

        .register-card.light-mode {
          background: #fff;
        }
        .register-card.dark-mode {
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
