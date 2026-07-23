// src/components/ui/SubjectHeroIllustration.jsx
import React from "react";
import { getSubjectIdentity } from "../../context/ThemeContext";

export default function SubjectHeroIllustration({ subjectName = "Physics", className = "" }) {
  const identity = getSubjectIdentity(subjectName);
  const key = identity.name;

  return (
    <div className={`relative overflow-hidden rounded-2xl flex items-center justify-center p-6 bg-slate-900/80 border border-white/10 ${className}`}>
      {/* Background radial glow */}
      <div
        className="absolute inset-0 opacity-30 blur-2xl pointer-events-none"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${identity.accent}, transparent 70%)`,
        }}
      />

      <div className="relative z-10 text-center space-y-2 select-none">
        {/* Large Subject Icon */}
        <div
          className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-2xl flex items-center justify-center text-3xl sm:text-4xl shadow-xl border border-white/20 backdrop-blur-xl"
          style={{
            background: `radial-gradient(circle at 30% 30%, rgba(255,255,255,0.25), rgba(0,0,0,0.6))`,
            boxShadow: `0 8px 32px ${identity.accent}40`,
          }}
        >
          {identity.icon}
        </div>

        {/* SVG Decorative Art Graphic */}
        <svg className="w-32 h-12 mx-auto text-white/20" viewBox="0 0 100 30" fill="none" stroke="currentColor">
          {key === "Physics" && (
            <>
              <path d="M10 15 Q 30 0, 50 15 T 90 15" strokeWidth="2" strokeDasharray="3 3" />
              <circle cx="50" cy="15" r="4" fill={identity.accent} />
            </>
          )}
          {key === "Chemistry" && (
            <>
              <path d="M20 25 L40 5 L60 5 L80 25 Z" strokeWidth="1.5" />
              <circle cx="50" cy="18" r="3" fill={identity.accent} />
              <circle cx="42" cy="22" r="2" fill="#fff" />
            </>
          )}
          {key === "Mathematics" && (
            <>
              <line x1="10" y1="25" x2="90" y2="25" strokeWidth="2" />
              <line x1="10" y1="5" x2="10" y2="25" strokeWidth="2" />
              <path d="M10 25 L90 5" strokeWidth="1.5" strokeDasharray="2 2" />
            </>
          )}
          {key === "Biology" && (
            <>
              <path d="M20 15 C 40 0, 60 30, 80 15" strokeWidth="2" />
              <path d="M20 15 C 40 30, 60 0, 80 15" strokeWidth="2" />
            </>
          )}
          {key === "Computer Science" && (
            <>
              <rect x="20" y="5" width="60" height="20" rx="4" strokeWidth="1.5" />
              <line x1="35" y1="25" x2="65" y2="25" strokeWidth="2" />
            </>
          )}
          {key === "Astronomy" && (
            <>
              <ellipse cx="50" cy="15" rx="35" ry="8" strokeWidth="1.5" />
              <circle cx="50" cy="15" r="7" fill={identity.accent} />
            </>
          )}
        </svg>

        <span className="text-xs font-extrabold text-white tracking-wide uppercase block">
          {identity.name}
        </span>
      </div>
    </div>
  );
}
