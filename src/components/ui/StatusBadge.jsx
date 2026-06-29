export default function StatusBadge({
  children,
  variant = "default",
  icon,
  pulse = false,
  className = "",
}) {
  const variants = {
    default: "bg-white/[0.06] text-gray-300 border-white/[0.06]",
    accent:  "bg-purple-500/15 text-purple-300 border-purple-500/20",
    success: "bg-emerald-500/15 text-emerald-300 border-emerald-500/20",
    warning: "bg-amber-500/15 text-amber-300 border-amber-500/20",
    error:   "bg-red-500/15 text-red-300 border-red-500/20",
    info:    "bg-blue-500/15 text-blue-300 border-blue-500/20",
  };

  return (
    <span
      className={`
        inline-flex items-center gap-1.5
        px-3 py-1 rounded-full
        text-xs font-bold tracking-wide
        border
        ${variants[variant] || variants.default}
        ${pulse ? "animate-pulse-glow" : ""}
        ${className}
      `}
    >
      {icon && <span className="text-[0.7rem]">{icon}</span>}
      {children}
    </span>
  );
}
