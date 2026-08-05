// src/pages/Home.jsx
// Home = The Studio (Doorway Experience).
// Answers the core question: "Why am I opening DakshAI today?"
// Renders the 5-step emotional story flow:
// 1. Arrival → 2. Purpose → 3. Journey → 4. Inspiration → 5. State-Driven Action.
// ZERO stress graphs or analytical report cards on Home.

import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import progressApi from "../api/progressApi";
import syllabusApi from "../api/syllabusApi";
import SkeletonLoader from "../components/ui/SkeletonLoader";
import LandingPage from "../components/home/LandingPage";
import ServerStatusChecker from "../components/home/ServerStatusChecker";
import OnboardingGate from "../components/onboarding/OnboardingGate";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Compass, CheckCircle2, Globe } from "lucide-react";
import JourneyStory from "../components/home/JourneyStory";

import { useSessionEngine } from "../hooks/useSessionEngine";

export default function Home() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const { activeSession } = useSessionEngine();
  const [dashboard, setDashboard] = useState(null);
  const [streak, setStreak] = useState(null);
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isServerReady, setIsServerReady] = useState(false);

  useEffect(() => {
    if (!user || !isServerReady) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const [dashData, streakData, treeData] = await Promise.all([
          progressApi.getDashboard(),
          progressApi.getStreakStats(),
          syllabusApi.getTree(),
        ]);
        setDashboard(dashData);
        setStreak(streakData);
        setExams(treeData?.exams || []);
      } catch (err) {
        console.error("Home data fetch failed:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, isServerReady]);

  if (!user) return <LandingPage />;
  if (!isServerReady) return <ServerStatusChecker onReady={() => setIsServerReady(true)} />;

  if (loading) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 space-y-6 text-center">
        <SkeletonLoader lines={2} />
        <SkeletonLoader lines={4} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <p className="text-gray-400 mb-4">Something went wrong connecting to your study room.</p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  // ── Determine Dynamic Primary Action State ────────────────────────────────
  const activeGoal = dashboard?.goal;
  const recentActivity = dashboard?.recent_activity;
  const activeConcept = activeSession?.conceptTitle || recentActivity?.concept || "Foundation Physics & Math";
  const completedConcept = recentActivity?.prev_concept || "Concept Basics";
  const nextConcept = recentActivity?.next_concept || "Applied Systems";

  let ctaLabel = "Continue Journey";
  let ctaAction = () => navigate(activeSession?.conceptId ? `/learn/${activeSession.conceptId}` : recentActivity?.concept_id ? `/learn/${recentActivity.concept_id}` : "/learn");

  if (activeSession) {
    ctaLabel = `Continue ${activeSession.conceptTitle || 'Active Session'}`;
    ctaAction = () => navigate(`/learn/${activeSession.conceptId}`);
  } else if (!activeGoal) {
    ctaLabel = "Start Today's Mission";
    ctaAction = () => navigate("/growth");
  } else if (!recentActivity) {
    ctaLabel = "Begin Your Journey";
    ctaAction = () => navigate("/learn");
  } else if (dashboard?.is_daily_mission_complete) {
    ctaLabel = "Explore Next Concept";
    ctaAction = () => navigate("/learn");
  }

  // Time greeting helper
  const hour = new Date().getHours();
  const timeGreeting = hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";
  const userName = user?.first_name || user?.username || "Learner";

  return (
    <OnboardingGate
      dashboard={dashboard}
      exams={exams}
      onComplete={() => {
        setLoading(true);
        Promise.all([
          progressApi.getDashboard(),
          progressApi.getStreakStats(),
        ]).then(([d, s]) => {
          setDashboard(d);
          setStreak(s);
        }).finally(() => setLoading(false));
      }}
    >
      <div className="max-w-xl mx-auto px-4 py-8 space-y-8 select-none">

        {/* ── 1. ARRIVAL ────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-1"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-widest text-indigo-400 flex items-center gap-1.5">
              <Sparkles size={14} className="text-indigo-400" />
              The Studio
            </span>
            {streak?.streak_days > 0 && (
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-teal-500/10 text-teal-300 border border-teal-500/20">
                {streak.streak_days} Day Streak 🔥
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {timeGreeting}, {userName}.
          </h1>
          <p className="text-sm text-gray-400 font-medium">
            Welcome back to your study room.
          </p>
        </motion.div>

        {/* ── 2. PURPOSE ────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="p-5 rounded-2xl bg-indigo-950/20 border border-indigo-500/20 backdrop-blur-xl text-gray-300 space-y-1.5"
        >
          <p className="text-xs sm:text-sm font-semibold text-indigo-200 leading-relaxed">
            "{activeGoal ? `Every concept learned brings you one step closer to mastering ${activeGoal.name || activeGoal.title || 'your goal'}.` : "One small concept today. One step closer to the learner you're becoming."}"
          </p>
        </motion.div>

        {/* ── 3. JOURNEY (Continuity Flow) ──────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="p-6 rounded-3xl bg-slate-900/80 border border-white/10 backdrop-blur-2xl space-y-5 shadow-2xl relative overflow-hidden group"
        >
          {/* Ambient Glow */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-600/10 rounded-full blur-3xl group-hover:bg-indigo-600/20 transition-all duration-500 pointer-events-none" />

          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-widest text-indigo-300 flex items-center gap-1.5">
              <Compass size={14} />
              Today's Journey
            </span>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-white/5 text-gray-400">
              ~18 min
            </span>
          </div>

          <div className="space-y-1">
            <h2 className="text-xl font-black text-white tracking-tight">
              {activeConcept}
            </h2>
            <p className="text-xs text-gray-400 font-normal">
              Active learning & retrieval phase
            </p>
          </div>

          {/* Continuity Step Timeline */}
          <div className="grid grid-cols-3 gap-2 pt-2 text-left border-t border-white/5 text-xs">
            <div className="space-y-1">
              <span className="text-[10px] text-gray-500 font-bold uppercase block">Yesterday</span>
              <p className="font-semibold text-gray-300 truncate flex items-center gap-1">
                <CheckCircle2 size={11} className="text-teal-400 shrink-0" />
                {completedConcept}
              </p>
            </div>
            <div className="space-y-1 border-x border-white/5 px-2">
              <span className="text-[10px] text-indigo-400 font-bold uppercase block">Today</span>
              <p className="font-bold text-white truncate">{activeConcept}</p>
            </div>
            <div className="space-y-1 pl-1">
              <span className="text-[10px] text-gray-500 font-bold uppercase block">Tomorrow</span>
              <p className="font-semibold text-gray-400 truncate">{nextConcept}</p>
            </div>
          </div>

          {/* ── 4. INSPIRATION (World Connection) ───────────────────────── */}
          <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs text-gray-400">
            <div className="flex items-center gap-2 max-w-[80%]">
              <Globe size={14} className="text-indigo-400 shrink-0" />
              <span className="truncate">
                These principles power modern robotics & electric vehicles.
              </span>
            </div>
            <button
              onClick={() => navigate("/community")}
              className="text-indigo-400 hover:text-indigo-300 font-bold text-[11px] whitespace-nowrap"
            >
              Explore →
            </button>
          </div>

          {/* ── 5. ACTION (Single State-Driven Button) ───────────────────── */}
          <div className="pt-2">
            <button
              onClick={ctaAction}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-extrabold text-sm shadow-xl shadow-indigo-900/30 transition-all flex items-center justify-center gap-2 transform active:scale-[0.98] cursor-pointer"
            >
              <span>{ctaLabel}</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </motion.div>

        {/* ── 6. JOURNEY STORY (Identity Summary) ────────────────────────── */}
        <JourneyStory dashboardData={dashboard} streakStats={streak} />

        {/* Footer Guidance */}
        <div className="text-center text-xs text-gray-500 pt-4 font-medium">
          Need deep trajectory analysis? Visit <button onClick={() => navigate("/growth")} className="text-indigo-400 hover:underline">Growth Observatory</button>
        </div>
      </div>
    </OnboardingGate>
  );
}
