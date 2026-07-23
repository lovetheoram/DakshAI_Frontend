import GlassCard from "../ui/GlassCard";
import { motion } from "framer-motion";

const DIMENSION_CONFIG = [
  {
    label: "Covered",
    icon: "📚",
    colors: { high: "from-blue-500 to-cyan-400", mid: "from-amber-500 to-yellow-400", low: "from-red-500 to-rose-400" },
    dotColor: { high: "bg-blue-400", mid: "bg-amber-400", low: "bg-red-400" },
  },
  {
    label: "Retention",
    icon: "💾",
    colors: { high: "from-teal-500 to-emerald-400", mid: "from-amber-500 to-yellow-400", low: "from-red-500 to-rose-400" },
    dotColor: { high: "bg-teal-400", mid: "bg-amber-400", low: "bg-red-400" },
  },
  {
    label: "Accuracy",
    icon: "🎯",
    colors: { high: "from-purple-500 to-violet-400", mid: "from-amber-500 to-yellow-400", low: "from-red-500 to-rose-400" },
    dotColor: { high: "bg-purple-400", mid: "bg-amber-400", low: "bg-red-400" },
  },
  {
    label: "Momentum",
    icon: "⚡",
    colors: { high: "from-indigo-500 to-blue-400", mid: "from-amber-500 to-yellow-400", low: "from-red-500 to-rose-400" },
    dotColor: { high: "bg-indigo-400", mid: "bg-amber-400", low: "bg-red-400" },
  },
  {
    label: "Discipline",
    icon: "🔥",
    colors: { high: "from-orange-500 to-amber-400", mid: "from-amber-500 to-yellow-400", low: "from-red-500 to-rose-400" },
    dotColor: { high: "bg-orange-400", mid: "bg-amber-400", low: "bg-red-400" },
  },
];

function BrainRow({ icon, label, humanStat, value, description, delay, config }) {
  const barWidth = Math.max(0, Math.min(100, value));
  const tier = value >= 60 ? "high" : value >= 30 ? "mid" : "low";
  const barColor = config.colors[tier];
  const dotColor = config.dotColor[tier];
  const statColor = tier === "high" ? "text-white" : tier === "mid" ? "text-amber-300" : "text-rose-300";

  return (
    <motion.div
      className="group"
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.4 }}
    >
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${dotColor} shadow-md`} />
          <span className="text-xs font-bold text-gray-300">{icon} {label}</span>
        </div>
        <span className={`text-xs font-black tabular-nums ${statColor}`}>{humanStat}</span>
      </div>

      {/* Bar track */}
      <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden border border-white/[0.04]">
        <motion.div
          className={`h-full rounded-full bg-gradient-to-r ${barColor}`}
          initial={{ width: 0 }}
          animate={{ width: `${barWidth}%` }}
          transition={{ delay: delay + 0.15, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>

      <p className="text-[10px] text-gray-600 mt-1 leading-none">{description}</p>
    </motion.div>
  );
}

export default function BrainStatus({ dashboard, streak }) {
  const brainState = dashboard?.brain_state || {};
  const masteredCount = dashboard?.concepts_mastered_count ?? 0;
  const totalConcepts = dashboard?.total_concepts_in_exam ?? 0;
  const activeDays = dashboard?.active_days_this_week ?? 0;
  const currentStreak = streak?.current_streak ?? 0;

  const dimensions = [
    {
      label: "Covered",
      value: brainState.knowledge ?? 0,
      humanStat: `${masteredCount}/${totalConcepts} concepts`,
      description: "How much of the syllabus you've practiced",
    },
    {
      label: "Retention",
      value: brainState.retention ?? 0,
      humanStat: `${Math.round(brainState.retention ?? 0)}% recall`,
      description: "What you'd remember if tested right now",
    },
    {
      label: "Accuracy",
      value: brainState.confidence ?? 0,
      humanStat: `${Math.round(brainState.confidence ?? 0)}% trend`,
      description: "Your recent quiz performance trend",
    },
    {
      label: "Momentum",
      value: brainState.momentum ?? 0,
      humanStat: `${activeDays}/7 days`,
      description: "Your study intensity this week",
    },
    {
      label: "Discipline",
      value: brainState.discipline ?? 0,
      humanStat: currentStreak > 0 ? `${currentStreak}-day streak` : "No streak yet",
      description: "Your habit consistency over time",
    },
  ];

  // Overall brain health score
  const allVals = dimensions.map((d) => d.value);
  const avgScore = Math.round(allVals.reduce((a, b) => a + b, 0) / allVals.length);
  const healthLabel = avgScore >= 65 ? "Excellent" : avgScore >= 40 ? "Growing" : "Needs Work";
  const healthColor =
    avgScore >= 65 ? "text-emerald-400" : avgScore >= 40 ? "text-amber-400" : "text-rose-400";
  const healthRingColor =
    avgScore >= 65
      ? "from-emerald-500 to-teal-400"
      : avgScore >= 40
      ? "from-amber-500 to-yellow-400"
      : "from-rose-500 to-red-400";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <GlassCard accent accentColor="purple">
        {/* Header with Brain Health Score */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center text-lg shadow-lg shadow-purple-500/20">
              🧠
            </div>
            <div>
              <p className="text-xs font-black text-white">Brain Core</p>
              <p className="text-[10px] text-gray-500">Neural performance snapshot</p>
            </div>
          </div>

          {/* Overall health score ring */}
          <div className="text-right">
            <p className={`text-xl font-black tabular-nums ${healthColor}`}>{avgScore}%</p>
            <p className={`text-[10px] font-bold ${healthColor}`}>{healthLabel}</p>
          </div>
        </div>

        <div className="space-y-3.5">
          {dimensions.map((dim, i) => (
            <BrainRow
              key={dim.label}
              icon={DIMENSION_CONFIG[i].icon}
              label={dim.label}
              humanStat={dim.humanStat}
              value={dim.value}
              description={dim.description}
              delay={0.45 + i * 0.07}
              config={DIMENSION_CONFIG[i]}
            />
          ))}
        </div>
      </GlassCard>
    </motion.div>
  );
}
