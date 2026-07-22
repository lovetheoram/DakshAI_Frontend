// src/components/ui/AmbientBackgroundEngine.jsx
import React from "react";
import { useTheme } from "../../context/ThemeContext";

export default function AmbientBackgroundEngine() {
  const { theme } = useTheme();

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      {/* 1. Base Layer Gradient Glow Blobs */}
      <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full blur-[140px] opacity-35 bg-[var(--color-accent)] transition-all duration-700" />
      <div className="absolute top-1/3 -right-32 w-[450px] h-[450px] rounded-full blur-[140px] opacity-25 bg-[var(--color-accent-light)] transition-all duration-700" />
      <div className="absolute -bottom-32 left-1/4 w-[600px] h-[600px] rounded-full blur-[160px] opacity-20 bg-[var(--color-accent-dark)] transition-all duration-700" />

      {/* 2. Theme-Specific Atmosphere Overlays */}
      {theme === "galaxy" && (
        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_50%_30%,rgba(139,92,246,0.15),transparent_70%)] animate-pulse-glow" />
      )}

      {theme === "sunrise" && (
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_50%_0%,rgba(249,115,22,0.2),transparent_75%)]" />
      )}

      {theme === "forest" && (
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_20%_80%,rgba(16,185,129,0.18),transparent_60%)]" />
      )}

      {theme === "candy" && (
        <div className="absolute inset-0 opacity-35 bg-[radial-gradient(circle_at_80%_20%,rgba(236,72,153,0.2),transparent_70%)]" />
      )}

      {theme === "midnight" && (
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_50%_50%,rgba(148,163,184,0.1),transparent_80%)]" />
      )}
    </div>
  );
}
