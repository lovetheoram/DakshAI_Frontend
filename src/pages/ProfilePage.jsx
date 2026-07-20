import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import progressApi from "../api/progressApi";
import GlassCard from "../components/ui/GlassCard";
import StatusBadge from "../components/ui/StatusBadge";
import BrainStatus from "../components/home/BrainStatus";
import { motion } from "framer-motion";
import {
  User,
  Settings,
  LogOut,
  Award,
  BarChart3,
  BookOpen,
  ChevronRight,
  Bell,
  Sparkles,
  Rocket,
  History,
  CheckCircle2,
  Flame,
  Brain,
  Clock,
  TrendingUp,
  Zap
} from "lucide-react";

export default function ProfilePage() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState(null);
  const [streak, setStreak] = useState(null);
  const [diaryEntries, setDiaryEntries] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  // Tab State: 'history' | 'achievements' | 'analytics' | 'projects'
  const [activeTab, setActiveTab] = useState("history");

  useEffect(() => {
    const fetchProfileStats = async () => {
      try {
        const [dashData, streakData, diaryData] = await Promise.all([
          progressApi.getDashboard(),
          progressApi.getStreakStats(),
          progressApi.getDiary()
        ]);
        setDashboard(dashData);
        setStreak(streakData);
        
        const historyList = Array.isArray(diaryData) ? diaryData : (diaryData?.results || []);
        setDiaryEntries(historyList);
      } catch (err) {
        console.error("Failed to load profile telemetry:", err);
      } finally {
        setLoadingHistory(false);
      }
    };
    if (user) fetchProfileStats();
  }, [user]);

  const streakDays = streak?.current_streak || 0;
  const questionsSolved = dashboard?.total_questions_solved ?? 0;
  const masteredConcepts = dashboard?.concepts_mastered_count ?? 0;
  const avgAccuracy = dashboard?.brain_stats?.accuracy ?? 0;
  const weekCompliance = streak?.week_compliance ?? 0;
  const dakshScore = dashboard?.overall_score ?? 0;

  const achievementsList = [
    { 
      emoji: "🔥", 
      title: "3-Day Streak", 
      unlocked: streakDays >= 3,
      progressVal: streakDays,
      targetVal: 3,
      label: streakDays >= 3 ? "✓ Unlocked" : `${streakDays}/3 days`
    },
    { 
      emoji: "🧠", 
      title: "100 Questions Solved", 
      unlocked: questionsSolved >= 100,
      progressVal: questionsSolved,
      targetVal: 100,
      label: questionsSolved >= 100 ? "✓ Unlocked" : `${questionsSolved}/100 questions`
    },
    { 
      emoji: "🎯", 
      title: "High Accuracy Master", 
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
      title: "Halfway Exam Readiness", 
      unlocked: dakshScore >= 50,
      progressVal: dakshScore,
      targetVal: 50,
      label: dakshScore >= 50 ? "✓ Unlocked" : `${Math.round(dakshScore)}/50% readiness`
    }
  ];

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">
      
      {/* Identity Header Card */}
      <GlassCard glow className="text-center py-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <motion.div
          className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-2xl sm:text-3xl font-black text-white shadow-2xl shadow-purple-500/30 mb-3"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
        >
          {user?.username?.[0]?.toUpperCase() || "U"}
        </motion.div>

        <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">{user?.username || "Learner"}</h2>
        <p className="text-xs text-gray-400 mt-0.5">{user?.email || ""}</p>

        <div className="flex items-center justify-center gap-2 mt-3">
          <StatusBadge variant="accent" icon="⚡">Concept Builder</StatusBadge>
          <StatusBadge variant="success" icon="🎯">Target: JEE 2028</StatusBadge>
        </div>
      </GlassCard>

      {/* Segmented Sub-Navigation Tabs */}
      <div className="grid grid-cols-4 gap-1.5 p-1 rounded-2xl bg-slate-950/60 border border-white/[0.04] text-[11px] font-bold">
        <button
          onClick={() => setActiveTab("history")}
          className={`py-2 rounded-xl transition-all flex flex-col sm:flex-row items-center justify-center gap-1 ${
            activeTab === "history"
              ? "bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 shadow-md"
              : "text-gray-400 hover:text-white"
          }`}
        >
          <History size={13} />
          <span>History</span>
        </button>

        <button
          onClick={() => setActiveTab("achievements")}
          className={`py-2 rounded-xl transition-all flex flex-col sm:flex-row items-center justify-center gap-1 ${
            activeTab === "achievements"
              ? "bg-amber-600/20 text-amber-300 border border-amber-500/30 shadow-md"
              : "text-gray-400 hover:text-white"
          }`}
        >
          <Award size={13} />
          <span>Badges</span>
        </button>

        <button
          onClick={() => setActiveTab("analytics")}
          className={`py-2 rounded-xl transition-all flex flex-col sm:flex-row items-center justify-center gap-1 ${
            activeTab === "analytics"
              ? "bg-purple-600/20 text-purple-300 border border-purple-500/30 shadow-md"
              : "text-gray-400 hover:text-white"
          }`}
        >
          <Brain size={13} />
          <span>Analytics</span>
        </button>

        <button
          onClick={() => setActiveTab("projects")}
          className={`py-2 rounded-xl transition-all flex flex-col sm:flex-row items-center justify-center gap-1 ${
            activeTab === "projects"
              ? "bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 shadow-md"
              : "text-gray-400 hover:text-white"
          }`}
        >
          <Rocket size={13} />
          <span>Projects</span>
        </button>
      </div>

      {/* Tab 1: Study History & Activity Log (FULL TIMELINE) */}
      {activeTab === "history" && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
          <GlassCard padding="p-5" className="space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.04] pb-3">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <History size={18} className="text-indigo-400" />
                  <span>Study History Timeline</span>
                </h3>
                <p className="text-[10px] text-gray-400 mt-0.5">Your chronological learning sessions and revision history</p>
              </div>
              <span className="text-[10px] text-indigo-300 font-bold px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20">
                {diaryEntries.length} Sessions Logged
              </span>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto pr-1 scrollbar-hide">
              {loadingHistory ? (
                <p className="text-xs text-gray-400 text-center py-4 animate-pulse">Loading study history...</p>
              ) : diaryEntries.length > 0 ? (
                diaryEntries.map((entry, idx) => {
                  const dateObj = new Date(entry.date);
                  const dayStr = dateObj.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" });
                  const revisionMins = Math.round((entry.time_spent_seconds || 0) / 60) || entry.revision_minutes || 0;
                  const solvedCount = entry.questions_solved ?? 0;
                  const growthPercent = entry.daily_growth_percentage ?? 0;

                  return (
                    <div 
                      key={idx} 
                      className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:border-indigo-500/20 transition-all space-y-2"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <Clock size={14} className="text-indigo-400" />
                          <span className="font-bold text-white">{dayStr}</span>
                        </div>
                        {growthPercent > 0 && (
                          <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                            +{growthPercent.toFixed(2)}% Growth
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-gray-300 pt-1">
                        <span>{solvedCount} MCQs Solved · {revisionMins} min Revision</span>
                        <div className="flex items-center gap-3">
                          <span className="text-purple-300">Energy: {entry.energy_score ?? 70}%</span>
                          <span className="text-emerald-300">Accuracy: {Math.round(entry.accuracy_rate ?? 80)}%</span>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-6 text-xs text-gray-500 space-y-1">
                  <p className="font-semibold text-gray-400">No study history recorded yet.</p>
                  <p>Complete learning concepts or practice sessions to record your history.</p>
                </div>
              )}
            </div>
          </GlassCard>
        </motion.div>
      )}

      {/* Tab 2: Achievements & Badges */}
      {activeTab === "achievements" && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
          <GlassCard padding="p-5" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Award size={18} className="text-amber-400" />
                <span>Unlocked Achievements & Badges</span>
              </h3>
              <span className="text-[10px] text-amber-300 font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20">
                Milestones
              </span>
            </div>

            {/* Quick Stat Tiles */}
            <div className="grid grid-cols-3 gap-3 pt-1">
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] text-center">
                <Flame size={18} className="text-amber-400 mx-auto mb-1" />
                <span className="text-[10px] text-gray-400 block font-semibold uppercase">Daily Streak</span>
                <span className="text-xs font-black text-white mt-0.5 block">{streakDays} Days</span>
              </div>

              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] text-center">
                <CheckCircle2 size={18} className="text-emerald-400 mx-auto mb-1" />
                <span className="text-[10px] text-gray-400 block font-semibold uppercase">Mastered</span>
                <span className="text-xs font-black text-white mt-0.5 block">{masteredConcepts} Topics</span>
              </div>

              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] text-center">
                <Sparkles size={18} className="text-purple-400 mx-auto mb-1" />
                <span className="text-[10px] text-gray-400 block font-semibold uppercase">Questions</span>
                <span className="text-xs font-black text-white mt-0.5 block">{questionsSolved} Solved</span>
              </div>
            </div>

            {/* Full Detailed Achievement List */}
            <div className="space-y-2.5 pt-2 border-t border-white/[0.04]">
              {achievementsList.map((ach, i) => {
                const unlocked = ach.unlocked;
                const ratioPercent = Math.min(100, (ach.progressVal / ach.targetVal) * 100);

                return (
                  <div 
                    key={i} 
                    className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                      unlocked 
                        ? 'bg-amber-500/5 border-amber-500/20 opacity-100' 
                        : 'bg-white/[0.01] border-white/[0.04] opacity-65'
                    }`}
                  >
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-base flex-shrink-0 ${unlocked ? 'bg-amber-500/10' : 'bg-white/[0.04]'}`}>
                      {ach.emoji}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between text-xs font-semibold mb-1">
                        <span className="text-white">{ach.title}</span>
                        <span className={unlocked ? "text-amber-400 font-bold" : "text-gray-400"}>{ach.label}</span>
                      </div>
                      
                      {!unlocked && (
                        <div className="w-full h-1 bg-slate-950 rounded-full overflow-hidden">
                          <div className="h-full bg-amber-500 rounded-full" style={{ width: `${ratioPercent}%` }} />
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

      {/* Tab 3: Brain Core & Telemetry Analytics */}
      {activeTab === "analytics" && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
          <BrainStatus dashboard={dashboard} streak={streak} />
        </motion.div>
      )}

      {/* Tab 4: Showcase & Projects */}
      {activeTab === "projects" && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
          <GlassCard padding="p-5" className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Rocket size={18} className="text-emerald-400" />
                <span>Showcase Projects</span>
              </h3>
              <span className="text-[10px] text-gray-500 font-semibold">0 Projects Published</span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              Your published prototypes, hardware hacking demos, and Olympiad solutions will appear here as proof of your evolution.
            </p>
          </GlassCard>
        </motion.div>
      )}

      {/* Account Settings & Sign Out */}
      <div className="pt-2 space-y-2">
        <button
          onClick={() => navigate("/settings")}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.05] transition text-left text-xs font-medium text-gray-300"
        >
          <Settings size={15} className="text-gray-400" />
          <span className="flex-1">Account & Preference Settings</span>
          <ChevronRight size={14} className="text-gray-600" />
        </button>

        <button
          onClick={() => {
            logout();
            navigate("/");
          }}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-red-500/10 hover:bg-red-500/5 transition text-left text-xs font-medium text-red-400"
        >
          <LogOut size={15} className="text-red-400" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
}
