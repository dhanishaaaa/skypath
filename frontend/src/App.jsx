import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Onboarding from "./pages/Onboarding";
import Roadmap from "./pages/Roadmap";
import Calculator from "./pages/Calculator";
import Schools from "./pages/Schools";
import Quiz from "./pages/Quiz";
import QuizHistory from "./pages/QuizHistory";
import Chat from "./pages/Chat";
import Readiness from "./pages/Readiness";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/roadmap" element={<Roadmap />} />
        <Route path="/calculator" element={<Calculator />} />
        <Route path="/schools" element={<Schools />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/quiz-history" element={<QuizHistory />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/readiness" element={<Readiness />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;