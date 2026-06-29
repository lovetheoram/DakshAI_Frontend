import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import progressApi from "../api/progressApi";
import SkeletonLoader from "../components/ui/SkeletonLoader";
import HeroHeader from "../components/home/HeroHeader";
import TodayGrowth from "../components/home/TodayGrowth";
import ContinueLearning from "../components/home/ContinueLearning";
import BrainStatus from "../components/home/BrainStatus";
import WeeklyMomentum from "../components/home/WeeklyMomentum";
import AICoach from "../components/home/AICoach";
import LandingPage from "../components/home/LandingPage";

export default function Home() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState(null);
  const [streak, setStreak] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const [dashData, streakData] = await Promise.all([
          progressApi.getDashboard(),
          progressApi.getStreakStats(),
        ]);
        setDashboard(dashData);
        setStreak(streakData);
      } catch (err) {
        console.error("Home data fetch failed:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  // Logged-out users see the landing page
  if (!user) {
    return <LandingPage />;
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
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
      <HeroHeader user={user} streak={streak} />
      
      {/* Alert banner if no active goal is configured */}
      {!dashboard?.goal && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-5 rounded-3xl bg-purple-950/40 border border-purple-500/20 backdrop-blur-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-white"
        >
          <div className="space-y-1">
            <h3 className="text-sm font-bold flex items-center gap-2">
              <span>🔮</span> Initialize Growth OS Engine
            </h3>
            <p className="text-[10px] text-gray-400 max-w-md leading-relaxed">
              Define your target exam and daily study hours to start logging cognitive metrics, energy telemetry, and daily revision logs.
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

      <TodayGrowth dashboard={dashboard} />
      <ContinueLearning dashboard={dashboard} />
      <BrainStatus dashboard={dashboard} />
      <WeeklyMomentum dashboard={dashboard} streak={streak} />
      <AICoach dashboard={dashboard} />
    </div>
  );
}
