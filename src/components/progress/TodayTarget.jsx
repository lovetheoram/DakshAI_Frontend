import React, { useState, useEffect } from "react";
import { 
  Trophy, Target, Calendar, Share2, Sparkles, BookOpen, Clock, 
  Activity, Smile, Zap, ChevronRight, Check, AlertCircle, RefreshCw
} from "lucide-react";
import progressApi from "../../api/progressApi";
import syllabusApi from "../../api/syllabusApi";

export default function TodayTarget() {
  const [goal, setGoal] = useState(null);
  const [target, setTarget] = useState(null);
  const [streakStats, setStreakStats] = useState(null);
  const [diary, setDiary] = useState([]);
  const [exams, setExams] = useState([]);
  
  // Loading states
  const [loadingGoal, setLoadingGoal] = useState(true);
  const [submittingGoal, setSubmittingGoal] = useState(false);
  const [loggingTelemetry, setLoggingTelemetry] = useState(false);
  const [loggingRevision, setLoggingRevision] = useState(false);
  const [sharing, setSharing] = useState(false);

  // Form states
  const [setupGoalName, setSetupGoalName] = useState("Become Interview Ready");
  const [setupExamId, setSetupExamId] = useState("");
  const [setupTargetDate, setSetupTargetDate] = useState("");
  const [setupHours, setSetupHours] = useState(2.0);

  // Telemetry logs
  const [energy, setEnergy] = useState(70);
  const [focus, setFocus] = useState(80);
  const [mood, setMood] = useState("motivated");

  // Revision input
  const [revMinutes, setRevMinutes] = useState("");

  // UI Messages
  const [telemetryMessage, setTelemetryMessage] = useState("");
  const [revisionMessage, setRevisionMessage] = useState("");
  const [shareMessage, setShareMessage] = useState("");
  const [wizardError, setWizardError] = useState("");

  const loadAllData = async () => {
    try {
      setLoadingGoal(true);
      const dashboardData = await progressApi.getDashboard();
      
      if (dashboardData.goal) {
        setGoal(dashboardData.goal);
        setTarget(dashboardData.target);
        setStreakStats(dashboardData.streak_stats);
        setDiary(dashboardData.diary || []);
        
        // Prefill telemetry from today's diary if available
        const todayStr = new Date().toISOString().split("T")[0];
        const todayEntry = (dashboardData.diary || []).find(e => e.date === todayStr);
        if (todayEntry) {
          setEnergy(todayEntry.energy_score);
          setFocus(todayEntry.focus_score);
          setMood(todayEntry.mood);
        }
      } else {
        setGoal(null);
        setExams(dashboardData.exams || []);
        if (dashboardData.exams && dashboardData.exams.length > 0) {
          setSetupExamId(dashboardData.exams[0].id);
        }
        
        // Pre-fill target date (120 days from now)
        const dateOffset = 120 * 24 * 60 * 60 * 1000;
        const targetD = new Date(Date.now() + dateOffset);
        setSetupTargetDate(targetD.toISOString().split("T")[0]);
      }
    } catch (err) {
      console.error("Error loading growth OS dashboard data:", err);
    } finally {
      setLoadingGoal(false);
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
    } catch (err) {
      console.error(err);
      setWizardError(err.response?.data?.detail || "Failed to save goal configuration.");
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
      // Refresh dashboard data
      const dashboardData = await progressApi.getDashboard();
      if (dashboardData.goal) {
        setTarget(dashboardData.target);
        setDiary(dashboardData.diary || []);
        setStreakStats(dashboardData.streak_stats);
      }
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
      setRevisionMessage(`Logged ${revMinutes} revision minutes! (+0.1% Growth Added) 📚`);
      setRevMinutes("");
      // Refresh dashboard data
      const dashboardData = await progressApi.getDashboard();
      if (dashboardData.goal) {
        setTarget(dashboardData.target);
        setDiary(dashboardData.diary || []);
        setStreakStats(dashboardData.streak_stats);
      }
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
      const res = await progressApi.shareDailyTarget();
      setShareMessage("Successfully posted card to Feed! 🚀");
      setTimeout(() => setShareMessage(""), 4000);
    } catch (err) {
      console.error(err);
      setShareMessage("Failed to share growth card.");
    } finally {
      setSharing(false);
    }
  };

  if (loadingGoal) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-white">
        <RefreshCw className="animate-spin text-purple-400 mb-3" size={32} />
        <p className="text-gray-400 text-sm">Quantifying growth telemetry...</p>
      </div>
    );
  }

  // Setup Wizard view if no goal configured
  if (!goal) {
    return (
      <div className="w-full max-w-2xl mx-auto rounded-3xl bg-slate-900/60 backdrop-blur-xl border border-white/10 shadow-2xl p-8 sm:p-10 text-white">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-3 bg-purple-500/20 rounded-2xl">
            <Target className="text-purple-400" size={28} />
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Configure Your Behavioral growth OS</h2>
            <p className="text-xs text-gray-400">DakshAI recalculates targets dynamically to align with your deadlines.</p>
          </div>
        </div>

        {wizardError && (
          <div className="mb-5 flex items-center space-x-2 text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-sm">
            <AlertCircle size={18} />
            <span>{wizardError}</span>
          </div>
        )}

        <form onSubmit={handleCreateGoal} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-1.5">Preparation Goal Name</label>
            <input 
              type="text" 
              value={setupGoalName}
              onChange={(e) => setSetupGoalName(e.target.value)}
              placeholder="e.g. Become Interview Ready, Master JEE Physics"
              className="w-full px-4 py-3 bg-slate-950/60 rounded-xl border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition text-sm"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-1.5">Select Syllabus/Exam</label>
              <select 
                value={setupExamId}
                onChange={(e) => setSetupExamId(e.target.value)}
                className="w-full px-4 py-3 bg-slate-950/60 rounded-xl border border-white/10 text-white focus:outline-none focus:border-purple-500 transition text-sm"
                required
              >
                {exams.map(exam => (
                  <option key={exam.id} value={exam.id}>{exam.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-1.5">Target Completion Date</label>
              <input 
                type="date" 
                value={setupTargetDate}
                onChange={(e) => setSetupTargetDate(e.target.value)}
                className="w-full px-4 py-3 bg-slate-950/60 rounded-xl border border-white/10 text-white focus:outline-none focus:border-purple-500 transition text-sm"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-1.5">Available Hours / Day: <span className="text-purple-400 font-bold">{setupHours} hrs</span></label>
            <input 
              type="range" 
              min="1" 
              max="12" 
              step="0.5"
              value={setupHours}
              onChange={(e) => setSetupHours(parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-purple-500"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>1 hr</span>
              <span>6 hrs</span>
              <span>12 hrs</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={submittingGoal}
            className="w-full flex items-center justify-center py-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg transition active:scale-[0.98] disabled:opacity-50 text-sm mt-3"
          >
            {submittingGoal ? "Quantifying Deadlines..." : "Initialize Growth OS Engine ⚡"}
          </button>
        </form>
      </div>
    );
  }

  // Calculate remaining days for UI
  const targetDateObj = new Date(goal.target_date);
  const todayObj = new Date();
  const diffTime = targetDateObj - todayObj;
  const remainingDays = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  // Circle metrics
  const percent = target ? Math.min(100, (target.completed_growth / target.target_growth) * 100) : 0;
  const radius = 64;
  const strokeWidth = 9;
  const normalizedRadius = radius - strokeWidth * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percent / 100) * circumference;

  return (
    <div className="w-full max-w-6xl mx-auto text-white space-y-6">
      
      {/* Dynamic Philosophy Header */}
      <div className="rounded-3xl p-6 md:p-8 bg-gradient-to-r from-purple-900/60 via-slate-900/60 to-slate-900/60 border border-white/10 backdrop-blur-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1.5 text-center md:text-left">
          <h1 className="text-xl md:text-2xl font-extrabold flex items-center justify-center md:justify-start gap-2">
            <span>Daksh score: </span>
            <span className="text-purple-400 font-black text-2xl md:text-3xl">{streakStats ? `${streakStats.daksh_score}%` : "0%"}</span>
          </h1>
          <p className="text-xs text-purple-200/80 italic font-medium max-w-md">
            "You don't chase success. You grow by a measurable percentage every day."
          </p>
          <div className="flex items-center justify-center md:justify-start space-x-4 text-xs text-gray-400 mt-3">
            <span className="flex items-center gap-1"><BookOpen size={13} className="text-indigo-400" /> Goal: {goal.goal_name}</span>
            <span className="flex items-center gap-1"><Clock size={13} className="text-indigo-400" /> Remaining: {remainingDays} Days</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
          <div className="px-5 py-3 rounded-2xl bg-white/5 border border-white/5 text-center">
            <span className="text-xs text-gray-400 block mb-0.5">Consistency Streak</span>
            <span className="text-xl font-bold flex items-center justify-center gap-1 text-purple-400">
              <Calendar size={18} className="text-purple-400" />
              {streakStats ? `${streakStats.growth_streak} Days` : "0 Days"}
            </span>
          </div>
          <div className="px-5 py-3 rounded-2xl bg-white/5 border border-white/5 text-center">
            <span className="text-xs text-gray-400 block mb-0.5">Dynamic Prediction</span>
            <span className="text-xl font-bold text-emerald-400">
              {streakStats && streakStats.predicted_remaining_days ? `Ready in ${streakStats.predicted_remaining_days}d` : `${remainingDays} Days`}
            </span>
          </div>
        </div>
      </div>

      {/* Main Quota Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: Today's Quota (2 cols on lg) */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="rounded-3xl p-6 bg-slate-900/60 border border-white/10 backdrop-blur-xl space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Target className="text-purple-400" size={20} />
                Today's Mission
              </h2>
              {target && (
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300">
                  Target Required: +{target.target_growth.toFixed(2)}%
                </span>
              )}
            </div>

            {target && (
              <div className="flex flex-col md:flex-row items-center gap-8 py-4 px-4 bg-white/5 rounded-2xl border border-white/5">
                
                {/* Circular indicator */}
                <div className="relative flex items-center justify-center">
                  <svg height={radius * 2} width={radius * 2} className="transform -rotate-90">
                    {/* Background Circle */}
                    <circle
                      stroke="rgba(255,255,255,0.06)"
                      fill="transparent"
                      strokeWidth={strokeWidth}
                      r={normalizedRadius}
                      cx={radius}
                      cy={radius}
                    />
                    {/* Progress Circle with Linear Gradient */}
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#818cf8" />
                        <stop offset="100%" stopColor="#c084fc" />
                      </linearGradient>
                    </defs>
                    <circle
                      stroke="url(#gradient)"
                      fill="transparent"
                      strokeWidth={strokeWidth}
                      strokeDasharray={circumference + " " + circumference}
                      style={{ strokeDashoffset }}
                      strokeLinecap="round"
                      r={normalizedRadius}
                      cx={radius}
                      cy={radius}
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center justify-center">
                    <span className="text-2xl font-black">{percent.toFixed(0)}%</span>
                    <span className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Quota</span>
                  </div>
                </div>

                <div className="flex-1 space-y-3 w-full">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Current Growth Today</span>
                    <span className="font-bold text-purple-300">+{target.completed_growth.toFixed(3)}%</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Remaining to Quota</span>
                    <span className="font-bold text-white">
                      +{Math.max(0, target.target_growth - target.completed_growth).toFixed(3)}%
                    </span>
                  </div>

                  {/* Message prompt */}
                  <div className="text-xs text-purple-200/60 bg-purple-500/5 border border-purple-500/10 rounded-lg p-2.5 mt-2">
                    💡 <span className="font-medium text-purple-300">How to grow:</span> Practice any concept in the Skill Tree or log revision below. Your growth increments mathematically with each concept mastery gain.
                  </div>
                </div>
              </div>
            )}

            {/* Actions: Log Revision and Share */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Log Revision Box */}
              <div className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-3">
                <div className="flex items-center space-x-2 text-sm font-semibold">
                  <Clock className="text-indigo-400" size={18} />
                  <span>Log Revision Session</span>
                </div>
                <form onSubmit={handleLogRevision} className="flex space-x-2">
                  <input
                    type="number"
                    value={revMinutes}
                    onChange={(e) => setRevMinutes(e.target.value)}
                    placeholder="Minutes (e.g. 20)"
                    className="flex-1 px-3 py-2 bg-slate-950/60 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition text-xs"
                    disabled={loggingRevision}
                  />
                  <button
                    type="submit"
                    disabled={loggingRevision}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition text-xs flex items-center justify-center disabled:opacity-50"
                  >
                    Log 📚
                  </button>
                </form>
                {revisionMessage && (
                  <p className="text-[11px] text-indigo-300 animate-pulse font-medium">{revisionMessage}</p>
                )}
              </div>

              {/* Share Card to Social Box */}
              <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center space-x-2 text-sm font-semibold mb-1">
                    <Share2 className="text-purple-400" size={18} />
                    <span>Social Feedback Loop</span>
                  </div>
                  <p className="text-xs text-gray-400">Share today's quantified progress card to the social learning feed.</p>
                </div>
                <div>
                  <button
                    onClick={handleShareToFeed}
                    disabled={sharing}
                    className="w-full py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl transition text-xs flex items-center justify-center gap-1.5 disabled:opacity-50"
                  >
                    <Share2 size={13} />
                    {sharing ? "Publishing card..." : "Share Growth to Feed 🚀"}
                  </button>
                  {shareMessage && (
                    <p className="text-[11px] text-purple-300 mt-2 text-center animate-pulse font-medium">{shareMessage}</p>
                  )}
                </div>
              </div>

            </div>

          </div>

          {/* Daily Diary / Preparation Autobiography logs */}
          <div className="rounded-3xl p-6 bg-slate-900/60 border border-white/10 backdrop-blur-xl space-y-4">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <BookOpen className="text-purple-400" size={20} />
              Smart Diary & Telemetry Logs
            </h2>
            <p className="text-xs text-gray-400">
              A historical log of your consistency, self-reported cognitive states, and knowledge accumulation.
            </p>

            <div className="space-y-3 overflow-y-auto max-h-[300px] pr-1">
              {diary.length === 0 ? (
                <div className="text-center py-8 text-gray-500 text-sm">
                  No telemetry logged yet. Master concepts to fill this diary!
                </div>
              ) : (
                diary.map((entry) => {
                  const items = Object.entries(entry.knowledge_gain || {});
                  return (
                    <div key={entry.id} className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-2 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-gray-300 text-sm">{entry.date}</span>
                        <span className="font-black text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-md border border-purple-500/20 text-xs">
                          +{entry.daily_growth_percentage.toFixed(2)}% Growth
                        </span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-gray-400">
                        <div>Solved: <span className="font-semibold text-white">{entry.questions_solved} MCQs</span></div>
                        <div>Accuracy: <span className="font-semibold text-white">{(entry.accuracy * 100).toFixed(0)}%</span></div>
                        <div>Energy: <span className="font-semibold text-white">{entry.energy_score}%</span></div>
                        <div>Focus: <span className="font-semibold text-white">{entry.focus_score}%</span></div>
                      </div>
                      <div className="flex flex-wrap items-center gap-1.5 mt-2">
                        <span className="text-gray-500">Mood:</span>
                        <span className="px-2 py-0.5 rounded bg-white/10 text-white font-medium capitalize text-[10px]">
                          {entry.mood}
                        </span>
                        {items.length > 0 && (
                          <>
                            <span className="text-gray-500 ml-1">Gain:</span>
                            {items.map(([sub, count]) => (
                              <span key={sub} className="px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[10px]">
                                {sub} +{count}
                              </span>
                            ))}
                          </>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

        </div>

        {/* Right Side: Battery, Streak, Telemetry form (1 col on lg) */}
        <div className="space-y-6">
          
          {/* Daily Growth Battery */}
          <div className="rounded-3xl p-6 bg-slate-900/60 border border-white/10 backdrop-blur-xl space-y-4">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <Zap className="text-purple-400" size={20} />
              Growth Battery
            </h2>
            <div className="space-y-3.5">
              
              {/* Battery Metrics */}
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1 text-gray-300">
                  <span className="flex items-center gap-1"><BookOpen size={12} className="text-blue-400" /> Knowledge Mastery</span>
                  <span>{streakStats ? `${(streakStats.daksh_score * 1.2).toFixed(0)}%` : "0%"}</span>
                </div>
                <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-white/5">
                  <div 
                    className="h-full bg-blue-500 rounded-full transition-all duration-500" 
                    style={{ width: `${Math.min(100, streakStats ? streakStats.daksh_score * 1.2 : 0)}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1 text-gray-300">
                  <span className="flex items-center gap-1"><Target size={12} className="text-purple-400" /> Problem Solving accuracy</span>
                  <span>
                    {diary.length > 0 
                      ? `${(diary.reduce((acc, curr) => acc + curr.accuracy, 0) / diary.length * 100).toFixed(0)}%` 
                      : "80%"}
                  </span>
                </div>
                <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-white/5">
                  <div 
                    className="h-full bg-purple-500 rounded-full transition-all duration-500" 
                    style={{ 
                      width: `${
                        diary.length > 0 
                          ? (diary.reduce((acc, curr) => acc + curr.accuracy, 0) / diary.length * 100) 
                          : 80
                      }%` 
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1 text-gray-300">
                  <span className="flex items-center gap-1"><Calendar size={12} className="text-purple-400" /> Consistency Compliance</span>
                  <span>{streakStats ? `${streakStats.week_compliance}%` : "0%"}</span>
                </div>
                <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-white/5">
                  <div 
                    className="h-full bg-orange-500 rounded-full transition-all duration-500" 
                    style={{ width: `${streakStats ? streakStats.week_compliance : 0}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1 text-gray-300">
                  <span className="flex items-center gap-1"><Activity size={12} className="text-emerald-400" /> Cognitive energy</span>
                  <span>{energy}%</span>
                </div>
                <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-white/5">
                  <div 
                    className="h-full bg-emerald-500 rounded-full transition-all duration-500" 
                    style={{ width: `${energy}%` }}
                  />
                </div>
              </div>

            </div>
          </div>

          {/* Today's Cognitive Logging form */}
          <div className="rounded-3xl p-6 bg-slate-900/60 border border-white/10 backdrop-blur-xl space-y-4">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <Smile className="text-purple-400" size={20} />
              Log Daily Telemetry
            </h2>
            <p className="text-xs text-gray-400">
              Correlate cognitive energy & mood with learning speed and correctness.
            </p>

            <form onSubmit={handleLogTelemetry} className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1.5">
                  <span>Energy level</span>
                  <span className="text-purple-400 font-bold">{energy}%</span>
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
                <div className="flex justify-between text-xs font-semibold mb-1.5">
                  <span>Focus capability</span>
                  <span className="text-purple-400 font-bold">{focus}%</span>
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
                <label className="block text-xs font-semibold mb-1.5">Current mood</label>
                <select
                  value={mood}
                  onChange={(e) => setMood(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-purple-500 transition"
                >
                  <option value="motivated">Motivated 🔥</option>
                  <option value="focused">Focused 🎯</option>
                  <option value="calm">Calm 🧘</option>
                  <option value="tired">Tired 🥱</option>
                  <option value="stressed">Stressed 😰</option>
                  <option value="happy">Happy 😊</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loggingTelemetry}
                className="w-full py-2.5 bg-white/10 hover:bg-white/15 text-white font-bold rounded-xl text-xs transition active:scale-[0.98] disabled:opacity-50"
              >
                {loggingTelemetry ? "Logging telemetry..." : "Save Today's Telemetry ✨"}
              </button>

              {telemetryMessage && (
                <p className="text-center text-xs text-purple-300 font-medium animate-pulse">{telemetryMessage}</p>
              )}
            </form>
          </div>

        </div>

      </div>

    </div>
  );
}
