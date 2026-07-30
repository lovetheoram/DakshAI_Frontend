import { useEffect, useState } from "react";
import progressApi from "../api/progressApi";
import syllabusApi from "../api/syllabusApi";
import EventTracker from "../intelligence/events/EventTracker";
import PredictionEngine from "../intelligence/prediction/PredictionEngine";
import IdentityEngine from "../intelligence/identity/IdentityEngine";
import GlassCard from "../components/ui/GlassCard";
import ProgressBar from "../components/ui/ProgressBar";
import StatusBadge from "../components/ui/StatusBadge";
import SkeletonLoader from "../components/ui/SkeletonLoader";
import { motion, AnimatePresence } from "framer-motion";
import {
  Target,
  Award,
  X,
  TrendingUp,
  AlertCircle,
  Smile,
  ChevronDown,
  ChevronUp,
  Share2,
  Sparkles
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

  // Daily Check-in Telemetry states
  const [energy, setEnergy] = useState(70);
  const [focus, setFocus] = useState(80);
  const [mood, setMood] = useState("motivated");
  const [showTelemetryForm, setShowTelemetryForm] = useState(true);
  const [loggingTelemetry, setLoggingTelemetry] = useState(false);
  const [telemetryMessage, setTelemetryMessage] = useState("");

  // Sharing progress to feed
  const [sharing, setSharing] = useState(false);
  const [shareMessage, setShareMessage] = useState("");

  // Submitting flags
  const [submittingGoal, setSubmittingGoal] = useState(false);
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
    if (!setupGoalName.trim()) {
      setWizardError("Goal name is required.");
      return;
    }
    if (!setupTargetDate) {
      setWizardError("Target date is required.");
      return;
    }

    try {
      setSubmittingGoal(true);
      await progressApi.setGoal({
        goal_name: setupGoalName,
        exam: setupExamId ? parseInt(setupExamId) : undefined,
        target_date: setupTargetDate,
        available_hours_per_day: setupHours,
      });

      setIsEditingGoal(false);
      EventTracker.goalSet(setupGoalName);
      await loadAllData();
    } catch (err) {
      console.error("Create goal error:", err);
      setWizardError(err.response?.data?.detail || "Failed to set target goal.");
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
      setTelemetryMessage("Daily check-in logged! ✨");
      EventTracker.energyReported(energy, focus, mood);
      await loadAllData();
      setTimeout(() => setTelemetryMessage(""), 3000);
    } catch (err) {
      console.error(err);
      setTelemetryMessage("Failed to log check-in.");
    } finally {
      setLoggingTelemetry(false);
    }
  };

  const handleShareToFeed = async () => {
    setShareMessage("");
    try {
      setSharing(true);
      await progressApi.shareDailyTarget();
      setShareMessage("Posted progress compliance badge to Feed! 🚀");
      setTimeout(() => setShareMessage(""), 4000);
    } catch (err) {
      console.error(err);
      setShareMessage("Failed to share progress.");
    } finally {
      setSharing(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-4">
        <SkeletonLoader avatar />
        <SkeletonLoader lines={3} />
        <SkeletonLoader lines={5} />
      </div>
    );
  }

  const goal = dashboard?.goal;
  const prediction = dashboard?.prediction || {};
  const dakshScore = dashboard?.overall_score ?? 0;

  // Formatting dates for prediction timeline with full year
  const today = new Date();
  const targetDateStr = goal?.target_date ? new Date(goal.target_date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "Aug 15, 2026";
  
  // Calculate predicted date
  const predictedDays = streak?.predicted_remaining_days ?? 0;
  const predictedDate = new Date(today.getTime() + predictedDays * 24 * 60 * 60 * 1000);
  const predictedDateStr = predictedDate.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

  // Behind/Ahead counts
  const statusType = prediction?.status || "on_track";
  const daysDelta = prediction?.days_delta ?? 0;

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
      {/* ① Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">Academic Growth</h1>
          {goal && (
            <p className="text-xs text-gray-500 mt-0.5">
              Day {dashboard?.mission_day ?? 1} · {goal.exam || "Preparation Plan"}
            </p>
          )}
        </div>
        {statusType === "behind" && daysDelta > 0 && (
          <StatusBadge variant="danger" icon={<AlertCircle size={10} />}>
            {daysDelta} days behind pace
          </StatusBadge>
        )}
        {statusType === "ahead" && daysDelta > 0 && (
          <StatusBadge variant="success" icon={<TrendingUp size={10} />}>
            {daysDelta} days ahead
          </StatusBadge>
        )}
        {statusType === "on_track" && (
          <StatusBadge variant="accent">On track</StatusBadge>
        )}
      </div>

      {/* ② Predictive Growth Story & Exam Readiness Summary */}
      {goal && !isEditingGoal && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-4"
        >
          {/* Daksh Predictive Story Card */}
          {(() => {
            const narrative = PredictionEngine.narrate(
              {
                targetDate: targetDateStr,
                predictedFinishDate: predictedDateStr,
                daysDelta,
                dailyMinutes: Math.round((goal.available_hours_per_day || 2) * 60),
                status: statusType,
              },
              "companion"
            );
            return (
              <GlassCard className="border border-purple-500/30 bg-gradient-to-r from-slate-900 via-purple-950/20 to-slate-900">
                <div className="flex items-center gap-2 mb-2 text-purple-400 font-bold text-xs uppercase tracking-wider">
                  <Sparkles size={14} className="text-purple-400 animate-pulse" />
                  <span>Daksh Predictive Story</span>
                </div>
                <h3 className="text-sm font-extrabold text-white mb-1">{narrative.headline}</h3>
                <p className="text-xs text-gray-300 leading-relaxed mb-3">{narrative.body}</p>
                <button
                  onClick={() => {
                    if (narrative.ctaAction.startsWith("growth:adjust")) {
                      setSetupHours((prev) => Math.min(12, prev + 0.5));
                      setIsEditingGoal(true);
                    }
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/40 text-purple-200 text-xs font-bold transition shadow-sm"
                >
                  {narrative.ctaText}
                </button>
              </GlassCard>
            );
          })()}

          <GlassCard className="relative overflow-hidden">
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />
            <div className="relative">
              <p className="text-[10px] font-black tracking-widest text-gray-400 uppercase mb-2">
                Estimated Readiness Path
              </p>

              {/* Clean non-colliding date metrics cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 my-4">
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] text-center">
                  <span className="text-[10px] text-gray-400 block uppercase font-semibold">Target Exam Date</span>
                  <span className="text-xs font-bold text-emerald-400 mt-1 block">{targetDateStr}</span>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] text-center">
                  <span className="text-[10px] text-gray-400 block uppercase font-semibold">Predicted Finish</span>
                  <span className={`text-xs font-bold mt-1 block ${statusType === "behind" ? "text-red-400" : "text-emerald-400"}`}>{predictedDateStr}</span>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] text-center col-span-2 sm:col-span-1">
                  <span className="text-[10px] text-gray-400 block uppercase font-semibold">Current Readiness</span>
                  <span className="text-xs font-bold text-purple-300 mt-1 block">{Math.round(dakshScore)}%</span>
                </div>
              </div>

              {/* Explanatory sentence */}
              <div className="text-xs text-gray-400 leading-relaxed border-t border-white/[0.04] pt-3">
                {statusType === "behind" ? (
                  <>
                    At your current pace of <span className="text-white font-bold">+{prediction.actual_daily?.toFixed(2)}%</span> daily growth, you are predicted to finish on <span className="text-red-400 font-bold">{predictedDateStr}</span>. You need an extra <span className="text-white font-bold">+{prediction.need_extra?.toFixed(2)}%</span> daily to meet your target.
                  </>
                ) : statusType === "ahead" ? (
                  <>
                    Great job! You're studying at an average pace of <span className="text-emerald-400 font-bold">+{prediction.actual_daily?.toFixed(2)}%</span> daily, which puts you ahead of your target completion date by <span className="text-white font-bold">{daysDelta} days</span>.
                  </>
                ) : (
                  <>
                    You are studying right on track to hit your target by <span className="text-emerald-400 font-bold">{targetDateStr}</span>. Keep up this daily pace of <span className="text-white font-bold">+{prediction.actual_daily?.toFixed(2)}%</span>!
                  </>
                )}
              </div>
            </div>
          </GlassCard>
        </motion.div>
      )}

      {/* ③ Goal Configuration Card */}
      {goal && !isEditingGoal ? (
        <GlassCard className="relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-[10px] font-black tracking-widest text-purple-400 uppercase">Preparation Plan</span>
              <h3 className="text-sm sm:text-base font-bold text-white mt-1">{goal.name || goal.title}</h3>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsEditingGoal(true)}
                className="px-2.5 py-1 rounded-xl bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.08] text-[10px] font-bold text-purple-300 transition"
              >
                Configure
              </button>
              <StatusBadge variant="accent">{goal.exam || "Active"}</StatusBadge>
            </div>
          </div>
          <div className="flex items-center justify-between text-[10px] text-gray-500 mb-3">
            <span>Started: {new Date(goal.created_at).toLocaleDateString()}</span>
            <span>Target Hours: {goal.available_hours_per_day} hr/day</span>
          </div>
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
                  {isEditingGoal ? "Override Target Goal" : "Set Your Goal"}
                </h2>
                <p className="text-[10px] text-gray-500">Configure your target exam, deadline, and daily hours.</p>
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
                placeholder="e.g. Crack JEE Physics, Master Coding Interviews"
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
              {submittingGoal ? "Setting goal..." : "Initialize Goal Engine ⚡"}
            </button>
          </form>
        </GlassCard>
      )}

      {/* ④ Daily Check-in & Single-Tap Emoji Arrival Ritual Card */}
      {goal && !isEditingGoal && (
        <GlassCard padding="p-5" className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Smile className="text-purple-400" size={18} />
              <h3 className="text-sm font-bold text-white">Daily Arrival & Energy Ritual</h3>
            </div>
            <button
              onClick={() => setShowTelemetryForm(!showTelemetryForm)}
              className="text-[11px] font-semibold text-purple-300 hover:text-purple-200"
            >
              {showTelemetryForm ? "Collapse" : "Expand"}
            </button>
          </div>

          <AnimatePresence>
            {showTelemetryForm && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: "auto" }}
                exit={{ height: 0 }}
                className="overflow-hidden space-y-4 pt-2 border-t border-white/[0.04]"
              >
                {/* Single-Tap Emoji Ritual */}
                <div className="space-y-2">
                  <span className="text-[11px] font-extrabold text-purple-300 uppercase tracking-wider block">
                    How are you arriving today?
                  </span>
                  <div className="grid grid-cols-4 gap-2">
                    {IdentityEngine.getOptions().map((opt) => {
                      const selected = mood === opt.key;
                      return (
                        <button
                          key={opt.key}
                          type="button"
                          onClick={() => {
                            setMood(opt.key);
                            setEnergy(opt.prefillEnergy);
                            setFocus(opt.prefillFocus);
                          }}
                          className={`p-3 rounded-2xl flex flex-col items-center gap-1 border transition-all ${
                            selected
                              ? "bg-purple-600/30 border-purple-400 text-white scale-105 shadow-lg"
                              : "bg-white/[0.03] border-white/10 text-gray-400 hover:bg-white/[0.07]"
                          }`}
                        >
                          <span className="text-2xl">{opt.emoji}</span>
                          <span className="text-[10px] font-bold">{opt.label}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Daksh State Naming Banner */}
                  {(() => {
                    const moodDetails = IdentityEngine.getMoodDetails(mood);
                    return (
                      <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-500/20 text-xs text-purple-200 space-y-1">
                        <div className="flex items-center gap-1.5 font-bold text-purple-300">
                          <Sparkles size={13} />
                          <span>Daksh State: {moodDetails.dakshName}</span>
                        </div>
                        <p className="text-gray-300 leading-snug">{moodDetails.message}</p>
                      </div>
                    );
                  })()}
                </div>

                <form onSubmit={handleLogTelemetry} className="space-y-3">
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div>
                      <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                        <span>Energy</span>
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
                      <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                        <span>Focus</span>
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
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="submit"
                      disabled={loggingTelemetry}
                      className="flex-1 py-2.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 text-xs font-bold transition disabled:opacity-50 border border-purple-500/30"
                    >
                      {loggingTelemetry ? "Syncing..." : "Log Daily State ✨"}
                    </button>

                    <button
                      type="button"
                      onClick={handleShareToFeed}
                      disabled={sharing}
                      className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold transition disabled:opacity-50 flex items-center justify-center gap-1.5 shadow-md"
                    >
                      <Share2 size={13} />
                      <span>{sharing ? "Posting..." : "Post Progress to Feed"}</span>
                    </button>
                  </div>

                  {telemetryMessage && (
                    <p className="text-center text-[10px] text-purple-400 font-medium animate-pulse">{telemetryMessage}</p>
                  )}
                  {shareMessage && (
                    <p className="text-center text-[10px] text-emerald-400 font-medium animate-pulse">{shareMessage}</p>
                  )}
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </GlassCard>
      )}
    </div>
  );
}
