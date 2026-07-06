import GlassCard from "../ui/GlassCard";
import { motion } from "framer-motion";

function BrainRow({ icon, label, humanStat, value, description, color, delay }) {
  const barWidth = Math.max(0, Math.min(100, value));
  const barColor =
    value >= 60
      ? "from-emerald-500 to-emerald-400"
      : value >= 30
      ? "from-amber-500 to-yellow-400"
      : "from-red-500 to-orange-400";

  return (
    <motion.div
      className="space-y-1.5"
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.4 }}
    >
      {/* Header row: icon + label + human stat */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm">{icon}</span>
          <span className="text-xs font-bold text-gray-300">{label}</span>
        </div>
        <span className="text-xs font-bold text-white">{humanStat}</span>
      </div>

      {/* Bar */}
      <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full bg-gradient-to-r ${barColor}`}
          initial={{ width: 0 }}
          animate={{ width: `${barWidth}%` }}
          transition={{ delay: delay + 0.15, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>

      {/* Description */}
      <p className="text-[10px] text-gray-600">{description}</p>
    </motion.div>
  );
}

export default function BrainStatus({ dashboard, streak }) {
  const brainState = dashboard?.brain_state || {};
  const masteredCount = dashboard?.concepts_mastered_count ?? 0;
  const totalConcepts = dashboard?.total_concepts_in_exam ?? 0;
  const activeDays = dashboard?.active_days_this_week ?? 0;
  const currentStreak = streak?.current_streak ?? 0;

  // Compute human stats
  const dimensions = [
    {
      icon: "📚",
      label: "Covered",
      value: brainState.knowledge ?? 0,
      humanStat: `${masteredCount} of ${totalConcepts} concepts`,
      description: "How much of the syllabus you've practiced",
    },
    {
      icon: "💾",
      label: "Retention",
      value: brainState.retention ?? 0,
      humanStat: `Recall ${Math.round(brainState.retention ?? 0)}% now`,
      description: "What you'd remember if tested right now",
    },
    {
      icon: "🎯",
      label: "Accuracy",
      value: brainState.confidence ?? 0,
      humanStat: `${Math.round(brainState.confidence ?? 0)}% trend`,
      description: "Your recent quiz performance trend",
    },
    {
      icon: "⚡",
      label: "Momentum",
      value: brainState.momentum ?? 0,
      humanStat: `${activeDays} of 7 days active`,
      description: "Your study intensity this week",
    },
    {
      icon: "🔥",
      label: "Discipline",
      value: brainState.discipline ?? 0,
      humanStat: currentStreak > 0 ? `${currentStreak}-day streak` : "No streak yet",
      description: "Your habit consistency over time",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.5 }}
    >
      <GlassCard>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-sm">🧠</span>
          <p className="text-xs font-bold text-white">Your Brain</p>
        </div>

        <div className="space-y-4">
          {dimensions.map((dim, i) => (
            <BrainRow
              key={dim.label}
              icon={dim.icon}
              label={dim.label}
              humanStat={dim.humanStat}
              value={dim.value}
              description={dim.description}
              delay={0.45 + i * 0.06}
            />
          ))}
        </div>
      </GlassCard>
    </motion.div>
  );
}
