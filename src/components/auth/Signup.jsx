// src/components/auth/Signup.jsx
import { useState, useContext, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import authApi from "../../api/authApi";
import syllabusApi from "../../api/syllabusApi";
import { AuthContext } from "../../context/AuthContext";

export default function Signup() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const FALLBACK_EXAM_TYPES = [
    { type: "jee", name: "JEE Main" },
    { type: "neet", name: "NEET" },
    { type: "placement", name: "Placement Preparation" },
    { type: "pcs", name: "State PCS (BPSC, UPPCS, etc.)" }
  ];

  const [form, setForm] = useState({ username: "", email: "", password: "", exam_type: "jee" });
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    syllabusApi.getTree()
      .then((data) => {
        if (data?.exams?.length) {
          setExams(data.exams);
          setForm((prev) => ({ ...prev, exam_type: data.exams[0].exam_type }));
        }
      })
      .catch((err) => {
        console.error("Failed to load exams list from backend:", err);
      });
  }, []);

  const uniqueExamTypes = useMemo(() => {
    if (!exams || exams.length === 0) return FALLBACK_EXAM_TYPES;
    const types = new Map();
    exams.forEach((exam) => {
      if (exam.exam_type && !types.has(exam.exam_type)) {
        let displayName = exam.name;
        if (exam.exam_type === "jee") displayName = "JEE Main";
        else if (exam.exam_type === "neet") displayName = "NEET";
        else if (exam.exam_type === "placement") displayName = "Placement Preparation";
        else if (exam.exam_type === "pcs") displayName = "State PCS (BPSC, UPPCS, etc.)";

        types.set(exam.exam_type, {
          type: exam.exam_type,
          name: displayName
        });
      }
    });
    return Array.from(types.values());
  }, [exams]);

  const update = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async () => {
    if (!form.exam_type) { setError("Please select an exam type first."); return; }
    setLoading(true);
    setError("");

    try {
      const payload = { username: form.username, email: form.email, password: form.password, exam_type: form.exam_type };
      const res = await authApi.register(payload);
      login(res.user, res.tokens);
      navigate("/");
    } catch {
      setError("Signup failed. Try different credentials.");
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

        <h2 className="text-xl font-bold mb-6 text-center text-[var(--color-text-primary)]">Create Account</h2>

        {error && (
          <p className="text-[var(--color-danger)] font-semibold bg-[var(--color-danger-light)] border border-[var(--color-danger)]/20 px-4 py-2.5 rounded-xl text-xs mb-5 text-center">
            {error}
          </p>
        )}

        <div className="space-y-4">
          <div>
            <label className="text-[10px] font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider block mb-1.5">Username</label>
            <input type="text" name="username" value={form.username} onChange={update} className="input-field text-base md:text-sm" />
          </div>

          <div>
            <label className="text-[10px] font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider block mb-1.5">Email</label>
            <input type="email" name="email" value={form.email} onChange={update} className="input-field text-base md:text-sm" />
          </div>

          <div>
            <label className="text-[10px] font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider block mb-1.5">Password</label>
            <input type="password" name="password" value={form.password} onChange={update} className="input-field text-base md:text-sm" />
          </div>

          {uniqueExamTypes.length > 0 && (
            <div>
              <label className="text-[10px] font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider block mb-1.5">Exam Type</label>
              <select name="exam_type" value={form.exam_type} onChange={update} className="input-field text-base md:text-sm appearance-none">
                {uniqueExamTypes.map((et) => (
                  <option key={et.type} value={et.type}>{et.name}</option>
                ))}
              </select>
            </div>
          )}

          <button
            onClick={submit}
            disabled={loading}
            className="w-full py-3 mt-2 btn-gold rounded-xl text-sm disabled:opacity-50 flex items-center justify-center"
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </div>

        <p className="text-center mt-6 text-xs text-[var(--color-text-secondary)]">
          Already have an account?{" "}
          <span
            className="text-[var(--color-gold)] hover:text-[var(--color-gold-dark)] font-bold cursor-pointer transition-colors"
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}
