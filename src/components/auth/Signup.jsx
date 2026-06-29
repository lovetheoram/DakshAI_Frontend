import { useState, useContext, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import authApi from "../../api/authApi";
import syllabusApi from "../../api/syllabusApi";
import { AuthContext } from "../../context/AuthContext";
import GlassCard from "../ui/GlassCard";

export default function Signup() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const FALLBACK_EXAM_TYPES = [
    { type: "jee", name: "JEE Main" },
    { type: "neet", name: "NEET" },
    { type: "placement", name: "Placement Preparation" }
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
    if (!exams || exams.length === 0) {
      return FALLBACK_EXAM_TYPES;
    }
    const types = new Map();
    exams.forEach((exam) => {
      if (exam.exam_type && !types.has(exam.exam_type)) {
        types.set(exam.exam_type, {
          type: exam.exam_type,
          name: exam.exam_type === "jee" ? "JEE Main" : exam.exam_type === "neet" ? "NEET" : "Placement Preparation"
        });
      }
    });
    return Array.from(types.values());
  }, [exams]);

  const update = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async () => {
    if (!form.exam_type) {
      setError("Please select an exam type first.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const payload = {
        username: form.username,
        email: form.email,
        password: form.password,
        exam_type: form.exam_type
      };
      const res = await authApi.register(payload);
      login(res.user, res.tokens);
      navigate("/"); // redirect to home
    } catch {
      setError("Signup failed. Try different credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[var(--color-bg-primary)] relative overflow-hidden">
      {/* Ambient backgrounds */}
      <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-purple-600/5 rounded-full blur-[80px]" />

      <GlassCard className="w-full max-w-md" padding="p-8">
        <h2 className="text-2xl font-black mb-6 text-center text-white">Create Account</h2>

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
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1.5">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
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

          {uniqueExamTypes.length > 0 && (
            <div>
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1.5">Selected Syllabus/Exam Type</label>
              <div className="relative w-full">
                <select
                  name="exam_type"
                  value={form.exam_type}
                  onChange={update}
                  className="w-full appearance-none bg-slate-950/60 border border-white/10 rounded-xl px-4 py-2.5 pr-10 text-sm text-white focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200 outline-none"
                >
                  {uniqueExamTypes.map((et) => (
                    <option key={et.type} value={et.type} className="bg-slate-900 text-white">
                      {et.name}
                    </option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          )}

          <button
            onClick={submit}
            disabled={loading}
            className="w-full py-3 mt-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30 transition-all disabled:opacity-50 flex items-center justify-center"
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </div>

        <p className="text-center mt-6 text-xs text-gray-400">
          Already have an account?{" "}
          <span 
            className="text-purple-400 hover:text-purple-300 font-bold cursor-pointer transition-colors" 
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>
      </GlassCard>
    </div>
  );
}
