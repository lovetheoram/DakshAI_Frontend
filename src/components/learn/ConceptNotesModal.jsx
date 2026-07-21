// src/components/learn/ConceptNotesModal.jsx
import React, { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, FileText, Layers, BookOpen, Lightbulb, CheckCircle2, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";

// Reusable Horizontal Slider / Carousel for each section
function HorizontalSectionSlider({ title, icon: Icon, badge, accentColor, items = [], renderItem }) {
  const containerRef = useRef(null);

  const scrollLeft = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: -320, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: 320, behavior: "smooth" });
    }
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
            {items.length} {items.length === 1 ? "card" : "cards"}
          </span>
        </div>

        {items.length > 1 && (
          <div className="flex items-center gap-1.5">
            <button
              onClick={scrollLeft}
              className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors border border-white/10"
              title="Scroll left"
            >
              <ChevronLeft size={14} />
            </button>
            <button
              onClick={scrollRight}
              className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors border border-white/10"
              title="Scroll right"
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
          className="flex gap-4 overflow-x-auto pb-3 pt-1 scroll-smooth snap-x snap-mandatory scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent"
        >
          {items.map((item, idx) => (
            <React.Fragment key={idx}>
              {renderItem(item, idx)}
            </React.Fragment>
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
  if (!isOpen) return null;

  // Normalize DB arrays
  const dbFormulas = aiMeta.layer_1_hard_formulas || formulas || [];
  const dbRules = aiMeta.layer_2_rule_based_logics || rules || [];
  const dbConsequences = aiMeta.layer_3_derived_consequences || consequences || [];

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
                <FileText size={20} />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-white">{conceptName} — Interactive Notes</h3>
                <p className="text-xs text-gray-400">{chapterName || "Structured Syllabus Notes & Slider Carousel"}</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Content Body */}
          <div className="p-6 overflow-y-auto flex-1 space-y-6">
            
            {/* 1. TOP HERO: Concept Description */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-950/60 via-indigo-950/40 to-slate-900 border border-purple-500/30 shadow-xl space-y-2">
              <div className="flex items-center gap-2 text-purple-300 font-extrabold text-xs uppercase tracking-wider">
                <BookOpen size={16} className="text-purple-400" />
                <span>Concept Overview & Description</span>
              </div>
              <p className="text-xs sm:text-sm text-gray-100 font-medium leading-relaxed">
                {description || `${conceptName} represents a key concept under ${chapterName}. Refer to slider cards below for detailed formulas, rules, and applications.`}
              </p>
            </div>

            {/* 2. SECTION 1 CAROUSEL: Part 1 — Hard Formulas */}
            <HorizontalSectionSlider
              title="Part 1 — Hard Formulas"
              icon={Layers}
              accentColor="text-indigo-400"
              items={dbFormulas}
              renderItem={(formula, idx) => (
                <div
                  key={idx}
                  className="min-w-[280px] sm:min-w-[320px] max-w-[340px] p-5 rounded-2xl bg-slate-800/90 border border-indigo-500/30 space-y-2 shrink-0 snap-center shadow-lg hover:border-indigo-400/50 transition-all select-none"
                >
                  <span className="text-[10px] font-extrabold text-indigo-400 uppercase tracking-wider block">
                    Formula Card #{idx + 1} {formula.id ? `(${formula.id})` : ""}
                  </span>
                  <code className="text-base font-mono text-yellow-300 font-extrabold block my-1">
                    {formula.formula || formula.equation || formula}
                  </code>
                  {formula.used_for && (
                    <p className="text-xs text-gray-300 leading-snug">
                      <strong>Used for:</strong> {formula.used_for}
                    </p>
                  )}
                  {formula.notes && <p className="text-xs text-gray-400 leading-snug">{formula.notes}</p>}
                </div>
              )}
            />

            {/* 3. SECTION 2 CAROUSEL: Part 2 — Rule-Based Logics */}
            <HorizontalSectionSlider
              title="Part 2 — Rule-Based Logics"
              icon={CheckCircle2}
              accentColor="text-emerald-400"
              items={dbRules}
              renderItem={(rule, idx) => (
                <div
                  key={idx}
                  className="min-w-[280px] sm:min-w-[320px] max-w-[340px] p-5 rounded-2xl bg-slate-800/90 border border-emerald-500/30 space-y-2 shrink-0 snap-center shadow-lg hover:border-emerald-400/50 transition-all select-none"
                >
                  <span className="text-[10px] font-extrabold text-emerald-400 uppercase tracking-wider block">
                    Rule Card #{idx + 1} {rule.id ? `(${rule.id})` : ""}
                  </span>
                  <p className="text-xs sm:text-sm font-bold text-white leading-relaxed">
                    {rule.rule || rule.statement || rule}
                  </p>
                  {rule.applied_when && (
                    <p className="text-xs text-emerald-200 leading-snug">
                      <strong>Applied when:</strong> {rule.applied_when}
                    </p>
                  )}
                </div>
              )}
            />

            {/* 4. SECTION 3 CAROUSEL: Part 3 — Derived Consequences & Traps */}
            <HorizontalSectionSlider
              title="Part 3 — Derived Consequences & Traps"
              icon={Lightbulb}
              accentColor="text-amber-400"
              items={dbConsequences}
              renderItem={(item, idx) => (
                <div
                  key={idx}
                  className="min-w-[280px] sm:min-w-[320px] max-w-[340px] p-5 rounded-2xl bg-slate-800/90 border border-amber-500/30 space-y-2 shrink-0 snap-center shadow-lg hover:border-amber-400/50 transition-all select-none"
                >
                  <span className="text-[10px] font-extrabold text-amber-400 uppercase tracking-wider block">
                    Consequence Card #{idx + 1} {item.id ? `(${item.id})` : ""}
                  </span>
                  <p className="text-xs sm:text-sm font-bold text-amber-100 leading-relaxed">
                    {item.consequence || item}
                  </p>
                  {item.derived_from && (
                    <span className="text-[10px] text-gray-400 block pt-1 border-t border-white/10">
                      Derived from: {Array.isArray(item.derived_from) ? item.derived_from.join(", ") : item.derived_from}
                    </span>
                  )}
                </div>
              )}
            />
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
