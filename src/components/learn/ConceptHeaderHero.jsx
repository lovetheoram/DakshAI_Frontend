// src/components/learn/ConceptHeaderHero.jsx
// Clean tactile Concept Header aligned with Warm Ivory + Ink + Antique Gold identity.

import React from "react";
import { ArrowRight, BookOpen, Target } from "lucide-react";
import InfoTooltip from "../ui/InfoTooltip";

export default function ConceptHeaderHero({ conceptName, chapterName, masteryPercent, onContinue }) {
  return (
    <div className="daksh-card p-6 sm:p-7 space-y-4 border-t-3 border-t-[var(--color-gold)] text-[var(--color-text-primary)] select-none">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-caption tracking-widest text-[var(--color-gold)] font-bold uppercase flex items-center gap-1.5">
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

        <span className="text-xs font-bold text-[var(--color-gold-dark)] bg-[var(--color-gold-pale)] px-2.5 py-0.5 rounded-full border border-[var(--color-gold)]/20 flex items-center gap-1">
          <Target size={12} />
          {masteryPercent}% Mastered
        </span>
      </div>

      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-bold text-[var(--color-text-primary)] tracking-tight">
          {conceptName || "Concept Mastery"}
        </h1>
        <p className="text-xs text-[var(--color-text-secondary)] font-normal">
          Review core formulas, rules, and real-world applications before active retrieval testing.
        </p>
      </div>

      <div className="pt-2 border-t border-[var(--color-border)] flex items-center justify-between">
        <span className="text-[11px] text-[var(--color-mid-gray)] font-semibold">
          Status: <strong className="text-[var(--color-text-primary)]">{masteryPercent >= 70 ? "Stable Retention" : masteryPercent >= 40 ? "Developing" : "Needs Revision"}</strong>
        </span>

        <button
          onClick={onContinue}
          className="btn-gold px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
        >
          <span>Test Recall in Quiz</span>
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}
