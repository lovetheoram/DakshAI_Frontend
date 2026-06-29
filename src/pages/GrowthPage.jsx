import { useEffect, useState } from "react";
import progressApi from "../api/progressApi";
import GlassCard from "../components/ui/GlassCard";
import ProgressRing from "../components/ui/ProgressRing";
import ProgressBar from "../components/ui/ProgressBar";
import AnimatedCounter from "../components/ui/AnimatedCounter";
import StatusBadge from "../components/ui/StatusBadge";
import SkeletonLoader from "../components/ui/SkeletonLoader";
import { motion } from "framer-motion";
import {
  Brain,
  TrendingUp,
  Target,
  Zap,
  Award,
  BarChart3,
  Clock,
  Flame,
} from "lucide-react";

export default function GrowthPage() {
  const [dashboard, setDashboard] = useState(null);
  const [streak, setStreak] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dashData, streakData] = await Promise.all([
          progressApi.getDashboard(),
          progressApi.getStreakStats(),
        ]);
        setDashboard(dashData);
        setStreak(streakData);
      } catch (err) {
        console.error("Growth data fetch failed:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-4">
        <SkeletonLoader lines={3} />
        <SkeletonLoader lines={4} />
        <SkeletonLoader lines={2} />
      </div>
    );
  }

  const stats = dashboard?.brain_stats || {};
  const goal = dashboard?.goal;

  const metricCards = [
    { label: "Knowledge", value: stats.knowledge ?? 0, icon: Brain, color: "from-purple-500 to-indigo-500" },
    { label: "Memory", value: stats.memory ?? 0, icon: Clock, color: "from-blue-500 to-cyan-500" },
    { label: "Accuracy", value: stats.accuracy ?? 0, icon: Target, color: "from-emerald-500 to-teal-500" },
    { label: "Consistency", value: stats.consistency ?? 0, icon: Zap, color: "from-amber-500 to-orange-500" },
  ];

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-heading text-white">Growth</h1>
        <p className="text-body text-sm mt-1">Everything about your progress.</p>
      </div>

      {/* Overall Learning Score */}
      <GlassCard glow className="text-center py-8">
        <p className="text-caption mb-3">Learning Score</p>
        <ProgressRing
          value={dashboard?.overall_score ?? 0}
          size={140}
          strokeWidth={12}
          className="mx-auto mb-4"
        />
        <p className="text-body text-sm">
          Based on knowledge, memory retention, accuracy, and consistency.
        </p>
      </GlassCard>

      {/* Metric cards */}
      <div className="grid grid-cols-2 gap-3">
        {metricCards.map((metric, i) => {
          const Icon = metric.icon;
          return (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.08 }}
            >
              <GlassCard padding="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${metric.color} flex items-center justify-center shadow-lg`}>
                    <Icon size={14} className="text-white" />
                  </div>
                  <span className="text-xs font-bold text-gray-400">{metric.label}</span>
                </div>
                <AnimatedCounter
                  value={metric.value}
                  suffix="%"
                  className="text-xl font-black text-white"
                />
                <ProgressBar
                  value={metric.value}
                  className="mt-2"
                  height="h-1.5"
                  color={metric.color}
                />
              </GlassCard>
            </motion.div>
          );
        })}
      </div>

      {/* Streak section */}
      <GlassCard>
        <div className="flex items-center justify-between mb-4">
          <p className="text-caption">Streak & Consistency</p>
          <StatusBadge variant="warning" icon={<Flame size={10} />}>
            {streak?.current_streak ?? 0} days
          </StatusBadge>
        </div>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-black text-white">{streak?.current_streak ?? 0}</p>
            <p className="text-[10px] text-gray-500 mt-1">Current</p>
          </div>
          <div>
            <p className="text-2xl font-black text-white">{streak?.longest_streak ?? 0}</p>
            <p className="text-[10px] text-gray-500 mt-1">Longest</p>
          </div>
          <div>
            <p className="text-2xl font-black text-white">{streak?.total_active_days ?? 0}</p>
            <p className="text-[10px] text-gray-500 mt-1">Total Days</p>
          </div>
        </div>
      </GlassCard>

      {/* Goal section */}
      {goal && (
        <GlassCard>
          <div className="flex items-center justify-between mb-3">
            <p className="text-caption">Active Goal</p>
            <StatusBadge variant="accent">{goal.exam || "Exam"}</StatusBadge>
          </div>
          <h3 className="text-subheading text-white mb-1">{goal.name || goal.title}</h3>
          {goal.target_date && (
            <p className="text-xs text-gray-500 mb-3">
              Target: {new Date(goal.target_date).toLocaleDateString()}
            </p>
          )}
          <ProgressBar
            value={goal.progress ?? 0}
            showValue
            color="from-purple-500 to-pink-500"
          />
        </GlassCard>
      )}

      {/* Achievements placeholder */}
      <GlassCard padding="p-5">
        <div className="flex items-center gap-2 mb-3">
          <Award size={16} className="text-amber-400" />
          <p className="text-caption">Achievements</p>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-1">
          {(dashboard?.achievements || [
            { emoji: "🔥", label: "First Streak" },
            { emoji: "🧠", label: "100 Questions" },
            { emoji: "🎯", label: "90% Accuracy" },
          ]).map((ach, i) => (
            <div
              key={i}
              className="flex-shrink-0 w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex flex-col items-center justify-center gap-1"
            >
              <span className="text-lg">{ach.emoji}</span>
              <span className="text-[8px] text-gray-500 text-center leading-tight">{ach.label}</span>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
