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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Create Account</h2>

        {error && <p className="text-red-600 mb-4 text-center">{error}</p>}

        <div className="flex flex-col gap-4">
          <Input label="Username" name="username" value={form.username} onChange={update} />
          <Input label="Email" name="email" value={form.email} onChange={update} />
          <Input label="Password" name="password" type="password" value={form.password} onChange={update} />

          {uniqueExamTypes.length > 0 && (
            <div className="flex flex-col gap-1 w-full">
              <label className="text-sm font-medium text-gray-700">Selected Syllabus/Exam Type</label>
              <select
                name="exam_type"
                value={form.exam_type}
                onChange={update}
                className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none bg-white text-sm"
              >
                {uniqueExamTypes.map((et) => (
                  <option key={et.type} value={et.type}>
                    {et.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <Button onClick={submit} loading={loading}>Sign Up</Button>
        </div>

        <p className="text-center mt-4 text-sm">
          Already have an account?{" "}
          <span className="text-blue-600 cursor-pointer" onClick={() => navigate("/login")}>
            Login
          </span>
        </p>
      </div>
    </div>
  );
}
