import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

function QuizHistory() {
  const navigate = useNavigate();
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.get("/quiz/history");
        setAttempts(res.data.attempts);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-charcoal flex items-center justify-center">
        <p className="text-cloud/50 font-mono text-sm">Loading history...</p>
      </div>
    );
  }

  const bestScore = attempts.length
    ? Math.max(...attempts.map((a) => (a.score / a.totalQuestions) * 100))
    : 0;

  return (
    <div className="min-h-screen bg-charcoal text-cloud font-sans p-6">
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-2xl font-semibold">Quiz History</h1>
        <button onClick={() => navigate("/dashboard")} className="text-sm text-cloud/60 hover:text-amber transition">
          Back to Dashboard
        </button>
      </div>
      <p className="text-cloud/60 text-sm mb-8">
        {attempts.length} attempt{attempts.length !== 1 ? "s" : ""} — best score {Math.round(bestScore)}%
      </p>

      {attempts.length === 0 ? (
        <div className="max-w-2xl bg-steel rounded-lg p-6 border border-white/10 text-center">
          <p className="text-cloud/60 mb-4">No attempts yet.</p>
          <button
            onClick={() => navigate("/quiz")}
            className="bg-amber text-charcoal px-4 py-2 rounded font-medium hover:opacity-90 transition"
          >
            Take Your First Quiz
          </button>
        </div>
      ) : (
        <div className="max-w-2xl space-y-3">
          {attempts.map((a) => {
            const pct = Math.round((a.score / a.totalQuestions) * 100);
            return (
              <div key={a.id} className="bg-steel rounded-lg p-4 border border-white/10 flex justify-between items-center">
                <div>
                  <p className="font-medium">{a.topic}</p>
                  <p className="text-cloud/50 text-xs font-mono mt-1">
                    {new Date(a.takenAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
                <div className={`font-mono text-lg ${pct >= 70 ? "text-green-400" : pct >= 40 ? "text-amber" : "text-alert"}`}>
                  {a.score}/{a.totalQuestions} ({pct}%)
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default QuizHistory;