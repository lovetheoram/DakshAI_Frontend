import GlassCard from "../ui/GlassCard";
import { motion } from "framer-motion";

const BRAIN_METRICS = [
  { key: "knowledge",   label: "Knowledge",   color: "#a855f7", emoji: "🧠" },
  { key: "memory",      label: "Memory",      color: "#3b82f6", emoji: "💾" },
  { key: "accuracy",    label: "Accuracy",    color: "#22c55e", emoji: "🎯" },
  { key: "consistency", label: "Consistency", color: "#f59e0b", emoji: "⚡" },
  { key: "focus",       label: "Focus",       color: "#ef4444", emoji: "🔥" },
];

function MiniRing({ value, color, emoji, label, delay }) {
  const size = 52;
  const stroke = 4;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - Math.max(0, Math.min(100, value)) / 100);

  return (
    <motion.div
      className="flex flex-col items-center gap-1.5 group cursor-default"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.4 }}
    >
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2} cy={size / 2} r={radius}
            fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth={stroke}
          />
          <motion.circle
            cx={size / 2} cy={size / 2} r={radius}
            fill="none" stroke={color} strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ delay: delay + 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            style={{ filter: `drop-shadow(0 0 4px ${color}40)` }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center text-lg">
          {emoji}
        </div>
      </div>

      {/* Label appears on hover */}
      <span className="text-[10px] font-semibold text-gray-600 group-hover:text-gray-300 transition-colors">
        {Math.round(value)}%
      </span>
    </motion.div>
  );
}

export default function BrainStatus({ dashboard }) {
  const stats = dashboard?.brain_stats || {};

  return (
    <GlassCard>
      <p className="text-caption mb-4">Brain Status</p>

      <div className="flex items-center justify-between px-2">
        {BRAIN_METRICS.map((metric, i) => (
          <MiniRing
            key={metric.key}
            value={stats[metric.key] ?? 0}
            color={metric.color}
            emoji={metric.emoji}
            label={metric.label}
            delay={i * 0.08}
          />
        ))}
      </div>
    </GlassCard>
  );
}
