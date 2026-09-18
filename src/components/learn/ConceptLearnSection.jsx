// src/components/learn/ConceptLearnSection.jsx
// Clean, Focused Concept Learn Section with horizontal scrolling sliders for mobile & touch swipe.
// Features automatic slide autoplay, section controls (Listen, Pause, Replay, Prev, Next), and on-demand text explanation.

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Zap,
  CheckCircle2,
  Volume2,
  Play,
  Pause,
  RotateCcw,
  Square,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  Clock,
  Layers,
  FileText,
  Lightbulb,
  Eye,
  EyeOff,
  Headphones,
} from "lucide-react";
import PreferenceStore from "../../product/preferenceStore";

// Helper function to build speech text per section item
function getSpeechText(sectionKey, item, index, conceptName) {
  if (sectionKey === "formula") {
    const formulaStr = typeof item === "string" ? item : item.formula || item.equation || "";
    const usedFor = typeof item === "object" && item.used_for ? `. Used for: ${item.used_for}` : "";
    return `Core Equation ${index + 1}: ${formulaStr}${usedFor}`;
  }
  if (sectionKey === "rule") {
    const ruleStr = typeof item === "string" ? item : item.rule || item.statement || "";
    const appliedWhen = typeof item === "object" && item.applied_when ? `. Applied when: ${item.applied_when}` : "";
    return `Key Rule ${index + 1}: ${ruleStr}${appliedWhen}`;
  }
  if (sectionKey === "consequence") {
    const itemText = typeof item === "string" ? item : item.consequence || "";
    return `Derived Consequence ${index + 1}: ${itemText}`;
  }
  if (sectionKey === "fact") {
    const factStr = typeof item === "string" ? item : item.fact || "";
    return `High Yield Fact ${index + 1}: ${factStr}`;
  }
  if (sectionKey === "chronology") {
    const period = item.year_or_period ? `${item.year_or_period}: ` : "";
    const significance = item.significance ? `. Significance: ${item.significance}` : "";
    return `Milestone: ${period}${item.event}${significance}`;
  }
  if (sectionKey === "pathway") {
    const processStr = item.process || "";
    const stepsStr = item.key_steps_or_enzymes ? `. Key steps: ${item.key_steps_or_enzymes}` : "";
    return `Pathway process: ${processStr}${stepsStr}`;
  }
  if (sectionKey === "term") {
    const termStr = item.term || item.entity_a || "";
    const defStr = item.definition_or_example || item.meaning ? `. Details: ${item.definition_or_example || item.meaning}` : "";
    return `Scientific Term ${termStr}: ${defStr}`;
  }
  if (sectionKey === "exception") {
    const ruleStr = item.general_rule ? `General rule: ${item.general_rule}. ` : "";
    const excStr = item.exception ? `NCERT Exception: ${item.exception}` : "";
    return `NCERT Exception. ${ruleStr}${excStr}`;
  }
  if (sectionKey === "trap") {
    if (item.assertion) {
      return `Assertion Reason Trap. Assertion: ${item.assertion}. Reason: ${item.reason}.`;
    }
    return `Candidate Trap: ${item.incorrect_belief || ""}. Correct fact: ${item.correct_fact || ""}`;
  }
  return conceptName;
}

