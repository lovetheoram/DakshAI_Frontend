import React, { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, FileText, Headphones, Layers, BookOpen, Lightbulb, CheckCircle2, ChevronLeft, ChevronRight, Sparkles, HelpCircle, ArrowRight, Volume2, Play, Square } from "lucide-react";
import { useNavigate } from "react-router-dom";
import CuriosityEngine from "../../intelligence/curiosity/CuriosityEngine";
import PreferenceStore from "../../product/preferenceStore";

// Interactive Active Recall widget inside Notes modal
function CuriosityQuickCheck({ formulas = [], conceptName, onCloseModal }) {
  const navigate = useNavigate();
  const [selectedMap, setSelectedMap] = useState({});
  const [evaluated, setEvaluated] = useState(null);

  const toggleCheck = (idx) => {
    setSelectedMap((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const handleEvaluate = () => {
    const res = CuriosityEngine.evaluateRecall(formulas, selectedMap);
    setEvaluated(res);
  };

  const handleAction = () => {
    if (onCloseModal) onCloseModal();
    if (evaluated?.recommendation === "TAKE_QUIZ_DIRECT") {
      navigate(`/practice?concept=${encodeURIComponent(conceptName)}`);
    } else {
      // scroll notes into view
    }
  };

  return (
    <div className="p-4 rounded-xl bg-slate-900/80 border border-purple-500/20 space-y-3">
      <div className="text-xs font-bold text-purple-200">
        Without looking at the details — check which formulas you already know:
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {formulas.slice(0, 4).map((f, idx) => {
          const formulaStr = typeof f === "string" ? f : f.formula || f.equation || `Formula #${idx + 1}`;
          const isChecked = !!selectedMap[idx];
          return (
            <button
              key={idx}
              type="button"
              onClick={() => toggleCheck(idx)}
              className={`flex items-center gap-2 p-2.5 rounded-lg text-xs text-left transition-all border ${isChecked
                  ? "bg-purple-600/30 border-purple-400 text-purple-100 font-bold"
                  : "bg-white/5 border-white/10 text-gray-300 hover:bg-white/10"
                }`}
            >
              <div className={`w-4 h-4 rounded flex items-center justify-center border ${isChecked ? "bg-purple-500 border-purple-300 text-white" : "border-gray-500"}`}>
                {isChecked && <CheckCircle2 size={12} />}
              </div>
              <span className="truncate font-mono">{formulaStr}</span>
            </button>
          );
        })}
      </div>

      {!evaluated ? (
        <button
          onClick={handleEvaluate}
          className="w-full py-2 px-4 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>See How Good You Are 🙂</span>
          <ArrowRight size={14} />
        </button>
      ) : (
        <div className="p-3 rounded-lg bg-purple-950/60 border border-purple-400/30 space-y-2">
          <p className="text-xs font-semibold text-purple-200">{evaluated.message}</p>
          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] text-gray-400">Score: {evaluated.knownCount}/{evaluated.totalCount} recalled</span>
            {evaluated.recommendation === "TAKE_QUIZ_DIRECT" && (
              <button
                onClick={handleAction}
                className="px-3 py-1 rounded bg-yellow-500 hover:bg-yellow-400 text-slate-950 text-xs font-extrabold transition-all cursor-pointer"
              >
                Take Challenge Quiz ⚡
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}


// Reusable Horizontal Slider / Carousel for each section
function HorizontalSectionSlider({ title, icon: Icon, badge, accentColor, items = [], renderItem }) {
  const containerRef = useRef(null);
  const cardRefs = useRef([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const scrollToCard = (index) => {
    const container = containerRef.current;
    const card = cardRefs.current[index];
    if (container && card) {
      const targetLeft = card.offsetLeft - (container.clientWidth - card.clientWidth) / 2;
      container.scrollTo({ left: Math.max(0, targetLeft), behavior: "smooth" });
    }
  };

  const handleScroll = () => {
    const container = containerRef.current;
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
    if (closestIndex !== currentIndex) {
      setCurrentIndex(closestIndex);
    }
  };

  const scrollPrev = () => {
    const nextIdx = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
    setCurrentIndex(nextIdx);
    scrollToCard(nextIdx);
  };

  const scrollNext = () => {
    const nextIdx = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
    setCurrentIndex(nextIdx);
    scrollToCard(nextIdx);
  };

  return (
    <div className="space-y-3">
      {/* Slider Section Title & Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`p-1.5 rounded-lg bg-white/10 ${accentColor}`}>
            <Icon size={16} />
          </div>
          <h4 className="text-xs sm:text-sm font-extrabold text-white uppercase tracking-wider">
            {title}
          </h4>
          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-white/10 text-gray-300">
            {currentIndex + 1} of {items.length}
          </span>
        </div>

        {items.length > 1 && (
          <div className="flex items-center gap-1.5">
            <button
              onClick={scrollPrev}
              className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors border border-white/10 cursor-pointer"
              title="Previous card"
            >
              <ChevronLeft size={14} />
            </button>
            <button
              onClick={scrollNext}
              className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors border border-white/10 cursor-pointer"
              title="Next card"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        )}
      </div>

      {/* Carousel Scroll Track */}
      {items.length > 0 ? (
        <div
          ref={containerRef}
          onScroll={handleScroll}
          className="flex gap-3 sm:gap-4 overflow-x-auto pb-3 pt-1 scroll-smooth snap-x snap-mandatory touch-pan-x overscroll-x-contain scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent"
        >
          {items.map((item, idx) => (
            <div
              key={idx}
              ref={(el) => (cardRefs.current[idx] = el)}
              className="shrink-0 snap-center"
            >
              {renderItem(item, idx)}
            </div>
          ))}
        </div>
      ) : (
        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 text-xs text-gray-400">
          No records found for this section in database.
        </div>
      )}
    </div>
  );
}

export default function ConceptNotesModal({
  isOpen,
  onClose,
  conceptName,
  chapterName,
  formulas = [],
  rules = [],
  consequences = [],
  description = "",
  aiMeta = {}
}) {
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

    if (speakingCardId === cardId) {
      window.speechSynthesis.cancel();
      setSpeakingCardId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const prefs = PreferenceStore.getPreferences();
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = prefs.speechRate || 1.0;

    const voices = window.speechSynthesis.getVoices();
    const targetLang = prefs.speechVoiceLang || "en-US";
    const matchedVoice = voices.find((v) => v.lang.includes(targetLang) || v.lang.startsWith("en"));
    if (matchedVoice) utterance.voice = matchedVoice;

    utterance.onend = () => setSpeakingCardId(null);
    utterance.onerror = () => setSpeakingCardId(null);

    window.speechSynthesis.speak(utterance);
    setSpeakingCardId(cardId);
  };

  if (!isOpen) return null;

  // Normalize DB arrays
  const dbFormulas = aiMeta.layer_1_hard_formulas || aiMeta.core_formulas_or_equations || formulas || [];
  const dbRules = aiMeta.layer_2_rule_based_logics || aiMeta.biological_or_chemical_pathways || rules || [];
  const dbConsequences = aiMeta.layer_3_derived_consequences || aiMeta.assertion_reason_traps || aiMeta.ncert_exceptions_and_anomalies || consequences || [];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-lg">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-4xl max-h-[90vh] bg-slate-900 border border-purple-500/30 rounded-3xl shadow-2xl overflow-hidden flex flex-col"
        >
          {/* Top Header Bar */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-slate-950/70">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-400">
                <Headphones size={20} />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-white">{conceptName} — Vocal Explanation</h3>
                <p className="text-xs text-gray-400">{chapterName || "Slide Deck & Vocal Narration"}</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          {/* Content Body */}
          <div className="p-6 overflow-y-auto flex-1 space-y-6">

            {/* 1. TOP HERO: Curiosity Spark & Active Recall Banner */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-950/60 via-indigo-950/40 to-slate-900 border border-purple-500/30 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-purple-300 font-extrabold text-xs uppercase tracking-wider">
                  <Sparkles size={16} className="text-purple-400 animate-pulse" />
                  <span>Curiosity & Active Recall Challenge</span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  Retrieval Practice
                </span>
              </div>

              {/* Curiosity Question */}
              <p className="text-xs sm:text-sm text-gray-100 font-medium leading-relaxed">
                {description || `${conceptName} represents a key concept under ${chapterName}. Before scrolling through the notes, test your memory!`}
              </p>

              {/* Formula Quick Check Widget if formulas exist */}
              {dbFormulas.length > 0 && (
                <CuriosityQuickCheck
                  formulas={dbFormulas}
                  conceptName={conceptName}
                  onCloseModal={onClose}
                />
              )}
            </div>

            {/* 2. SECTION 1 CAROUSEL: Part 1 — Hard Formulas */}
            <HorizontalSectionSlider
              title="Part 1 — Hard Formulas & Equations"
              icon={Layers}
              accentColor="text-amber-400"
              items={dbFormulas}
              renderItem={(formula, idx) => {
                const cardId = `m-formula-${idx}`;
                const formulaText = typeof formula === "string" ? formula : formula.formula || formula.equation || "";
                const isSpeakingCard = speakingCardId === cardId;

                return (
                  <div
                    key={idx}
                    className="min-w-[280px] sm:min-w-[320px] max-w-[340px] p-5 rounded-2xl bg-slate-900 border border-amber-500/40 space-y-3 shrink-0 snap-center shadow-xl hover:border-amber-400 transition-all select-none"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold text-amber-400 uppercase tracking-wider block">
                        Formula Card #{idx + 1}
                      </span>
                      <button
                        onClick={() => speakText(cardId, `Formula: ${formulaText}`)}
                        className={`p-1.5 rounded-lg border text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${isSpeakingCard
                            ? "bg-rose-500/30 text-rose-300 border-rose-400"
                            : "bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border-amber-500/30"
                          }`}
                        title="Listen formula"
                      >
                        {isSpeakingCard ? <Square size={12} className="fill-current" /> : <Volume2 size={13} />}
                      </button>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-950 border border-amber-500/30 shadow-inner">
                      <code className="text-sm sm:text-base font-mono text-yellow-300 font-extrabold block whitespace-pre-wrap break-words leading-relaxed select-text">
                        {formulaText}
                      </code>
                    </div>

                    {formula.used_for && (
                      <p className="text-xs text-gray-300 leading-snug select-text">
                        <strong className="text-amber-300">Used for:</strong> {formula.used_for}
                      </p>
                    )}
                  </div>
                );
              }}
            />

            {/* 3. SECTION 2 CAROUSEL: Part 2 — Rule-Based Logics */}
            <HorizontalSectionSlider
              title="Part 2 — Rule-Based Logics"
              icon={CheckCircle2}
              accentColor="text-emerald-400"
              items={dbRules}
              renderItem={(rule, idx) => {
                const cardId = `m-rule-${idx}`;
                const ruleText = typeof rule === "string" ? rule : rule.rule || rule.statement || "";
                const isSpeakingCard = speakingCardId === cardId;

                return (
                  <div
                    key={idx}
                    className="min-w-[280px] sm:min-w-[320px] max-w-[340px] p-5 rounded-2xl bg-slate-800/90 border border-emerald-500/30 space-y-2 shrink-0 snap-center shadow-lg hover:border-emerald-400/50 transition-all select-none"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold text-emerald-400 uppercase tracking-wider block">
                        Rule Card #{idx + 1}
                      </span>
                      <button
                        onClick={() => speakText(cardId, `Rule: ${ruleText}`)}
                        className={`p-1.5 rounded-lg border text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${isSpeakingCard
                            ? "bg-rose-500/30 text-rose-300 border-rose-400"
                            : "bg-white/10 hover:bg-white/20 text-gray-200 border-white/10"
                          }`}
                        title="Listen rule"
                      >
                        {isSpeakingCard ? <Square size={12} className="fill-current" /> : <Volume2 size={13} />}
                      </button>
                    </div>

                    <p className="text-xs sm:text-sm font-bold text-white leading-relaxed">
                      • {ruleText}
                    </p>
                    {rule.applied_when && (
                      <p className="text-xs text-emerald-200 leading-snug">
                        <strong>Applied when:</strong> {rule.applied_when}
                      </p>
                    )}
                  </div>
                );
              }}
            />

            {/* 4. SECTION 3 CAROUSEL: Part 3 — Derived Consequences & Traps */}
            <HorizontalSectionSlider
              title="Part 3 — Derived Consequences & Traps"
              icon={Lightbulb}
              accentColor="text-amber-400"
              items={dbConsequences}
              renderItem={(item, idx) => {
                const cardId = `m-consequence-${idx}`;
                const itemText = typeof item === "string" ? item : item.consequence || "";
                const isSpeakingCard = speakingCardId === cardId;

                return (
                  <div
                    key={idx}
                    className="min-w-[280px] sm:min-w-[320px] max-w-[340px] p-5 rounded-2xl bg-slate-800/90 border border-amber-500/30 space-y-2 shrink-0 snap-center shadow-lg hover:border-amber-400/50 transition-all select-none"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold text-amber-400 uppercase tracking-wider block">
                        Consequence Card #{idx + 1}
                      </span>
                      <button
                        onClick={() => speakText(cardId, `Consequence: ${itemText}`)}
                        className={`p-1.5 rounded-lg border text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${isSpeakingCard
                            ? "bg-rose-500/30 text-rose-300 border-rose-400"
                            : "bg-white/10 hover:bg-white/20 text-gray-200 border-white/10"
                          }`}
                        title="Listen consequence"
                      >
                        {isSpeakingCard ? <Square size={12} className="fill-current" /> : <Volume2 size={13} />}
                      </button>
                    </div>

                    <p className="text-xs sm:text-sm font-bold text-amber-100 leading-relaxed">
                      {itemText}
                    </p>
                    {item.derived_from && (
                      <span className="text-[10px] text-gray-400 block pt-1 border-t border-white/10">
                        Derived from: {Array.isArray(item.derived_from) ? item.derived_from.join(", ") : item.derived_from}
                      </span>
                    )}
                  </div>
                );
              }}
            />
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

