import { motion } from "framer-motion";

export default function ProgressRing({
  value = 0,
  size = 120,
  strokeWidth = 8,
  color = "var(--color-accent)",
  bgColor = "rgba(255,255,255,0.06)",
  label,
  sublabel,
  className = "",
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(100, value));
  const offset = circumference * (1 - clamped / 100);

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={bgColor}
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          style={{
            filter: `drop-shadow(0 0 6px ${color})`,
          }}
        />
      </svg>

      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {label !== undefined ? (
          <>
            <motion.span
              className="text-2xl font-black text-white"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              {label}
            </motion.span>
            {sublabel && (
              <span className="text-caption mt-0.5">{sublabel}</span>
            )}
          </>
        ) : (
          <>
            <motion.span
              className="text-2xl font-black text-white"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              {Math.round(clamped)}%
            </motion.span>
            {sublabel && (
              <span className="text-caption mt-0.5">{sublabel}</span>
            )}
          </>
        )}
      </div>
    </div>
  );
}
