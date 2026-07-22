// src/components/learn/ConceptHeaderHero.jsx
import React from "react";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, CheckCircle2 } from "lucide-react";
import ProgressRing from "../ui/ProgressRing";
import { getConceptTheme } from "./ConceptVisualTheme";

export default function ConceptHeaderHero({ conceptName, chapterName, masteryPercent, onContinue }) {
  const theme = getConceptTheme(conceptName, chapterName);

  return (
    <div
      className={`relative overflow-hidden rounded-3xl p-6 sm:p-8 border ${theme.borderGlow} shadow-2xl backdrop-blur-xl bg-slate-900/80 transition-all duration-500`}
      style={{
        backgroundImage: theme.gradient,
      }}
    >
      {/* Background Accent Blur */}
      <div
        className="absolute -top-10 -right-10 w-48 h-48 rounded-full blur-3xl opacity-40 pointer-events-none"
        style={{ backgroundColor: theme.primaryColor }}
      />
      <div
        className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full blur-3xl opacity-30 pointer-events-none"
        style={{ backgroundColor: theme.accentColor }}
      />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        {/* Left Side: Icon & Title */}
        <div className="flex items-start sm:items-center gap-4">
          <div
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center text-3xl sm:text-4xl shadow-xl shrink-0 border border-white/10"
            style={{
              background: `radial-gradient(circle at 30% 30%, rgba(255,255,255,0.2), rgba(0,0,0,0.6))`,
              boxShadow: `0 8px 32px ${theme.glowColor}`,
            }}
          >
            <motion.span
              animate={{ rotate: [0, -5, 5, 0], scale: [1, 1.05, 1] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              {theme.icon}
            </motion.span>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide uppercase border ${theme.pillBg}`}>
                {theme.badge}
              </span>
              <span className="text-xs text-gray-400 font-medium">
                {chapterName || "Core Concept"}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {conceptName || "Concept"}
            </h1>

            <div className="flex items-center gap-2 pt-0.5">
              <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                <CheckCircle2 size={13} />
                <span>{masteryPercent}% Mastered</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Mastery Ring & Continue CTA */}
        <div className="flex items-center justify-between md:justify-end gap-5 pt-2 md:pt-0 border-t border-white/10 md:border-t-0">
          <div className="flex items-center gap-3">
            <ProgressRing
              value={masteryPercent}
              size={64}
              strokeWidth={6}
              color={theme.accentColor}
              bgColor="rgba(255,255,255,0.06)"
              sublabel="MASTERED"
            />
          </div>

          <motion.button
            onClick={onContinue}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="px-5 py-3 rounded-2xl text-slate-900 font-extrabold text-sm shadow-xl flex items-center gap-2.5 transition-all"
            style={{
              backgroundColor: theme.accentColor,
              boxShadow: `0 0 24px ${theme.accentColor}60`,
            }}
          >
            <span>Start Practice</span>
            <ArrowRight size={16} className="stroke-[3]" />
          </motion.button>
        </div>
      </div>
    </div>
  );
}
