// src/components/ui/ConceptCard.jsx
import React from "react";
import { motion } from "framer-motion";
import { Play, CheckCircle2, ArrowRight, BookOpen, Clock, Award } from "lucide-react";
import ProgressRing from "./ProgressRing";
import { useExperience } from "../../context/ThemeContext";

/**
 * Universal Concept Card for DakshAI
 * Used across Home, Learn (Concept Workspace), Growth, and World.
 */
export default function ConceptCard({
  title = "Electricity & Circuits",
  chapter = "Physics · Chapter 3",
  progress = 65,
  variant = "home", // 'home' | 'learn' | 'growth' | 'world'
  estimatedTime = "18 mins",
  difficulty = "Medium",
  onAction,
  extraMeta = null,
  className = "",
}) {
  const { experienceTokens } = useExperience();

  const badgeIcon = experienceTokens?.illustration?.badgeIcon || "⚡";
  const hoverScale = experienceTokens?.motion?.hoverScale || 1.02;
  const tokenSurfaces = experienceTokens?.surfaces || {};
  const tokenCopy = experienceTokens?.copy || {};

  return (
    <motion.div
      whileHover={{ y: -3, scale: hoverScale, transition: { duration: 0.2 } }}
      className={`glass relative overflow-hidden rounded-2xl border ${tokenSurfaces.borderGlow || "border-white/10"} ${tokenSurfaces.cardBg || "bg-slate-900/80"} p-6 shadow-xl backdrop-blur-xl transition-all duration-300 ${className}`}
    >
      {/* Background Accent Glow */}
      <div className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-purple-600/10 blur-2xl group-hover:bg-purple-600/20 transition-all" />

      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          {/* Chapter Badge with Environment Icon */}
          <div className="mb-2 flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-lg bg-purple-500/15 px-2.5 py-1 text-xs font-semibold text-purple-300 border border-purple-500/20">
              <span>{badgeIcon}</span>
              <span>{chapter}</span>
            </span>
            {estimatedTime && (
              <span className="flex items-center gap-1 text-[11px] font-medium text-gray-400">
                <Clock size={12} />
                {estimatedTime}
              </span>
            )}
          </div>

          {/* Concept Title */}
          <h3 className="text-lg font-bold text-white tracking-tight group-hover:text-purple-300 transition-colors">
            {title}
          </h3>

          {/* Environment-specific copy quote snippet if available */}
          <div className="mt-1 text-[11px] text-purple-300/80 font-medium italic">
            "{tokenCopy.greeting || "Focus session active"}"
          </div>

          {extraMeta && <div className="mt-2 text-xs text-gray-400">{extraMeta}</div>}
        </div>

        {/* Progress Ring Indicator */}
        <div className="flex flex-col items-center justify-center shrink-0">
          <ProgressRing progress={progress} size={48} strokeWidth={4} />
        </div>
      </div>

      {/* Footer Actions Based on Variant */}
      <div className="mt-5 flex items-center justify-between border-t border-white/5 pt-4">
        {variant === "growth" ? (
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-400 border border-emerald-500/20">
              <CheckCircle2 size={14} />
              {progress >= 100 ? "Mastered" : "In Progress"}
            </span>
            <span className="text-xs text-gray-400 font-medium">{difficulty}</span>
          </div>
        ) : variant === "world" ? (
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <Award size={14} className="text-amber-400" />
            <span>Student Innovation Context</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <BookOpen size={14} className="text-purple-400" />
            <span>{difficulty} Rigor</span>
          </div>
        )}

        <button
          onClick={onAction}
          className="group/btn flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-purple-600/25 transition-all hover:bg-purple-500 hover:shadow-purple-500/40 active:scale-95"
        >
          {variant === "home" && (
            <>
              <span>{tokenCopy.mission || "Continue Session"}</span>
              <Play size={13} className="fill-current transition-transform group-hover/btn:translate-x-0.5" />
            </>
          )}
          {variant === "learn" && (
            <>
              <span>Open Workspace</span>
              <ArrowRight size={13} className="transition-transform group-hover/btn:translate-x-0.5" />
            </>
          )}
          {variant === "growth" && (
            <>
              <span>Review Journey</span>
              <ArrowRight size={13} className="transition-transform group-hover/btn:translate-x-0.5" />
            </>
          )}
          {variant === "world" && (
            <>
              <span>Explore Project</span>
              <ArrowRight size={13} className="transition-transform group-hover/btn:translate-x-0.5" />
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
}
