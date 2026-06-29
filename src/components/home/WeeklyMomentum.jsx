import GlassCard from "../ui/GlassCard";
import StatusBadge from "../ui/StatusBadge";
import { motion } from "framer-motion";
import { Zap, Trophy } from "lucide-react";

const DAY_LABELS = ["M", "T", "W", "T", "F", "S", "S"];

export default function WeeklyMomentum({ dashboard, streak }) {
  const weekData = dashboard?.weekly_data || [];
  const maxVal = Math.max(...weekData.map((d) => d?.value ?? 0), 1);
  const bestDay = dashboard?.best_day;
  const weeklyGrowth = dashboard?.weekly_growth ?? 0;
  const currentStreak = streak?.current_streak ?? 0;

  // Pad to 7 days
  const bars = DAY_LABELS.map((label, i) => ({
    label,
    value: weekData[i]?.value ?? 0,
    isToday: i === new Date().getDay() - 1 || (i === 6 && new Date().getDay() === 0),
  }));

  return (
    <GlassCard>
      <div className="flex items-center justify-between mb-5">
        <p className="text-caption">Weekly Momentum</p>
        <StatusBadge variant="accent" icon={<Zap size={10} />}>
          {weeklyGrowth > 0 ? "+" : ""}{weeklyGrowth}% this week
        </StatusBadge>
      </div>

      {/* Bar chart */}
      <div className="flex items-end gap-2 h-24 mb-4">
        {bars.map((bar, i) => {
          const heightPct = maxVal > 0 ? (bar.value / maxVal) * 100 : 0;

          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
              <motion.div
                className={`w-full rounded-lg ${
                  bar.isToday
                    ? "bg-gradient-to-t from-purple-600 to-purple-400 shadow-sm shadow-purple-500/30"
                    : "bg-white/[0.06]"
                }`}
                style={{ minHeight: 4 }}
                initial={{ height: 0 }}
                animate={{ height: `${Math.max(heightPct, 5)}%` }}
                transition={{ delay: 0.3 + i * 0.06, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              />
              <span className={`text-[10px] font-bold ${bar.isToday ? "text-purple-400" : "text-gray-600"}`}>
                {bar.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Stats row */}
      <div className="flex items-center gap-4 text-xs text-gray-400">
        {bestDay && (
          <div className="flex items-center gap-1.5">
            <Trophy size={12} className="text-amber-400" />
            <span>Best: <span className="text-white font-medium">{bestDay}</span></span>
          </div>
        )}
        <div className="flex items-center gap-1.5">
          <Zap size={12} className="text-purple-400" />
          <span>Streak: <span className="text-white font-medium">{currentStreak}d</span></span>
        </div>
      </div>
    </GlassCard>
  );
}
