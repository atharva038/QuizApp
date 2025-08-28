import React, {useContext} from "react";
import {useNavigate} from "react-router-dom";
import {
  FaUserFriends,
  FaClipboardList,
  FaMobileAlt,
  FaBrain,
  FaLock,
  FaBook,
  FaShieldAlt,
} from "react-icons/fa";
import {ThemeContext} from "../themeContext.js"; // <-- import ThemeContext

export default function LandingPage() {
  const navigate = useNavigate();
  const {theme} = useContext(ThemeContext);

  return (
    <div className="landing-page" data-theme={theme}>
      {/* --- Hero Section --- */}
      <section className="hero-section d-flex flex-column justify-content-center align-items-center text-center text-white">
        <div className="hero-content">
          <h1 className="display-3 fw-bold mb-3 animate-fade-in-down">
            Welcome to KnockNFix 🚀
          </h1>
          <p
            className="lead mb-4 animate-fade-in-up"
            style={{animationDelay: "0.2s"}}
          >
            Discover, create, and share interactive quizzes powered by AI. Track
            progress, challenge friends, and learn smarter!
          </p>
          <button
            className="btn btn-primary btn-lg cta-button"
            onClick={() => navigate("/quizzes")}
            style={{animationDelay: "0.4s"}}
          >
            Explore Quizzes
          </button>
        </div>
      </section>

      {/* --- Features Section --- */}
      <section className="features-section py-5">
        <div className="container">
          <h2 className="text-center mb-5 fw-bold section-title">
            An Unmatched Learning Experience
          </h2>
          <div className="row text-center g-4">
            <div className="col-lg-3 col-md-6">
              <div className="feature-card h-100">
                <div className="icon-wrapper bg-primary-light">
                  <FaBrain size={30} className="text-primary" />
                </div>
                <h5>AI-Powered Quizzes</h5>
                <p>
                  Instantly generate dynamic quizzes on any topic with our
                  advanced AI.
                </p>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className="feature-card h-100">
                <div className="icon-wrapper bg-warning-light">
                  <FaBook size={30} className="text-warning" />
                </div>
                <h5>Detailed Explanations</h5>
                <p>
                  Learn from your mistakes with clear, instant explanations for
                  every answer.
                </p>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className="feature-card h-100">
                <div className="icon-wrapper bg-success-light">
                  <FaUserFriends size={30} className="text-success" />
                </div>
                <h5>Collaborate & Share</h5>
                <p>
                  Easily share quizzes with a public link or collaborate with
                  your team.
                </p>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className="feature-card h-100">
                <div className="icon-wrapper bg-info-light">
                  <FaClipboardList size={30} className="text-info" />
                </div>
                <h5>Track Performance</h5>
                <p>
                  Monitor results and progress with insightful, easy-to-read
                  analytics.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- Trust & Security Section --- */}
      <section className="security-section py-5">
        <div className="container">
          <h2 className="text-center mb-5 fw-bold section-title">
            Secure, Private, and Reliable
          </h2>
          <div className="row text-center g-4 justify-content-center">
            <div className="col-lg-3 col-md-6">
              <div className="feature-card h-100">
                <div className="icon-wrapper bg-success-light">
                  <FaLock size={30} className="text-success" />
                </div>
                <h5>Secure Authentication</h5>
                <p>
                  Robust login and signup protected with JWT and encryption.
                </p>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className="feature-card h-100">
                <div className="icon-wrapper bg-danger-light">
                  <FaShieldAlt size={30} className="text-danger" />
                </div>
                <h5>Advanced Protection</h5>
                <p>
                  Shielded by Helmet, Cookie Parser, and rate limiting for
                  safety.
                </p>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className="feature-card h-100">
                <div className="icon-wrapper bg-primary-light">
                  <FaMobileAlt size={30} className="text-primary" />
                </div>
                <h5>Fully Responsive</h5>
                <p>
                  Access your quizzes anytime, anywhere, on any of your devices.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- How It Works Section --- */}
      <section className="how-section py-5">
        <div className="container">
          <h2 className="text-center mb-5 fw-bold section-title">
            How It Works in 3 Easy Steps
          </h2>
          <div className="row g-5 align-items-center">
            <div className="col-md-4 text-center">
              <div className="how-step">
                <div className="step-number">1</div>
                <h5>Create a Quiz</h5>
                <p>
                  Use our intuitive builder to design quizzes with various
                  question types.
                </p>
              </div>
            </div>
            <div className="col-md-4 text-center">
              <div className="how-step">
                <div className="step-number">2</div>
                <h5>Share & Engage</h5>
                <p>
                  Share your quiz via a link and let others test their
                  knowledge.
                </p>
              </div>
            </div>
            <div className="col-md-4 text-center">
              <div className="how-step">
                <div className="step-number">3</div>
                <h5>Analyze Results</h5>
                <p>
                  Get instant feedback, see detailed scores, and track
                  improvement.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- Call to Action --- */}
      <section className="cta-section py-5 text-white text-center">
        <div className="container">
          <h2 className="display-5 mb-3 fw-bold">
            Ready to Elevate Your Knowledge?
          </h2>
          <p className="lead mb-4">
            Join thousands of users who are learning smarter today!
          </p>
          <button
            className="btn btn-lg btn-light cta-button-alt"
            onClick={() => navigate("/quiz/create")}
          >
            Create Your First Quiz Now
          </button>
        </div>
      </section>

      {/* --- Styling --- */}
      <style>{`
        /* --- Import Google Font --- */
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap');

        /* --- CSS Variables for Theming --- */
        .landing-page[data-theme='light'] {
          --primary-color: #6a11cb;
          --secondary-color: #2575fc;
          --accent-color: #ff6f61;
          --text-primary: #212529;
          --text-secondary: #6c757d;
          --bg-primary: #fff;
          --bg-secondary: #f8f9fa;
          --card-bg: #fff;
          --card-border: #eee;
          --card-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          --card-hover-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        }

        .landing-page[data-theme='dark'] {
          --primary-color: #8A43F6;
          --secondary-color: #4A90E2;
          --accent-color: #ff7f71;
          --text-primary: #f8f9fa;
          --text-secondary: #adb5bd;
          --bg-primary: #121212;
          --bg-secondary: #1a1a1a;
          --card-bg: #1e1e1e;
          --card-border: #333;
          --card-shadow: 0 4px 6px rgba(0, 0, 0, 0.4);
          --card-hover-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
        }

        /* --- Base Styles --- */
        .landing-page {
          font-family: 'Poppins', sans-serif;
          background-color: var(--bg-primary);
          color: var(--text-primary);
          overflow-x: hidden;
          transition: background-color 0.3s ease, color 0.3s ease;
        }

        .section-title {
          color: var(--text-primary);
          position: relative;
          padding-bottom: 15px;
        }

        .section-title::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 80px;
          height: 4px;
          background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
          border-radius: 2px;
        }

        /* --- Theme Toggle Button --- */
        .theme-toggle-btn {
          position: absolute;
          top: 30px;
          right: 30px;
          background: rgba(0,0,0,0.2);
          color: white;
          border: none;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          font-size: 1.5rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background-color 0.3s ease, transform 0.3s ease;
          z-index: 1000;
        }
        .theme-toggle-btn:hover {
          background: rgba(0,0,0,0.4);
          transform: scale(1.1);
        }

        /* --- Sections General --- */
        .features-section, .how-section {
          background-color: var(--bg-primary);
        }
        .security-section {
          background-color: var(--bg-secondary);
        }
        section {
            transition: background-color 0.3s ease;
            padding-top: 80px;
            padding-bottom: 80px;
        }

        /* --- Animations --- */
        @keyframes fadeInDown { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in-down { animation: fadeInDown 0.8s ease-out forwards; }
        .animate-fade-in-up { animation: fadeInUp 0.8s ease-out forwards; }

        /* --- Hero Section --- */
        .hero-section {
          background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
          min-height: 90vh;
          padding: 60px 20px;
          position: relative;
        }
        .hero-content { max-width: 800px; }
        .hero-section .cta-button {
          background-color: #f8f9fa;
          color: #6a11cb;
          font-weight: 600;
          padding: 12px 30px;
          border-radius: 50px;
          border: none;
          transition: all 0.3s ease;
          animation: fadeInUp 0.8s ease-out forwards;
        }
        .hero-section .cta-button:hover {
          transform: translateY(-3px);
          box-shadow: 0 5px 15px rgba(255, 255, 255, 0.2);
        }

        /* --- Features & Security Cards --- */
        .feature-card {
          background: var(--card-bg);
          border-radius: 15px;
          padding: 30px;
          box-shadow: var(--card-shadow);
          transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease, background-color 0.3s ease;
          border: 1px solid var(--card-border);
        }
        .feature-card:hover {
          transform: translateY(-10px);
          box-shadow: var(--card-hover-shadow);
          border-color: var(--primary-color);
        }
        .feature-card .icon-wrapper {
          width: 70px;
          height: 70px;
          margin: 0 auto 20px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .feature-card h5 {
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 10px;
        }
        .feature-card p {
          color: var(--text-secondary);
          font-size: 0.95rem;
        }
        .bg-primary-light { background-color: rgba(106, 17, 203, 0.1); }
        .bg-success-light { background-color: rgba(25, 135, 84, 0.1); }
        .bg-warning-light { background-color: rgba(255, 193, 7, 0.1); }
        .bg-danger-light { background-color: rgba(220, 53, 69, 0.1); }
        .bg-info-light { background-color: rgba(13, 202, 240, 0.1); }

        /* --- How It Works Section --- */
        .how-step { padding: 20px; }
        .step-number {
          width: 60px;
          height: 60px;
          margin: 0 auto 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
          color: #fff;
          font-size: 1.8rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        }
        .how-step h5 { font-weight: 600; color: var(--text-primary); }
        .how-step p { color: var(--text-secondary); }

        /* --- Call to Action Section --- */
        .cta-section {
          background: linear-gradient(135deg, #ff6f61, #ff8c42);
          padding: 80px 20px;
        }
        .cta-section .cta-button-alt {
          font-weight: 600;
          color: var(--accent-color);
          padding: 12px 35px;
          border-radius: 50px;
          border: none;
          transition: all 0.3s ease;
        }
        .cta-section .cta-button-alt:hover {
          transform: scale(1.05);
          background-color: #fff;
        }

        /* --- Responsive Adjustments --- */
        @media (max-width: 768px) {
          .hero-section { min-height: 70vh; }
          .display-3 { font-size: 2.5rem; }
          .display-5 { font-size: 2rem; }
          .theme-toggle-btn { top: 15px; right: 15px; }
          section {
            padding-top: 60px;
            padding-bottom: 60px;
          }
        }
      `}</style>
    </div>
  );
}
