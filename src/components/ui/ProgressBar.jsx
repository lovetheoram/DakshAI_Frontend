import { motion } from "framer-motion";

export default function ProgressBar({
  value = 0,
  height = "h-2",
  color = "from-purple-500 to-indigo-500",
  bgColor = "bg-white/[0.04]",
  rounded = "rounded-full",
  className = "",
  showValue = false,
  animate = true,
}) {
  const clamped = Math.max(0, Math.min(100, value));

  return (
    <div className={`w-full ${className}`}>
      {showValue && (
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-caption">Progress</span>
          <span className="text-xs font-bold text-white">{Math.round(clamped)}%</span>
        </div>
      )}
      <div className={`w-full ${bgColor} ${height} ${rounded} overflow-hidden border border-white/[0.03]`}>
        <motion.div
          className={`${height} ${rounded} bg-gradient-to-r ${color} relative`}
          initial={animate ? { width: 0 } : false}
          animate={{ width: `${clamped}%` }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Subtle shimmer overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-60" />
        </motion.div>
      </div>
    </div>
  );
}
