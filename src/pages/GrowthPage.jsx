import { useEffect, useState } from "react";
import progressApi from "../api/progressApi";
import syllabusApi from "../api/syllabusApi";
import GlassCard from "../components/ui/GlassCard";
import ProgressRing from "../components/ui/ProgressRing";
import ProgressBar from "../components/ui/ProgressBar";
import AnimatedCounter from "../components/ui/AnimatedCounter";
import StatusBadge from "../components/ui/StatusBadge";
import SkeletonLoader from "../components/ui/SkeletonLoader";
import { motion } from "framer-motion";
import {
  Brain, Target, Zap, Award, Clock, Flame, Smile, Share2, BookOpen, X,
  TrendingUp, TrendingDown, Calendar, Activity, Shield, RefreshCcw
} from "lucide-react";

// ─────────────────────────────────────────────
// Achievements — computed from real data
// ─────────────────────────────────────────────
function computeAchievements(dashboard, streak) {
  if (dashboard?.achievements) return dashboard.achievements;
  const s = streak?.current_streak ?? 0;
  const acc = dashboard?.brain_stats?.accuracy ?? 0;
  const wc = dashboard?.streak_stats?.week_compliance ?? 0;
  const score = dashboard?.overall_score ?? 0;
  return [
    { emoji: "🔥", label: s >= 3 ? `${s}d Streak` : "3d Streak", unlocked: s >= 3 },
    { emoji: "🧠", label: "100 Questions", unlocked: false },
    { emoji: "🎯", label: "90% Accuracy", unlocked: acc >= 80 },
    { emoji: "⚡", label: "Week On Fire", unlocked: wc >= 80 },
    { emoji: "🏆", label: "Half Ready", unlocked: score >= 50 },
  ];
}

// ─────────────────────────────────────────────
// Daily Quota Card
// ─────────────────────────────────────────────
function DailyQuotaCard({ dashboard }) {
  const todayGrowth = dashboard?.today_growth ?? 0;
  const targetGrowth = dashboard?.target_growth ?? 0;
  const compliance = dashboard?.streak_stats?.today_compliance ?? 0;
  const predictedDays = dashboard?.streak_stats?.predicted_remaining_days ?? 0;
  const avgGrowth = dashboard?.streak_stats?.avg_growth ?? 0;

  const isCompleted = compliance >= 100;

  return (
    <GlassCard className="relative overflow-hidden">
      {/* Subtle ambient glow when complete */}
      {isCompleted && (
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent pointer-events-none rounded-3xl" />
      )}
      <div className="flex items-center gap-5">
        <ProgressRing
          value={compliance}
          size={90}
          strokeWidth={8}
          color={isCompleted ? "#10b981" : "var(--color-accent)"}
          sublabel="quota"
        />
        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-black tracking-widest text-gray-400 uppercase">
              Today's Growth Quota
            </p>
            <StatusBadge variant={isCompleted ? "success" : "accent"}>
              {isCompleted ? "Complete ✓" : `${compliance.toFixed(0)}%`}
            </StatusBadge>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-white">
              +{todayGrowth.toFixed(3)}%
            </span>
            <span className="text-xs text-gray-500">/ target +{targetGrowth.toFixed(3)}%</span>
          </div>
          <div className="flex items-center gap-4 text-[10px] text-gray-500">
            <span className="flex items-center gap-1">
              <TrendingUp size={10} className="text-purple-400" />
              Avg +{avgGrowth.toFixed(2)}%/day
            </span>
            {predictedDays > 0 && (
              <span className="flex items-center gap-1">
                <Calendar size={10} className="text-indigo-400" />
                ~{predictedDays} days to goal
              </span>
            )}
          </div>
        </div>
      </div>
    </GlassCard>
  );
}

