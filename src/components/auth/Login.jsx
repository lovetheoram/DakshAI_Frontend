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
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Welcome Back</h2>

        {error && <p className="text-red-600 mb-4 text-center">{error}</p>}

        <div className="flex flex-col gap-4">
          <Input label="Username" name="username" value={form.username} onChange={update} />
          <Input label="Password" name="password" type="password" value={form.password} onChange={update} />

          <Button onClick={submit} loading={loading}>Login</Button>
        </div>

        <p className="text-center mt-4 text-sm">
          New here?{" "}
          <span className="text-blue-600 cursor-pointer" onClick={() => navigate("/signup")}>
            Create an account
          </span>
        </p>
      </div>
    </div>
  );
}
