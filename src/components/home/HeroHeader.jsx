import { motion, AnimatePresence } from "framer-motion";
import StatusBadge from "../ui/StatusBadge";
import { Flame, Check, Zap, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import progressApi from "../../api/progressApi";

export default function HeroHeader({ user, streak, dashboard, onRefreshDashboard }) {
  const navigate = useNavigate();
  const [checkingIn, setCheckingIn] = useState(false);
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
  const targetData = dashboard?.target || {};
  const checkedInToday = Boolean(targetData.study_checked_in || targetData.checked_in_today);

  const completedCorrect = targetData.completed_correct_questions || 0;
  const targetCorrect = targetData.target_correct_questions || 20;

  const checkinGrowth = checkedInToday ? 50.0 : 0.0;
  const questionsGrowth = targetData.questions_growth ?? (targetCorrect > 0 ? Math.min(50.0, Math.round((completedCorrect / targetCorrect) * 50.0)) : 0.0);

  const completed = targetData.completed_growth ?? (checkinGrowth + questionsGrowth);
  const target = targetData.target_growth ?? 100;
  const isComplete = targetData.is_completed || completed >= 100;
  const ratioPercent = Math.min(100, Math.round((completed / target) * 100));
  const ratio = ratioPercent / 100;

  const handleCheckin = async () => {
    try {
      setCheckingIn(true);
      await progressApi.checkin();
      if (onRefreshDashboard) onRefreshDashboard();
    } catch (err) {
      console.error("Checkin failed:", err);
    } finally {
      setCheckingIn(false);
    }
  };

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
  let statusColor = "text-gray-400";
  if (!checkedInToday && completedCorrect === 0) {
    statusMessage = "Tap 'Daily Check-in' (+50%) or solve practice questions to complete today's target!";
    statusColor = "text-rose-400/90";
  } else if (isComplete) {
    statusMessage = "🎯 100% Target Completed today! Check-in (+50%) + Practice Questions (+50%) complete.";
    statusColor = "text-emerald-400 font-bold";
  } else {
    statusMessage = `50/50 Target: Check-in (${checkinGrowth}%/50%) + Practice Questions (${questionsGrowth}%/50%).`;
    statusColor = "text-amber-300 font-medium";
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

      <div className="relative px-6 py-5 space-y-4">
        {/* Row 1: Greeting + Streak + About */}
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div>
            <p className="text-[11px] text-gray-400 font-semibold mb-0.5">{greeting}</p>
            <h1 className="text-xl font-black text-white tracking-tight">
              {user?.username || "Learner"}
              <span className="text-purple-400">.</span>
            </h1>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {!checkedInToday ? (
              <button
                onClick={handleCheckin}
                disabled={checkingIn}
                className="px-3 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[11px] font-bold hover:bg-emerald-500/30 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Check size={11} className="text-emerald-400" />
                {checkingIn ? "Checking in..." : "1-Tap Check-in (+50%)"}
              </button>
            ) : (
              <span className="px-3 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 text-[11px] font-bold flex items-center gap-1.5 shadow-xs">
                <Check size={11} />
                Checked in today (+50%)
              </span>
            )}

            <button
              onClick={() => navigate("/about")}
              className="px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-[11px] font-bold hover:bg-purple-500/20 hover:border-purple-400/50 transition-all flex items-center gap-1.5 group cursor-pointer"
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
                {streakDays}d Streak
              </motion.div>
            )}
          </div>
        </div>

        {/* Row 2: 50 / 50 Dual Criteria Breakdown Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
          {/* 50% Track 1: Study Check-in */}
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                Track 1 (50%) — Daily Check-In
              </span>
              <span className="text-xs font-black text-white block">
                {checkedInToday ? "Checked In (+50%)" : "Pending Check-In (+0%)"}
              </span>
            </div>
            {checkedInToday ? (
              <div className="w-7 h-7 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center font-bold text-xs">
                ✓
              </div>
            ) : (
              <button
                onClick={handleCheckin}
                disabled={checkingIn}
                className="px-2.5 py-1 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[10px] font-bold hover:bg-emerald-500/30 cursor-pointer"
              >
                {checkingIn ? "..." : "Check in"}
              </button>
            )}
          </div>

          {/* 50% Track 2: Practice Questions */}
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                Track 2 (50%) — Practice Questions
              </span>
              <span className="text-xs font-black text-white block">
                {completedCorrect} / {targetCorrect} Correct (+{questionsGrowth}%)
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs font-extrabold text-amber-400 block">
                {Math.round((completedCorrect / Math.max(1, targetCorrect)) * 100)}%
              </span>
            </div>
          </div>
        </div>

        {/* Row 3: Total Combined Daily Progress Bar */}
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-black tracking-[0.12em] text-gray-400 uppercase flex items-center gap-1.5">
              <Zap size={11} className="text-purple-400" />
              Total 50/50 Daily Target Progress
            </p>
            <p className="text-[10px] font-bold tabular-nums text-gray-400">
              <span className={ratioPercent >= 100 ? "text-emerald-400 font-black" : "text-white"}>
                {ratioPercent}%
              </span>
              {" "}completed (100% max)
            </p>
          </div>

          {/* Progress Bar — thicker with glow */}
          <div className="w-full h-3 bg-black/40 rounded-full overflow-hidden relative border border-white/[0.04]">
            <motion.div
              className={`h-full rounded-full bg-gradient-to-r ${barGradient} shadow-lg ${barGlow}`}
              initial={{ width: 0 }}
              animate={{ width: `${ratioPercent}%` }}
              transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
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
