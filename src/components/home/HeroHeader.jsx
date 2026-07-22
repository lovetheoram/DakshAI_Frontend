import { motion, AnimatePresence } from "framer-motion";
import StatusBadge from "../ui/StatusBadge";
import { Flame, Check, Zap, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function HeroHeader({ user, streak, dashboard }) {
  const navigate = useNavigate();
  const hours = new Date().getHours();
  const greeting =
    hours < 5
      ? "🌙 Late night"
      : hours < 12
      ? "🌅 Good morning"
      : hours < 17
      ? "☀️ Good afternoon"
      : "🌆 Good evening";

  const streakDays = streak?.current_streak || 0;
  const completed = dashboard?.target?.completed_growth ?? 0;
  const target = dashboard?.target?.target_growth ?? 1;
  const isComplete = dashboard?.target?.is_completed ?? false;
  const ratio = target > 0 ? Math.min(1, completed / target) : 1;
  const ratioPercent = Math.round(ratio * 100);

  const [showCelebration, setShowCelebration] = useState(false);
  useEffect(() => {
    if (isComplete) {
      setShowCelebration(true);
      const t = setTimeout(() => setShowCelebration(false), 2500);
      return () => clearTimeout(t);
    }
  }, [isComplete]);

  // Micro-copy with emotional intelligence
  let statusMessage = "";
  let statusColor = "text-gray-500";
  if (completed === 0) {
    statusMessage = "Haven't started yet — your streak is at risk.";
    statusColor = "text-rose-400/80";
  } else if (isComplete && completed > target * 1.5) {
    statusMessage = "🔥 You're absolutely crushing it today!";
    statusColor = "text-emerald-400";
  } else if (isComplete) {
    statusMessage = "🎯 Target hit! Every extra rep is bonus XP.";
    statusColor = "text-emerald-400";
  } else if (ratio >= 0.6) {
    statusMessage = "Almost there — one more push and you're done.";
    statusColor = "text-amber-400/90";
  } else {
    const remaining = (target - completed).toFixed(2);
    statusMessage = `+${remaining}% more to hit today's target.`;
    statusColor = "text-gray-400";
  }

  // Bar gradient based on progress
  const barGradient =
    ratio >= 0.8
      ? "from-emerald-400 via-teal-400 to-cyan-400"
      : ratio >= 0.3
      ? "from-amber-400 via-orange-400 to-yellow-400"
      : "from-rose-500 via-red-500 to-orange-500";

  const barGlow =
    ratio >= 0.8
      ? "shadow-emerald-500/60"
      : ratio >= 0.3
      ? "shadow-amber-500/60"
      : "shadow-rose-500/60";

  return (
    <motion.div
      className="relative overflow-hidden rounded-3xl"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Rich layered background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-900/95 to-purple-950/60" />
      <div className="absolute inset-0 bg-gradient-to-tl from-indigo-900/20 via-transparent to-transparent" />
      <div className="absolute top-0 right-0 w-72 h-72 bg-purple-500/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-500/8 rounded-full blur-3xl pointer-events-none" />
      {/* Top shimmer line */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
      {/* Border */}
      <div className="absolute inset-0 rounded-3xl border border-white/[0.06]" />

      <div className="relative px-6 py-5">
        {/* Row 1: Greeting + Streak + About */}
        <div className="flex items-start justify-between mb-5">
          <div>
            <p className="text-[11px] text-gray-500 font-semibold mb-0.5">{greeting}</p>
            <h1 className="text-xl font-black text-white tracking-tight">
              {user?.username || "Learner"}
              <span className="text-purple-400">.</span>
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate("/about")}
              className="px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-[11px] font-bold hover:bg-purple-500/20 hover:border-purple-400/50 transition-all flex items-center gap-1.5 group"
            >
              <Sparkles size={11} className="text-purple-300 group-hover:text-purple-200" />
              About Us
            </button>

            {streakDays > 0 && (
              <motion.div
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 text-orange-300 text-[11px] font-black"
                animate={streakDays >= 7 ? { scale: [1, 1.03, 1] } : {}}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                <Flame size={12} className="text-orange-400" />
                {streakDays}d
              </motion.div>
            )}
          </div>
        </div>

        {/* Row 2: Progress Section */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-black tracking-[0.12em] text-gray-500 uppercase flex items-center gap-1.5">
              <Zap size={10} className="text-purple-400" />
              Daily Progress
            </p>
            <p className="text-[10px] font-bold tabular-nums text-gray-500">
              <span className={ratioPercent >= 100 ? "text-emerald-400 font-black" : "text-white"}>
                {ratioPercent}%
              </span>
              {" "}complete
            </p>
          </div>

          {/* Progress Bar — thicker with glow */}
          <div className="w-full h-3 bg-black/40 rounded-full overflow-hidden relative border border-white/[0.04]">
            <motion.div
              className={`h-full rounded-full bg-gradient-to-r ${barGradient} shadow-lg ${barGlow}`}
              initial={{ width: 0 }}
              animate={{ width: `${ratioPercent}%` }}
              transition={{ delay: 0.4, duration: 1, ease: [0.16, 1, 0.3, 1] }}
            />
            {/* Shimmer on bar */}
            {ratioPercent > 5 && (
              <div
                className="absolute inset-y-0 left-0 bg-white/20 blur-sm rounded-full"
                style={{ width: `${Math.min(ratioPercent, 30)}%` }}
              />
            )}
          </div>

          <p className={`text-xs ${statusColor} leading-snug font-medium`}>
            {statusMessage}
          </p>
        </div>

        {/* Celebration overlay */}
        <AnimatePresence>
          {showCelebration && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center bg-emerald-950/60 backdrop-blur-sm rounded-3xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0, rotate: -10 }}
                  animate={{ scale: [0, 1.3, 1], rotate: 0 }}
                  transition={{ duration: 0.5, ease: "backOut" }}
                >
                  <Check size={44} className="text-emerald-400 mx-auto mb-2" />
                </motion.div>
                <p className="text-sm font-black text-emerald-300">Daily Target Complete! 🎯</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
