import GlassCard from "../ui/GlassCard";
import ProgressRing from "../ui/ProgressRing";
import AnimatedCounter from "../ui/AnimatedCounter";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

export default function TodayGrowth({ dashboard }) {
  const today = dashboard?.today_growth ?? 0;
  const yesterday = dashboard?.yesterday_growth ?? 0;
  const weekAvg = dashboard?.week_avg_growth ?? 0;

  const diff = today - yesterday;
  const TrendIcon = diff > 0 ? TrendingUp : diff < 0 ? TrendingDown : Minus;
  const trendColor = diff > 0 ? "text-emerald-400" : diff < 0 ? "text-red-400" : "text-gray-500";

  return (
    <GlassCard className="flex items-center gap-6">
      <ProgressRing
        value={today}
        size={110}
        strokeWidth={10}
        sublabel="today"
      />

      <div className="flex-1 space-y-3">
        <div>
          <p className="text-caption">Today's Growth</p>
          <AnimatedCounter
            value={today}
            suffix="%"
            className="text-3xl font-black text-white"
          />
        </div>

        {/* Comparison chips */}
        <div className="flex items-center gap-3">
          <motion.div
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/[0.04] text-xs"
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <TrendIcon size={12} className={trendColor} />
            <span className="text-gray-400">
              vs yesterday <span className={`font-bold ${trendColor}`}>{yesterday}%</span>
            </span>
          </motion.div>

          <motion.div
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/[0.04] text-xs text-gray-400"
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            Week avg: <span className="font-bold text-gray-300">{weekAvg}%</span>
          </motion.div>
        </div>
      </div>
    </GlassCard>
  );
}
