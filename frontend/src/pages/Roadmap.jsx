import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

function Roadmap() {
  const navigate = useNavigate();
  const [route, setRoute] = useState("");
  const [steps, setSteps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoadmap = async () => {
      try {
        const res = await api.get("/roadmap");
        setRoute(res.data.route);
        setSteps(res.data.steps);
      } catch (err) {
        navigate("/onboarding");
      } finally {
        setLoading(false);
      }
    };
    fetchRoadmap();
  }, []);

  const toggleComplete = async (stepId) => {
    try {
      await api.post(`/roadmap/${stepId}/complete`);
      setSteps((prev) =>
        prev.map((s) =>
          s.id === stepId ? { ...s, progress: [{ completed: true }] } : s
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-charcoal flex items-center justify-center">
        <p className="text-cloud/50 font-mono text-sm">Loading your roadmap...</p>
      </div>
    );
  }

  const completedCount = steps.filter((s) => s.progress?.[0]?.completed).length;

  return (
    <div className="min-h-screen bg-charcoal text-cloud font-sans p-6">
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-2xl font-semibold">
          Your Roadmap <span className="text-amber">— {route}</span>
        </h1>
        <button onClick={() => navigate("/dashboard")} className="text-sm text-cloud/60 hover:text-amber transition">
          Back to Dashboard
        </button>
      </div>
      <p className="text-cloud/60 text-sm mb-8">
        {completedCount} of {steps.length} steps completed
      </p>

      <div className="relative max-w-2xl">
        <div className="absolute left-4 top-2 bottom-2 w-px bg-white/10"></div>

        {steps.map((step, i) => {
          const done = step.progress?.[0]?.completed;
          return (
            <div key={step.id} className="relative pl-12 pb-8">
              <button
                onClick={() => toggleComplete(step.id)}
                className={`absolute left-0 top-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-mono border-2 transition ${
                  done
                    ? "bg-amber border-amber text-charcoal"
                    : "bg-steel border-white/20 text-cloud/60 hover:border-amber"
                }`}
              >
                {done ? "✓" : i + 1}
              </button>

              <div className={`bg-steel rounded-lg p-4 border border-white/10 ${done ? "opacity-60" : ""}`}>
                <h3 className="font-medium mb-1">{step.title}</h3>
                <p className="text-cloud/60 text-sm mb-2">{step.description}</p>
                <div className="flex gap-4 text-xs font-mono text-cloud/50">
                  {step.estCostLakhs !== null && <span>₹{step.estCostLakhs}L</span>}
                  {step.estDuration && <span>{step.estDuration}</span>}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Roadmap;