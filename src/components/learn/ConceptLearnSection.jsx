// src/components/learn/ConceptLearnSection.jsx
import React, { useRef } from "react";
import { motion } from "framer-motion";
import { BookOpen, Layers, CheckCircle2, Lightbulb, ChevronLeft, ChevronRight, Swords, Sparkles } from "lucide-react";

// Reusable Horizontal Section Carousel
function LearnSectionCarousel({ title, icon: Icon, badgeColor, items = [], renderCard }) {
  const scrollRef = useRef(null);

  const handleScrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -320, behavior: "smooth" });
    }
  };

  const handleScrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 320, behavior: "smooth" });
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`p-1.5 rounded-lg bg-white/10 ${badgeColor}`}>
            <Icon size={16} />
          </div>
          <h4 className="text-sm font-extrabold text-white uppercase tracking-wider">
            {title}
          </h4>
          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-white/10 text-gray-300">
            {items.length} {items.length === 1 ? "card" : "cards"}
          </span>
        </div>

        {items.length > 1 && (
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleScrollLeft}
              className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors border border-white/10"
              title="Previous card"
            >
              <ChevronLeft size={14} />
            </button>
            <button
              onClick={handleScrollRight}
              className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors border border-white/10"
              title="Next card"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        )}
      </div>

      {items.length > 0 ? (
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto pb-3 pt-1 scroll-smooth snap-x snap-mandatory scrollbar-thin scrollbar-thumb-white/10"
        >
          {items.map((item, idx) => (
            <React.Fragment key={idx}>{renderCard(item, idx)}</React.Fragment>
          ))}
        </div>
      ) : (
        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 text-xs text-gray-400">
          No entries stored for this section in database.
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
  consequences = [],
  aiMeta = {},
  onStartPractice
}) {
  // Extract DB layers
  const dbFormulas = aiMeta.layer_1_hard_formulas || formulas || [];
  const dbRules = aiMeta.layer_2_rule_based_logics || rules || [];
  const dbConsequences = aiMeta.layer_3_derived_consequences || consequences || [];

  // Scroll observer — tells Daksh about each module as it enters the viewport
  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const moduleId = entry.target.id;
            if (moduleId) {
              window.dispatchEvent(
                new CustomEvent("daksh:module_view", {
                  detail: { moduleId },
                  bubbles: true,
                })
              );
            }
          }
        });
      },
      { threshold: 0.4 }
    );

    ["module-formulas", "module-rules", "module-consequences"].forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="space-y-6">
      {/* 1. TOP HERO: Description Card */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-purple-950/80 via-indigo-950/50 to-slate-900 border border-purple-500/30 shadow-2xl space-y-3 relative overflow-hidden backdrop-blur-xl">
        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-extrabold border border-purple-500/30 uppercase tracking-wide flex items-center gap-1.5">
            <BookOpen size={14} />
            Concept Description
          </span>
        </div>

        <h2 className="text-xl font-extrabold text-white tracking-tight">{conceptName}</h2>

        <p className="text-xs sm:text-sm text-gray-200 leading-relaxed font-medium">
          {description || `${conceptName} is a foundational concept in ${chapterName}. Refer to the 3 section sliders below to review formulas, rules, and derived consequences.`}
        </p>
      </div>

      {/* 2. THREE SECTION SLIDERS / CAROUSELS WITH ACTIVE RECALL CHIPS */}
      <div id="active-recall-notes-dashboard" className="space-y-6 scroll-mt-6">
        {/* SLIDER 1: Part 1 — Hard Formulas */}
        <div id="module-formulas">
        <LearnSectionCarousel
          title="Part 1 — Hard Formulas"
          icon={Layers}
          badgeColor="text-indigo-400"
          items={dbFormulas}
          renderCard={(formula, idx) => (
            <div
              key={idx}
              className="min-w-[280px] sm:min-w-[320px] max-w-[340px] p-5 rounded-2xl bg-slate-900/90 border border-indigo-500/30 space-y-2 shrink-0 snap-center shadow-xl hover:border-indigo-400/50 transition-all select-none"
            >
              <span className="text-[10px] font-extrabold text-indigo-400 uppercase tracking-wider block">
                Formula #{idx + 1} {formula.id ? `(${formula.id})` : ""}
              </span>
              <code className="text-base font-mono text-yellow-300 font-extrabold block my-1">
                {formula.formula || formula.equation || formula}
              </code>
              {formula.used_for && (
                <p className="text-xs text-gray-300 leading-snug">
                  <strong>Used for:</strong> {formula.used_for}
                </p>
              )}

              {/* Active Recall Self-Assessment Chips */}
              <div className="pt-2 border-t border-white/10 mt-2 flex items-center justify-between">
                <span className="text-[10px] text-gray-400 font-medium">Recall Check:</span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => EventTracker.conceptStarted(formula.id || idx, "Formula Recall", "Active Recall")}
                    className="px-2 py-0.5 rounded-lg text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30 transition-all cursor-pointer"
                  >
                    ✓ I know
                  </button>
                  <button
                    className="px-2 py-0.5 rounded-lg text-[10px] font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30 transition-all cursor-pointer"
                  >
                    ? Not sure
                  </button>
                  <button
                    className="px-2 py-0.5 rounded-lg text-[10px] font-extrabold bg-red-500/20 text-red-300 border border-red-500/30 hover:bg-red-500/30 transition-all cursor-pointer"
                  >
                    ✗ Review
                  </button>
                </div>
              </div>
            </div>
          )}
        />
        </div>

        {/* SLIDER 2: Part 2 — Rule-Based Logics */}
        <div id="module-rules">
        <LearnSectionCarousel
          title="Part 2 — Rule-Based Logics"
          icon={CheckCircle2}
          badgeColor="text-emerald-400"
          items={dbRules}
          renderCard={(rule, idx) => (
            <div
              key={idx}
              className="min-w-[280px] sm:min-w-[320px] max-w-[340px] p-5 rounded-2xl bg-slate-900/90 border border-emerald-500/30 space-y-2 shrink-0 snap-center shadow-xl hover:border-emerald-400/50 transition-all select-none"
            >
              <span className="text-[10px] font-extrabold text-emerald-400 uppercase tracking-wider block">
                Rule #{idx + 1} {rule.id ? `(${rule.id})` : ""}
              </span>
              <p className="text-xs sm:text-sm font-bold text-white leading-relaxed">
                {rule.rule || rule.statement || rule}
              </p>
              {rule.applied_when && (
                <p className="text-xs text-emerald-200 leading-snug">
                  <strong>Applied when:</strong> {rule.applied_when}
                </p>
              )}

              {/* Active Recall Self-Assessment Chips */}
              <div className="pt-2 border-t border-white/10 mt-2 flex items-center justify-between">
                <span className="text-[10px] text-gray-400 font-medium">Recall Check:</span>
                <div className="flex items-center gap-1">
                  <button
                    className="px-2 py-0.5 rounded-lg text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30 transition-all cursor-pointer"
                  >
                    ✓ I know
                  </button>
                  <button
                    className="px-2 py-0.5 rounded-lg text-[10px] font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30 transition-all cursor-pointer"
                  >
                    ? Not sure
                  </button>
                  <button
                    className="px-2 py-0.5 rounded-lg text-[10px] font-extrabold bg-red-500/20 text-red-300 border border-red-500/30 hover:bg-red-500/30 transition-all cursor-pointer"
                  >
                    ✗ Review
                  </button>
                </div>
              </div>
            </div>
          )}
        />
        </div>

        {/* SLIDER 3: Part 3 — Derived Consequences */}
        <div id="module-consequences">
        <LearnSectionCarousel
          title="Part 3 — Derived Consequences & Traps"
          icon={Lightbulb}
          badgeColor="text-amber-400"
          items={dbConsequences}
          renderCard={(item, idx) => (
            <div
              key={idx}
              className="min-w-[280px] sm:min-w-[320px] max-w-[340px] p-5 rounded-2xl bg-slate-900/90 border border-amber-500/30 space-y-2 shrink-0 snap-center shadow-xl hover:border-amber-400/50 transition-all select-none"
            >
              <span className="text-[10px] font-extrabold text-amber-400 uppercase tracking-wider block">
                Consequence #{idx + 1} {item.id ? `(${item.id})` : ""}
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
      </div>

      {/* Start Practice CTA */}
      <div className="p-5 rounded-2xl bg-slate-900/70 border border-white/10 backdrop-blur-md flex items-center justify-between">
        <div>
          <h4 className="text-sm font-bold text-white">Reviewed all revision notes?</h4>
          <p className="text-xs text-gray-400">Test your recall in gamified practice mode.</p>
        </div>

        <button
          onClick={onStartPractice}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white font-extrabold text-xs shadow-lg flex items-center gap-1.5 transition-all"
        >
          <span>Start Practice</span>
          <Swords size={14} />
        </button>
      </div>
    </div>
  );
}
