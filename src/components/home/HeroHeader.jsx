import { motion, AnimatePresence } from "framer-motion";
import StatusBadge from "../ui/StatusBadge";
import { Flame, Check, AlertCircle, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function HeroHeader({ user, streak, dashboard }) {
  const navigate = useNavigate();
  const hours = new Date().getHours();
  const greeting =
    hours < 12 ? "Good morning" : hours < 17 ? "Good afternoon" : "Good evening";

  const streakDays = streak?.current_streak || 0;
  const completed = dashboard?.target?.completed_growth ?? 0;
  const target = dashboard?.target?.target_growth ?? 1;
  const isComplete = dashboard?.target?.is_completed ?? false;
  const ratio = target > 0 ? Math.min(1, completed / target) : 1;
  const ratioPercent = Math.round(ratio * 100);

  // Delight: celebrate target completion
  const [showCelebration, setShowCelebration] = useState(false);
  useEffect(() => {
    if (isComplete) {
      setShowCelebration(true);
      const t = setTimeout(() => setShowCelebration(false), 2500);
      return () => clearTimeout(t);
    }
  }, [isComplete]);

  // Dynamic micro-sentence
  let statusMessage = "";
  let statusColor = "text-gray-500";
  if (completed === 0) {
    statusMessage = "You haven't started today. Your streak is at risk.";
    statusColor = "text-red-400/80";
  } else if (isComplete && completed > target * 1.5) {
    statusMessage = "🔥 Crushing it today!";
    statusColor = "text-emerald-400";
  } else if (isComplete) {
    statusMessage = "🎯 Target hit! Everything beyond is bonus.";
    statusColor = "text-emerald-400";
  } else if (ratio >= 0.6) {
    statusMessage = "Almost there — just a little more push.";
    statusColor = "text-amber-400/80";
  } else {
    statusMessage = `You need +${(target - completed).toFixed(2)}% more to hit today's goal.`;
    statusColor = "text-gray-400";
  }

  // Bar color
  const barColor =
    ratio >= 0.8
      ? "from-emerald-500 to-emerald-400"
      : ratio >= 0.3
      ? "from-amber-500 to-yellow-400"
      : "from-red-500 to-orange-400";

  return (
    <motion.div
      className="relative overflow-hidden rounded-2xl"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Ambient gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-slate-900/60 to-indigo-900/20" />
      <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />

      <div className="relative px-6 py-6">
        {/* Row 1: Greeting + Light-up About Us + Streak */}
        <div className="flex items-start justify-between mb-5">
          <div>
            <p className="text-xs text-gray-400 mb-0.5">{greeting}</p>
            <h1 className="text-lg font-bold text-white">
              {user?.username || "Learner"}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            {/* Glowing / Light-up About Us Shape */}
            <button
              onClick={() => navigate("/about")}
              className="px-3 py-1.5 rounded-full bg-gradient-to-r from-purple-500/20 to-indigo-500/20 border border-purple-500/40 text-purple-300 text-xs font-bold shadow-lg shadow-purple-500/10 hover:shadow-purple-500/30 hover:border-purple-400 transition-all flex items-center gap-1.5 animate-pulse"
              title="Learn about DakshAI purpose & vision"
            >
              <Sparkles size={12} className="text-purple-300" />
              <span>About Us</span>
            </button>

            {streakDays > 0 && (
              <StatusBadge
                variant="warning"
                icon={<Flame size={12} />}
                pulse={streakDays >= 7}
              >
                {streakDays}d streak
              </StatusBadge>
            )}
          </div>
        </div>

        {/* Row 2: Today's Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-black tracking-widest text-gray-400 uppercase">
              Today's Progress
            </p>
            <p className="text-[10px] font-bold text-gray-500">
              {completed.toFixed(2)}% / {target.toFixed(2)}%
            </p>
          </div>

          {/* Target bar */}
          <div className="w-full h-2.5 bg-slate-950/80 rounded-full overflow-hidden relative">
            <motion.div
              className={`h-full rounded-full bg-gradient-to-r ${barColor}`}
              initial={{ width: 0 }}
              animate={{ width: `${ratioPercent}%` }}
              transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>

          {/* Status message */}
          <p className={`text-xs ${statusColor} leading-relaxed`}>
            {statusMessage}
          </p>
        </div>

        {/* Celebration overlay */}
        <AnimatePresence>
          {showCelebration && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center bg-emerald-500/10 backdrop-blur-sm rounded-2xl"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.4 }}
            >
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.3, 1] }}
                  transition={{ duration: 0.6 }}
                >
                  <Check size={40} className="text-emerald-400 mx-auto mb-2" />
                </motion.div>
                <p className="text-sm font-bold text-emerald-400">
                  Daily Target Complete!
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
