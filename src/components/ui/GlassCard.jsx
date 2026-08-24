// GlassCard.jsx — Tactile White Surface Card Component
import React from "react";
import { motion } from "framer-motion";

export default function GlassCard({
  children,
  className = "",
  hover = false,
  glow = false,
  onClick,
  padding = "p-5",
  accent = false,
  ...props
}) {
  const Component = onClick || hover ? motion.div : "div";

  const motionProps =
    onClick || hover
      ? {
          whileHover: { y: -1.5 },
          whileTap: onClick ? { scale: 0.995 } : {},
        }
      : {};

  return (
    <Component
      className={`
        relative
        rounded-2xl
        border border-[var(--color-border)]
        bg-white
        text-[var(--color-text-primary)]
        shadow-[var(--shadow-card)]
        ${hover || onClick ? "hover:border-[var(--color-border-hover)] hover:shadow-[var(--shadow-md)] cursor-pointer" : ""}
        ${glow ? "border-[var(--color-gold)] shadow-[var(--shadow-gold)]" : ""}
        transition-all duration-200
        overflow-hidden
        ${padding}
        ${className}
      `}
      onClick={onClick}
      {...motionProps}
      {...props}
    >
      {/* Optional gold accent left border */}
      {accent && (
        <div
          className="absolute left-0 top-3 bottom-3 w-[3px] rounded-full bg-[var(--color-gold)] pointer-events-none"
        />
      )}

      {children}
    </Component>
  );
}
