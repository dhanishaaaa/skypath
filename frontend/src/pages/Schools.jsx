import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

function Schools() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const res = await api.get("/schools/recommendations");
        setData(res.data);
      } catch (err) {
        navigate("/onboarding");
      } finally {
        setLoading(false);
      }
    };
    fetchSchools();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-charcoal flex items-center justify-center">
        <p className="text-cloud/50 font-mono text-sm">Finding the best fit...</p>
      </div>
    );
  }
  if (!data) return null;

  return (
    <div className="min-h-screen bg-charcoal text-cloud font-sans p-6">
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-2xl font-semibold">Flying School Recommendations</h1>
        <button onClick={() => navigate("/dashboard")} className="text-sm text-cloud/60 hover:text-amber transition">
          Back to Dashboard
        </button>
      </div>
      <p className="text-cloud/60 text-sm mb-8">
        {data.budget ? `Ranked for your ₹${data.budget}L budget` : "Set a budget in onboarding for personalized ranking"}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl">
        {data.schools.map((school, i) => (
          <div key={school.id} className={`bg-steel rounded-lg p-5 border relative ${school.overBudget ? "border-alert/30 opacity-70" : "border-white/10"}`}>
            {i === 0 && (
              <span className="absolute top-3 right-3 bg-amber text-charcoal text-xs font-mono px-2 py-0.5 rounded">
                Top Match
              </span>
            )}
            <h3 className="font-medium mb-1 pr-20">{school.name}</h3>
            <p className="text-cloud/50 text-sm mb-3">{school.city}, {school.state} — {school.ownership}</p>

            <div className="flex gap-4 text-xs font-mono text-cloud/60 mb-3">
              <span>₹{school.feeMinLakhs}L – ₹{school.feeMaxLakhs}L</span>
              <span>{school.fleetType}</span>
            </div>

            <div className="space-y-1">
              {school.reasons.map((reason, idx) => (
                <p key={idx} className={`text-xs flex items-start gap-1 ${school.overBudget ? "text-alert/80" : "text-amber/80"}`}>
                    <span>{school.overBudget ? "!" : "✓"}</span> {reason}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Schools;