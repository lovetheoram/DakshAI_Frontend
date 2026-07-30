import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import progressApi from "../api/progressApi";
import syllabusApi from "../api/syllabusApi";
import SkeletonLoader from "../components/ui/SkeletonLoader";
import LandingPage from "../components/home/LandingPage";
import ServerStatusChecker from "../components/home/ServerStatusChecker";
import { motion } from "framer-motion";

// Living OS Components — ordered by emotional priority
import HeroHeader from "../components/home/HeroHeader";
import DakshCatalyst from "../components/home/DakshCatalyst";
import ContinueLearning from "../components/home/ContinueLearning";
import DecayAlerts from "../components/home/DecayAlerts";
import DiscoveryFeed from "../components/home/DiscoveryFeed";
import KnowledgeGalaxy from "../components/home/KnowledgeGalaxy";
import BrainStatus from "../components/home/BrainStatus";
import WeeklyMomentum from "../components/home/WeeklyMomentum";
import OnboardingGate from "../components/onboarding/OnboardingGate";

export default function Home() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState(null);
  const [streak, setStreak] = useState(null);
  const [galaxyData, setGalaxyData] = useState(null);
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- FREE TIER SERVER CHECKER ---
  // Set initial state to 'true' to completely disable the wakeup check when shifting to a paid server.
  const [isServerReady, setIsServerReady] = useState(false);

  useEffect(() => {
    // If not logged in, or if we are still waiting for the server to wake up, do not fetch data.
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

        // Galaxy is secondary — fetch after main data loads, don't block
        if (dashData?.goal) {
          progressApi.getGalaxy().then(setGalaxyData).catch(() => {});
        }
      } catch (err) {
        console.error("Home data fetch failed:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, isServerReady]);

  // Logged-out (unauthorized) users see the landing page immediately
  if (!user) {
    return <LandingPage />;
  }

  // If backend server is asleep, show the wakeup progress component for logged-in user
  if (!isServerReady) {
    return <ServerStatusChecker onReady={() => setIsServerReady(true)} />;
  }

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-4">
        <SkeletonLoader avatar />
        <SkeletonLoader lines={2} />
        <SkeletonLoader lines={4} />
        <SkeletonLoader lines={2} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <p className="text-gray-400 mb-4">Something went wrong loading your dashboard.</p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-medium transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

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
          if (d?.goal) progressApi.getGalaxy().then(setGalaxyData).catch(() => {});
        }).finally(() => setLoading(false));
      }}
    >
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        {/* ① Compact Hero — greeting + streak + today's target bar */}
        <HeroHeader user={user} streak={streak} dashboard={dashboard} />

        {/* ② Daksh Catalyst — the companion (replaces AICoach) */}
        <DakshCatalyst />

        {/* Alert banner if no active goal is configured */}
        {!dashboard?.goal && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-5 rounded-3xl bg-purple-950/40 border border-purple-500/20 backdrop-blur-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-white"
          >
            <div className="space-y-1">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <span>🎯</span> Set Your Goal
              </h3>
              <p className="text-[10px] text-gray-400 max-w-md leading-relaxed">
                Define your target exam and daily study hours to start tracking your progress and predictions.
              </p>
            </div>
            <button
              onClick={() => navigate("/growth")}
              className="px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg transition active:scale-[0.97] whitespace-nowrap self-start sm:self-center"
            >
              Configure Goal ⚡
            </button>
          </motion.div>
        )}

        {/* ③ Continue Learning — MOST IMPORTANT card ⭐⭐⭐⭐⭐ */}
        <ContinueLearning dashboard={dashboard} />

        {/* ④ Memory Fading — conditional urgency ⭐⭐⭐⭐ */}
        <DecayAlerts decayAlerts={dashboard?.decay_alerts} />

        {/* ⑤ Discovery Feed — "What's New" events ⭐⭐⭐⭐ */}
        <DiscoveryFeed dashboard={dashboard} streak={streak} />

        {/* ⑥ Knowledge Galaxy — living constellation ⭐⭐⭐ */}
        <KnowledgeGalaxy galaxyData={galaxyData} />

        {/* ⑦ Weekly Momentum — bar chart ⭐⭐ */}
        <WeeklyMomentum dashboard={dashboard} streak={streak} />
      </div>
    </OnboardingGate>
  );
}
