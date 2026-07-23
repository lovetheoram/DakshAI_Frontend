import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useExperience } from "../context/ThemeContext";
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
  ChevronRight,
  Sparkles,
  Rocket,
  CheckCircle2,
  Flame,
  Brain,
  Palette,
} from "lucide-react";

export default function ProfilePage() {
  const { user, logout } = useContext(AuthContext);
  const { activeThemeMeta, openCustomizer } = useExperience();
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState(null);
  const [streak, setStreak] = useState(null);

  // Tab State: 'achievements' | 'analytics' | 'projects'
  const [activeTab, setActiveTab] = useState("achievements");

  useEffect(() => {
    const fetchProfileStats = async () => {
      try {
        const [dashData, streakData] = await Promise.all([
          progressApi.getDashboard(),
          progressApi.getStreakStats(),
        ]);
        setDashboard(dashData);
        setStreak(streakData);
      } catch (err) {
        console.error("Failed to load profile telemetry:", err);
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
      label: streakDays >= 3 ? "✓ Unlocked" : `${streakDays}/3 days`,
    },
    {
      emoji: "🧠",
      title: "100 Questions Solved",
      unlocked: questionsSolved >= 100,
      progressVal: questionsSolved,
      targetVal: 100,
      label: questionsSolved >= 100 ? "✓ Unlocked" : `${questionsSolved}/100 questions`,
    },
    {
      emoji: "🎯",
      title: "High Accuracy Master",
      unlocked: avgAccuracy >= 80,
      progressVal: avgAccuracy,
      targetVal: 80,
      label: avgAccuracy >= 80 ? "✓ Unlocked" : `${Math.round(avgAccuracy)}/80% accuracy`,
    },
    {
      emoji: "⚡",
      title: "Week On Fire",
      unlocked: weekCompliance >= 80,
      progressVal: weekCompliance,
      targetVal: 80,
      label: weekCompliance >= 80 ? "✓ Unlocked" : `${Math.round(weekCompliance)}/80% compliance`,
    },
    {
      emoji: "🏆",
      title: "Halfway Exam Readiness",
      unlocked: dakshScore >= 50,
      progressVal: dakshScore,
      targetVal: 50,
      label: dakshScore >= 50 ? "✓ Unlocked" : `${Math.round(dakshScore)}/50% readiness`,
    },
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
          <StatusBadge variant="success" icon="🎯">Target Goal Active</StatusBadge>
        </div>
      </GlassCard>

      {/* Study Environment Selector Card */}
      <GlassCard
        padding="p-4"
        hover
        onClick={() => openCustomizer()}
        className="border-purple-500/30 bg-purple-950/20 flex items-center justify-between cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-300">
            <Palette size={18} />
          </div>
          <div>
            <div className="text-[10px] font-bold text-purple-300 uppercase tracking-wider">Active Study Environment</div>
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5 mt-0.5">
              <span>{activeThemeMeta?.name || "Classic Focus"}</span>
              <span className="text-sm">{activeThemeMeta?.badge || "⚡"}</span>
            </h3>
          </div>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            openCustomizer();
          }}
          className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer relative z-10"
        >
          Change Environment
        </button>
      </GlassCard>

      {/* Segmented Sub-Navigation Tabs (3 Columns) */}
      <div className="grid grid-cols-3 gap-1.5 p-1 rounded-2xl bg-slate-950/60 border border-white/[0.04] text-[11px] font-bold">
        <button
          onClick={() => setActiveTab("achievements")}
          className={`py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            activeTab === "achievements"
              ? "bg-amber-600/20 text-amber-300 border border-amber-500/30 shadow-md"
              : "text-gray-400 hover:text-white"
          }`}
        >
          <Award size={14} />
          <span>Badges & Achievements</span>
        </button>

        <button
          onClick={() => setActiveTab("analytics")}
          className={`py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            activeTab === "analytics"
              ? "bg-purple-600/20 text-purple-300 border border-purple-500/30 shadow-md"
              : "text-gray-400 hover:text-white"
          }`}
        >
          <Brain size={14} />
          <span>Analytics</span>
        </button>

        <button
          onClick={() => setActiveTab("projects")}
          className={`py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            activeTab === "projects"
              ? "bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 shadow-md"
              : "text-gray-400 hover:text-white"
          }`}
        >
          <Rocket size={14} />
          <span>Projects</span>
        </button>
      </div>

      {/* Tab 1: Achievements & Badges */}
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
                        ? "bg-amber-500/5 border-amber-500/20 opacity-100"
                        : "bg-white/[0.01] border-white/[0.04] opacity-65"
                    }`}
                  >
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center text-base flex-shrink-0 ${
                        unlocked ? "bg-amber-500/10" : "bg-white/[0.04]"
                      }`}
                    >
                      {ach.emoji}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between text-xs font-semibold mb-1">
                        <span className="text-white">{ach.title}</span>
                        <span className={unlocked ? "text-amber-400 font-bold" : "text-gray-400"}>
                          {ach.label}
                        </span>
                      </div>

                      {!unlocked && (
                        <div className="w-full h-1 bg-slate-950 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-amber-500 rounded-full"
                            style={{ width: `${ratioPercent}%` }}
                          />
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

      {/* Tab 2: Brain Core & Telemetry Analytics */}
      {activeTab === "analytics" && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
          <BrainStatus dashboard={dashboard} streak={streak} />
        </motion.div>
      )}

      {/* Tab 3: Showcase & Projects */}
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
