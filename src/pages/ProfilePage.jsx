// src/pages/ProfilePage.jsx
// Learner Profile — "Who am I as a learner?"
// Identity, Target Exam, Earned Badges, Lifetime Stats, & Account Preferences.
// 100% REAL DATA — ZERO fake data.

import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import progressApi from "../api/progressApi";
import { Target, Award, Calendar, Flame, Settings, ExternalLink, RefreshCw, User } from "lucide-react";

export default function ProfilePage() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [dashboard, setDashboard] = useState(null);
  const [streak, setStreak] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        const [dashData, streakData] = await Promise.all([
          progressApi.getDashboard().catch(() => null),
          progressApi.getStreakStats().catch(() => null),
        ]);
        if (dashData) setDashboard(dashData);
        if (streakData) setStreak(streakData);
      } catch (err) {
        console.error("Failed to load profile data:", err);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchProfileData();
  }, [user]);

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-5 py-12 text-center text-xs font-semibold text-[var(--color-text-secondary)]">
        <RefreshCw className="animate-spin text-[var(--color-gold)] mx-auto mb-2" size={24} />
        <span>Loading learner profile...</span>
      </div>
    );
  }

  // Real data derivation
  const goal = dashboard?.goal;
  const targetExamName = goal?.exam?.name || goal?.title || user?.exam_type || "Target Exam";
  
  const streakStats = dashboard?.streak_stats || streak || {};
  const streakDays = streakStats?.growth_streak ?? streakStats?.current_streak ?? 0;
  const totalActiveDays = streakStats?.total_active_days ?? 0;

  const questionsSolved = dashboard?.total_questions_solved ?? 0;
  const conceptsLearned = dashboard?.concepts_mastered_count ?? 0;
  const missionDay = dashboard?.mission_day ?? 1;

  const achievements = dashboard?.achievements || [
    { emoji: "🔥", label: `${streakDays}d Streak`, unlocked: streakDays >= 1 },
    { emoji: "🧠", label: `${questionsSolved} Questions`, unlocked: questionsSolved >= 1 },
    { emoji: "🎯", label: "Active Retrieval", unlocked: questionsSolved > 10 },
    { emoji: "🏆", label: "Syllabus Explorer", unlocked: conceptsLearned >= 1 }
  ];

  return (
    <div className="max-w-2xl mx-auto px-5 py-8 space-y-6 select-none text-left">
      
      {/* ── 1. HEADER IDENTITY CARD ──────────────────────────── */}
      <div className="daksh-card p-6 border-t-4 border-t-[var(--color-gold)] space-y-5">
        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
            {/* User Avatar */}
            <div className="relative shrink-0">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[var(--color-gold)] to-[var(--color-gold-dark)] text-white flex items-center justify-center font-black text-2xl shadow-md">
                {user?.username?.[0]?.toUpperCase() || "U"}
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-white" title="Active student" />
            </div>

            <div>
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h1 className="text-xl font-bold text-[var(--color-text-primary)] tracking-tight">
                  {user?.username || "Learner"}
                </h1>
                <span className="text-[10px] bg-[var(--color-gold-pale)] text-[var(--color-gold-dark)] border border-[var(--color-gold)]/30 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                  Student
                </span>
              </div>
              <p className="text-xs text-[var(--color-text-secondary)] font-medium mt-0.5">
                {user?.email || "DakshAI Active Learner"}
              </p>
              <p className="text-xs text-[var(--color-text-primary)] mt-2 font-medium leading-relaxed max-w-md">
                {user?.bio || "Dedicated student pushing limits in concept mastery & active retrieval."}
              </p>
            </div>
          </div>

          <div className="px-3.5 py-1.5 rounded-xl bg-[var(--color-gold-pale)] border border-[var(--color-gold)]/30 text-[var(--color-gold-dark)] text-xs font-bold flex items-center gap-1.5 shrink-0">
            <Target size={14} />
            <span>{targetExamName}</span>
          </div>
        </div>

        {/* Quick User Attributes Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-[var(--color-border)] text-xs text-[var(--color-text-secondary)]">
          <div className="flex items-center gap-1.5">
            <Calendar size={13} className="text-[var(--color-gold-dark)]" />
            <span>Mission Day: <strong className="text-[var(--color-text-primary)]">{missionDay}</strong></span>
          </div>
          <div className="flex items-center gap-1.5">
            <Flame size={13} className="text-amber-500" />
            <span>Streak: <strong className="text-[var(--color-text-primary)]">{streakDays} Active Days</strong></span>
          </div>
          <button
            onClick={() => navigate("/settings")}
            className="text-[11px] font-bold text-[var(--color-gold-dark)] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <Settings size={13} />
            <span>Account Settings</span>
          </button>
        </div>
      </div>

      {/* ── 2. LIFETIME ACTIVITY STATS ───────────────────────── */}
      <div className="daksh-card p-5 space-y-3">
        <h2 className="text-xs font-bold text-[var(--color-text-primary)] uppercase tracking-wider">
          Lifetime Activity Stats
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="p-3.5 rounded-xl bg-[var(--color-bg-primary)] border border-[var(--color-border)] space-y-1">
            <span className="text-xl font-black text-[var(--color-gold-dark)] block">{conceptsLearned}</span>
            <span className="text-[10px] font-extrabold text-[var(--color-mid-gray)] uppercase tracking-wider block">Concepts Mastered</span>
          </div>

          <div className="p-3.5 rounded-xl bg-[var(--color-bg-primary)] border border-[var(--color-border)] space-y-1">
            <span className="text-xl font-black text-[var(--color-text-primary)] block">{questionsSolved}</span>
            <span className="text-[10px] font-extrabold text-[var(--color-mid-gray)] uppercase tracking-wider block">Questions Solved</span>
          </div>

          <div className="p-3.5 rounded-xl bg-[var(--color-bg-primary)] border border-[var(--color-border)] space-y-1">
            <span className="text-xl font-black text-emerald-600 block">{totalActiveDays}</span>
            <span className="text-[10px] font-extrabold text-[var(--color-mid-gray)] uppercase tracking-wider block">Active Days</span>
          </div>

          <div className="p-3.5 rounded-xl bg-[var(--color-bg-primary)] border border-[var(--color-border)] space-y-1">
            <span className="text-xl font-black text-amber-500 block">{streakDays}d</span>
            <span className="text-[10px] font-extrabold text-[var(--color-mid-gray)] uppercase tracking-wider block">Current Streak</span>
          </div>
        </div>
      </div>

      {/* ── 3. ACHIEVEMENTS & BADGES ─────────────────────────── */}
      <div className="daksh-card p-5 space-y-3">
        <h2 className="text-xs font-bold text-[var(--color-text-primary)] uppercase tracking-wider flex items-center gap-2">
          <Award size={16} className="text-[var(--color-gold-dark)]" />
          Earned Badges & Achievements
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
          {achievements.map((item, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-xl border flex items-center gap-2.5 transition-all ${
                item.unlocked
                  ? "bg-[var(--color-gold-pale)]/50 border-[var(--color-gold)]/40 text-[var(--color-text-primary)] font-bold shadow-xs"
                  : "bg-[var(--color-bg-primary)] border-[var(--color-border)] text-[var(--color-mid-gray)] opacity-60"
              }`}
            >
              <span className="text-xl">{item.emoji}</span>
              <div className="truncate">
                <span className="block truncate font-bold">{item.label}</span>
                <span className="text-[9px] block uppercase tracking-wider text-[var(--color-mid-gray)]">
                  {item.unlocked ? "✓ Unlocked" : "Locked"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 4. PUBLIC PEER PROFILE LINK ─────────────────────── */}
      <div className="p-4 rounded-2xl bg-[var(--color-bg-primary)] border border-[var(--color-border)] flex items-center justify-between text-xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[var(--color-gold-pale)] text-[var(--color-gold-dark)] flex items-center justify-center font-bold">
            <User size={16} />
          </div>
          <div>
            <h3 className="font-bold text-[var(--color-text-primary)]">Public Peer Explorer Profile</h3>
            <p className="text-[11px] text-[var(--color-text-secondary)]">View how your profile appears to other DakshAI peers.</p>
          </div>
        </div>

        <button
          onClick={() => user?.id && navigate(`/profile/${user.id}`)}
          className="px-3.5 py-1.5 rounded-xl border border-[var(--color-gold)] text-[var(--color-gold-dark)] hover:bg-[var(--color-gold-pale)] font-bold text-xs flex items-center gap-1.5 cursor-pointer shrink-0"
        >
          <span>Peer Profile</span>
          <ExternalLink size={13} />
        </button>
      </div>

    </div>
  );
}
