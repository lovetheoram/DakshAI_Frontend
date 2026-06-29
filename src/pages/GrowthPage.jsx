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
  Brain,
  TrendingUp,
  Target,
  Zap,
  Award,
  Clock,
  Flame,
  Smile,
  Share2,
  BookOpen,
  X
} from "lucide-react";

export default function GrowthPage() {
  const [dashboard, setDashboard] = useState(null);
  const [streak, setStreak] = useState(null);
  const [loading, setLoading] = useState(true);

  // Exams / Setup Wizard states
  const [exams, setExams] = useState([]);
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [setupGoalName, setSetupGoalName] = useState("Become Interview Ready");
  const [setupExamId, setSetupExamId] = useState("");
  const [setupTargetDate, setSetupTargetDate] = useState("");
  const [setupHours, setSetupHours] = useState(2.0);

  // Telemetry inputs
  const [energy, setEnergy] = useState(70);
  const [focus, setFocus] = useState(80);
  const [mood, setMood] = useState("motivated");

  // Revision inputs
  const [revMinutes, setRevMinutes] = useState("");

  // Loading/submitting flags
  const [submittingGoal, setSubmittingGoal] = useState(false);
  const [loggingTelemetry, setLoggingTelemetry] = useState(false);
  const [loggingRevision, setLoggingRevision] = useState(false);
  const [sharing, setSharing] = useState(false);

  // Messages
  const [telemetryMessage, setTelemetryMessage] = useState("");
  const [revisionMessage, setRevisionMessage] = useState("");
  const [shareMessage, setShareMessage] = useState("");
  const [wizardError, setWizardError] = useState("");

  const loadAllData = async () => {
    try {
      const [dashData, streakData, treeData] = await Promise.all([
        progressApi.getDashboard(),
        progressApi.getStreakStats(),
        syllabusApi.getTree()
      ]);
      setDashboard(dashData);
      setStreak(streakData);

      const examList = treeData.exams || [];
      setExams(examList);

      if (dashData.goal) {
        setSetupGoalName(dashData.goal.name || dashData.goal.title || "Become Interview Ready");
        setSetupExamId(dashData.goal.exam_id || (examList[0]?.id ?? ""));
        setSetupTargetDate(dashData.goal.target_date || "");
        setSetupHours(dashData.goal.available_hours_per_day || 2.0);
      } else {
        if (examList.length > 0) {
          setSetupExamId(examList[0].id);
        }
        const targetD = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);
        setSetupTargetDate(targetD.toISOString().split("T")[0]);
      }

      // Prefill telemetry from today's diary if available
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

  useEffect(() => {
    loadAllData();
  }, []);

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
      console.error(err);
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
      await progressApi.logEnergy({
        energy_score: energy,
        focus_score: focus,
        mood: mood
      });
      setTelemetryMessage("Diary telemetry logged successfully! ✨");
      await loadAllData();
      setTimeout(() => setTelemetryMessage(""), 3000);
    } catch (err) {
      console.error(err);
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
    } catch (err) {
      console.error(err);
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
      setShareMessage("Successfully posted target compliance badge to Feed! 🚀");
      setTimeout(() => setShareMessage(""), 4000);
    } catch (err) {
      console.error(err);
      setShareMessage("Failed to share target badge.");
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

  const stats = dashboard?.brain_stats || {};
  const goal = dashboard?.goal;

  const metricCards = [
    { label: "Knowledge", value: stats.knowledge ?? 0, icon: Brain, color: "from-purple-500 to-indigo-500" },
    { label: "Memory", value: stats.memory ?? 0, icon: Clock, color: "from-blue-500 to-cyan-500" },
    { label: "Accuracy", value: stats.accuracy ?? 0, icon: Target, color: "from-emerald-500 to-teal-500" },
    { label: "Consistency", value: stats.consistency ?? 0, icon: Zap, color: "from-amber-500 to-orange-500" },
  ];

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-white">Growth Space</h1>
        <p className="text-xs text-gray-500 mt-0.5">Everything about your behavioral telemetry loop.</p>
      </div>

      {/* Goal Section / Setup Wizard */}
      {goal && !isEditingGoal ? (
        <GlassCard className="relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-[10px] font-black tracking-widest text-purple-400 uppercase">Active Target Goal</span>
              <h3 className="text-sm sm:text-base font-bold text-white mt-1">{goal.name || goal.title}</h3>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsEditingGoal(true)}
                className="px-2.5 py-1 rounded-xl bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.08] text-[10px] font-bold text-purple-300 transition"
              >
                Change Goal
              </button>
              <StatusBadge variant="accent">{goal.exam || "Active"}</StatusBadge>
            </div>
          </div>
          {goal.target_date && (
            <p className="text-[10px] text-gray-500 mb-3">
              Target Deadline: {new Date(goal.target_date).toLocaleDateString()}
            </p>
          )}
          <ProgressBar
            value={goal.progress ?? 0}
            showValue
            color="from-purple-500 to-pink-500"
          />
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
                <p className="text-[10px] text-gray-500">Configure exams, deadlines, and daily targets.</p>
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
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Preparation Goal Description</label>
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
                <span>Daily study target</span>
                <span className="text-purple-400 font-extrabold">{setupHours} hrs</span>
              </div>
              <input 
                type="range" 
                min="1" 
                max="12" 
                step="0.5"
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

      {/* Daily Telemetry & Revision Logs (Rendered only when active goal is running) */}
      {goal && !isEditingGoal && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Energy & Focus Sliders */}
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
                <input 
                  type="range" 
                  min="10" 
                  max="100" 
                  step="5"
                  value={energy}
                  onChange={(e) => setEnergy(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-purple-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                  <span>Focus Capability</span>
                  <span className="text-purple-400 font-extrabold">{focus}%</span>
                </div>
                <input 
                  type="range" 
                  min="10" 
                  max="100" 
                  step="5"
                  value={focus}
                  onChange={(e) => setFocus(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-purple-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Current Mood State</label>
                <select
                  value={mood}
                  onChange={(e) => setMood(e.target.value)}
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

              <button
                type="submit"
                disabled={loggingTelemetry}
                className="w-full py-2.5 rounded-xl bg-purple-600/10 hover:bg-purple-600/20 text-purple-300 text-xs font-bold transition active:scale-[0.97] disabled:opacity-50 border border-purple-500/20"
              >
                {loggingTelemetry ? "Syncing..." : "Save Today's Telemetry ✨"}
              </button>

              {telemetryMessage && (
                <p className="text-center text-[10px] text-purple-400 font-medium animate-pulse">{telemetryMessage}</p>
              )}
            </form>
          </GlassCard>

          {/* Revision & Social Share Card Panel */}
          <div className="space-y-4">
            
            {/* Revision Log card */}
            <GlassCard padding="p-5" className="space-y-3">
              <div className="flex items-center gap-2 mb-1">
                <BookOpen className="text-purple-400" size={16} />
                <p className="text-xs font-black tracking-widest text-gray-400 uppercase">Log Concept Revision</p>
              </div>

              <form onSubmit={handleLogRevision} className="space-y-3">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Revision Minutes</label>
                  <input
                    type="number"
                    min="1"
                    max="480"
                    placeholder="e.g. 30"
                    value={revMinutes}
                    onChange={(e) => setRevMinutes(e.target.value)}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 transition"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loggingRevision}
                  className="w-full py-2.5 rounded-xl bg-purple-600/10 hover:bg-purple-600/20 text-purple-300 text-xs font-bold transition active:scale-[0.97] disabled:opacity-50 border border-purple-500/20"
                >
                  {loggingRevision ? "Submitting..." : "Log Revision Minutes 📚"}
                </button>

                {revisionMessage && (
                  <p className="text-center text-[10px] text-purple-400 font-medium animate-pulse">{revisionMessage}</p>
                )}
              </form>
            </GlassCard>

            {/* Social target sharing Card */}
            <GlassCard padding="p-4" className="flex items-center justify-between gap-4">
              <div>
                <h4 className="text-xs font-bold text-white">Share Target Progress</h4>
                <p className="text-[10px] text-gray-500 mt-0.5">Publish today's compliance card to peer feed.</p>
              </div>

              <button
                type="button"
                onClick={handleShareToFeed}
                disabled={sharing}
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

      {/* Learning score dial */}
      <GlassCard glow className="text-center py-8">
        <p className="text-caption mb-3">Overall Learning Score</p>
        <ProgressRing
          value={dashboard?.overall_score ?? 0}
          size={130}
          strokeWidth={11}
          className="mx-auto mb-4"
        />
        <p className="text-xs text-gray-400 leading-relaxed px-4">
          Based on knowledge, memory retention, accuracy, and consistency compliance.
        </p>
      </GlassCard>

      {/* Metric cards grid */}
      <div className="grid grid-cols-2 gap-3">
        {metricCards.map((metric, i) => {
          const Icon = metric.icon;
          return (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.08 }}
            >
              <GlassCard padding="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${metric.color} flex items-center justify-center shadow-lg`}>
                    <Icon size={14} className="text-white" />
                  </div>
                  <span className="text-xs font-bold text-gray-400">{metric.label}</span>
                </div>
                <AnimatedCounter
                  value={metric.value}
                  suffix="%"
                  className="text-lg font-black text-white"
                />
                <ProgressBar
                  value={metric.value}
                  className="mt-2"
                  height="h-1.5"
                  color={metric.color}
                />
              </GlassCard>
            </motion.div>
          );
        })}
      </div>

      {/* Streak details */}
      <GlassCard>
        <div className="flex items-center justify-between mb-4">
          <p className="text-caption">Streak & Consistency</p>
          <StatusBadge variant="warning" icon={<Flame size={10} />}>
            {streak?.current_streak ?? 0} days
          </StatusBadge>
        </div>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-xl font-black text-white">{streak?.current_streak ?? 0}</p>
            <p className="text-[10px] text-gray-500 mt-1">Current Streak</p>
          </div>
          <div>
            <p className="text-xl font-black text-white">{streak?.longest_streak ?? 0}</p>
            <p className="text-[10px] text-gray-500 mt-1">Longest Streak</p>
          </div>
          <div>
            <p className="text-xl font-black text-white">{streak?.total_active_days ?? 0}</p>
            <p className="text-[10px] text-gray-500 mt-1">Total Active Days</p>
          </div>
        </div>
      </GlassCard>

      {/* Achievements placeholder */}
      <GlassCard padding="p-5">
        <div className="flex items-center gap-2 mb-3">
          <Award size={16} className="text-amber-400" />
          <p className="text-caption">Achievements</p>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-1">
          {(dashboard?.achievements || [
            { emoji: "🔥", label: "First Streak" },
            { emoji: "🧠", label: "100 Questions" },
            { emoji: "🎯", label: "90% Accuracy" },
          ]).map((ach, i) => (
            <div
              key={i}
              className="flex-shrink-0 w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex flex-col items-center justify-center gap-1"
            >
              <span className="text-base">{ach.emoji}</span>
              <span className="text-[8px] text-gray-500 text-center leading-tight">{ach.label}</span>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
