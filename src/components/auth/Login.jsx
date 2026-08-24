// src/components/auth/Login.jsx
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import authApi from "../../api/authApi";
import { AuthContext } from "../../context/AuthContext";

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
      navigate("/");
    } catch {
      setError("Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-white">
      <div className="w-full max-w-md rounded-2xl border border-[var(--color-border)] bg-white p-8 shadow-[var(--shadow-lg)]">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-9 h-9 rounded-lg bg-[var(--color-gold)] flex items-center justify-center shadow-sm">
            <span className="text-white font-black text-sm">D</span>
          </div>
          <span className="text-lg font-bold text-[var(--color-text-primary)] tracking-tight">
            Daksh<span className="text-[var(--color-gold)]">AI</span>
          </span>
        </div>

        <h2 className="text-xl font-bold mb-6 text-center text-[var(--color-text-primary)]">Welcome Back</h2>

        {error && (
          <p className="text-[var(--color-danger)] font-semibold bg-[var(--color-danger-light)] border border-[var(--color-danger)]/20 px-4 py-2.5 rounded-xl text-xs mb-5 text-center">
            {error}
          </p>
        )}

        <div className="space-y-4">
          <div>
            <label className="text-[10px] font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider block mb-1.5">Username</label>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={update}
              className="input-field text-base md:text-sm"
            />
          </div>

          <div>
            <label className="text-[10px] font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider block mb-1.5">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={update}
              className="input-field text-base md:text-sm"
            />
          </div>

          <button
            onClick={submit}
            disabled={loading}
            className="w-full py-3 mt-2 btn-gold rounded-xl text-sm disabled:opacity-50 flex items-center justify-center"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </div>

        <p className="text-center mt-6 text-xs text-[var(--color-text-secondary)]">
          New here?{" "}
          <span
            className="text-[var(--color-gold)] hover:text-[var(--color-gold-dark)] font-bold cursor-pointer transition-colors"
            onClick={() => navigate("/signup")}
          >
            Create an account
          </span>
        </p>
      </div>
    </div>
  );
}
