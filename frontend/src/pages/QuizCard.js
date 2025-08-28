import React from "react";
import {Link} from "react-router-dom";
import {FaEye, FaEdit, FaTrash, FaQuestionCircle} from "react-icons/fa";

const QuizCard = ({quiz, onDelete, isDeleting, isOwner = false}) => (
  <div className="col-md-6 col-lg-4 mb-4">
    <div className="card quiz-card h-100">
      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{quiz.title}</h5>
        <p className="card-text text-muted mb-2 card-topic">
          <strong>Topic:</strong> {quiz.topic || "General"}
        </p>
        <div className="d-flex align-items-center text-muted mb-3">
          <FaQuestionCircle className="me-2" />
          <span>{quiz.questions.length} Questions</span>
        </div>
        <div className="mt-auto">
          <Link
            to={`/quizzes/${quiz._id}`}
            className="btn btn-outline-primary w-100 mb-2"
          >
            <FaEye className="me-2" />
            View Quiz
          </Link>

          {isOwner && (
            <div className="d-flex justify-content-between">
              <Link
                to={`/quiz/edit/${quiz._id}`}
                className="btn btn-outline-secondary btn-sm flex-grow-1 me-1"
              >
                <FaEdit className="me-1" /> Edit
              </Link>
              <button
                className="btn btn-outline-danger btn-sm flex-grow-1 ms-1"
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
  </div>
);

export default QuizCard;
