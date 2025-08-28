import React, {useContext, useEffect} from "react";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Navbar from "./components/Navbar.js";
import Login from "./pages/Login.js";
import Register from "./pages/Register.js";
import Quizzes from "./pages/Quizzes.js";
import Results from "./pages/Results.js";
import ResultDetail from "./pages/ResultDetail.js";
import CreateQuiz from "./pages/CreateQuiz.js";
import QuizDetail from "./pages/QuizDetail.js";
import EditQuiz from "./pages/EditQuiz.js";
import MyQuizzes from "./pages/MyQuizzes.js";
import LandingPage from "./pages/LandingPage.js";
import {ThemeProvider, ThemeContext} from "./themeContext.js";

function AppContent() {
  const {theme} = useContext(ThemeContext);

  useEffect(() => {
    document.body.classList.remove("light-mode", "dark-mode");
    document.body.classList.add(theme === "dark" ? "dark-mode" : "light-mode");
  }, [theme]);

  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/quizzes" element={<Quizzes />} />
        <Route path="/results" element={<Results />} />
        <Route path="/results/:id" element={<ResultDetail />} />
        <Route path="/quiz/create" element={<CreateQuiz />} />
        <Route path="/quizzes/:id" element={<QuizDetail />} />
        <Route path="/quiz/edit/:id" element={<EditQuiz />} />
        <Route path="/my-quizzes" element={<MyQuizzes />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <Router>
        <AppContent />
      </Router>
    </ThemeProvider>
  );
}

export default App;
