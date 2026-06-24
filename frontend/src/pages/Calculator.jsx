import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

function Calculator() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCalc = async () => {
      try {
        const res = await api.get("/calculator");
        setData(res.data);
      } catch (err) {
        navigate("/onboarding");
      } finally {
        setLoading(false);
      }
    };
    fetchCalc();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-charcoal flex items-center justify-center">
        <p className="text-cloud/50 font-mono text-sm">Calculating your path...</p>
      </div>
    );
  }
  if (!data) return null;

  return (
    <div className="min-h-screen bg-charcoal text-cloud font-sans p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold">
          Cost & Timeline <span className="text-amber">— {data.route}</span>
        </h1>
        <button onClick={() => navigate("/dashboard")} className="text-sm text-cloud/60 hover:text-amber transition">
          Back to Dashboard
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 max-w-3xl">
        <div className="bg-steel rounded-lg p-5 border border-white/10">
          <p className="text-cloud/50 text-xs mb-1">Total Estimated Cost</p>
          <p className="font-mono text-2xl text-amber">₹{data.totalCostLakhs}L</p>
        </div>
        <div className="bg-steel rounded-lg p-5 border border-white/10">
          <p className="text-cloud/50 text-xs mb-1">Total Time</p>
          <p className="font-mono text-2xl text-amber">{data.totalDurationYears} yrs</p>
          <p className="text-cloud/40 text-xs mt-1">({data.totalDurationMonths} months)</p>
        </div>
        <div className={`bg-steel rounded-lg p-5 border ${
          data.userBudgetLakhs === 0 ? "border-white/10" : data.isBudgetSufficient ? "border-green-500/30" : "border-alert/40"
        }`}>
          <p className="text-cloud/50 text-xs mb-1">Your Budget</p>
          <p className="font-mono text-2xl">{data.userBudgetLakhs === 0 ? "Not set" : `₹${data.userBudgetLakhs}L`}</p>
          <p className={`text-xs mt-1 font-mono ${
            data.userBudgetLakhs === 0 ? "text-cloud/40" : data.isBudgetSufficient ? "text-green-400" : "text-alert"
          }`}>
            {data.userBudgetLakhs === 0
              ? "Add a budget in onboarding to compare"
              : data.isBudgetSufficient
              ? `Surplus of ₹${data.budgetGapLakhs}L`
              : `Short by ₹${Math.abs(data.budgetGapLakhs)}L`}
          </p>
        </div>
      </div>

      <h2 className="text-lg font-medium mb-3">Step-by-step breakdown</h2>
      <div className="max-w-3xl bg-steel rounded-lg border border-white/10 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-cloud/50 border-b border-white/10">
              <th className="p-3">Step</th>
              <th className="p-3 font-mono">Cost (₹L)</th>
              <th className="p-3 font-mono">Duration (mo)</th>
            </tr>
          </thead>
          <tbody>
            {data.breakdown.map((step, i) => (
              <tr key={i} className="border-b border-white/5 last:border-0">
                <td className="p-3">{step.title}</td>
                <td className="p-3 font-mono text-amber">{step.costLakhs ?? 0}</td>
                <td className="p-3 font-mono text-cloud/70">{step.durationMonths ?? "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Calculator;