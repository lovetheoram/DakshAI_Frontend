import { motion } from "framer-motion";

export default function ProgressBar({
  value = 0,
  height = "h-1.5",
  className = "",
  showValue = false,
  animate = true,
  // Keep color prop for backwards compat but ignore it
  color,
  bgColor,
  rounded,
}) {
  const clamped = Math.max(0, Math.min(100, value));

  return (
    <div className={`w-full ${className}`}>
      {showValue && (
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-caption">Progress</span>
          <span className="text-xs font-bold text-[var(--color-text-primary)]">{Math.round(clamped)}%</span>
        </div>
      )}
      <div className="w-full bg-[var(--color-cream)] h-1.5 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full relative"
          style={{
            background: `linear-gradient(90deg, var(--color-gold-light), var(--color-gold))`,
          }}
          initial={animate ? { width: 0 } : false}
          animate={{ width: `${clamped}%` }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
    </div>
  );
}
