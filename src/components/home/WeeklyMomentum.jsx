import GlassCard from "../ui/GlassCard";
import { motion } from "framer-motion";
import { Zap } from "lucide-react";

const DAY_LABELS = ["M", "T", "W", "T", "F", "S", "S"];

export default function WeeklyMomentum({ dashboard, streak }) {
  const weekData = dashboard?.weekly_data || [];
  const targetGrowth = dashboard?.target_growth ?? 0;
  const weekCompliance = streak?.week_compliance ?? 0;

  // Count active study days
  const activeDays = weekData.filter((d) => (d?.value ?? 0) > 0).length;

  const maxVal = Math.max(...weekData.map((d) => d?.value ?? 0), targetGrowth, 0.5);

  // Pad to 7 days
  const bars = DAY_LABELS.map((label, i) => ({
    label,
    value: weekData[i]?.value ?? 0,
    isToday:
      i === new Date().getDay() - 1 ||
      (i === 6 && new Date().getDay() === 0),
  }));

  // Target line position as percentage of chart height
  const targetLinePct = maxVal > 0 ? Math.min(100, (targetGrowth / maxVal) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.5 }}
    >
      <GlassCard>
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Zap size={14} className="text-purple-400" />
            <p className="text-xs font-bold text-white">This Week</p>
          </div>
          <p className="text-[10px] text-gray-500">
            {Math.round(weekCompliance)}% compliance
          </p>
        </div>

        {/* Bar chart with target line */}
        <div className="relative">
          <div className="flex items-end gap-2 h-20 mb-3">
            {bars.map((bar, i) => {
              const heightPct = maxVal > 0 ? (bar.value / maxVal) * 100 : 0;
              const hitTarget = bar.value >= targetGrowth && targetGrowth > 0;

              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                  <motion.div
                    className={`w-full rounded-lg ${
                      bar.isToday
                        ? "bg-gradient-to-t from-purple-600 to-purple-400 shadow-sm shadow-purple-500/30"
                        : hitTarget
                        ? "bg-gradient-to-t from-emerald-600/60 to-emerald-400/40"
                        : "bg-white/[0.06]"
                    }`}
                    style={{ minHeight: 4 }}
                    initial={{ height: 0 }}
                    animate={{ height: `${Math.max(heightPct, 5)}%` }}
                    transition={{
                      delay: 0.5 + i * 0.06,
                      duration: 0.6,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  />
                  <span
                    className={`text-[10px] font-bold ${
                      bar.isToday ? "text-purple-400" : "text-gray-600"
                    }`}
                  >
                    {bar.label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Target line overlay */}
          {targetGrowth > 0 && (
            <div
              className="absolute left-0 right-0 border-t border-dashed border-gray-600/50 pointer-events-none"
              style={{ bottom: `${targetLinePct * 0.8 + 24}px` }}
            >
              <span className="absolute -top-3 right-0 text-[8px] text-gray-600 font-bold">
                Target
              </span>
            </div>
          )}
        </div>

        {/* Human footer */}
        <p className="text-xs text-gray-400">
          Studied <span className="text-white font-bold">{activeDays}</span> of 7 days
          this week
          {weekCompliance < 80 && activeDays < 7 && (
            <span className="text-gray-600">
              {" "}
              · Push harder to maintain momentum
            </span>
          )}
        </p>
      </GlassCard>
    </motion.div>
  );
}
