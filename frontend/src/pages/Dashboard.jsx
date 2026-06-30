import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [roadmapSummary, setRoadmapSummary] = useState(null);
  const [eligibility, setEligibility] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/auth/me");
        setUser(res.data.user);

        try {
          const roadmapRes = await api.get("/roadmap");
          const total = roadmapRes.data.steps.length;
          const done = roadmapRes.data.steps.filter(
            (s) => s.progress?.[0]?.completed
          ).length;
          setRoadmapSummary({ total, done, route: roadmapRes.data.route });
        } catch (err) {
          setRoadmapSummary(null);
        }

        try {
          const eligRes = await api.get("/eligibility");
          setEligibility(eligRes.data);
        } catch (err) {
          setEligibility(null);
        }
      } catch (err) {
        localStorage.removeItem("token");
        navigate("/");
      }
    };
    fetchUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const downloadReport = async () => {
    try {
      const res = await api.get("/report/pdf", { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "SkyPath_Roadmap.pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error(err);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-charcoal text-cloud font-sans p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold">
          SkyPath <span className="text-amber">✈</span>
        </h1>
        <button
          onClick={handleLogout}
          className="text-sm text-cloud/60 hover:text-alert transition"
        >
          Log out
        </button>
      </div>

      <div className="bg-steel rounded-lg p-6 border border-white/10">
        <p className="text-cloud/70 mb-1">Welcome, {user.name}.</p>

        {roadmapSummary && (
          <p className="text-amber font-mono text-sm mb-4">
            {roadmapSummary.done}/{roadmapSummary.total} steps completed —{" "}
            {roadmapSummary.route} route
          </p>
        )}

        {eligibility?.nda?.monthsRemaining !== null && eligibility?.nda?.eligible && (
          <div className="bg-amber/10 border border-amber/30 rounded p-3 mb-4">
            <p className="text-amber text-sm font-mono">
              ⏳ {eligibility.nda.monthsRemaining} months left in your NDA eligibility window
            </p>
          </div>
        )}

        {eligibility?.routeWarning && (
          <div className="bg-alert/10 border border-alert/30 rounded p-3 mb-4">
            <p className="text-alert text-sm">⚠ {eligibility.routeWarning}</p>
          </div>
        )}

        <div className="flex gap-3 flex-wrap">
          <button
            onClick={() => navigate("/roadmap")}
            className="bg-amber text-charcoal px-4 py-2 rounded font-medium hover:opacity-90 transition"
          >
            View My Roadmap
          </button>
          <button
            onClick={() => navigate("/calculator")}
            className="bg-steel border border-amber text-amber px-4 py-2 rounded font-medium hover:bg-amber/10 transition"
          >
            Cost & Timeline
          </button>
          <button
            onClick={() => navigate("/schools")}
            className="bg-steel border border-amber text-amber px-4 py-2 rounded font-medium hover:bg-amber/10 transition"
          >
            Flying Schools
          </button>
          <button
            onClick={() => navigate("/quiz")}
            className="bg-steel border border-amber text-amber px-4 py-2 rounded font-medium hover:bg-amber/10 transition"
          >
            Take Quiz
          </button>
          <button
            onClick={() => navigate("/quiz-history")}
            className="bg-steel border border-amber text-amber px-4 py-2 rounded font-medium hover:bg-amber/10 transition"
          >
            Quiz History
          </button>
          <button
            onClick={() => navigate("/chat")}
            className="bg-steel border border-amber text-amber px-4 py-2 rounded font-medium hover:bg-amber/10 transition"
          >
            Ask Assistant
          </button>
          <button
            onClick={downloadReport}
            className="bg-steel border border-amber text-amber px-4 py-2 rounded font-medium hover:bg-amber/10 transition"
          >
            Download PDF
          </button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;