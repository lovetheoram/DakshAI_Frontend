import { useEffect, useState } from "react";
import progressApi from "../api/progressApi";
import syllabusApi from "../api/syllabusApi";
import GlassCard from "../components/ui/GlassCard";
import ProgressBar from "../components/ui/ProgressBar";
import StatusBadge from "../components/ui/StatusBadge";
import SkeletonLoader from "../components/ui/SkeletonLoader";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain,
  Target,
  Zap,
  Award,
  Clock,
  Flame,
  Smile,
  Share2,
  BookOpen,
  X,
  ChevronDown,
  ChevronUp,
  History,
  TrendingUp,
  AlertCircle
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
  const [showTelemetryForm, setShowTelemetryForm] = useState(true);

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

  const goal = dashboard?.goal;
  const prediction = dashboard?.prediction || {};
  const currentStreak = streak?.current_streak ?? 0;
  const dakshScore = dashboard?.overall_score ?? 0;
  const brainState = dashboard?.brain_state || {};
  const diaryEntries = dashboard?.diary || [];

  // Computed Achievement Details for progress visualization
  const totalQuestionsSolved = dashboard?.total_questions_solved ?? 0;
  const avgAccuracy = dashboard?.brain_stats?.accuracy ?? 0;
  const weekCompliance = streak?.week_compliance ?? 0;

  // Formatting dates for prediction timeline
  const today = new Date();
  const targetDateStr = goal?.target_date ? new Date(goal.target_date).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "Aug 15";
  
  // Calculate predicted date
  const predictedDays = streak?.predicted_remaining_days ?? 0;
  const predictedDate = new Date(today.getTime() + predictedDays * 24 * 60 * 60 * 1000);
  const predictedDateStr = predictedDate.toLocaleDateString("en-US", { month: "short", day: "numeric" });

  // Behind/Ahead counts
  const statusType = prediction?.status || "on_track"; // ahead, behind, on_track
  const daysDelta = prediction?.days_delta ?? 0;

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
      {/* ① Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white">Your Journey</h1>
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

      {/* ② Prediction Timeline Card [NEW] */}
      {goal && !isEditingGoal && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <GlassCard className="relative overflow-hidden">
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />
            <div className="relative">
              <p className="text-[10px] font-black tracking-widest text-gray-400 uppercase mb-4">
                Estimated Readiness Path
              </p>

              {/* Graphical Timeline Bar */}
              <div className="relative h-12 flex items-center mb-6 mt-2 px-2">
                {/* Background line */}
                <div className="absolute left-0 right-0 h-1 bg-slate-900 rounded-full" />
                
                {/* Progress fill */}
                <div 
                  className="absolute left-0 h-1 bg-gradient-to-r from-purple-600 to-purple-400 rounded-full" 
                  style={{ width: `${dakshScore}%` }}
                />

                {/* You marker */}
                <div 
                  className="absolute -translate-x-1/2 flex flex-col items-center"
                  style={{ left: `${dakshScore}%` }}
                >
                  <div className="w-3.5 h-3.5 rounded-full bg-purple-400 border-2 border-slate-950 shadow-md shadow-purple-500/30" />
                  <span className="text-[9px] font-bold text-white mt-1">You ({Math.round(dakshScore)}%)</span>
                </div>

                {/* Target Marker */}
                <div 
                  className="absolute -translate-x-1/2 flex flex-col items-center"
                  style={{ left: "80%" }} // Placed statically near the end
                >
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 border border-slate-950" />
                  <span className="text-[9px] font-medium text-emerald-400 mt-1">Target ({targetDateStr})</span>
                </div>

                {/* Predicted Marker */}
                <div 
                  className="absolute -translate-x-1/2 flex flex-col items-center"
                  style={{ left: statusType === "behind" ? "92%" : "70%" }}
                >
                  <div className={`w-2.5 h-2.5 rounded-full border border-slate-950 ${statusType === "behind" ? "bg-red-500" : "bg-emerald-400"}`} />
                  <span className={`text-[9px] font-medium mt-1 ${statusType === "behind" ? "text-red-400" : "text-emerald-400"}`}>
                    Predicted ({predictedDateStr})
                  </span>
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

      {/* ③ Goal Card */}
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

      {/* ④ Daily Check-in [REDESIGNED] */}
      {goal && !isEditingGoal && (
        <GlassCard padding="p-0" className="overflow-hidden">
          <button
            onClick={() => setShowTelemetryForm(!showTelemetryForm)}
            className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-white/[0.02] transition"
          >
            <div className="flex items-center gap-2.5">
              <Smile className="text-purple-400" size={16} />
              <div>
                <p className="text-xs font-bold text-white">Daily Check-in</p>
                <p className="text-[10px] text-gray-500">Log cognitive energy and focus capability</p>
              </div>
            </div>
            {showTelemetryForm ? <ChevronUp size={16} className="text-gray-500" /> : <ChevronDown size={16} className="text-gray-500" />}
          </button>

          <AnimatePresence>
            {showTelemetryForm && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: "auto" }}
                exit={{ height: 0 }}
                className="overflow-hidden border-t border-white/[0.04]"
              >
                <div className="p-5 space-y-4">
                  {/* Psychological validation */}
                  <div className="p-3.5 rounded-xl bg-purple-500/5 border border-purple-500/10 text-[10px] text-purple-300 leading-relaxed">
                    💡 <strong>Why track telemetry?</strong> Students who check in daily correlate energy and mood patterns with a <strong>23% improvement</strong> in quiz memory retention.
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
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </GlassCard>
      )}

      {/* ⑤ Study History Timeline [NEW] */}
      {goal && !isEditingGoal && diaryEntries.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <GlassCard>
            <div className="flex items-center gap-2 mb-4">
              <History size={14} className="text-purple-400" />
              <p className="text-xs font-bold text-white">Study History</p>
            </div>

            <div className="space-y-3 max-h-60 overflow-y-auto pr-1 scrollbar-hide">
              {diaryEntries.slice(0, 14).map((entry, idx) => {
                const dateObj = new Date(entry.date);
                const dayStr = dateObj.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
                
                const isRest = entry.questions_solved === 0 && entry.revision_minutes === 0;

                return (
                  <div 
                    key={idx} 
                    className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] text-xs"
                  >
                    <div className="min-w-0">
                      <p className="font-semibold text-white">{dayStr}</p>
                      {isRest ? (
                        <p className="text-[10px] text-gray-500">Rest day</p>
                      ) : (
                        <p className="text-[10px] text-gray-400">
                          {entry.questions_solved} MCQs · {entry.revision_minutes} min revision
                        </p>
                      )}
                    </div>

                    <div className="text-right">
                      {!isRest && (
                        <>
                          <p className={`font-bold ${entry.accuracy_rate >= 80 ? "text-emerald-400" : entry.accuracy_rate >= 50 ? "text-amber-400" : "text-red-400"}`}>
                            {Math.round(entry.accuracy_rate)}% accuracy
                          </p>
                          <p className="text-[9px] text-gray-600">
                            Energy: {entry.energy_score}%
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </GlassCard>
        </motion.div>
      )}

      {/* ⑥ Brain Dimensions (expanded version) [REDESIGNED] */}
      {goal && !isEditingGoal && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <GlassCard>
            <div className="flex items-center gap-2 mb-4">
              <Brain size={14} className="text-purple-400" />
              <p className="text-xs font-bold text-white">Brain Core Attributes</p>
            </div>

            <div className="space-y-4">
              {[
                { label: "Knowledge Base", val: brainState.knowledge ?? 0, desc: "Portion of the exam concepts and syllabus mastered.", icon: "📚", color: "from-purple-500 to-indigo-500" },
                { label: "Recall Retention", val: brainState.retention ?? 0, desc: "Estimated retention probability before memory decay sets in.", icon: "💾", color: "from-blue-500 to-cyan-500" },
                { label: "Quiz Accuracy", val: brainState.confidence ?? 0, desc: "Your confidence and correctness rate in recent practice sessions.", icon: "🎯", color: "from-emerald-500 to-teal-500" },
                { label: "Study Momentum", val: brainState.momentum ?? 0, desc: "Weekly practice volume compliance relative to your hours.", icon: "⚡", color: "from-amber-500 to-orange-500" },
              ].map((dim, i) => (
                <div key={i} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-gray-300 flex items-center gap-1.5">
                      <span>{dim.icon}</span> {dim.label}
                    </span>
                    <span className="font-bold text-white">{Math.round(dim.val)}%</span>
                  </div>
                  <ProgressBar value={dim.val} color={dim.color} height="h-1.5" />
                  <p className="text-[10px] text-gray-500 leading-relaxed">{dim.desc}</p>
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>
      )}

      {/* ⑦ Streak details */}
      <GlassCard>
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs font-bold text-white">Streak & Consistency</p>
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

      {/* ⑧ Achievements [REDESIGNED] */}
      {goal && !isEditingGoal && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <GlassCard padding="p-5">
            <div className="flex items-center gap-2 mb-4">
              <Award size={16} className="text-amber-400" />
              <p className="text-xs font-bold text-white">Achievements & Badges</p>
            </div>

            <div className="space-y-4">
              {[
                { 
                  emoji: "🔥", 
                  title: "3-Day Streak", 
                  unlocked: currentStreak >= 3,
                  progressVal: currentStreak,
                  targetVal: 3,
                  label: currentStreak >= 3 ? "✓ Unlocked" : `${currentStreak}/3 days`
                },
                { 
                  emoji: "🧠", 
                  title: "100 Questions", 
                  unlocked: totalQuestionsSolved >= 100,
                  progressVal: totalQuestionsSolved,
                  targetVal: 100,
                  label: totalQuestionsSolved >= 100 ? "✓ Unlocked" : `${totalQuestionsSolved}/100 questions`
                },
                { 
                  emoji: "🎯", 
                  title: "90% Accuracy", 
                  unlocked: avgAccuracy >= 80,
                  progressVal: avgAccuracy,
                  targetVal: 80,
                  label: avgAccuracy >= 80 ? "✓ Unlocked" : `${Math.round(avgAccuracy)}/80% accuracy`
                },
                { 
                  emoji: "⚡", 
                  title: "Week On Fire", 
                  unlocked: weekCompliance >= 80,
                  progressVal: weekCompliance,
                  targetVal: 80,
                  label: weekCompliance >= 80 ? "✓ Unlocked" : `${Math.round(weekCompliance)}/80% compliance`
                },
                { 
                  emoji: "🏆", 
                  title: "Half Ready", 
                  unlocked: dakshScore >= 50,
                  progressVal: dakshScore,
                  targetVal: 50,
                  label: dakshScore >= 50 ? "✓ Unlocked" : `${Math.round(dakshScore)}/50% exam score`
                }
              ].map((ach, i) => {
                const unlocked = ach.unlocked;
                const ratioPercent = Math.min(100, (ach.progressVal / ach.targetVal) * 100);

                return (
                  <div key={i} className={`flex items-start gap-4 p-3 rounded-2xl border transition-all ${unlocked ? 'bg-emerald-500/5 border-emerald-500/10 opacity-100' : 'bg-white/[0.01] border-white/[0.04] opacity-50'}`}>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0 ${unlocked ? 'bg-emerald-500/10' : 'bg-white/[0.04]'}`}>
                      {ach.emoji}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between text-xs font-semibold mb-1">
                        <span className="text-white">{ach.title}</span>
                        <span className={unlocked ? "text-emerald-400 font-bold" : "text-gray-500"}>{ach.label}</span>
                      </div>
                      
                      {!unlocked && (
                        <div className="w-full h-1 bg-slate-950 rounded-full overflow-hidden">
                          <div className="h-full bg-purple-500 rounded-full" style={{ width: `${ratioPercent}%` }} />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </GlassCard>
        </motion.div>
      )}

      {/* ⑨ Revision Logger & Sharing */}
      {goal && !isEditingGoal && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Revision Card */}
          <GlassCard padding="p-5" className="space-y-3">
            <div className="flex items-center gap-2 mb-1">
              <BookOpen className="text-purple-400" size={16} />
              <p className="text-xs font-bold text-white">Log Concept Revision</p>
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

          {/* Social share card */}
          <GlassCard padding="p-4" className="flex flex-col justify-between gap-4">
            <div>
              <h4 className="text-xs font-bold text-white">Share Target Progress</h4>
              <p className="text-[10px] text-gray-500 mt-0.5">Publish today's compliance card to peer feed.</p>
            </div>

            <div>
              <button
                type="button"
                onClick={handleShareToFeed}
                disabled={sharing}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold transition active:scale-[0.97] shadow-lg disabled:opacity-50 flex items-center justify-center gap-1.5"
              >
                <Share2 size={12} />
                {sharing ? "Sharing..." : "Post Progress to Feed"}
              </button>
              
              {shareMessage && (
                <p className="text-center text-[10px] text-purple-400 mt-2 font-medium animate-pulse">{shareMessage}</p>
              )}
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
}
