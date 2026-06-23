import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [roadmapSummary, setRoadmapSummary] = useState(null);

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

        <button
          onClick={() => navigate("/roadmap")}
          className="bg-amber text-charcoal px-4 py-2 rounded font-medium hover:opacity-90 transition"
        >
          View My Roadmap
        </button>
      </div>
    </div>
  );
}

export default Dashboard;