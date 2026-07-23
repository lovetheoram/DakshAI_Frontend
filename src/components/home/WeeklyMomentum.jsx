import GlassCard from "../ui/GlassCard";
import { motion } from "framer-motion";
import { Zap, TrendingUp } from "lucide-react";

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const DAY_SHORT = ["M", "T", "W", "T", "F", "S", "S"];

export default function WeeklyMomentum({ dashboard, streak }) {
  const weekData = dashboard?.weekly_data || [];
  const targetGrowth = dashboard?.target_growth ?? 0;
  const weekCompliance = streak?.week_compliance ?? 0;

  const activeDays = weekData.filter((d) => (d?.value ?? 0) > 0).length;
  const maxVal = Math.max(...weekData.map((d) => d?.value ?? 0), targetGrowth, 0.5);

  const todayIdx = (new Date().getDay() + 6) % 7; // Mon=0

  const bars = DAY_SHORT.map((label, i) => ({
    label,
    fullLabel: DAY_LABELS[i],
    value: weekData[i]?.value ?? 0,
    isToday: i === todayIdx,
    hitTarget: (weekData[i]?.value ?? 0) >= targetGrowth && targetGrowth > 0,
  }));

  const complianceColor =
    weekCompliance >= 80
      ? "text-emerald-400"
      : weekCompliance >= 50
      ? "text-amber-400"
      : "text-rose-400";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <GlassCard accent accentColor="blue">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-blue-700 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Zap size={16} className="text-white" />
            </div>
            <div>
              <p className="text-xs font-black text-white">This Week</p>
              <p className="text-[10px] text-gray-500">Daily study momentum</p>
            </div>
          </div>

          <div className="text-right">
            <p className={`text-base font-black tabular-nums ${complianceColor}`}>
              {Math.round(weekCompliance)}%
            </p>
            <p className="text-[10px] text-gray-500">compliance</p>
          </div>
        </div>

        {/* Bar chart */}
        <div className="relative">
          <div className="flex items-end gap-1.5 h-24 mb-1">
            {bars.map((bar, i) => {
              const heightPct = maxVal > 0 ? (bar.value / maxVal) * 100 : 0;

              // Color assignment
              const barClass = bar.isToday
                ? "from-purple-500 to-violet-400 shadow-purple-500/40"
                : bar.hitTarget
                ? "from-emerald-500 to-teal-400 shadow-emerald-500/20"
                : bar.value > 0
                ? "from-indigo-600/60 to-blue-500/40"
                : "";

              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                  <div className="relative w-full flex flex-col justify-end" style={{ height: "76px" }}>
                    {bar.value > 0 ? (
                      <motion.div
                        className={`w-full rounded-lg bg-gradient-to-t ${barClass} shadow-sm`}
                        initial={{ height: 0 }}
                        animate={{ height: `${Math.max(heightPct, 8)}%` }}
                        transition={{ delay: 0.55 + i * 0.07, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                      />
                    ) : (
                      <div className="w-full rounded-lg bg-white/[0.04] border border-white/[0.06]" style={{ height: "8%" }} />
                    )}

                    {/* Today ring */}
                    {bar.isToday && (
                      <div className="absolute inset-x-0 -bottom-0.5 h-0.5 bg-purple-400 rounded-full shadow-sm shadow-purple-400/60" />
                    )}
                  </div>

                  <span className={`text-[10px] font-bold ${bar.isToday ? "text-purple-400" : "text-gray-600"}`}>
                    {bar.label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Target line */}
          {targetGrowth > 0 && (
            <div
              className="absolute left-0 right-0 border-t border-dashed border-purple-500/30 pointer-events-none"
              style={{ bottom: `${(targetGrowth / maxVal) * 76 + 22}px` }}
            >
              <span className="absolute -top-3 right-0 text-[9px] text-purple-400/70 font-bold">goal</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 mt-1 border-t border-white/[0.04] flex items-center justify-between">
          <p className="text-xs text-gray-400">
            <span className="text-white font-black">{activeDays}</span>
            <span className="text-gray-500"> / 7 days active</span>
          </p>
          {weekCompliance < 80 && activeDays < 7 && (
            <div className="flex items-center gap-1 text-[10px] text-amber-400 font-semibold">
              <TrendingUp size={10} />
              Push harder
            </div>
          )}
        </div>
      </GlassCard>
    </motion.div>
  );
}