// ─────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────
export default function GrowthPage() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  const [exams, setExams] = useState([]);
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [setupGoalName, setSetupGoalName] = useState("Become Interview Ready");
  const [setupExamId, setSetupExamId] = useState("");
  const [setupTargetDate, setSetupTargetDate] = useState("");
  const [setupHours, setSetupHours] = useState(2.0);

  const [energy, setEnergy] = useState(70);
  const [focus, setFocus] = useState(80);
  const [mood, setMood] = useState("motivated");
  const [revMinutes, setRevMinutes] = useState("");

  const [submittingGoal, setSubmittingGoal] = useState(false);
  const [loggingTelemetry, setLoggingTelemetry] = useState(false);
  const [loggingRevision, setLoggingRevision] = useState(false);
  const [sharing, setSharing] = useState(false);

  const [telemetryMessage, setTelemetryMessage] = useState("");
  const [revisionMessage, setRevisionMessage] = useState("");
  const [shareMessage, setShareMessage] = useState("");
  const [wizardError, setWizardError] = useState("");

  const loadAllData = async () => {
    try {
      const [dashData, treeData] = await Promise.all([
        progressApi.getDashboard(),
        syllabusApi.getTree()
      ]);
      setDashboard(dashData);

      const examList = treeData.exams || [];
      setExams(examList);

      if (dashData.goal) {
        setSetupGoalName(dashData.goal.goal_name || "Become Interview Ready");
        setSetupExamId(dashData.goal.exam || (examList[0]?.id ?? ""));
        setSetupTargetDate(dashData.goal.target_date || "");
        setSetupHours(dashData.goal.available_hours_per_day || 2.0);
      } else {
        if (examList.length > 0) setSetupExamId(examList[0].id);
        const targetD = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);
        setSetupTargetDate(targetD.toISOString().split("T")[0]);
      }

      const todayStr = new Date().toISOString().split("T")[0];
      const todayEntry = (dashData.diary || []).find(e => e.date === todayStr);
      if (todayEntry) {
        setEnergy(todayEntry.energy_score ?? 70);
        setFocus(todayEntry.focus_score ?? 80);
        setMood(todayEntry.mood ?? "motivated");
      }
    } catch (err) {
      console.error("Growth OS data fetch failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadAllData(); }, []);

  const handleCreateGoal = async (e) => {
    e.preventDefault();
    setWizardError("");
    if (!setupGoalName || !setupExamId || !setupTargetDate) {
      setWizardError("Please fill out all fields.");
      return;
    }
    try {
      setSubmittingGoal(true);
      await progressApi.setGoal({
        goal_name: setupGoalName,
        exam: setupExamId,
        target_date: setupTargetDate,
        available_hours_per_day: setupHours
      });
      await loadAllData();
      setIsEditingGoal(false);
    } catch (err) {
      setWizardError(err.response?.data?.detail || "Failed to initialize goal.");
    } finally {
      setSubmittingGoal(false);
    }
  };

  const handleLogTelemetry = async (e) => {
    e.preventDefault();
    setTelemetryMessage("");
    try {
      setLoggingTelemetry(true);
      await progressApi.logEnergy({ energy_score: energy, focus_score: focus, mood });
      setTelemetryMessage("Diary telemetry logged! ✨");
      await loadAllData();
      setTimeout(() => setTelemetryMessage(""), 3000);
    } catch {
      setTelemetryMessage("Failed to log telemetry.");
    } finally {
      setLoggingTelemetry(false);
    }
  };

  const handleLogRevision = async (e) => {
    e.preventDefault();
    setRevisionMessage("");
    if (!revMinutes || isNaN(revMinutes) || parseInt(revMinutes) <= 0) {
      setRevisionMessage("Enter valid revision minutes.");
      return;
    }
    try {
      setLoggingRevision(true);
      await progressApi.logRevision(parseInt(revMinutes));
      setRevisionMessage(`Logged ${revMinutes} revision minutes! 📚`);
      setRevMinutes("");
      await loadAllData();
      setTimeout(() => setRevisionMessage(""), 4000);
    } catch {
      setRevisionMessage("Failed to log revision.");
    } finally {
      setLoggingRevision(false);
    }
  };

  const handleShareToFeed = async () => {
    setShareMessage("");
    try {
      setSharing(true);
      await progressApi.shareDailyTarget();
      setShareMessage("Posted to Feed! 🚀");
      setTimeout(() => setShareMessage(""), 4000);
    } catch {
      setShareMessage("Failed to share.");
    } finally {
      setSharing(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-4">
        <SkeletonLoader lines={3} />
        <SkeletonLoader lines={4} />
        <SkeletonLoader lines={2} />
      </div>
    );
  }

  // Use streak and prediction from dashboard — no extra API call
  const streakStats = dashboard?.streak_stats || {};
  const state = dashboard?.brain_state || dashboard?.brain_stats || {};

  const metricCards = [
    { label: "Knowledge",   value: state.knowledge   ?? 0, icon: Brain,       color: "from-purple-500 to-indigo-500",  desc: "Exam readiness across all concepts" },
    { label: "Retention",   value: state.retention   ?? 0, icon: RefreshCcw,  color: "from-blue-500 to-cyan-500",     desc: "How well you're retaining past learning" },
    { label: "Confidence",  value: state.confidence  ?? 0, icon: Shield,      color: "from-emerald-500 to-teal-500",  desc: "Weighted accuracy trend, recent sessions" },
    { label: "Momentum",    value: state.momentum    ?? 0, icon: Zap,         color: "from-amber-500 to-orange-500",  desc: "7-day composite: focus, growth, revision" },
    { label: "Discipline",  value: state.discipline  ?? 0, icon: Flame,       color: "from-rose-500 to-pink-500",    desc: "Streak commitment + monthly consistency" },
  ];

  const achievements = computeAchievements(dashboard, streakStats);

  const goal = dashboard?.goal;

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-white">Growth Space</h1>
        <p className="text-xs text-gray-500 mt-0.5">Your behavioral telemetry loop — live.</p>
      </div>

      {/* ── Goal Section / Setup Wizard ── */}
      {goal && !isEditingGoal ? (
        <GlassCard className="relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <div>
              <span className="text-[10px] font-black tracking-widest text-purple-400 uppercase">Active Goal</span>
              <h3 className="text-sm sm:text-base font-bold text-white mt-0.5">{goal.goal_name}</h3>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsEditingGoal(true)}
                className="px-2.5 py-1 rounded-xl bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.08] text-[10px] font-bold text-purple-300 transition"
              >
                Change
              </button>
              <StatusBadge variant="accent">{goal.exam_name || "Active"}</StatusBadge>
            </div>
          </div>
          {goal.target_date && (
            <p className="text-[10px] text-gray-500 mb-3 flex items-center gap-1">
              <Calendar size={10} />
              Deadline: {new Date(goal.target_date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
            </p>
          )}
          <div className="mb-1.5 flex items-center justify-between text-[10px] text-gray-500">
            <span>Overall Readiness</span>
            <span className="text-white font-bold">{(goal.progress ?? 0).toFixed(1)}%</span>
          </div>
          <ProgressBar value={goal.progress ?? 0} color="from-purple-500 to-pink-500" />
        </GlassCard>
      ) : (
        <GlassCard className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/15 flex items-center justify-center">
                <Target className="text-purple-400" size={20} />
              </div>
              <div>
                <h2 className="text-sm font-bold text-white">
                  {isEditingGoal ? "Override Target Goal" : "Initialize Growth OS Engine"}
                </h2>
                <p className="text-[10px] text-gray-500">Configure exam, deadline, and daily hours.</p>
              </div>
            </div>
            {isEditingGoal && (
              <button
                onClick={() => setIsEditingGoal(false)}
                className="w-8 h-8 rounded-full bg-white/[0.02] border border-white/[0.06] flex items-center justify-center text-gray-400 hover:text-white"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {wizardError && (
            <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-3.5 py-2">
              ⚠️ {wizardError}
            </div>
          )}

          <form onSubmit={handleCreateGoal} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Goal Description</label>
              <input
                type="text"
                value={setupGoalName}
                onChange={(e) => setSetupGoalName(e.target.value)}
                placeholder="e.g. Master JEE Physics, Pass Coding Interviews"
                className="w-full bg-slate-950/60 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500 transition"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Target Exam</label>
                <select
                  value={setupExamId}
                  onChange={(e) => setSetupExamId(e.target.value)}
                  className="w-full bg-slate-950/60 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500 transition"
                  required
                >
                  <option value="" className="bg-slate-900 text-gray-500">Select Exam</option>
                  {exams.map(exam => (
                    <option key={exam.id} value={exam.id} className="bg-slate-900">{exam.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Completion Date</label>
                <input
                  type="date"
                  value={setupTargetDate}
                  onChange={(e) => setSetupTargetDate(e.target.value)}
                  className="w-full bg-slate-950/60 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500 transition"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                <span>Daily study hours</span>
                <span className="text-purple-400 font-extrabold">{setupHours} hrs</span>
              </div>
              <input
                type="range" min="1" max="12" step="0.5"
                value={setupHours}
                onChange={(e) => setSetupHours(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-purple-500"
              />
            </div>

            <button
              type="submit"
              disabled={submittingGoal}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold transition shadow-lg disabled:opacity-50"
            >
              {submittingGoal ? "Quantifying deadline matrix..." : "Initialize Goal Engine ⚡"}
            </button>
          </form>
        </GlassCard>
      )}

      {/* ── Daily Quota + Prediction (only shown when goal is active) ── */}
      {goal && !isEditingGoal && <DailyQuotaCard dashboard={dashboard} />}

      {/* ── Daily Telemetry & Revision ── */}
      {goal && !isEditingGoal && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Telemetry */}
          <GlassCard padding="p-5" className="space-y-4">
            <div className="flex items-center gap-2 mb-1">
              <Smile className="text-purple-400" size={16} />
              <p className="text-xs font-black tracking-widest text-gray-400 uppercase">Log Daily Telemetry</p>
            </div>

            <form onSubmit={handleLogTelemetry} className="space-y-4">
              <div>
                <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                  <span>Cognitive Energy</span>
                  <span className="text-purple-400 font-extrabold">{energy}%</span>
                </div>
                <input type="range" min="10" max="100" step="5" value={energy}
                  onChange={(e) => setEnergy(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-purple-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                  <span>Focus Capability</span>
                  <span className="text-purple-400 font-extrabold">{focus}%</span>
                </div>
                <input type="range" min="10" max="100" step="5" value={focus}
                  onChange={(e) => setFocus(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-purple-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Mood State</label>
                <select value={mood} onChange={(e) => setMood(e.target.value)}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500 transition"
                >
                  <option value="motivated" className="bg-slate-900">Motivated 🔥</option>
                  <option value="focused" className="bg-slate-900">Focused 🎯</option>
                  <option value="calm" className="bg-slate-900">Calm 🧘</option>
                  <option value="tired" className="bg-slate-900">Tired 🥱</option>
                  <option value="stressed" className="bg-slate-900">Stressed 😰</option>
                  <option value="happy" className="bg-slate-900">Happy 😊</option>
                </select>
              </div>

              <button type="submit" disabled={loggingTelemetry}
                className="w-full py-2.5 rounded-xl bg-purple-600/10 hover:bg-purple-600/20 text-purple-300 text-xs font-bold transition active:scale-[0.97] disabled:opacity-50 border border-purple-500/20"
              >
                {loggingTelemetry ? "Syncing..." : "Save Today's Telemetry ✨"}
              </button>
              {telemetryMessage && (
                <p className="text-center text-[10px] text-purple-400 font-medium animate-pulse">{telemetryMessage}</p>
              )}
            </form>
          </GlassCard>

          {/* Revision + Share */}
          <div className="space-y-4">
            <GlassCard padding="p-5" className="space-y-3">
              <div className="flex items-center gap-2 mb-1">
                <BookOpen className="text-purple-400" size={16} />
                <p className="text-xs font-black tracking-widest text-gray-400 uppercase">Log Concept Revision</p>
              </div>

              <form onSubmit={handleLogRevision} className="space-y-3">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Revision Minutes</label>
                  <input
                    type="number" min="1" max="480" placeholder="e.g. 30"
                    value={revMinutes}
                    onChange={(e) => setRevMinutes(e.target.value)}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 transition"
                    required
                  />
                </div>
                <button type="submit" disabled={loggingRevision}
                  className="w-full py-2.5 rounded-xl bg-purple-600/10 hover:bg-purple-600/20 text-purple-300 text-xs font-bold transition active:scale-[0.97] disabled:opacity-50 border border-purple-500/20"
                >
                  {loggingRevision ? "Submitting..." : "Log Revision Minutes 📚"}
                </button>
                {revisionMessage && (
                  <p className="text-center text-[10px] text-purple-400 font-medium animate-pulse">{revisionMessage}</p>
                )}
              </form>
            </GlassCard>

            <GlassCard padding="p-4" className="flex items-center justify-between gap-4">
              <div>
                <h4 className="text-xs font-bold text-white">Share Target Progress</h4>
                <p className="text-[10px] text-gray-500 mt-0.5">Publish today's compliance badge to feed.</p>
              </div>
              <button type="button" onClick={handleShareToFeed} disabled={sharing}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold transition active:scale-[0.97] shadow-lg disabled:opacity-50 flex items-center gap-1.5"
              >
                <Share2 size={12} />
                {sharing ? "Sharing..." : "Share"}
              </button>
            </GlassCard>
            {shareMessage && (
              <p className="text-center text-[10px] text-purple-400 font-medium animate-pulse">{shareMessage}</p>
            )}
          </div>
        </div>
      )}

      {/* ── Overall Score Dial ── */}
      {goal && (
        <GlassCard glow className="text-center py-8">
          <p className="text-caption mb-3">Overall Exam Readiness</p>
          <ProgressRing
            value={dashboard?.overall_score ?? 0}
            size={130}
            strokeWidth={11}
            className="mx-auto mb-4"
          />
          <p className="text-xs text-gray-400 leading-relaxed px-4">
            Composite Daksh Score — weighted readiness across all exam concepts.
          </p>
        </GlassCard>
      )}

      {/* ── Brain Metric Cards ── */}
      {goal && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {metricCards.map((metric, i) => {
            const Icon = metric.icon;
            return (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.07 }}
              >
                <GlassCard padding="p-4" className="h-full">
                  <div className="flex items-center gap-2 mb-3">
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${metric.color} flex items-center justify-center shadow-lg`}>
                      <Icon size={14} className="text-white" />
                    </div>
                    <span className="text-xs font-bold text-gray-400">{metric.label}</span>
                  </div>
                  <AnimatedCounter
                    value={metric.value}
                    decimals={1}
                    suffix="%"
                    className="text-lg font-black text-white"
                  />
                  <ProgressBar value={metric.value} className="mt-2" height="h-1.5" color={metric.color} />
                  <p className="text-[9px] text-gray-600 mt-1.5 leading-tight">{metric.desc}</p>
                </GlassCard>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* ── Streak & Consistency ── */}
      <GlassCard>
        <div className="flex items-center justify-between mb-4">
          <p className="text-caption">Streak &amp; Consistency</p>
          <StatusBadge variant="warning" icon={<Flame size={10} />}>
            {streakStats.current_streak ?? 0} days
          </StatusBadge>
        </div>
        <div className="grid grid-cols-3 gap-4 text-center mb-4">
          <div>
            <p className="text-xl font-black text-white">{streakStats.current_streak ?? 0}</p>
            <p className="text-[10px] text-gray-500 mt-1">Current Streak</p>
          </div>
          <div>
            <p className="text-xl font-black text-white">{streakStats.longest_streak ?? 0}</p>
            <p className="text-[10px] text-gray-500 mt-1">Longest Streak</p>
          </div>
          <div>
            <p className="text-xl font-black text-white">{streakStats.total_active_days ?? 0}</p>
            <p className="text-[10px] text-gray-500 mt-1">Active Days</p>
          </div>
        </div>
        {/* Compliance bars */}
        <div className="space-y-2">
          <div>
            <div className="flex justify-between text-[10px] text-gray-500 mb-1">
              <span>7-day compliance</span>
              <span className="text-white font-bold">{streakStats.week_compliance ?? 0}%</span>
            </div>
            <ProgressBar value={streakStats.week_compliance ?? 0} height="h-1" color="from-purple-500 to-indigo-500" />
          </div>
          <div>
            <div className="flex justify-between text-[10px] text-gray-500 mb-1">
              <span>30-day compliance</span>
              <span className="text-white font-bold">{streakStats.month_compliance ?? 0}%</span>
            </div>
            <ProgressBar value={streakStats.month_compliance ?? 0} height="h-1" color="from-blue-500 to-cyan-500" />
          </div>
        </div>
      </GlassCard>

      {/* ── Achievements ── */}
      <GlassCard padding="p-5">
        <div className="flex items-center gap-2 mb-3">
          <Award size={16} className="text-amber-400" />
          <p className="text-caption">Achievements</p>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-1">
          {achievements.map((ach, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 + i * 0.07 }}
              className={`flex-shrink-0 w-16 h-16 rounded-2xl flex flex-col items-center justify-center gap-1 border ${
                ach.unlocked
                  ? "bg-white/[0.05] border-white/[0.1] shadow-sm"
                  : "bg-white/[0.02] border-white/[0.04] opacity-40 grayscale"
              }`}
            >
              <span className="text-base">{ach.emoji}</span>
              <span className="text-[8px] text-gray-400 text-center leading-tight px-1">{ach.label}</span>
            </motion.div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
