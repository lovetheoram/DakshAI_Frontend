import { useContext, useEffect, useState } from "react";
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
      <TodayGrowth dashboard={dashboard} />
      <ContinueLearning dashboard={dashboard} />
      <BrainStatus dashboard={dashboard} />
      <WeeklyMomentum dashboard={dashboard} streak={streak} />
      <AICoach dashboard={dashboard} />
    </div>
  );
}
