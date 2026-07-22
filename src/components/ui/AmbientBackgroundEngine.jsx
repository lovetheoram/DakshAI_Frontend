// src/components/ui/AmbientBackgroundEngine.jsx
import React from "react";
import { useExperience } from "../../context/ThemeContext";

export default function EnvironmentRenderer() {
  const { theme, experienceTokens } = useExperience();
  const pType = experienceTokens?.illustration?.particleType || "minimal";

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      {/* 1. Base Ambient Glow Blobs */}
      <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full blur-[140px] opacity-35 bg-[var(--color-accent)] transition-all duration-700" />
      <div className="absolute top-1/3 -right-32 w-[450px] h-[450px] rounded-full blur-[140px] opacity-25 bg-[var(--color-accent-light)] transition-all duration-700" />
      <div className="absolute -bottom-32 left-1/4 w-[600px] h-[600px] rounded-full blur-[160px] opacity-20 bg-[var(--color-accent-dark)] transition-all duration-700" />

      {/* 2. Theme Atmospheric Overlays */}
      {theme === "galaxy" && (
        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_50%_30%,rgba(139,92,246,0.2),transparent_70%)] animate-pulse-glow" />
      )}

      {theme === "sunrise" && (
        <div className="absolute inset-0 opacity-35 bg-[radial-gradient(circle_at_50%_0%,rgba(249,115,22,0.25),transparent_75%)]" />
      )}

      {theme === "forest" && (
        <div className="absolute inset-0 opacity-35 bg-[radial-gradient(circle_at_20%_80%,rgba(16,185,129,0.2),transparent_60%)]" />
      )}

      {theme === "candy" && (
        <div className="absolute inset-0 opacity-35 bg-[radial-gradient(circle_at_80%_20%,rgba(236,72,153,0.25),transparent_70%)]" />
      )}

      {theme === "midnight" && (
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_50%_50%,rgba(148,163,184,0.1),transparent_80%)]" />
      )}

      {/* 3. Floating Particles Canvas overlay based on pType */}
      {pType === "stars" && (
        <div className="absolute inset-0 opacity-60">
          <div className="absolute top-10 left-1/5 text-purple-400 text-xs animate-pulse">✦</div>
          <div className="absolute top-1/4 left-3/4 text-cyan-300 text-xs animate-ping">✧</div>
          <div className="absolute top-2/3 left-1/3 text-indigo-300 text-sm animate-pulse">★</div>
          <div className="absolute top-1/2 left-4/5 text-purple-300 text-xs animate-bounce">✨</div>
        </div>
      )}

      {pType === "leaves" && (
        <div className="absolute inset-0 opacity-50">
          <div className="absolute top-12 left-10 text-emerald-400 text-sm animate-bounce">🍃</div>
          <div className="absolute top-1/3 left-4/5 text-green-300 text-xs animate-pulse">🌿</div>
          <div className="absolute top-3/4 left-1/4 text-emerald-300 text-sm animate-pulse">🍃</div>
        </div>
      )}

      {pType === "sunbeams" && (
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-5 left-1/3 text-amber-400 text-sm animate-pulse">🌅</div>
          <div className="absolute top-1/2 left-1/4 text-amber-300 text-xs animate-ping">✨</div>
        </div>
      )}

      {pType === "bubbles" && (
        <div className="absolute inset-0 opacity-50">
          <div className="absolute top-20 left-1/4 text-pink-400 text-sm animate-bounce">🍬</div>
          <div className="absolute top-1/2 left-3/4 text-sky-400 text-xs animate-pulse">✨</div>
        </div>
      )}
    </div>
  );
}

export { EnvironmentRenderer as AmbientBackgroundEngine };
