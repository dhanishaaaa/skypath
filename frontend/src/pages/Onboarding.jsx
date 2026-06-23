import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

const stages = [
  { value: "TENTH", label: "I'm in 10th" },
  { value: "TWELFTH", label: "I'm in 12th" },
  { value: "AFTER_TWELFTH", label: "I've finished 12th" },
  { value: "AFTER_GRADUATION", label: "I've finished graduation" },
];

const routes = [
  { value: "NDA", label: "Air Force (NDA route)" },
  { value: "CIVILIAN", label: "Commercial Pilot (Civilian route)" },
  { value: "UNDECIDED", label: "Not sure yet" },
];

function Onboarding() {
  const navigate = useNavigate();
  const [currentStage, setCurrentStage] = useState("");
  const [chosenRoute, setChosenRoute] = useState("");
  const [budgetLakhs, setBudgetLakhs] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api.post("/profile", {
        currentStage,
        chosenRoute,
        budgetLakhs: budgetLakhs ? Number(budgetLakhs) : null,
      });
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-charcoal text-cloud font-sans flex items-center justify-center p-6">
      <form onSubmit={handleSubmit} className="bg-steel p-8 rounded-lg w-full max-w-md border border-white/10">
        <h1 className="text-2xl font-semibold mb-1">Where are you starting from?</h1>
        <p className="text-cloud/60 text-sm mb-6">This builds your personalized roadmap</p>

        {error && <p className="bg-alert/20 text-alert text-sm rounded p-2 mb-4">{error}</p>}

        <label className="text-sm text-cloud/70 mb-1 block">Current stage</label>
        <select
          value={currentStage}
          onChange={(e) => setCurrentStage(e.target.value)}
          required
          className="w-full mb-4 px-3 py-2 rounded bg-charcoal border border-white/10 outline-none focus:border-amber"
        >
          <option value="" disabled>Select stage</option>
          {stages.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>

        <label className="text-sm text-cloud/70 mb-1 block">Which route interests you?</label>
        <select
          value={chosenRoute}
          onChange={(e) => setChosenRoute(e.target.value)}
          required
          className="w-full mb-4 px-3 py-2 rounded bg-charcoal border border-white/10 outline-none focus:border-amber"
        >
          <option value="" disabled>Select route</option>
          {routes.map((r) => (
            <option key={r.value} value={r.value}>{r.label}</option>
          ))}
        </select>

        <label className="text-sm text-cloud/70 mb-1 block">Budget (in lakhs, optional)</label>
        <input
          type="number"
          value={budgetLakhs}
          onChange={(e) => setBudgetLakhs(e.target.value)}
          placeholder="e.g. 30"
          className="w-full mb-6 px-3 py-2 rounded bg-charcoal border border-white/10 outline-none focus:border-amber"
        />

        <button type="submit" className="w-full bg-amber text-charcoal font-medium py-2 rounded hover:opacity-90 transition">
          Continue
        </button>
      </form>
    </div>
  );
}

export default Onboarding;