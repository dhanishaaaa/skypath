import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await axios.post("http://localhost:5000/api/auth/signup", form);
      localStorage.setItem("token", res.data.token);
      navigate("/onboarding");
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-charcoal flex items-center justify-center font-sans">
      <form
        onSubmit={handleSubmit}
        className="bg-steel p-8 rounded-lg w-full max-w-sm border border-white/10"
      >
        <h1 className="text-cloud text-2xl font-semibold mb-1">Create your account</h1>
        <p className="text-cloud/60 text-sm mb-6">Start your journey to becoming a pilot</p>

        {error && (
          <p className="bg-alert/20 text-alert text-sm rounded p-2 mb-4">{error}</p>
        )}

        <input
          type="text"
          name="name"
          placeholder="Full name"
          value={form.name}
          onChange={handleChange}
          required
          className="w-full mb-3 px-3 py-2 rounded bg-charcoal text-cloud border border-white/10 outline-none focus:border-amber"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full mb-3 px-3 py-2 rounded bg-charcoal text-cloud border border-white/10 outline-none focus:border-amber"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
          className="w-full mb-4 px-3 py-2 rounded bg-charcoal text-cloud border border-white/10 outline-none focus:border-amber"
        />

        <button
          type="submit"
          className="w-full bg-amber text-charcoal font-medium py-2 rounded hover:opacity-90 transition"
        >
          Sign up
        </button>

        <p className="text-cloud/60 text-sm mt-4 text-center">
          Already have an account?{" "}
          <Link to="/" className="text-amber">Log in</Link>
        </p>
      </form>
    </div>
  );
}

export default Signup;