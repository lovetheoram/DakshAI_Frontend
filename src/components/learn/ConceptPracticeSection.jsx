// src/components/learn/ConceptPracticeSection.jsx
// Clean tactile Concept Practice Section aligned with Warm Ivory + Ink + Antique Gold styling.

import React from "react";
import { Flame, Target, RotateCcw, Clock, Award, ArrowRight } from "lucide-react";

export default function ConceptPracticeSection({ onStartQuiz }) {
  const modes = [
    {
      id: "quick",
      numQuestions: 5,
      type: "PYQS",
      title: "Quick 5-Question Check",
      desc: "Fast recall test for core formulas",
      questions: "5 Questions",
      time: "2 mins",
      badge: "Fast Track",
      icon: Flame,
    },
    {
      id: "exam",
      numQuestions: 20,
      type: "NEW",
      title: "Full Exam Simulation",
      desc: "Comprehensive topic test",
      questions: "20 Questions",
      time: "15 mins",
      badge: "Simulated Test",
      icon: Target,
    },
    {
      id: "mistakes",
      numQuestions: 10,
      type: "PYQS",
      title: "PYQs Practice Check",
      desc: "Practice authentic previous year exam questions",
      questions: "10 Questions",
      time: "8 mins",
      badge: "Exam PYQs",
      icon: RotateCcw,
    }
  ];

  return (
    <div className="space-y-6 select-none text-[var(--color-text-primary)]">
      <div>
        <h3 className="text-xs font-bold text-[var(--color-text-primary)] uppercase tracking-wider">
          Practice & Retrieval Modes
        </h3>
        <p className="text-[11px] text-[var(--color-text-secondary)] mt-0.5">Select a quiz format to test your retention evidence.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {modes.map((mode) => {
          const Icon = mode.icon;

          return (
            <div
              key={mode.id}
              className="daksh-card p-5 space-y-4 flex flex-col justify-between"
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
                <p className="text-[11px] text-[var(--color-text-secondary)]">{mode.desc}</p>
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
                  <span>Start Quiz</span>
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
