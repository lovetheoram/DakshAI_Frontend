// src/components/learn/ConceptPracticeSection.jsx
// Distinct, Un-mixed Practice Modes Aligned with Backend Data & Warm Ivory + Ink + Antique Gold styling.

import React from "react";
import { Brain, Target, Award, ArrowRight } from "lucide-react";

export default function ConceptPracticeSection({ onStartQuiz }) {
  const modes = [
    {
      id: "concept-ai",
      numQuestions: 5,
      type: "LLM",
      title: "1. Concept AI Practice",
      desc: "Adaptive practice questions generated specifically for this concept by AI.",
      questions: "5 Questions",
      time: "4 mins",
      badge: "Concept AI Generated",
      icon: Brain,
    },
    {
      id: "exam-sim",
      numQuestions: 20,
      type: "FULL_EXAM",
      title: "2. Full Exam Simulation",
      desc: "Full-length timed exam simulation covering overall topic endurance.",
      questions: "20 Questions",
      time: "15 mins",
      badge: "Full Exam Test",
      icon: Target,
    },
    {
      id: "mock-pyqs",
      numQuestions: 10,
      type: "PYQS",
      title: "3. Authentic PYQ Questions",
      desc: "Authentic previous year questions with options, correct answer, and detailed backend explanations.",
      questions: "10 Questions",
      time: "8 mins",
      badge: "Verified PYQs",
      icon: Award,
    }
  ];

  return (
    <div className="space-y-6 select-none text-[var(--color-text-primary)]">
      <div>
        <h3 className="text-xs font-bold text-[var(--color-text-primary)] uppercase tracking-wider">
          Practice & Retrieval Modes
        </h3>
        <p className="text-[11px] text-[var(--color-text-secondary)] mt-0.5">Select a dedicated practice mode. Each mode has a separate, distinct purpose.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {modes.map((mode) => {
          const Icon = mode.icon;

          return (
            <div
              key={mode.id}
              className="daksh-card p-5 space-y-4 flex flex-col justify-between border-t-2 border-t-[var(--color-gold)]"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-lg bg-[var(--color-gold-pale)] text-[var(--color-gold-dark)] flex items-center justify-center font-bold">
                    <Icon size={16} />
                  </div>
                  <span className="text-[10px] font-bold text-[var(--color-gold-dark)] bg-[var(--color-gold-pale)] px-2 py-0.5 rounded-md border border-[var(--color-gold)]/20">
                    {mode.badge}
                  </span>
                </div>

                <h4 className="text-xs font-bold text-[var(--color-text-primary)]">{mode.title}</h4>
                <p className="text-[11px] text-[var(--color-text-secondary)] leading-relaxed">{mode.desc}</p>
              </div>

              <div className="space-y-3 pt-2 border-t border-[var(--color-border)]">
                <div className="flex items-center justify-between text-[11px] font-semibold text-[var(--color-text-secondary)]">
                  <span>{mode.questions}</span>
                  <span>~{mode.time}</span>
                </div>

                <button
                  onClick={() => onStartQuiz(mode.numQuestions, mode.type)}
                  className="w-full py-2.5 rounded-xl btn-gold text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <span>Start Mode</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