// Reusable Section Carousel with Horizontal Touch Scrolling & Auto Speech Advancement
function SectionCardSlider({
  title,
  icon: Icon,
  accentColorClass = "text-[var(--color-gold-dark)]",
  items = [],
  sectionKey,
  conceptName,
  activeSectionKey,
  onSectionActiveChange,
  renderCardContent,
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const scrollTrackRef = useRef(null);
  const cardRefs = useRef([]);

  const isSpeakingRef = useRef(isSpeaking);
  isSpeakingRef.current = isSpeaking;

  const currentIndexRef = useRef(currentIndex);
  currentIndexRef.current = currentIndex;

  if (!items || items.length === 0) return null;

  const isSectionActive = activeSectionKey === sectionKey;
  const isCardSpeaking = isSectionActive && isSpeaking;
  const isCardPaused = isSectionActive && isPaused;

  const scrollToCard = (index) => {
    const container = scrollTrackRef.current;
    const card = cardRefs.current[index];
    if (container && card) {
      const targetLeft = card.offsetLeft - (container.clientWidth - card.clientWidth) / 2;
      container.scrollTo({
        left: Math.max(0, targetLeft),
        behavior: "smooth",
      });
    }
  };

  const handleScroll = () => {
    const container = scrollTrackRef.current;
    if (!container || !items.length) return;

    const containerCenter = container.scrollLeft + container.clientWidth / 2;
    let closestIndex = 0;
    let minDistance = Infinity;

    cardRefs.current.forEach((card, idx) => {
      if (card) {
        const cardCenter = card.offsetLeft + card.clientWidth / 2;
        const distance = Math.abs(containerCenter - cardCenter);
        if (distance < minDistance) {
          minDistance = distance;
          closestIndex = idx;
        }
      }
    });

    if (closestIndex !== currentIndexRef.current) {
      setCurrentIndex(closestIndex);
    }
  };

  const speakCard = (index, shouldAutoplay = true) => {
    if (!("speechSynthesis" in window)) {
      alert("Text-to-speech is not supported in this browser.");
      return;
    }

    if (index < 0 || index >= items.length) return;

    window.speechSynthesis.cancel();
    onSectionActiveChange(sectionKey);
    scrollToCard(index);

    const item = items[index];
    const textToSpeak = getSpeechText(sectionKey, item, index, conceptName);

    const prefs = PreferenceStore.getPreferences();
    const utterance = new SpeechSynthesisUtterance(textToSpeak);

    utterance.rate = prefs.speechRate || 1.0;
    utterance.pitch = 1.0;

    const voices = window.speechSynthesis.getVoices();
    const targetLang = prefs.speechVoiceLang || "en-US";
    const matchedVoice = voices.find((v) => v.lang.includes(targetLang) || v.lang.startsWith("en"));
    if (matchedVoice) utterance.voice = matchedVoice;

    utterance.onend = () => {
      // Continuous autoplay across slides in section
      if (shouldAutoplay && isSpeakingRef.current && currentIndexRef.current < items.length - 1) {
        const nextIdx = currentIndexRef.current + 1;
        setCurrentIndex(nextIdx);
        speakCard(nextIdx, true);
      } else {
        setIsSpeaking(false);
        setIsPaused(false);
      }
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };

    setIsSpeaking(true);
    setIsPaused(false);
    window.speechSynthesis.speak(utterance);
  };

  const handlePlayPause = () => {
    if (isCardPaused && "speechSynthesis" in window) {
      window.speechSynthesis.resume();
      setIsPaused(false);
      setIsSpeaking(true);
    } else if (isCardSpeaking && "speechSynthesis" in window) {
      window.speechSynthesis.pause();
      setIsPaused(true);
      setIsSpeaking(false);
    } else {
      speakCard(currentIndex, true);
    }
  };

  const handleReplay = () => {
    speakCard(currentIndex, true);
  };

  const handlePrev = () => {
    const newIdx = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
    setCurrentIndex(newIdx);
    scrollToCard(newIdx);
    if (isCardSpeaking || isCardPaused) {
      speakCard(newIdx, true);
    }
  };

  const handleNext = () => {
    const newIdx = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
    setCurrentIndex(newIdx);
    scrollToCard(newIdx);
    if (isCardSpeaking || isCardPaused) {
      speakCard(newIdx, true);
    }
  };

  const handleDotClick = (idx) => {
    setCurrentIndex(idx);
    scrollToCard(idx);
    if (isCardSpeaking || isCardPaused) {
      speakCard(idx, true);
    }
  };

  return (
    <div className="daksh-card p-4 sm:p-6 space-y-4 border-t-2 border-t-[var(--color-gold)] shadow-sm bg-white dark:bg-slate-900 rounded-2xl">
      {/* Slider Header & Audio Controls */}
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

        {/* Section Audio & Navigation Controls */}
        <div className="flex items-center gap-1.5">
          {/* Previous Card */}
          {items.length > 1 && (
            <button
              onClick={handlePrev}
              className="p-1.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-primary)] hover:border-[var(--color-gold)] text-[var(--color-text-primary)] transition-all cursor-pointer"
              title="Previous card"
            >
              <ChevronLeft size={16} />
            </button>
          )}

          {/* Primary Play / Pause Button */}
          <button
            onClick={handlePlayPause}
            className="px-3.5 py-1.5 rounded-xl bg-[var(--color-gold)] hover:bg-[var(--color-gold-dark)] text-white text-xs font-extrabold shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
          >
            {isCardSpeaking ? (
              <>
                <Pause size={13} className="fill-current" />
                <span>Pause</span>
              </>
            ) : isCardPaused ? (
              <>
                <Play size={13} className="fill-current ml-0.5" />
                <span>Resume</span>
              </>
            ) : (
              <>
                <Volume2 size={13} />
                <Play size={10} className="fill-current ml-0.5" />
                <span>▶ Listen</span>
              </>
            )}
          </button>

          {/* Replay Current Card */}
          <button
            onClick={handleReplay}
            className="p-1.5 rounded-xl border border-[var(--color-border)] bg-white dark:bg-slate-800 hover:border-[var(--color-gold)] text-slate-700 dark:text-slate-200 transition-all cursor-pointer"
            title="Replay card speech"
          >
            <RotateCcw size={13} />
          </button>

          {/* Next Card */}
          {items.length > 1 && (
            <button
              onClick={handleNext}
              className="p-1.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-primary)] hover:border-[var(--color-gold)] text-[var(--color-text-primary)] transition-all cursor-pointer"
              title="Next card"
            >
              <ChevronRight size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Horizontal Touch Scroll Track */}
      <div
        ref={scrollTrackRef}
        onScroll={handleScroll}
        className="flex gap-3 sm:gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth touch-pan-x overscroll-x-contain scrollbar-thin scrollbar-thumb-[var(--color-gold)]/20 scrollbar-track-transparent py-2 px-1"
      >
        {items.map((item, idx) => (
          <div
            key={idx}
            ref={(el) => (cardRefs.current[idx] = el)}
            onClick={() => handleDotClick(idx)}
            className={`w-[85vw] min-w-[85vw] sm:w-[340px] sm:min-w-[320px] max-w-[380px] snap-center shrink-0 p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer select-none ${
              idx === currentIndex
                ? "border-[var(--color-gold)] bg-white dark:bg-slate-900 shadow-md ring-2 ring-[var(--color-gold)]/20"
                : "border-[var(--color-border)] bg-white/70 dark:bg-slate-900/60 hover:border-[var(--color-gold)]/50"
            }`}
          >
            {renderCardContent(item, idx, isCardSpeaking && idx === currentIndex, handlePlayPause)}
          </div>
        ))}
      </div>

      {/* Pagination Dot Indicators */}
      {items.length > 1 && (
        <div className="flex items-center justify-between pt-1">
          <span className="text-[10px] text-[var(--color-mid-gray)] font-semibold sm:hidden">
            Swipe left/right ← →
          </span>
          <div className="flex items-center justify-center gap-1.5 mx-auto">
            {items.map((_, idx) => (
              <button
                key={idx}
                onClick={() => handleDotClick(idx)}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  idx === currentIndex
                    ? "w-6 bg-[var(--color-gold)]"
                    : "w-2 bg-gray-300 dark:bg-gray-700 hover:bg-gray-400"
                }`}
                title={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
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
  // Extract concept notes directly from aiMeta & concept properties
  const dbFormulas = aiMeta.layer_1_hard_formulas || aiMeta.core_formulas_or_equations || formulas || [];
  const dbRules = aiMeta.layer_2_rule_based_logics || rules || [];
  const dbConsequences = aiMeta.layer_3_derived_consequences || [];
  const dbFacts = aiMeta.core_facts || aiMeta.ncert_key_definitions_and_facts || [];
  const dbChronology = aiMeta.chronology || [];
  const dbTraps = aiMeta.common_traps || aiMeta.assertion_reason_traps || [];
  const dbPathways = aiMeta.biological_or_chemical_pathways || [];
  const dbExceptions = aiMeta.ncert_exceptions_and_anomalies || [];
  const dbTerms = aiMeta.key_terms_and_entities || aiMeta.scientific_terms_and_classifications || [];

  // Active section speech tracking
  const [activeSectionKey, setActiveSectionKey] = useState(null);
  const [isOverviewSpeaking, setIsOverviewSpeaking] = useState(false);
  const [isOverviewPaused, setIsOverviewPaused] = useState(false);
  const [expandedTextCardId, setExpandedTextCardId] = useState(null);

  useEffect(() => {
    return () => {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const toggleTextExplanation = (cardId) => {
    setExpandedTextCardId((prev) => (prev === cardId ? null : cardId));
  };

  const handlePlayNotes = () => {
    if (!("speechSynthesis" in window)) return;
    if (isOverviewPaused) {
      window.speechSynthesis.resume();
      setIsOverviewPaused(false);
      setIsOverviewSpeaking(true);
      return;
    }
    window.speechSynthesis.cancel();
    setActiveSectionKey("overview");

    const textToSpeak = `${conceptName}. ${description || "Concept notes for syllabus revision."}`;
    const prefs = PreferenceStore.getPreferences();
    const utterance = new SpeechSynthesisUtterance(textToSpeak);

    utterance.rate = prefs.speechRate || 1.0;
    utterance.pitch = 1.0;

    const voices = window.speechSynthesis.getVoices();
    const targetLang = prefs.speechVoiceLang || "en-US";
    const matchedVoice = voices.find((v) => v.lang.includes(targetLang) || v.lang.startsWith("en"));
    if (matchedVoice) utterance.voice = matchedVoice;

    utterance.onend = () => {
      setIsOverviewSpeaking(false);
      setIsOverviewPaused(false);
      setActiveSectionKey(null);
    };

    utterance.onerror = () => {
      setIsOverviewSpeaking(false);
      setIsOverviewPaused(false);
      setActiveSectionKey(null);
    };

    setIsOverviewSpeaking(true);
    setIsOverviewPaused(false);
    window.speechSynthesis.speak(utterance);
  };

  const handlePauseNotes = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.pause();
      setIsOverviewPaused(true);
      setIsOverviewSpeaking(false);
    }
  };

  const handleStopNotes = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setIsOverviewSpeaking(false);
      setIsOverviewPaused(false);
      setActiveSectionKey(null);
    }
  };

  return (
    <div className="space-y-6 select-none text-[var(--color-text-primary)]">
      {/* ── 1. CONCEPT REVISION OVERVIEW ── */}
      <div className="daksh-card p-6 sm:p-7 space-y-4 border-t-3 border-t-[var(--color-gold)] border-indigo-500/30 shadow-md shadow-indigo-500/10">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <span className="text-caption tracking-widest text-[var(--color-gold-dark)] font-bold uppercase flex items-center gap-1.5">
            <Headphones size={15} />
            Concept Revision & Vocal Overview
          </span>

          {/* Clean Audio Reader Button */}
          <div className="flex items-center gap-2">
            {!isOverviewSpeaking && !isOverviewPaused ? (
              <button
                onClick={handlePlayNotes}
                className="btn-gold px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
                title="Listen to concept overview"
              >
                <Volume2 size={14} />
                <Play size={12} className="fill-current" />
                <span>Listen Overview</span>
              </button>
            ) : (
              <div className="flex items-center gap-1.5">
                {isOverviewSpeaking ? (
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

      {/* ── 2. PART 1 — HARD FORMULAS & CORE TAKEAWAYS ── */}
      {dbFormulas.length > 0 && (
        <SectionCardSlider
          title="Part 1 — Hard Formulas & Equations"
          icon={Zap}
          accentColorClass="text-[var(--color-gold-dark)]"
          items={dbFormulas}
          sectionKey="formula"
          conceptName={conceptName}
          activeSectionKey={activeSectionKey}
          onSectionActiveChange={setActiveSectionKey}
          renderCardContent={(item, idx) => {
            const cardId = `formula-${idx}`;
            const formulaStr = typeof item === "string" ? item : item.formula || item.equation || "";
            const usedForStr = typeof item === "object" ? item.used_for : null;
            const isTextOpen = expandedTextCardId === cardId;

            return (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold text-[var(--color-gold-dark)] dark:text-amber-400 uppercase tracking-wider">
                    Equation #{idx + 1}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 dark:bg-slate-950 border border-indigo-500/40 shadow-inner">
                  <code className="text-xs sm:text-sm font-mono font-extrabold text-amber-300 block select-text leading-relaxed break-words">
                    {formulaStr}
                  </code>
                </div>

                {usedForStr && (
                  <div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleTextExplanation(cardId);
                      }}
                      className="text-xs font-bold text-[var(--color-gold-dark)] hover:text-[var(--color-gold)] flex items-center gap-1.5 cursor-pointer py-1"
                    >
                      {isTextOpen ? <EyeOff size={13} /> : <Eye size={13} />}
                      <span>{isTextOpen ? "Hide explanation" : "Show explanation"}</span>
                    </button>
                    {isTextOpen && (
                      <div className="p-3 mt-1.5 rounded-xl bg-amber-500/10 dark:bg-amber-950/40 border border-amber-500/30 text-xs text-slate-950 dark:text-slate-100 font-bold select-text">
                        <strong>Used for:</strong> {usedForStr}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          }}
        />
      )}

      {/* ── 3. PART 2 — KEY RULES & RULE-BASED LOGICS ── */}
      {dbRules.length > 0 && (
        <SectionCardSlider
          title="Part 2 — Rule-Based Logics"
          icon={CheckCircle2}
          accentColorClass="text-emerald-600"
          items={dbRules}
          sectionKey="rule"
          conceptName={conceptName}
          activeSectionKey={activeSectionKey}
          onSectionActiveChange={setActiveSectionKey}
          renderCardContent={(item, idx) => {
            const cardId = `rule-${idx}`;
            const ruleStr = typeof item === "string" ? item : item.rule || item.statement || "";
            const appliedWhenStr = typeof item === "object" ? item.applied_when : null;
            const isTextOpen = expandedTextCardId === cardId;

            return (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                    Rule #{idx + 1}
                  </span>
                </div>

                <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-relaxed select-text">
                  • {ruleStr}
                </p>

                {appliedWhenStr && (
                  <div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleTextExplanation(cardId);
                      }}
                      className="text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1.5 cursor-pointer py-1"
                    >
                      {isTextOpen ? <EyeOff size={13} /> : <Eye size={13} />}
                      <span>{isTextOpen ? "Hide explanation" : "Show explanation"}</span>
                    </button>
                    {isTextOpen && (
                      <div className="p-3 mt-1.5 rounded-xl bg-emerald-500/10 dark:bg-emerald-950/40 border border-emerald-500/20 text-xs text-slate-900 dark:text-slate-100 font-medium select-text">
                        <strong>Applied when:</strong> {appliedWhenStr}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          }}
        />
      )}

      {/* ── 4. PART 3 — DERIVED CONSEQUENCES ── */}
      {dbConsequences.length > 0 && (
        <SectionCardSlider
          title="Part 3 — Derived Consequences & Deductions"
          icon={Lightbulb}
          accentColorClass="text-amber-600"
          items={dbConsequences}
          sectionKey="consequence"
          conceptName={conceptName}
          activeSectionKey={activeSectionKey}
          onSectionActiveChange={setActiveSectionKey}
          renderCardContent={(item, idx) => {
            const cardId = `consequence-${idx}`;
            const itemText = typeof item === "string" ? item : item.consequence || "";
            const derivedFrom = typeof item === "object" && item.derived_from ? (Array.isArray(item.derived_from) ? item.derived_from.join(", ") : item.derived_from) : null;
            const isTextOpen = expandedTextCardId === cardId;

            return (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
                    Consequence #{idx + 1}
                  </span>
                </div>

                <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-relaxed select-text">
                  • {itemText}
                </p>

                {derivedFrom && (
                  <div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleTextExplanation(cardId);
                      }}
                      className="text-xs font-bold text-amber-700 dark:text-amber-400 hover:underline flex items-center gap-1.5 cursor-pointer py-1"
                    >
                      {isTextOpen ? <EyeOff size={13} /> : <Eye size={13} />}
                      <span>{isTextOpen ? "Hide explanation" : "Show explanation"}</span>
                    </button>
                    {isTextOpen && (
                      <div className="p-3 mt-1.5 rounded-xl bg-amber-500/10 dark:bg-amber-950/40 border border-amber-500/20 text-xs text-slate-900 dark:text-slate-100 font-medium select-text">
                        <strong>Derived from:</strong> {derivedFrom}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          }}
        />
      )}

      {/* ── 5. HIGH-YIELD EXAM FACTS SLIDER ── */}
      {dbFacts.length > 0 && (
        <SectionCardSlider
          title="High-Yield Exam Facts"
          icon={Zap}
          accentColorClass="text-amber-600"
          items={dbFacts}
          sectionKey="fact"
          conceptName={conceptName}
          activeSectionKey={activeSectionKey}
          onSectionActiveChange={setActiveSectionKey}
          renderCardContent={(item, idx) => {
            const factStr = typeof item === "string" ? item : item.fact || "";

            return (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
                    High-Yield Fact #{idx + 1}
                  </span>
                </div>

                <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white leading-relaxed select-text">
                  • {factStr}
                </p>
              </div>
            );
          }}
        />
      )}

      {/* ── 6. CHRONOLOGY SLIDER ── */}
      {dbChronology.length > 0 && (
        <SectionCardSlider
          title="Chronology & Key Milestones"
          icon={Clock}
          accentColorClass="text-indigo-600"
          items={dbChronology}
          sectionKey="chronology"
          conceptName={conceptName}
          activeSectionKey={activeSectionKey}
          onSectionActiveChange={setActiveSectionKey}
          renderCardContent={(item, idx) => (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold text-indigo-700 dark:text-indigo-400 uppercase tracking-wider">
                  Timeline Milestone #{idx + 1}
                </span>
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

      {/* ── 7. BIOLOGICAL & CHEMICAL PATHWAYS SLIDER ── */}
      {dbPathways.length > 0 && (
        <SectionCardSlider
          title="Biological & Chemical Pathways"
          icon={Zap}
          accentColorClass="text-cyan-600"
          items={dbPathways}
          sectionKey="pathway"
          conceptName={conceptName}
          activeSectionKey={activeSectionKey}
          onSectionActiveChange={setActiveSectionKey}
          renderCardContent={(item, idx) => (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold text-cyan-700 dark:text-cyan-400 uppercase tracking-wider">
                  Pathway #{idx + 1}
                </span>
              </div>

              <div className="space-y-2 text-xs sm:text-sm select-text">
                <p className="font-extrabold text-slate-900 dark:text-white">
                  🔄 Process: {item.process}
                </p>
                {item.key_steps_or_enzymes && (
                  <div className="p-3 rounded-xl bg-cyan-500/10 dark:bg-cyan-950/40 border border-cyan-500/20">
                    <p className="font-bold text-cyan-900 dark:text-cyan-300">
                      🧪 Key Steps / Enzymes / Reagents: {item.key_steps_or_enzymes}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        />
      )}

      {/* ── 8. SCIENTIFIC TERMS & CLASSIFICATIONS SLIDER ── */}
      {dbTerms.length > 0 && (
        <SectionCardSlider
          title="Scientific Terms & Classifications"
          icon={FileText}
          accentColorClass="text-purple-600"
          items={dbTerms}
          sectionKey="term"
          conceptName={conceptName}
          activeSectionKey={activeSectionKey}
          onSectionActiveChange={setActiveSectionKey}
          renderCardContent={(item, idx) => {
            const termStr = item.term || item.entity_a || "";
            const defStr = item.definition_or_example || item.meaning || item.relationship || "";

            return (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold text-purple-700 dark:text-purple-400 uppercase tracking-wider">
                    Scientific Term #{idx + 1}
                  </span>
                </div>

                <div className="space-y-2 text-xs sm:text-sm select-text">
                  <p className="font-extrabold text-slate-900 dark:text-white">
                    🏷️ Term: {termStr}
                  </p>
                  {defStr && (
                    <div className="p-3 rounded-xl bg-purple-500/10 dark:bg-purple-950/40 border border-purple-500/20">
                      <p className="font-medium text-purple-900 dark:text-purple-300">
                        {defStr}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          }}
        />
      )}

      {/* ── 9. NCERT EXCEPTIONS & ANOMALIES SLIDER ── */}
      {dbExceptions.length > 0 && (
        <SectionCardSlider
          title="NCERT Exceptions & Anomalies"
          icon={AlertTriangle}
          accentColorClass="text-amber-600"
          items={dbExceptions}
          sectionKey="exception"
          conceptName={conceptName}
          activeSectionKey={activeSectionKey}
          onSectionActiveChange={setActiveSectionKey}
          renderCardContent={(item, idx) => (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
                  Exception #{idx + 1}
                </span>
              </div>

              <div className="space-y-2 text-xs sm:text-sm select-text">
                <div className="p-3 rounded-xl bg-slate-900/10 dark:bg-slate-950/40 border border-slate-500/20">
                  <p className="font-bold text-slate-800 dark:text-slate-300">
                    📜 General Rule: {item.general_rule}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-amber-500/10 dark:bg-amber-950/40 border border-amber-500/20">
                  <p className="font-black text-amber-900 dark:text-amber-300">
                    ⚠️ NCERT Exception: {item.exception}
                  </p>
                </div>
              </div>
            </div>
          )}
        />
      )}

      {/* ── 10. COMMON TRAPS & ASSERTION-REASON SLIDER ── */}
      {dbTraps.length > 0 && (
        <SectionCardSlider
          title="Common Candidate Traps & Assertion-Reason Couplets"
          icon={AlertTriangle}
          accentColorClass="text-rose-600"
          items={dbTraps}
          sectionKey="trap"
          conceptName={conceptName}
          activeSectionKey={activeSectionKey}
          onSectionActiveChange={setActiveSectionKey}
          renderCardContent={(item, idx) => (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold text-rose-600 uppercase tracking-wider">
                  Trap / Couplet #{idx + 1}
                </span>
              </div>

              <div className="space-y-2 text-xs sm:text-sm select-text">
                {item.assertion ? (
                  <>
                    <div className="p-3 rounded-xl bg-amber-500/10 dark:bg-amber-950/40 border border-amber-500/20">
                      <p className="font-bold text-amber-900 dark:text-amber-300">
                        📌 Assertion (A): {item.assertion}
                      </p>
                    </div>
                    <div className="p-3 rounded-xl bg-indigo-500/10 dark:bg-indigo-950/40 border border-indigo-500/20">
                      <p className="font-bold text-indigo-900 dark:text-indigo-300">
                        💡 Reason (R): {item.reason}
                      </p>
                    </div>
                  </>
                ) : (
                  <>
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
                  </>
                )}
              </div>
            </div>
          )}
        />
      )}
    </div>
  );
}
