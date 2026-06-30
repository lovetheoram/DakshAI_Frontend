import GlassCard from "../ui/GlassCard";
import StatusBadge from "../ui/StatusBadge";
import { motion } from "framer-motion";
import { Zap, Trophy, TrendingUp, TrendingDown, Minus } from "lucide-react";

const DAY_LABELS = ["M", "T", "W", "T", "F", "S", "S"];

// ─── Prediction Band ──────────────────────────────────────────────────────────
function PredictionBand({ prediction }) {
  if (!prediction) return null;

  const { status, days_delta, need_extra, required_daily, actual_daily } = prediction;

  if (status === "on_track") {
    return (
      <div className="flex items-center gap-1.5 text-xs text-emerald-400">
        <Minus size={12} />
        <span>On track — averaging <span className="font-bold">+{actual_daily.toFixed(2)}%</span>/day</span>
      </div>
    );
  }
  if (status === "ahead") {
    return (
      <div className="flex items-center gap-1.5 text-xs text-emerald-400">
        <TrendingUp size={12} />
        <span>
          Ahead <span className="font-bold">{days_delta} day{days_delta !== 1 ? "s" : ""}</span>
          {" "}· avg <span className="font-bold">+{actual_daily.toFixed(2)}%</span>/day
        </span>
      </div>
    );
  }
  // behind
  return (
    <div className="flex items-center gap-1.5 text-xs text-amber-400">
      <TrendingDown size={12} />
      <span>
        Behind <span className="font-bold">{days_delta} day{days_delta !== 1 ? "s" : ""}</span>
        {need_extra > 0 && (
          <> · need <span className="font-bold">+{need_extra.toFixed(2)}%</span> more/day</>
        )}
      </span>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────
export default function WeeklyMomentum({ dashboard, streak }) {
  const weekData = dashboard?.weekly_data || [];
  const maxVal = Math.max(...weekData.map((d) => d?.value ?? 0), 1);
  const bestDay = dashboard?.best_day;
  const weeklyGrowth = dashboard?.week_avg_growth ?? 0;
  const currentStreak = streak?.current_streak ?? 0;
  const prediction = dashboard?.prediction;

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
          avg +{weeklyGrowth.toFixed(2)}%/day
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

      {/* Stats + prediction row */}
      <div className="flex items-center justify-between gap-4">
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

        {/* Prediction band — the "Ahead/Behind" signal */}
        <PredictionBand prediction={prediction} />
      </div>
    </GlassCard>
  );
}
