// src/components/learn/ConceptLearnSection.jsx
// Clean tactile Concept Learn Section aligned with Warm Ivory + Ink + Antique Gold identity.

import React from "react";
import { BookOpen, Layers, CheckCircle2, ArrowRight, Zap, Target } from "lucide-react";

export default function ConceptLearnSection({
  conceptName,
  chapterName,
  description,
  formulas = [],
  rules = [],
  aiMeta = {},
  onStartPractice
}) {
  const dbFormulas = aiMeta.layer_1_hard_formulas || formulas || [];
  const dbRules = aiMeta.layer_2_rule_based_logics || rules || [];

  return (
    <div className="space-y-6 select-none text-[var(--color-text-primary)]">
      {/* 1. Formal Description Card */}
      <div className="daksh-card p-6 space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-caption tracking-widest text-[var(--color-gold)] font-bold uppercase flex items-center gap-1.5">
            <BookOpen size={14} />
            Formal Concept Definition
          </span>
        </div>

        <h2 className="text-base sm:text-lg font-bold text-[var(--color-text-primary)]">
          {conceptName}
        </h2>

        <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] leading-relaxed font-normal">
          {description || `${conceptName} is a foundational concept in ${chapterName}. Review the core formulas and rules below to solidify your understanding.`}
        </p>
      </div>

      {/* 2. Key Formulas List */}
      {dbFormulas.length > 0 && (
        <div className="daksh-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-caption tracking-widest text-[var(--color-gold)] font-bold flex items-center gap-1.5">
              <Zap size={14} />
              Core Formulas ({dbFormulas.length})
            </span>
            <span className="text-[10px] text-[var(--color-mid-gray)]">Equation Breakdown</span>
          </div>

          <div className="space-y-3">
            {dbFormulas.map((f, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-primary)] space-y-2"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[var(--color-gold-dark)]">Formula #{idx + 1}</span>
                </div>
                <code className="text-sm sm:text-base font-mono font-bold text-[var(--color-text-primary)] block bg-white p-3 rounded-lg border border-[var(--color-border)]">
                  {typeof f === "string" ? f : f.formula || f.equation}
                </code>
                {f.used_for && (
                  <p className="text-xs text-[var(--color-text-secondary)]">
                    <strong className="text-[var(--color-text-primary)]">Context / Used for:</strong> {f.used_for}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Rule-Based Logics List */}
      {dbRules.length > 0 && (
        <div className="daksh-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-caption tracking-widest text-[var(--color-text-primary)] font-bold flex items-center gap-1.5">
              <CheckCircle2 size={14} className="text-[var(--color-gold)]" />
              Rule-Based Logics ({dbRules.length})
            </span>
          </div>

          <div className="space-y-2.5">
            {dbRules.map((rule, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-primary)] space-y-1 text-xs"
              >
                <span className="text-[10px] font-bold text-[var(--color-gold-dark)] uppercase block">Rule #{idx + 1}</span>
                <p className="font-bold text-[var(--color-text-primary)]">
                  {typeof rule === "string" ? rule : rule.rule || rule.statement}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Single CTA Card */}
      <div className="daksh-card p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t-2 border-t-[var(--color-gold)]">
        <div>
          <h4 className="text-xs font-bold text-[var(--color-text-primary)]">Finished reviewing notes?</h4>
          <p className="text-[11px] text-[var(--color-text-secondary)] mt-0.5">Test your recall stability in PYQ practice mode.</p>
        </div>

        <button
          onClick={onStartPractice}
          className="btn-gold px-5 py-2.5 rounded-xl text-xs font-bold shrink-0 flex items-center justify-center gap-1.5"
        >
          <span>Test Recall in Quiz</span>
          <ArrowRight size={15} />
        </button>
      </div>
    </div>
  );
}
