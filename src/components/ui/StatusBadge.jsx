export default function StatusBadge({
  children,
  variant = "default",
  icon,
  pulse = false,
  className = "",
}) {
  const variants = {
    default: "bg-[var(--color-cream)] text-[var(--color-text-secondary)] border-[var(--color-border)]",
    accent:  "bg-[var(--color-gold-pale)] text-[var(--color-gold-dark)] border-[var(--color-gold)]/30",
    gold:    "bg-[var(--color-gold-pale)] text-[var(--color-gold-dark)] border-[var(--color-gold)]/30",
    success: "bg-[var(--color-success-light)] text-[var(--color-success)] border-[var(--color-success)]/20",
    warning: "bg-[var(--color-gold-pale)] text-[var(--color-gold-dark)] border-[var(--color-gold)]/30",
    error:   "bg-[var(--color-danger-light)] text-[var(--color-danger)] border-[var(--color-danger)]/20",
    danger:  "bg-[var(--color-danger-light)] text-[var(--color-danger)] border-[var(--color-danger)]/20",
    info:    "bg-blue-50 text-[var(--color-info)] border-[var(--color-info)]/20",
  };

  return (
    <span
      className={`
        inline-flex items-center gap-1.5
        px-2.5 py-1 rounded-full
        text-[11px] font-semibold tracking-wide
        border
        ${variants[variant] || variants.default}
        ${pulse ? "animate-gold-pulse" : ""}
        ${className}
      `}
    >
      {icon && <span className="text-[0.65rem]">{icon}</span>}
      {children}
    </span>
  );
}
