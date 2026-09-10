// src/components/learn/ConceptLearnSection.jsx
// Clean tactile Concept Learn Section aligned with Warm Ivory + Ink + Antique Gold identity.
// Includes Web Speech API Audio Notes Player and Interactive PYQ Cards.

import React, { useState, useEffect } from "react";
import { BookOpen, Layers, CheckCircle2, ArrowRight, Zap, Play, Pause, Square, Volume2, HelpCircle } from "lucide-react";
import PYQCard from "./PYQCard";

export default function ConceptLearnSection({
  conceptName,
  chapterName,
  description,
  formulas = [],
  rules = [],
  pyqs = [],
  aiMeta = {},
  onStartPractice
}) {
  const dbFormulas = aiMeta.layer_1_hard_formulas || formulas || [];
  const dbRules = aiMeta.layer_2_rule_based_logics || rules || [];

  // Web Speech API State
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    return () => {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handlePlayNotes = () => {
    if (!("speechSynthesis" in window)) {
      alert("Text-to-speech is not supported in this browser.");
      return;
    }

    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
      setIsSpeaking(true);
      return;
    }

    window.speechSynthesis.cancel();
    const textToSpeak = `${conceptName}. ${description || "Prerequisite revision notes for State PCS."}`;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };

    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
    setIsPaused(false);
  };

  const handlePauseNotes = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.pause();
      setIsPaused(true);
      setIsSpeaking(false);
    }
  };

  const handleStopNotes = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setIsPaused(false);
    }
  };

  return (
    <div className="space-y-6 select-none text-[var(--color-text-primary)]">
      {/* 1. Formal Description Card with Web Speech API Audio Bar */}
      <div className="daksh-card p-6 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <span className="text-caption tracking-widest text-[var(--color-gold)] font-bold uppercase flex items-center gap-1.5">
            <BookOpen size={14} />
            Prerequisite Revision Notes
          </span>

          {/* Web Speech Audio Controls */}
          <div className="flex items-center gap-1.5 bg-[var(--color-gold-pale)] px-3 py-1.5 rounded-xl border border-[var(--color-gold)]/30">
            <Volume2 size={13} className="text-[var(--color-gold-dark)] mr-1" />
            {!isSpeaking && !isPaused ? (
              <button
                onClick={handlePlayNotes}
                className="flex items-center gap-1 text-xs font-bold text-[var(--color-gold-dark)] hover:opacity-80 cursor-pointer"
              >
                <Play size={12} className="fill-current" />
                Listen Notes
              </button>
            ) : (
              <>
                {isSpeaking ? (
                  <button
                    onClick={handlePauseNotes}
                    className="flex items-center gap-1 text-xs font-bold text-[var(--color-gold-dark)] hover:opacity-80 cursor-pointer"
                  >
                    <Pause size={12} className="fill-current" />
                    Pause
                  </button>
                ) : (
                  <button
                    onClick={handlePlayNotes}
                    className="flex items-center gap-1 text-xs font-bold text-[var(--color-gold-dark)] hover:opacity-80 cursor-pointer"
                  >
                    <Play size={12} className="fill-current" />
                    Resume
                  </button>
                )}
                <button
                  onClick={handleStopNotes}
                  className="flex items-center gap-1 text-xs font-bold text-rose-700 hover:opacity-80 ml-2 cursor-pointer"
                >
                  <Square size={10} className="fill-current" />
                  Stop
                </button>
              </>
            )}
          </div>
        </div>

        <h2 className="text-base sm:text-lg font-bold text-[var(--color-text-primary)]">
          {conceptName}
        </h2>

        <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] leading-relaxed font-normal bg-[var(--color-bg-primary)] p-4 rounded-xl border border-[var(--color-border)]">
          {description || `${conceptName} is a foundational concept under ${chapterName || "State PCS Syllabus"}. Review the core notes and previous year questions below.`}
        </p>
      </div>

      {/* 2. Previous Year Questions (PYQs) Section */}
      {pyqs && pyqs.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-primary)] flex items-center gap-1.5">
              <HelpCircle size={15} className="text-[var(--color-gold)]" />
              Authentic Exam PYQs ({pyqs.length})
            </span>
            <span className="text-[10px] text-[var(--color-mid-gray)]">Ghatnachakra Verified</span>
          </div>

          <div className="space-y-4">
            {pyqs.map((pyq, idx) => (
              <PYQCard key={pyq.id || idx} pyq={pyq} index={idx} />
            ))}
          </div>
        </div>
      )}

      {/* 3. Key Formulas List */}
      {dbFormulas.length > 0 && (
        <div className="daksh-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-caption tracking-widest text-[var(--color-gold)] font-bold flex items-center gap-1.5">
              <Zap size={14} />
              Core Takeaways & Equations ({dbFormulas.length})
            </span>
          </div>

          <div className="space-y-3">
            {dbFormulas.map((f, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-primary)] space-y-2"
              >
                <code className="text-xs sm:text-sm font-mono font-bold text-[var(--color-text-primary)] block bg-white p-3 rounded-lg border border-[var(--color-border)]">
                  {typeof f === "string" ? f : f.formula || f.equation}
                </code>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Rule-Based Logics List */}
      {dbRules.length > 0 && (
        <div className="daksh-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-caption tracking-widest text-[var(--color-text-primary)] font-bold flex items-center gap-1.5">
              <CheckCircle2 size={14} className="text-[var(--color-gold)]" />
              Key Rules ({dbRules.length})
            </span>
          </div>

          <div className="space-y-2.5">
            {dbRules.map((rule, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-primary)] text-xs font-bold text-[var(--color-text-primary)]"
              >
                {typeof rule === "string" ? rule : rule.rule || rule.statement}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Single CTA Card */}
      <div className="daksh-card p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t-2 border-t-[var(--color-gold)]">
        <div>
          <h4 className="text-xs font-bold text-[var(--color-text-primary)]">Ready for custom practice test?</h4>
          <p className="text-[11px] text-[var(--color-text-secondary)] mt-0.5">Generate a timed quiz with adaptive revision items.</p>
        </div>

        <button
          onClick={onStartPractice}
          className="btn-gold px-5 py-2.5 rounded-xl text-xs font-bold shrink-0 flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <span>Start Practice Quiz</span>
          <ArrowRight size={15} />
        </button>
      </div>
    </div>
  );
}
