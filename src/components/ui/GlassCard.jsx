// GlassCard.jsx — premium card foundation with experience token support
import React from "react";
import { motion } from "framer-motion";
import { useExperience } from "../../context/ThemeContext";

export default function GlassCard({
  children,
  className = "",
  hover = false,
  glow = false,
  onClick,
  padding = "p-5",
  accent = false, // new: add colored top border strip
  accentColor = "purple",
  ...props
}) {
  const { experienceTokens } = useExperience();
  const Component = onClick || hover ? motion.div : "div";
  const hoverScale = experienceTokens?.motion?.hoverScale || 1.015;

  const motionProps =
    onClick || hover
      ? {
          whileHover: { y: -2, scale: hoverScale },
          whileTap: onClick ? { scale: 0.99 } : {},
        }
      : {};

  const accentColors = {
    purple: "from-purple-500 via-violet-500 to-indigo-500",
    emerald: "from-emerald-500 via-teal-500 to-cyan-500",
    amber: "from-amber-500 via-orange-500 to-yellow-500",
    rose: "from-rose-500 via-pink-500 to-fuchsia-500",
    blue: "from-blue-500 via-sky-500 to-cyan-500",
  };

  return (
    <Component
      className={`
        relative
        rounded-2xl
        border border-[var(--color-border)]
        bg-[var(--color-surface)]
        text-[var(--color-text-main)]
        backdrop-blur-xl
        shadow-xl shadow-black/5
        ${hover || onClick ? "hover:border-[var(--color-border-active)] cursor-pointer" : ""}
        ${glow ? "ring-1 ring-sky-500/20 shadow-sky-500/10" : ""}
        transition-all duration-300
        overflow-hidden
        ${padding}
        ${className}
      `}
      onClick={onClick}
      {...motionProps}
      {...props}
    >
      {/* Subtle inner top-edge highlight */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />

      {/* Optional colored accent top strip */}
      {accent && (
        <div
          className={`absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r ${
            accentColors[accentColor] || accentColors.purple
          } pointer-events-none`}
        />
      )}

      {children}
    </Component>
  );
}
