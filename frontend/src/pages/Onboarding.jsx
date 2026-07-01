import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

const stages = [
  { value: "IN_TENTH", label: "Currently in 10th" },
  { value: "IN_TWELFTH", label: "Currently in 12th" },
  { value: "COMPLETED_TWELFTH", label: "Completed 12th" },
  { value: "IN_BACHELOR", label: "Currently doing Bachelor's" },
  { value: "COMPLETED_BACHELOR", label: "Completed Bachelor's" },
  { value: "IN_MASTER", label: "Currently doing Master's" },
  { value: "COMPLETED_MASTER", label: "Completed Master's" },
  { value: "WORKING_PROFESSIONAL", label: "Working Professional" },
];

const streams = [
  { value: "SCIENCE_PCM", label: "Science — Physics, Chemistry, Math (PCM)" },
  { value: "SCIENCE_PCB", label: "Science — Physics, Chemistry, Biology (PCB)" },
  { value: "COMMERCE", label: "Commerce" },
  { value: "ARTS", label: "Arts / Humanities" },
  { value: "OTHER", label: "Other / Not applicable" },
];

const routes = [
  { value: "NDA", label: "Air Force (NDA route)" },
  { value: "CIVILIAN", label: "Commercial Pilot (Civilian route)" },
  { value: "UNDECIDED", label: "Not sure yet" },
];

function Onboarding() {
  const navigate = useNavigate();
  const [currentStage, setCurrentStage] = useState("");
  const [stream, setStream] = useState("");
  const [pcmPercent, setPcmPercent] = useState("");
  const [chosenRoute, setChosenRoute] = useState("");
  const [budgetLakhs, setBudgetLakhs] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [colorBlind, setColorBlind] = useState(false);
  const [visionIssues, setVisionIssues] = useState(false);
  const [bpIssues, setBpIssues] = useState(false);
  const [error, setError] = useState("");

  const showPcm = stream === "SCIENCE_PCM";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api.post("/profile", {
        currentStage,
        stream,
        pcmPercent: showPcm && pcmPercent ? Number(pcmPercent) : null,
        chosenRoute,
        budgetLakhs: budgetLakhs ? Number(budgetLakhs) : null,
        dateOfBirth: dateOfBirth || null,
        colorBlind,
        visionIssues,
        bpIssues,
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

        <label className="text-sm text-cloud/70 mb-1 block">Current education stage</label>
        <select
          value={currentStage}
          onChange={(e) => setCurrentStage(e.target.value)}
          required
          className="w-full mb-4 px-3 py-2 rounded bg-charcoal border border-white/10 outline-none focus:border-amber"
        >
          <option value="" disabled>Select your current stage</option>
          {stages.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>

        <label className="text-sm text-cloud/70 mb-1 block">Your stream / background</label>
        <select
          value={stream}
          onChange={(e) => setStream(e.target.value)}
          required
          className="w-full mb-4 px-3 py-2 rounded bg-charcoal border border-white/10 outline-none focus:border-amber"
        >
          <option value="" disabled>Select your stream</option>
          {streams.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>

        {showPcm && (
          <>
            <label className="text-sm text-cloud/70 mb-1 block">PCM percentage (optional)</label>
            <input
              type="number"
              min="0"
              max="100"
              value={pcmPercent}
              onChange={(e) => setPcmPercent(e.target.value)}
              placeholder="e.g. 72"
              className="w-full mb-4 px-3 py-2 rounded bg-charcoal border border-white/10 outline-none focus:border-amber"
            />
          </>
        )}

        {stream && stream !== "SCIENCE_PCM" && (
          <div className="bg-amber/10 border border-amber/30 rounded p-3 mb-4">
            <p className="text-amber text-xs">
              {stream === "SCIENCE_PCB"
                ? "PCB stream: Math is not included — you may need to clear Math via NIOS to qualify for CPL/NDA."
                : "Non-science stream: You can still pursue a CPL by clearing Physics and Math via NIOS. NDA requires PCM in 12th."}
            </p>
          </div>
        )}

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
          className="w-full mb-4 px-3 py-2 rounded bg-charcoal border border-white/10 outline-none focus:border-amber"
        />

        <label className="text-sm text-cloud/70 mb-1 block">Date of birth (optional, for NDA age check)</label>
        <input
          type="date"
          value={dateOfBirth}
          onChange={(e) => setDateOfBirth(e.target.value)}
          className="w-full mb-4 px-3 py-2 rounded bg-charcoal border border-white/10 outline-none focus:border-amber"
        />

        <p className="text-sm text-cloud/70 mb-2">Any of these apply to you? (optional)</p>
        <p className="text-xs text-cloud/40 mb-3">Used only to flag potential medical eligibility issues.</p>

        <label className="flex items-center gap-2 mb-2 text-sm text-cloud/80">
          <input type="checkbox" checked={colorBlind} onChange={(e) => setColorBlind(e.target.checked)} className="accent-amber" />
          Color blindness
        </label>
        <label className="flex items-center gap-2 mb-2 text-sm text-cloud/80">
          <input type="checkbox" checked={visionIssues} onChange={(e) => setVisionIssues(e.target.checked)} className="accent-amber" />
          Vision issues (beyond standard correctable myopia)
        </label>
        <label className="flex items-center gap-2 mb-6 text-sm text-cloud/80">
          <input type="checkbox" checked={bpIssues} onChange={(e) => setBpIssues(e.target.checked)} className="accent-amber" />
          Blood pressure issues
        </label>

        <button type="submit" className="w-full bg-amber text-charcoal font-medium py-2 rounded hover:opacity-90 transition">
          Continue
        </button>
      </form>
    </div>
  );
}

export default Onboarding;