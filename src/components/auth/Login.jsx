// src/components/auth/Login.jsx
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import authApi from "../../api/authApi";
import { AuthContext } from "../../context/AuthContext";
import GlassCard from "../ui/GlassCard";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const update = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await authApi.login(form);
      login(res.user, res.tokens);
      navigate("/"); // redirect to home
    } catch {
      setError("Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[var(--color-bg-primary)] relative overflow-hidden">
      {/* Ambient backgrounds */}
      <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-purple-600/5 rounded-full blur-[80px]" />
      
      <GlassCard className="w-full max-w-md" padding="p-8">
        <h2 className="text-2xl font-black mb-6 text-center text-white">Welcome Back</h2>

        {error && (
          <p className="text-red-400 font-semibold bg-red-500/10 border border-red-500/20 px-4 py-2.5 rounded-xl text-xs mb-5 text-center">
            {error}
          </p>
        )}

        <div className="space-y-4">
          <div>
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1.5">Username</label>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={update}
              className="w-full bg-slate-950/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200 outline-none"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1.5">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={update}
              className="w-full bg-slate-950/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200 outline-none"
            />
          </div>

          <button
            onClick={submit}
            disabled={loading}
            className="w-full py-3 mt-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30 transition-all disabled:opacity-50 flex items-center justify-center"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </div>

        <p className="text-center mt-6 text-xs text-gray-400">
          New here?{" "}
          <span 
            className="text-purple-400 hover:text-purple-300 font-bold cursor-pointer transition-colors" 
            onClick={() => navigate("/signup")}
          >
            Create an account
          </span>
        </p>
      </GlassCard>
    </div>
  );
}
