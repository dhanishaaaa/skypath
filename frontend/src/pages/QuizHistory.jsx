import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

function QuizHistory() {
  const navigate = useNavigate();
  const [attempts, setAttempts] = useState([]);
  const [weakTopics, setWeakTopics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [histRes, weakRes] = await Promise.all([
          api.get("/quiz/history"),
          api.get("/quiz/weak-topics"),
        ]);
        setAttempts(histRes.data.attempts);
        setWeakTopics(weakRes.data.breakdown);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
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

  const weakest = weakTopics.filter((t) => t.accuracy < 50);
  const strongest = weakTopics.filter((t) => t.accuracy >= 70);

  return (
    <div className="min-h-screen bg-charcoal text-cloud font-sans p-6">
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-2xl font-semibold">Quiz History</h1>
        <button onClick={() => navigate("/dashboard")} className="text-sm text-cloud/60 hover:text-amber transition">
          Back to Dashboard
        </button>
      </div>
      <p className="text-cloud/60 text-sm mb-6">
        {attempts.length} attempt{attempts.length !== 1 ? "s" : ""} — best score {Math.round(bestScore)}%
      </p>

      {weakTopics.length > 0 && (
        <div className="max-w-2xl mb-8">
          <h2 className="text-lg font-medium mb-3">Topic Performance</h2>
          <div className="bg-steel rounded-lg border border-white/10 overflow-hidden">
            {weakTopics.map((t) => (
              <div key={t.topic} className="flex items-center justify-between p-3 border-b border-white/5 last:border-0">
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-mono px-2 py-0.5 rounded ${
                    t.accuracy < 50 ? "bg-alert/20 text-alert" :
                    t.accuracy >= 70 ? "bg-green-500/20 text-green-400" :
                    "bg-amber/20 text-amber"
                  }`}>
                    {t.accuracy}%
                  </span>
                  <span className="text-sm">{t.topic}</span>
                </div>
                <span className="text-xs text-cloud/40 font-mono">{t.correct}/{t.total} correct</span>
              </div>
            ))}
          </div>

          {weakest.length > 0 && (
            <div className="mt-3 bg-alert/10 border border-alert/30 rounded p-3">
              <p className="text-alert text-sm font-medium mb-1">Focus areas:</p>
              {weakest.map((t) => (
                <p key={t.topic} className="text-alert/80 text-xs">
                  ⚠ {t.topic} — only {t.accuracy}% accuracy across {t.total} questions
                </p>
              ))}
              <button
                onClick={() => navigate("/quiz")}
                className="mt-2 text-xs bg-alert/20 text-alert px-3 py-1 rounded hover:bg-alert/30 transition"
              >
                Retake quiz to improve
              </button>
            </div>
          )}

          {strongest.length > 0 && (
            <div className="mt-3 bg-green-500/10 border border-green-500/30 rounded p-3">
              <p className="text-green-400 text-sm font-medium mb-1">Strong areas:</p>
              {strongest.map((t) => (
                <p key={t.topic} className="text-green-400/80 text-xs">
                  ✓ {t.topic} — {t.accuracy}% accuracy
                </p>
              ))}
            </div>
          )}
        </div>
      )}

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
          <h2 className="text-lg font-medium mb-3">Attempt History</h2>
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