import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

function Quiz() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [results, setResults] = useState(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await api.get("/quiz");
        setQuestions(res.data.questions);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, []);

  const selectAnswer = (questionId, option) => {
    setAnswers((prev) => ({ ...prev, [questionId]: option }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const payload = {
        answers: Object.entries(answers).map(([questionId, selectedOption]) => ({
          questionId,
          selectedOption,
        })),
      };
      const res = await api.post("/quiz/submit", payload);
      setResults(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-charcoal flex items-center justify-center">
        <p className="text-cloud/50 font-mono text-sm">Loading quiz...</p>
      </div>
    );
  }

  if (results) {
    return (
      <div className="min-h-screen bg-charcoal text-cloud font-sans p-6">
        <div className="flex justify-between items-center mb-6 max-w-2xl">
          <h1 className="text-2xl font-semibold">
            Score: <span className="text-amber">{results.score}/{results.total}</span>
          </h1>
          <button onClick={() => navigate("/dashboard")} className="text-sm text-cloud/60 hover:text-amber transition">
            Back to Dashboard
          </button>
        </div>

        <div className="max-w-2xl space-y-3">
          {results.results.map((r, i) => (
            <div key={i} className={`bg-steel rounded-lg p-4 border ${r.isCorrect ? "border-green-500/30" : "border-alert/30"}`}>
              <p className="font-medium mb-1">{r.question}</p>
              <p className="text-sm text-cloud/60">
                Your answer: <span className={r.isCorrect ? "text-green-400" : "text-alert"}>{r.yourAnswer}</span>
                {!r.isCorrect && <> — Correct: <span className="text-green-400">{r.correctOption}</span></>}
              </p>
              <p className="text-xs text-cloud/50 mt-1">{r.explanation}</p>
            </div>
          ))}
        </div>

        <button
          onClick={() => { setResults(null); setAnswers({}); }}
          className="mt-6 bg-amber text-charcoal px-4 py-2 rounded font-medium hover:opacity-90 transition"
        >
          Retake Quiz
        </button>
        <button
          onClick={() => navigate("/quiz-history")}
          className="mt-6 ml-3 bg-steel border border-amber text-amber px-4 py-2 rounded font-medium hover:bg-amber/10 transition"
        >
          View History
        </button>
      </div>
    );
  }

  const allAnswered = questions.length > 0 && questions.every((q) => answers[q.id]);

  return (
    <div className="min-h-screen bg-charcoal text-cloud font-sans p-6">
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-2xl font-semibold">Aviation Knowledge Quiz</h1>
        <button onClick={() => navigate("/dashboard")} className="text-sm text-cloud/60 hover:text-amber transition">
          Back to Dashboard
        </button>
      </div>
      <p className="text-cloud/60 text-sm mb-8">{questions.length} questions — General Aviation Knowledge</p>

      <div className="max-w-2xl space-y-4">
        {questions.map((q, i) => (
          <div key={q.id} className="bg-steel rounded-lg p-4 border border-white/10">
            <p className="font-medium mb-3">{i + 1}. {q.question}</p>
            <div className="space-y-2">
              {["A", "B", "C", "D"].map((opt) => (
                <button
                  key={opt}
                  onClick={() => selectAnswer(q.id, opt)}
                  className={`w-full text-left px-3 py-2 rounded text-sm transition border ${
                    answers[q.id] === opt
                      ? "bg-amber/20 border-amber text-amber"
                      : "bg-charcoal border-white/10 text-cloud/70 hover:border-amber/40"
                  }`}
                >
                  {opt}. {q[`option${opt}`]}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={handleSubmit}
        disabled={!allAnswered || submitting}
        className="mt-6 bg-amber text-charcoal px-6 py-2 rounded font-medium hover:opacity-90 transition disabled:opacity-30 disabled:cursor-not-allowed"
      >
        {submitting ? "Submitting..." : "Submit Quiz"}
      </button>
    </div>
  );
}

export default Quiz;