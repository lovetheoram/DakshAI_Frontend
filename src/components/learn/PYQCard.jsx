// src/components/learn/PYQCard.jsx
// Interactive PYQ Card with Provenance Badge, Answer Check & Structured Insights Cards (Pattern, Trap, Hook)

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, Flame, AlertTriangle, Brain, BookOpen, ChevronDown, ChevronUp } from "lucide-react";

export default function PYQCard({ pyq, index }) {
  const [selectedOption, setSelectedOption] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);

  const options = pyq.options || [];
  const correctAnswerStr = String(pyq.correct_answer || "").trim();
  const summary = pyq.experiential_summary || {};

  // Check if option matches correct answer
  const isSelected = (opt, idx) => {
    if (selectedOption === null) return false;
    return selectedOption === opt || selectedOption === idx;
  };

  const isCorrect = (opt, idx) => {
    if (!correctAnswerStr) return false;
    const letter = String.fromCharCode(65 + idx); // 'A', 'B', 'C', 'D'
    return (
      correctAnswerStr.toLowerCase() === opt.toLowerCase() ||
      correctAnswerStr.toUpperCase() === letter ||
      correctAnswerStr.includes(opt)
    );
  };

  const handleSelect = (opt, idx) => {
    if (selectedOption !== null) return; // Locked after selection
    setSelectedOption(opt);
    setShowExplanation(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="daksh-card p-5 sm:p-6 space-y-4 text-[var(--color-text-primary)]"
    >
      {/* 1. Header & Provenance Badge */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-[var(--color-gold-pale)] text-[var(--color-gold-dark)] border border-[var(--color-gold)]/20">
            {pyq.exam_source || "State PCS"} {pyq.exam_year ? `(${pyq.exam_year})` : ""}
          </span>
          {pyq.source_page && (
            <span className="text-[10px] text-[var(--color-mid-gray)] flex items-center gap-1 font-medium">
              <BookOpen size={11} />
              Page {pyq.source_page}
            </span>
          )}
        </div>
        <span className="text-[10px] font-bold text-[var(--color-mid-gray)] uppercase tracking-wider">
          PYQ #{index + 1}
        </span>
      </div>

      {/* 2. Question Text */}
      <h3 className="text-sm sm:text-base font-bold text-[var(--color-text-primary)] leading-relaxed">
        {pyq.question_text}
      </h3>

      {/* 3. Options Grid */}
      <div className="space-y-2 pt-1">
        {options.map((opt, idx) => {
          const letter = String.fromCharCode(65 + idx);
          const optionSelected = isSelected(opt, idx);
          const optionCorrect = isCorrect(opt, idx);
          const answered = selectedOption !== null;

          let btnStyle = "border-[var(--color-border)] bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] hover:border-[var(--color-gold)]/50";
          
          if (answered) {
            if (optionCorrect) {
              btnStyle = "border-emerald-500 bg-emerald-50 text-emerald-900 font-bold shadow-xs";
            } else if (optionSelected && !optionCorrect) {
              btnStyle = "border-rose-500 bg-rose-50 text-rose-900 font-bold";
            } else {
              btnStyle = "border-[var(--color-border)] bg-gray-50 opacity-60";
            }
          }

          return (
            <button
              key={idx}
              disabled={answered}
              onClick={() => handleSelect(opt, idx)}
              className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm transition-all flex items-start justify-between gap-3 cursor-pointer ${btnStyle}`}
            >
              <div className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                  {letter}
                </span>
                <span className="leading-snug">{opt}</span>
              </div>

              {answered && (
                <div className="shrink-0 mt-0.5">
                  {optionCorrect ? (
                    <CheckCircle2 size={16} className="text-emerald-600" />
                  ) : optionSelected ? (
                    <XCircle size={16} className="text-rose-600" />
                  ) : null}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* 4. Explanation & Structured Insights Drawer */}
      <AnimatePresence>
        {showExplanation && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4 pt-4 border-t border-[var(--color-border)] overflow-hidden"
          >
            {/* Answer Result Banner */}
            <div className="p-3 rounded-xl bg-[var(--color-gold-pale)] border border-[var(--color-gold)]/30 flex items-center justify-between text-xs font-bold text-[var(--color-gold-dark)]">
              <span>Correct Answer: {pyq.correct_answer}</span>
              <button
                onClick={() => setShowExplanation(!showExplanation)}
                className="flex items-center gap-1 text-[11px] underline cursor-pointer"
              >
                {showExplanation ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                Hide Solution
              </button>
            </div>

            {/* Explanation text */}
            {pyq.explanation && (
              <div className="space-y-1 text-xs sm:text-sm text-[var(--color-text-secondary)] leading-relaxed">
                <span className="text-[11px] font-bold text-[var(--color-text-primary)] uppercase tracking-wider block">
                  Detailed Explanation:
                </span>
                <p className="bg-[var(--color-bg-primary)] p-3.5 rounded-xl border border-[var(--color-border)]">
                  {pyq.explanation}
                </p>
              </div>
            )}

            {/* Structured Insights Cards (Pattern, Trap, Hook) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              {/* 🔥 Exam Pattern */}
              <div className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/50 space-y-1">
                <div className="flex items-center gap-1.5 text-amber-800 text-[11px] font-bold uppercase tracking-wider">
                  <Flame size={14} className="text-amber-600" />
                  Exam Pattern
                </div>
                <p className="text-[11px] text-amber-900 leading-snug">
                  {summary.trend || summary.pattern || "Frequently tested in State PCS examinations."}
                </p>
              </div>

              {/* ⚠️ Common Trap */}
              <div className="p-3.5 rounded-xl border border-rose-200 bg-rose-50/50 space-y-1">
                <div className="flex items-center gap-1.5 text-rose-800 text-[11px] font-bold uppercase tracking-wider">
                  <AlertTriangle size={14} className="text-rose-600" />
                  Common Trap
                </div>
                <p className="text-[11px] text-rose-900 leading-snug">
                  {summary.trap || "Pay close attention to exact site locations and period chronology."}
                </p>
              </div>

              {/* 🧠 Memory Hook */}
              <div className="p-3.5 rounded-xl border border-indigo-200 bg-indigo-50/50 space-y-1">
                <div className="flex items-center gap-1.5 text-indigo-800 text-[11px] font-bold uppercase tracking-wider">
                  <Brain size={14} className="text-indigo-600" />
                  Memory Hook
                </div>
                <p className="text-[11px] text-indigo-900 leading-snug">
                  {summary.memory_hook || "Connect key findings with primary excavation leads."}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
