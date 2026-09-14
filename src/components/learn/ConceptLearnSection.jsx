// src/components/learn/ConceptLearnSection.jsx
// Clean, Focused Concept Learn Section aligned with Warm Ivory + Ink + Antique Gold identity.
// Contains Concept Revision Notes & Horizontal Card Sliders for Key Rules and Core Takeaways with per-card Audio Speech.

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Zap,
  CheckCircle2,
  Volume2,
  Play,
  Pause,
  Square,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  Clock,
} from "lucide-react";
import PreferenceStore from "../../product/preferenceStore";

// Reusable Horizontal Single-Card Slider with Navigation Arrows, Dots, and Audio Support
function SingleCardSlider({
  title,
  icon: Icon,
  accentColorClass = "text-[var(--color-gold-dark)]",
  items = [],
  sectionKey,
  speakingCardId,
  onPlayCard,
  renderCardContent,
}) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!items || items.length === 0) return null;

  const currentItem = items[currentIndex];
  const cardId = `${sectionKey}-${currentIndex}`;
  const isCardSpeaking = speakingCardId === cardId;

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : items.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < items.length - 1 ? prev + 1 : 0));
  };

  return (
    <div className="daksh-card p-5 sm:p-6 space-y-4 border-t-2 border-t-[var(--color-gold)]">
      {/* Slider Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <div className={`p-1.5 rounded-lg bg-[var(--color-gold-pale)] ${accentColorClass}`}>
            <Icon size={16} />
          </div>
          <span className="text-caption tracking-widest font-bold uppercase text-[var(--color-text-primary)]">
            {title}
          </span>
          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[var(--color-bg-primary)] border border-[var(--color-border)] text-[var(--color-text-secondary)]">
            {currentIndex + 1} of {items.length}
          </span>
        </div>

        {/* Navigation Arrows */}
        {items.length > 1 && (
          <div className="flex items-center gap-1.5">
            <button
              onClick={handlePrev}
              className="p-1.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-primary)] hover:border-[var(--color-gold)] text-[var(--color-text-primary)] transition-all cursor-pointer"
              title="Previous card"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={handleNext}
              className="p-1.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-primary)] hover:border-[var(--color-gold)] text-[var(--color-text-primary)] transition-all cursor-pointer"
              title="Next card"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>

      {/* Card Content with Slide Animation */}
      <div className="relative overflow-hidden min-h-[110px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 25 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -25 }}
            transition={{ duration: 0.2 }}
            className="p-4 sm:p-5 rounded-2xl border border-indigo-500/30 bg-white dark:bg-slate-900 space-y-3 shadow-md shadow-indigo-500/10 select-text"
          >
            {renderCardContent(currentItem, currentIndex, isCardSpeaking, () => onPlayCard(cardId, currentItem))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Pagination Dot Indicators */}
      {items.length > 1 && (
        <div className="flex items-center justify-center gap-1.5 pt-1">
          {items.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-2 rounded-full transition-all cursor-pointer ${
                idx === currentIndex
                  ? "w-6 bg-[var(--color-gold)]"
                  : "w-2 bg-gray-300 dark:bg-gray-700 hover:bg-gray-400"
              }`}
              title={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function ConceptLearnSection({
  conceptName,
  chapterName,
  description,
  formulas = [],
  rules = [],
  aiMeta = {},
}) {
  const dbFormulas = aiMeta.layer_1_hard_formulas || formulas || [];
  const dbRules = aiMeta.layer_2_rule_based_logics || rules || [];
  const dbFacts = aiMeta.core_facts || [];
  const dbChronology = aiMeta.chronology || [];
  const dbTraps = aiMeta.common_traps || [];

  // Web Speech API State using global PreferenceStore settings
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speakingCardId, setSpeakingCardId] = useState(null);

  useEffect(() => {
    return () => {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const speakText = (cardId, textToSpeak) => {
    if (!("speechSynthesis" in window)) {
      alert("Text-to-speech is not supported in this browser.");
      return;
    }

    if (speakingCardId === cardId && isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setIsPaused(false);
      setSpeakingCardId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const prefs = PreferenceStore.getPreferences();
    const utterance = new SpeechSynthesisUtterance(textToSpeak);

    utterance.rate = prefs.speechRate || 1.0;
    utterance.pitch = 1.0;

    const voices = window.speechSynthesis.getVoices();
    const targetLang = prefs.speechVoiceLang || "en-US";
    const matchedVoice = voices.find((v) => v.lang.includes(targetLang) || v.lang.startsWith("en"));
    if (matchedVoice) utterance.voice = matchedVoice;

    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
      setSpeakingCardId(null);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      setIsPaused(false);
      setSpeakingCardId(null);
    };

    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
    setIsPaused(false);
    setSpeakingCardId(cardId);
  };

  const handlePlayNotes = () => {
    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
      setIsSpeaking(true);
      return;
    }
    const textToSpeak = `${conceptName}. ${description || "Concept notes for syllabus revision."}`;
    speakText("notes", textToSpeak);
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
      setSpeakingCardId(null);
    }
  };

  // Helper speech triggers per item type
  const playFormulaAudio = (cardId, item) => {
    const formulaStr = typeof item === "string" ? item : item.formula || item.equation || "";
    const usedFor = typeof item === "object" && item.used_for ? `. Used for: ${item.used_for}` : "";
    speakText(cardId, `Core Equation: ${formulaStr}${usedFor}`);
  };

  const playRuleAudio = (cardId, item) => {
    const ruleStr = typeof item === "string" ? item : item.rule || item.statement || "";
    const appliedWhen = typeof item === "object" && item.applied_when ? `. Applied when: ${item.applied_when}` : "";
    speakText(cardId, `Key Rule: ${ruleStr}${appliedWhen}`);
  };

  const playFactAudio = (cardId, item) => {
    const factStr = typeof item === "string" ? item : item.fact || "";
    speakText(cardId, `High Yield Fact: ${factStr}`);
  };

  const playChronologyAudio = (cardId, item) => {
    const period = item.year_or_period ? `${item.year_or_period}: ` : "";
    const significance = item.significance ? `. Significance: ${item.significance}` : "";
    speakText(cardId, `Chronology Milestone: ${period}${item.event}${significance}`);
  };

  const playTrapAudio = (cardId, item) => {
    const incorrect = item.incorrect_belief ? `Misconception: ${item.incorrect_belief}. ` : "";
    const correct = item.correct_fact ? `Correct Fact: ${item.correct_fact}` : "";
    speakText(cardId, `Candidate Trap. ${incorrect}${correct}`);
  };

  return (
    <div className="space-y-6 select-none text-[var(--color-text-primary)]">
      {/* ── 1. CONCEPT REVISION NOTES ── */}
      <div className="daksh-card p-6 sm:p-7 space-y-4 border-t-3 border-t-[var(--color-gold)] border-indigo-500/30 shadow-md shadow-indigo-500/10">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <span className="text-caption tracking-widest text-[var(--color-gold-dark)] font-bold uppercase flex items-center gap-1.5">
            <BookOpen size={15} />
            Concept Revision Notes
          </span>

          {/* Clean Audio Reader Button */}
          <div className="flex items-center gap-2">
            {!isSpeaking && !isPaused ? (
              <button
                onClick={handlePlayNotes}
                className="btn-gold px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
                title="Listen to notes"
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

        <h2 className="text-base sm:text-lg font-black text-slate-950 dark:text-slate-100">
          {conceptName}
        </h2>

        {/* Clean Notes Paragraph */}
        <div className="p-4 sm:p-5 rounded-xl bg-white dark:bg-slate-900 border border-indigo-500/30 shadow-md shadow-indigo-500/10">
          <p className="text-xs sm:text-sm text-slate-950 dark:text-slate-100 leading-relaxed font-bold select-text">
            {description ||
              `${conceptName} is a key concept under ${chapterName || "Syllabus Topic"}. Review the notes and key takeaways below.`}
          </p>
        </div>
      </div>

      {/* ── 2. CORE TAKEAWAYS & EQUATIONS SLIDER ── */}
      {dbFormulas.length > 0 && (
        <SingleCardSlider
          title="Core Takeaways & Equations"
          icon={Zap}
          accentColorClass="text-[var(--color-gold-dark)]"
          items={dbFormulas}
          sectionKey="formula"
          speakingCardId={speakingCardId}
          onPlayCard={playFormulaAudio}
          renderCardContent={(item, idx, isCardSpeaking, playAudio) => {
            const formulaStr = typeof item === "string" ? item : item.formula || item.equation || "";
            const usedForStr = typeof item === "object" ? item.used_for : null;

            return (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold text-[var(--color-gold-dark)] dark:text-amber-400 uppercase tracking-wider">
                    Equation #{idx + 1}
                  </span>

                  <button
                    onClick={playAudio}
                    className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                      isCardSpeaking
                        ? "bg-rose-500/20 text-rose-600 border border-rose-500/30"
                        : "bg-[var(--color-gold-pale)] text-[var(--color-gold-dark)] border border-[var(--color-gold)]/30 hover:bg-[var(--color-gold)] hover:text-white"
                    }`}
                  >
                    {isCardSpeaking ? (
                      <>
                        <Square size={12} className="fill-current" />
                        <span>Stop</span>
                      </>
                    ) : (
                      <>
                        <Volume2 size={13} />
                        <Play size={10} className="fill-current" />
                        <span>Listen</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 dark:bg-slate-950 border border-indigo-500/40 shadow-inner">
                  <code className="text-xs sm:text-sm font-mono font-extrabold text-amber-300 block select-text leading-relaxed break-words">
                    {formulaStr}
                  </code>
                </div>

                {usedForStr && (
                  <div className="p-3 rounded-xl bg-amber-500/10 dark:bg-amber-950/40 border border-amber-500/30">
                    <p className="text-xs sm:text-sm text-slate-950 dark:text-slate-100 font-bold select-text leading-relaxed">
                      <strong className="text-[var(--color-gold-dark)] dark:text-amber-300 font-black">Used for:</strong> {usedForStr}
                    </p>
                  </div>
                )}
              </div>
            );
          }}
        />
      )}

      {/* ── 3. KEY RULES & CONSTRAINTS SLIDER ── */}
      {dbRules.length > 0 && (
        <SingleCardSlider
          title="Key Rules & Constraints"
          icon={CheckCircle2}
          accentColorClass="text-emerald-600"
          items={dbRules}
          sectionKey="rule"
          speakingCardId={speakingCardId}
          onPlayCard={playRuleAudio}
          renderCardContent={(item, idx, isCardSpeaking, playAudio) => {
            const ruleStr = typeof item === "string" ? item : item.rule || item.statement || "";
            const appliedWhenStr = typeof item === "object" ? item.applied_when : null;

            return (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                    Rule #{idx + 1}
                  </span>

                  <button
                    onClick={playAudio}
                    className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                      isCardSpeaking
                        ? "bg-rose-500/20 text-rose-600 border border-rose-500/30"
                        : "bg-emerald-500/10 text-emerald-700 border border-emerald-500/30 hover:bg-emerald-600 hover:text-white"
                    }`}
                  >
                    {isCardSpeaking ? (
                      <>
                        <Square size={12} className="fill-current" />
                        <span>Stop</span>
                      </>
                    ) : (
                      <>
                        <Volume2 size={13} />
                        <Play size={10} className="fill-current" />
                        <span>Listen</span>
                      </>
                    )}
                  </button>
                </div>

                <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-relaxed select-text">
                  • {ruleStr}
                </p>

                {appliedWhenStr && (
                  <div className="p-3 rounded-xl bg-emerald-500/10 dark:bg-emerald-950/40 border border-emerald-500/20">
                    <p className="text-xs sm:text-sm text-slate-900 dark:text-slate-100 font-medium select-text leading-relaxed">
                      <strong className="text-emerald-700 dark:text-emerald-300 font-extrabold">Applied when:</strong> {appliedWhenStr}
                    </p>
                  </div>
                )}
              </div>
            );
          }}
        />
      )}

      {/* ── 4. HIGH-YIELD EXAM FACTS SLIDER ── */}
      {dbFacts.length > 0 && (
        <SingleCardSlider
          title="High-Yield Exam Facts"
          icon={Zap}
          accentColorClass="text-amber-600"
          items={dbFacts}
          sectionKey="fact"
          speakingCardId={speakingCardId}
          onPlayCard={playFactAudio}
          renderCardContent={(item, idx, isCardSpeaking, playAudio) => {
            const factStr = typeof item === "string" ? item : item.fact || "";

            return (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
                    High-Yield Fact #{idx + 1}
                  </span>

                  <button
                    onClick={playAudio}
                    className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                      isCardSpeaking
                        ? "bg-rose-500/20 text-rose-600 border border-rose-500/30"
                        : "bg-amber-500/10 text-amber-700 border border-amber-500/30 hover:bg-amber-500 hover:text-white"
                    }`}
                  >
                    {isCardSpeaking ? (
                      <>
                        <Square size={12} className="fill-current" />
                        <span>Stop</span>
                      </>
                    ) : (
                      <>
                        <Volume2 size={13} />
                        <Play size={10} className="fill-current" />
                        <span>Listen</span>
                      </>
                    )}
                  </button>
                </div>

                <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white leading-relaxed select-text">
                  • {factStr}
                </p>
              </div>
            );
          }}
        />
      )}

      {/* ── 5. CHRONOLOGY SLIDER ── */}
      {dbChronology.length > 0 && (
        <SingleCardSlider
          title="Chronology & Key Milestones"
          icon={Clock}
          accentColorClass="text-indigo-600"
          items={dbChronology}
          sectionKey="chronology"
          speakingCardId={speakingCardId}
          onPlayCard={playChronologyAudio}
          renderCardContent={(item, idx, isCardSpeaking, playAudio) => (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold text-indigo-700 dark:text-indigo-400 uppercase tracking-wider">
                  Timeline Milestone #{idx + 1}
                </span>

                <button
                  onClick={playAudio}
                  className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    isCardSpeaking
                      ? "bg-rose-500/20 text-rose-600 border border-rose-500/30"
                      : "bg-indigo-500/10 text-indigo-700 border border-indigo-500/30 hover:bg-indigo-500 hover:text-white"
                  }`}
                >
                  {isCardSpeaking ? (
                    <>
                      <Square size={12} className="fill-current" />
                      <span>Stop</span>
                    </>
                  ) : (
                    <>
                      <Volume2 size={13} />
                      <Play size={10} className="fill-current" />
                      <span>Listen</span>
                    </>
                  )}
                </button>
              </div>

              <div className="text-xs space-y-1.5 select-text">
                <span className="font-extrabold text-[var(--color-gold-dark)] dark:text-amber-300 block">
                  {item.year_or_period || "Timeline Period"}
                </span>
                <p className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">{item.event}</p>
                {item.significance && (
                  <p className="text-xs text-slate-800 dark:text-slate-200">
                    <strong className="text-indigo-700 dark:text-indigo-300">Significance:</strong> {item.significance}
                  </p>
                )}
              </div>
            </div>
          )}
        />
      )}

      {/* ── 6. COMMON TRAPS SLIDER ── */}
      {dbTraps.length > 0 && (
        <SingleCardSlider
          title="Common Candidate Traps & Misconceptions"
          icon={AlertTriangle}
          accentColorClass="text-rose-600"
          items={dbTraps}
          sectionKey="trap"
          speakingCardId={speakingCardId}
          onPlayCard={playTrapAudio}
          renderCardContent={(item, idx, isCardSpeaking, playAudio) => (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold text-rose-600 uppercase tracking-wider">
                  Trap #{idx + 1}
                </span>

                <button
                  onClick={playAudio}
                  className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    isCardSpeaking
                      ? "bg-rose-500/20 text-rose-600 border border-rose-500/30"
                      : "bg-rose-100 text-rose-700 border border-rose-200 hover:bg-rose-600 hover:text-white"
                  }`}
                >
                  {isCardSpeaking ? (
                    <>
                      <Square size={12} className="fill-current" />
                      <span>Stop</span>
                    </>
                  ) : (
                    <>
                      <Volume2 size={13} />
                      <Play size={10} className="fill-current" />
                      <span>Listen</span>
                    </>
                  )}
                </button>
              </div>

              <div className="space-y-2 text-xs sm:text-sm select-text">
                <div className="p-3 rounded-xl bg-rose-500/10 dark:bg-rose-950/40 border border-rose-500/20">
                  <p className="font-bold text-rose-900 dark:text-rose-300">
                    ❌ Misconception: {item.incorrect_belief}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-emerald-500/10 dark:bg-emerald-950/40 border border-emerald-500/20">
                  <p className="font-bold text-emerald-900 dark:text-emerald-300">
                    ✅ Correct Fact: {item.correct_fact}
                  </p>
                </div>
              </div>
            </div>
          )}
        />
      )}
    </div>
  );
}

