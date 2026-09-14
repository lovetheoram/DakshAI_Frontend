// src/components/learn/ConceptHeaderHero.jsx
// Clean tactile Concept Header aligned with Warm Ivory + Ink + Antique Gold identity.

import React from "react";
import { ArrowRight, BookOpen, Target } from "lucide-react";
import InfoTooltip from "../ui/InfoTooltip";

export default function ConceptHeaderHero({ conceptName, chapterName, masteryPercent, onContinue }) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6 sm:p-7 space-y-4 border border-amber-500/30 border-t-4 border-t-[var(--color-gold)] text-slate-100 shadow-xl select-none">
      {/* Subtle ambient gold background glow */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-caption tracking-widest text-amber-400 font-bold uppercase flex items-center gap-1.5">
            <BookOpen size={14} />
            {chapterName || "Syllabus Topic"}
          </span>
          <InfoTooltip
            title="Concept Mastery Telemetry"
            meaning="Calculates your long-term memory retrieval strength on this specific formula and concept."
            formula="Concept Mastery = (Exam Quiz Accuracy * Ebbinghaus Retention Ratio) * 100%"
            howToIncrease="Complete active recall checks and PYQ quizzes to raise mastery toward 100%."
          />
        </div>

        <span className="text-xs font-bold text-amber-300 bg-amber-500/20 px-2.5 py-0.5 rounded-full border border-amber-500/40 flex items-center gap-1">
          <Target size={12} />
          {masteryPercent}% Mastered
        </span>
      </div>

      <div className="relative z-10 space-y-1">
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          {conceptName || "Concept Mastery"}
        </h1>
        <p className="text-xs sm:text-sm text-slate-200 font-semibold leading-relaxed">
          Review core formulas, rules, and real-world applications before active retrieval testing.
        </p>
      </div>

      <div className="relative z-10 pt-3 border-t border-slate-800/80 flex items-center justify-between">
        <span className="text-[11px] text-slate-400 font-semibold">
          Status: <strong className="text-amber-400">{masteryPercent >= 70 ? "Stable Retention" : masteryPercent >= 40 ? "Developing" : "Needs Revision"}</strong>
        </span>

        <button
          onClick={onContinue}
          className="btn-gold px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md cursor-pointer hover:scale-102 transition-transform"
        >
          <span>Test Recall in Quiz</span>
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}
