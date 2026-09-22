// src/components/onboarding/DakshOnboarding.jsx
// THE WELCOMER — Takes Target Date & Personal Promise from the learner on first onboarding.
// Exam type was already selected during signup.

import { useState, useContext } from "react";
import { motion } from "framer-motion";
import { AuthContext } from "../../context/AuthContext";
import progressApi from "../../api/progressApi";
import {
  Calendar,
  Sparkles,
  ArrowRight,
  HeartHandshake,
} from "lucide-react";

const PROMISE_SUGGESTIONS = [
  "I will show up honestly and face the questions I get wrong.",
  "Consistency over comfort. 2 hours of real retrieval every day.",
  "I will test before assuming mastery.",
];

export default function DakshOnboarding({ exams = [], existingGoal = null, onComplete }) {
  const { user } = useContext(AuthContext);

  const rawName = user?.first_name || user?.username || "Learner";
  const displayName = rawName.charAt(0).toUpperCase() + rawName.slice(1);

  // Exam name from user profile (selected at signup) or existing goal or fallback
  const targetExamName =
    user?.selected_exam?.name ||
    existingGoal?.exam_name ||
    (exams[0]?.name ?? "Your Target Exam");

  // Date setup: minimum tomorrow, default 6 months
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDateStr = tomorrow.toISOString().split("T")[0];

  const defaultDate = new Date();
  defaultDate.setDate(defaultDate.getDate() + 180);
  const defaultDateStr = existingGoal?.target_date || defaultDate.toISOString().split("T")[0];

  const [targetDate, setTargetDate] = useState(defaultDateStr);
  const [promiseText, setPromiseText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Live days left calculation
  const daysLeft = targetDate
    ? Math.max(1, Math.ceil((new Date(targetDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : 0;

  // Match exam ID
  function getExamId() {
    if (user?.selected_exam?.id) return user.selected_exam.id;
    if (existingGoal?.exam) return existingGoal.exam;
    if (user?.selected_exam?.exam_type) {
      const match = exams.find((e) => e.exam_type === user.selected_exam.exam_type);
      if (match) return match.id;
    }
    return exams[0]?.id ?? 1;
  }

  const handleFinish = async (e) => {
    if (e) e.preventDefault();
    if (submitting || !targetDate) return;
    setSubmitting(true);

    try {
      const examId = getExamId();
      await progressApi.setGoal({
        goal_name: `Crack ${targetExamName}`,
        exam: examId,
        target_date: targetDate,
        available_hours_per_day: 2.0,
      });

      // Save user promise & onboarding status
      const userKey = user?.id || user?.username || "default";
      if (promiseText.trim()) {
        localStorage.setItem(`daksh_promise_${userKey}`, promiseText.trim());
      }
      localStorage.setItem(`daksh_welcomed_${userKey}`, "true");
      localStorage.setItem("daksh_onboarding_done", "true");

      if (onComplete) onComplete();
    } catch (err) {
      console.error("Welcomer save failed:", err);
      // Ensure user is not blocked
      const userKey = user?.id || user?.username || "default";
      localStorage.setItem(`daksh_welcomed_${userKey}`, "true");
      localStorage.setItem("daksh_onboarding_done", "true");
      if (onComplete) onComplete();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md select-none font-sans overflow-y-auto">
      {/* Ambient background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-amber-500/10 rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-left text-slate-100 space-y-6"
      >
        {/* Header with Exam from Signup */}
        <div className="space-y-2 border-b border-slate-800 pb-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-amber-400 flex items-center gap-1.5">
              <Sparkles size={12} />
              <span>Welcome to DakshAI</span>
            </span>

            {/* Target Exam selected during signup */}
            <span className="px-3 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-xs font-bold text-amber-400">
              {targetExamName}
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Welcome, <span className="text-amber-400">{displayName}</span>.
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Let's anchor your preparation with two important commitments:
          </p>
        </div>

        <form onSubmit={handleFinish} className="space-y-6">

          {/* ═══ 1. EXAM TARGET DATE ═══ */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <Calendar size={14} className="text-amber-400" />
                <span>When is your exam target date?</span>
              </label>

              {daysLeft > 0 && (
                <span className="text-xs font-black text-amber-400 bg-amber-500/15 border border-amber-500/30 px-2.5 py-0.5 rounded-full">
                  {daysLeft} days to go
                </span>
              )}
            </div>

            <input
              type="date"
              min={minDateStr}
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-2xl bg-slate-800/70 border border-slate-700 text-slate-100 text-sm font-semibold focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all cursor-pointer"
            />
            <p className="text-[11px] text-slate-400">
              DakshAI uses this date to determine the exact daily pace your goal requires.
            </p>
          </div>

          {/* ═══ 2. PERSONAL PROMISE MESSAGE ═══ */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
              <HeartHandshake size={14} className="text-amber-400" />
              <span>A promise from yourself</span>
            </label>

            <textarea
              rows={3}
              value={promiseText}
              onChange={(e) => setPromiseText(e.target.value)}
              placeholder="e.g. I promise to show up honestly, face the questions I find hard, and never pretend I know what I haven't tested."
              className="w-full p-3.5 rounded-2xl bg-slate-800/70 border border-slate-700 text-slate-100 text-xs sm:text-sm leading-relaxed placeholder:text-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all resize-none"
            />

            {/* Quick Inspiration Chips */}
            <div className="space-y-1 pt-0.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Tap for inspiration:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {PROMISE_SUGGESTIONS.map((sug, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setPromiseText(sug)}
                    className="text-[11px] text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700/80 px-2.5 py-1 rounded-xl transition cursor-pointer text-left"
                  >
                    "{sug}"
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ═══ 3. SUBMIT / LAUNCH ═══ */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <button
              type="submit"
              disabled={submitting || !targetDate || daysLeft <= 0}
              className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 py-3.5 rounded-2xl text-sm font-black flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50"
            >
              <span>{submitting ? "Anchoring Your Room..." : "Seal Commitment & Enter Home"}</span>
              <ArrowRight size={15} />
            </button>

            <p className="text-center text-[11px] text-slate-400">
              You do the studying. We'll help you know if it's enough.
            </p>
          </div>

        </form>
      </motion.div>
    </div>
  );
}
