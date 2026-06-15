// src/pages/auth/Login.jsx
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import authApi from "../../api/authApi";
import { AuthContext } from "../../context/AuthContext";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";

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
    <div className="min-h-[85vh] flex items-center justify-center bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-950 p-4 text-white">
      <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 shadow-2xl rounded-3xl p-8 w-full max-w-md">
        <h2 className="text-2xl sm:text-3xl font-black mb-6 text-center text-white">Welcome Back</h2>

        {error && (
          <p className="text-red-400 font-semibold bg-red-500/10 border border-red-500/20 px-4 py-2.5 rounded-xl text-xs sm:text-sm mb-5 text-center">
            {error}
          </p>
        )}

        <div className="flex flex-col gap-4">
          <Input label="Username" name="username" value={form.username} onChange={update} />
          <Input label="Password" name="password" type="password" value={form.password} onChange={update} />

          <Button onClick={submit} loading={loading}>Login</Button>
        </div>

        <p className="text-center mt-6 text-sm text-gray-400">
          New here?{" "}
          <span 
            className="text-purple-400 hover:text-purple-300 font-bold cursor-pointer transition-colors" 
            onClick={() => navigate("/signup")}
          >
            Create an account
          </span>
        </p>
      </div>
    </div>
  );
}
