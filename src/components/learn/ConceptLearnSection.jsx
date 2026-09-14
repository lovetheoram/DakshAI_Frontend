// src/components/learn/ConceptLearnSection.jsx
// Clean, Focused Concept Learn Section aligned with Warm Ivory + Ink + Antique Gold identity.
// Contains ONLY the concept notes with a simple speech reader (Speech speed & language are managed in Settings Page).

import React, { useState, useEffect } from "react";
import { BookOpen, Zap, CheckCircle2, Volume2, Play, Pause, Square } from "lucide-react";
import PreferenceStore from "../../product/preferenceStore";

export default function ConceptLearnSection({
  conceptName,
  chapterName,
  description,
  formulas = [],
  rules = [],
  aiMeta = {}
}) {
  const dbFormulas = aiMeta.layer_1_hard_formulas || formulas || [];
  const dbRules = aiMeta.layer_2_rule_based_logics || rules || [];

  // Web Speech API State using global PreferenceStore settings
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
    const prefs = PreferenceStore.getPreferences();
    const textToSpeak = `${conceptName}. ${description || "Concept notes for syllabus revision."}`;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);

    // Apply speed and voice from Settings preferences
    utterance.rate = prefs.speechRate || 1.0;
    utterance.pitch = 1.0;

    const voices = window.speechSynthesis.getVoices();
    const targetLang = prefs.speechVoiceLang || "en-US";
    const matchedVoice = voices.find(v => v.lang.includes(targetLang) || v.lang.startsWith("en"));
    if (matchedVoice) utterance.voice = matchedVoice;

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
      
      {/* ── 1. CONCEPT REVISION NOTES (ONLY THE NOTES) ── */}
      <div className="daksh-card p-6 sm:p-7 space-y-4 border-t-3 border-t-[var(--color-gold)]">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <span className="text-caption tracking-widest text-[var(--color-gold-dark)] font-bold uppercase flex items-center gap-1.5">
            <BookOpen size={15} />
            Concept Revision Notes
          </span>

          {/* Simple Clean Audio Reader Button (Uses Settings Defaults) */}
          <div className="flex items-center gap-2">
            {!isSpeaking && !isPaused ? (
              <button
                onClick={handlePlayNotes}
                className="btn-gold px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
                title="Listen to notes (Speed & Voice configured in Settings)"
              >
                <Volume2 size={14} />
                <Play size={12} className="fill-current" />
                <span>Listen Notes</span>
              </button>
            ) : (
              <div className="flex items-center gap-1.5">
                {isSpeaking ? (
                  <button
                    onClick={handlePauseNotes}
                    className="px-3.5 py-1.5 rounded-xl bg-[var(--color-gold-pale)] text-[var(--color-gold-dark)] border border-[var(--color-gold)]/30 text-xs font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Pause size={12} className="fill-current" />
                    <span>Pause</span>
                  </button>
                ) : (
                  <button
                    onClick={handlePlayNotes}
                    className="btn-gold px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Play size={12} className="fill-current" />
                    <span>Resume</span>
                  </button>
                )}
                <button
                  onClick={handleStopNotes}
                  className="px-2.5 py-1.5 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 text-xs font-bold cursor-pointer"
                  title="Stop Audio"
                >
                  <Square size={10} className="fill-current" />
                </button>
              </div>
            )}
          </div>
        </div>

        <h2 className="text-base sm:text-lg font-bold text-[var(--color-text-primary)]">
          {conceptName}
        </h2>

        {/* Clean Notes Paragraph */}
        <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] leading-relaxed font-normal bg-[var(--color-bg-primary)] p-4 sm:p-5 rounded-xl border border-[var(--color-border)]">
          {description || `${conceptName} is a key concept under ${chapterName || "Syllabus Topic"}. Review the notes and key takeaways below.`}
        </p>
      </div>

      {/* ── 2. JEE FORMULA & LOGIC MAP (IF AVAILABLE) ── */}
      {dbFormulas.length > 0 && (
        <div className="daksh-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-caption tracking-widest text-[var(--color-gold-dark)] font-bold flex items-center gap-1.5">
              <Zap size={14} />
              Core Takeaways & Equations ({dbFormulas.length})
            </span>
          </div>

          <div className="space-y-2.5">
            {dbFormulas.map((f, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-primary)] space-y-1"
              >
                <code className="text-xs sm:text-sm font-mono font-bold text-[var(--color-text-primary)] block bg-white p-3 rounded-lg border border-[var(--color-border)]">
                  {typeof f === "string" ? f : f.formula || f.equation}
                </code>
                {f.used_for && <p className="text-[11px] text-[var(--color-text-secondary)]">{f.used_for}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {dbRules.length > 0 && (
        <div className="daksh-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-caption tracking-widest text-[var(--color-text-primary)] font-bold flex items-center gap-1.5">
              <CheckCircle2 size={14} className="text-[var(--color-gold)]" />
              Key Rules & Constraints ({dbRules.length})
            </span>
          </div>

          <div className="space-y-2">
            {dbRules.map((rule, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-primary)] text-xs font-bold text-[var(--color-text-primary)]"
              >
                • {typeof rule === "string" ? rule : rule.rule || rule.statement}
                {rule.applied_when && <span className="block text-[10px] font-normal text-[var(--color-text-secondary)] mt-0.5">Applied when: {rule.applied_when}</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── 3. STATE PCS KNOWLEDGE MAP SECTIONS (IF AVAILABLE) ── */}
      {aiMeta.core_facts && aiMeta.core_facts.length > 0 && (
        <div className="daksh-card p-6 space-y-3">
          <span className="text-caption tracking-widest text-[var(--color-gold-dark)] font-bold flex items-center gap-1.5">
            <Zap size={14} />
            High-Yield Exam Facts ({aiMeta.core_facts.length})
          </span>
          <div className="space-y-2">
            {aiMeta.core_facts.map((cf, idx) => (
              <div key={idx} className="p-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-primary)] text-xs font-semibold text-[var(--color-text-primary)]">
                • {cf.fact || cf}
              </div>
            ))}
          </div>
        </div>
      )}

      {aiMeta.chronology && aiMeta.chronology.length > 0 && (
        <div className="daksh-card p-6 space-y-3">
          <span className="text-caption tracking-widest text-[var(--color-gold-dark)] font-bold flex items-center gap-1.5">
            <BookOpen size={14} />
            Chronology & Key Milestones ({aiMeta.chronology.length})
          </span>
          <div className="space-y-2">
            {aiMeta.chronology.map((ch, idx) => (
              <div key={idx} className="p-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-primary)] text-xs space-y-0.5">
                <span className="font-bold text-[var(--color-gold-dark)]">{ch.year_or_period || "Timeline"}: </span>
                <span className="font-semibold text-[var(--color-text-primary)]">{ch.event}</span>
                {ch.significance && <p className="text-[10px] text-[var(--color-text-secondary)]">{ch.significance}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {aiMeta.common_traps && aiMeta.common_traps.length > 0 && (
        <div className="daksh-card p-6 space-y-3 border-l-2 border-l-rose-500">
          <span className="text-caption tracking-widest text-rose-700 font-bold flex items-center gap-1.5">
            ⚠️ Common Candidate Traps & Misconceptions ({aiMeta.common_traps.length})
          </span>
          <div className="space-y-2">
            {aiMeta.common_traps.map((tr, idx) => (
              <div key={idx} className="p-3 rounded-xl border border-rose-200 bg-rose-50/50 text-xs space-y-1">
                <p className="font-bold text-rose-800">❌ Misconception: {tr.incorrect_belief}</p>
                <p className="font-semibold text-emerald-800">✅ Correct Fact: {tr.correct_fact}</p>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
