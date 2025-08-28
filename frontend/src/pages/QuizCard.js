import React, {useContext} from "react";
import {Link} from "react-router-dom";
import {FaEye, FaEdit, FaTrash, FaQuestionCircle} from "react-icons/fa";
import {ThemeContext} from "../themeContext.js";

const QuizCard = ({quiz, onDelete, isDeleting, isOwner = false}) => {
  const {theme} = useContext(ThemeContext);
  const darkMode = theme === "dark";

  return (
    <div className="col-md-6 col-lg-4 mb-4">
      <div
        className={`quiz-card h-100 shadow-sm ${
          darkMode ? "dark-mode" : "light-mode"
        }`}
      >
        <div className="card-body d-flex flex-column">
          <h5 className="card-title fw-bold">{quiz.title}</h5>
          <p
            className={`card-text mb-2 ${
              darkMode ? "text-light opacity-75" : "text-muted"
            }`}
          >
            <strong>Topic:</strong> {quiz.topic || "General"}
          </p>
          <div
            className={`d-flex align-items-center mb-3 ${
              darkMode ? "text-light opacity-75" : "text-muted"
            }`}
          >
            <FaQuestionCircle className="me-2" />
            <span>{quiz.questions.length} Questions</span>
          </div>
          <div className="mt-auto">
            <Link
              to={`/quizzes/${quiz._id}`}
              className={`btn btn-primary-custom w-100 mb-2${
                darkMode ? " text-light" : ""
              }`}
            >
              <FaEye className="me-2" />
              View Quiz
            </Link>
            {isOwner && (
              <div className="d-flex justify-content-between">
                <Link
                  to={`/quiz/edit/${quiz._id}`}
                  className={`btn btn-outline-secondary-custom btn-sm flex-grow-1 me-1${
                    darkMode ? " text-light" : ""
                  }`}
                >
                  <FaEdit className="me-1" /> Edit
                </Link>
                <button
                  className={`btn btn-outline-danger-custom btn-sm flex-grow-1 ms-1${
                    darkMode ? " text-light" : ""
                  }`}
                  onClick={() => onDelete && onDelete(quiz._id)}
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-1"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Deleting...
                    </>
                  ) : (
                    <>
                      <FaTrash className="me-1" /> Delete
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Scoped Styling */}
      <style jsx>{`
        .quiz-card {
          border-radius: 15px;
          padding: 18px;
          transition: transform 0.2s ease, box-shadow 0.2s ease,
            background 0.3s ease;
        }
        .quiz-card.light-mode {
          background: #fff;
          border: 1px solid #e0e0e0;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          color: #212529;
        }
        .quiz-card.dark-mode {
          background: #1e1e1e;
          border: 1px solid #333;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
          color: #f1f1f1;
        }
        .quiz-card:hover {
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

        .btn-outline-secondary-custom {
          border-radius: 50px;
          font-weight: 500;
          border: 1px solid #6c757d;
        }
        .btn-outline-danger-custom {
          border-radius: 50px;
          font-weight: 500;
          border: 1px solid #dc3545;
        }
      `}</style>
    </div>
  );
};

export default QuizCard;
