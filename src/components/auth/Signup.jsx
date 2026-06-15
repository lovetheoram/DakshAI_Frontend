import { useState, useContext, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import authApi from "../../api/authApi";
import syllabusApi from "../../api/syllabusApi";
import { AuthContext } from "../../context/AuthContext";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";

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
    <div className="min-h-[85vh] flex items-center justify-center bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-950 p-4 text-white">
      <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 shadow-2xl rounded-3xl p-8 w-full max-w-md">
        <h2 className="text-2xl sm:text-3xl font-black mb-6 text-center text-white">Create Account</h2>

        {error && (
          <p className="text-red-400 font-semibold bg-red-500/10 border border-red-500/20 px-4 py-2.5 rounded-xl text-xs sm:text-sm mb-5 text-center">
            {error}
          </p>
        )}

        <div className="flex flex-col gap-4">
          <Input label="Username" name="username" value={form.username} onChange={update} />
          <Input label="Email" name="email" value={form.email} onChange={update} />
          <Input label="Password" name="password" type="password" value={form.password} onChange={update} />

          {uniqueExamTypes.length > 0 && (
            <div className="flex flex-col gap-1.5 w-full text-left">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Selected Syllabus/Exam Type</label>
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

          <Button onClick={submit} loading={loading}>Sign Up</Button>
        </div>

        <p className="text-center mt-6 text-sm text-gray-400">
          Already have an account?{" "}
          <span 
            className="text-purple-400 hover:text-purple-300 font-bold cursor-pointer transition-colors" 
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}
