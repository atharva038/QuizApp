import React, {useEffect} from "react";
import {Link, useLocation, useNavigate} from "react-router-dom";
import {
  FaBrain,
  FaTrophy,
  FaUserPlus,
  FaSignInAlt,
  FaSignOutAlt,
  FaPlusCircle,
} from "react-icons/fa";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token");

  useEffect(() => {
    const handleStorage = () => {
      // No-op, but keeps the effect for future extensibility
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

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

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
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
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {navItems
              .filter((item) => item.show)
              .map((item) => (
                <li className="nav-item" key={item.href}>
                  <Link
                    to={item.href}
                    className={`nav-link d-flex align-items-center gap-1 ${
                      location.pathname === item.href
                        ? "active fw-bold text-primary"
                        : ""
                    }`}
                  >
                    {item.icon}
                    {item.label}
                  </Link>
                </li>
              ))}
            {isLoggedIn && (
              <li className="nav-item">
                <button
                  className="nav-link btn btn-link d-flex align-items-center gap-1 text-danger"
                  style={{textDecoration: "none"}}
                  onClick={handleLogout}
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
