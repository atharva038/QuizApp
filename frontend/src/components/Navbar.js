import React, {useEffect, useState} from "react";
import {Link, useLocation, useNavigate} from "react-router-dom";
import {
  FaBrain,
  FaTrophy,
  FaUserPlus,
  FaSignInAlt,
  FaSignOutAlt,
  FaPlusCircle,
} from "react-icons/fa";
import axios from "axios";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setExpanded(false);
  }, [location.pathname]);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get(
          `${
            process.env.REACT_APP_API_URL || "http://localhost:5000/api"
          }/auth/me`,
          {withCredentials: true}
        );
        setIsLoggedIn(!!res.data?.user);
      } catch {
        setIsLoggedIn(false);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, [location.pathname]);

  const navItems = [
    {
      href: "/login",
      label: "Login",
      icon: <FaSignInAlt className="me-2" />,
      show: !isLoggedIn,
    },
    {
      href: "/register",
      label: "Register",
      icon: <FaUserPlus className="me-2" />,
      show: !isLoggedIn,
    },
    {
      href: "/quizzes",
      label: "Quizzes",
      icon: <FaBrain className="me-2" />,
      show: isLoggedIn,
    },
    {
      href: "/results",
      label: "Results",
      icon: <FaTrophy className="me-2" />,
      show: isLoggedIn,
    },
    {
      href: "/quiz/create",
      label: "Create Quiz",
      icon: <FaPlusCircle className="me-2" />,
      show: isLoggedIn,
    },
  ];

  const handleLogout = async () => {
    try {
      await axios.post(
        `${
          process.env.REACT_APP_API_URL || "http://localhost:5000/api"
        }/auth/logout`,
        {},
        {withCredentials: true}
      );
      setIsLoggedIn(false);
      navigate("/login");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  const handleToggle = () => {
    setExpanded((prev) => !prev);
  };

  return (
    <nav className="navbar navbar-expand-md navbar-light bg-light border-bottom sticky-top">
      <div className="container">
        <Link to="/" className="navbar-brand d-flex align-items-center gap-2">
          <FaBrain className="text-primary" size={24} />
          <span className="fw-bold">QuizMaster</span>
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          aria-controls="navbarNav"
          aria-expanded={expanded}
          aria-label="Toggle navigation"
          onClick={handleToggle}
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div
          className={`collapse navbar-collapse${expanded ? " show" : ""}`}
          id="navbarNav"
        >
          <ul className="navbar-nav ms-auto">
            {!loading &&
              navItems
                .filter((item) => item.show)
                .map((item) => (
                  <li className="nav-item" key={item.href}>
                    <Link
                      to={item.href}
                      className={`nav-link d-flex align-items-center gap-1 ${
                        location.pathname.startsWith(item.href)
                          ? "active fw-bold text-primary"
                          : ""
                      }`}
                      onClick={() => setExpanded(false)}
                    >
                      {item.icon}
                      {item.label}
                    </Link>
                  </li>
                ))}
            {!loading && isLoggedIn && (
              <li className="nav-item">
                <button
                  className="nav-link btn btn-link d-flex align-items-center gap-1 text-danger"
                  style={{textDecoration: "none"}}
                  onClick={() => {
                    handleLogout();
                    setExpanded(false);
                  }}
                >
                  <FaSignOutAlt className="me-2" />
                  Logout
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
