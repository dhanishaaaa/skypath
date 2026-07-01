import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

function Readiness() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchScore = async () => {
      try {
        const res = await api.get("/readiness");
        setData(res.data);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to load score");
      } finally {
        setLoading(false);
      }
    };
    fetchScore();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-charcoal flex items-center justify-center">
        <p className="text-cloud/50 font-mono text-sm">Calculating your readiness...</p>
      </div>
    );
  }

  const scoreColor = data?.label === 'High' ? 'text-green-400' :
    data?.label === 'Medium' ? 'text-amber' : 'text-alert';

  const borderColor = data?.label === 'High' ? 'border-green-500/30' :
    data?.label === 'Medium' ? 'border-amber/30' : 'border-alert/30';

  return (
    <div className="min-h-screen bg-charcoal text-cloud font-sans p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold">Pilot Readiness Score</h1>
        <button onClick={() => navigate("/dashboard")} className="text-sm text-cloud/60 hover:text-amber transition">
          Back to Dashboard
        </button>
      </div>

      {error ? (
        <div className="max-w-xl bg-alert/10 border border-alert/30 rounded-lg p-4">
          <p className="text-alert text-sm">{error}</p>
          <p className="text-cloud/50 text-xs mt-2">Make sure you have completed onboarding and taken at least one quiz.</p>
        </div>
      ) : (
        <div className="max-w-xl space-y-4">
          <div className={`bg-steel rounded-lg p-6 border ${borderColor}`}>
            <p className="text-cloud/50 text-xs mb-1 font-mono">READINESS SCORE</p>
            <p className={`font-mono text-6xl font-bold mb-1 ${scoreColor}`}>
              {data.readiness_score}
            </p>
            <p className={`text-sm font-medium ${scoreColor} mb-2`}>{data.label} Readiness</p>
            <p className="text-cloud/70 text-sm">{data.summary}</p>
          </div>

          <div className="bg-steel rounded-lg p-5 border border-white/10">
            <p className="text-sm font-medium mb-3">Key Insights</p>
            <div className="space-y-2">
              {data.insights.map((insight, i) => (
                <p key={i} className="text-sm text-cloud/70 flex items-start gap-2">
                  <span className="text-amber mt-0.5">→</span> {insight}
                </p>
              ))}
            </div>
          </div>

          <div className="bg-steel rounded-lg p-5 border border-white/10">
            <p className="text-sm font-medium mb-3 text-cloud/60">Profile Used for Calculation</p>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono text-cloud/50">
                <span>Age: {data.inputUsed.age} yrs</span>
                <span>Route: {data.inputUsed.route === 1 ? 'NDA' : 'Civilian'}</span>
                <span>Budget: Rs.{data.inputUsed.budget_lakhs}L</span>
                <span>PCM: {data.inputUsed.pcm_percent ? `${data.inputUsed.pcm_percent}%` : 'Not set'}</span>
                <span>Quiz accuracy: {data.inputUsed.quiz_accuracy}%</span>
                <span>Color blind: {data.inputUsed.color_blind ? 'Yes' : 'No'}</span>
                <span>Vision issues: {data.inputUsed.vision_issues ? 'Yes' : 'No'}</span>
                <span>BP issues: {data.inputUsed.bp_issues ? 'Yes' : 'No'}</span>
            </div>
            {data.note && (
              <p className="text-xs text-cloud/40 mt-3 italic">{data.note}</p>
            )}
          </div>

          <div className="bg-steel rounded-lg p-4 border border-white/10 flex gap-3">
            <button
              onClick={() => navigate("/quiz")}
              className="flex-1 bg-amber text-charcoal px-4 py-2 rounded font-medium hover:opacity-90 transition text-sm"
            >
              Improve Quiz Score
            </button>
            <button
              onClick={() => navigate("/onboarding")}
              className="flex-1 bg-steel border border-amber text-amber px-4 py-2 rounded font-medium hover:bg-amber/10 transition text-sm"
            >
              Update Profile
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Readiness;