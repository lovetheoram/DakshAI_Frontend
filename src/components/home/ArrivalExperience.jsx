// src/components/home/ArrivalExperience.jsx
// NON-LOGGED-IN HOME — Visual, Diagram-driven, Zero Walls of Text.
// Big typography with signature brand orange/amber accents.
// Deep explanatory text moved into optional drop-downs.
// No Mirror simulation shown to non-logged-in visitors.

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Target,
  BookOpen,
  Globe,
  Sparkles,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  XCircle,
} from "lucide-react";

export default function ArrivalExperience() {
  const navigate = useNavigate();

  // Accordion Dropdown States
  const [openDropdown, setOpenDropdown] = useState(null);

  const toggleDropdown = (id) => {
    setOpenDropdown((prev) => (prev === id ? null : id));
  };

  const handleStart = () => {
    navigate("/signup");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center relative overflow-hidden select-none font-sans text-left">
      {/* Background Amber Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-amber-500/15 rounded-full blur-[120px] pointer-events-none" />

      {/* ── HEADER NAV ────────────────────────────────────────── */}
      <header className="w-full max-w-4xl px-6 py-5 flex items-center justify-between z-20 border-b border-slate-800/80 sticky top-0 bg-slate-950/85 backdrop-blur-md">
        <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => navigate("/")}>
          <div className="w-8 h-8 rounded-xl bg-amber-500 flex items-center justify-center font-black text-slate-950 text-sm">
            D
          </div>
          <span className="text-base font-black tracking-tight text-white">
            Daksh<span className="text-amber-400">AI</span>
          </span>
        </div>

        <div className="flex items-center gap-3 text-xs font-bold">
          <button
            onClick={() => navigate("/login")}
            className="text-slate-400 hover:text-white transition-colors cursor-pointer px-3 py-2"
          >
            Log in
          </button>
          <button
            onClick={handleStart}
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-4 py-2 rounded-xl transition cursor-pointer font-black shadow-xs"
          >
            Start free
          </button>
        </div>
      </header>

      {/* ── MAIN CONTENT (DIAGRAMS & BIG TEXT — EXPANSIVE) ──── */}
      <main className="relative z-10 w-full max-w-4xl px-6 sm:px-8 py-16 sm:py-24 space-y-24">

        {/* ═══ 1. HERO ═══ */}
        <section className="space-y-6 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-[11px] font-bold text-amber-400">
            <Sparkles size={13} />
            <span>Built for Competitive Aspirants</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight uppercase leading-[1.05]">
            Know before it <span className="text-amber-400">matters</span>.
          </h1>

          <p className="text-sm sm:text-base text-slate-300 font-medium max-w-xl">
            You don't need another place to study. You need to know if what you're doing is actually enough.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center gap-4">
            <button
              onClick={handleStart}
              className="w-full sm:w-auto bg-amber-500 hover:bg-amber-400 text-slate-950 px-8 py-3.5 rounded-2xl text-sm font-black flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:scale-[1.01] transition-all"
            >
              <span>Start with your target</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </section>

        {/* ═══ 2. DIAGRAM 1: THE REALITY GAP (TIMELINE COMPARISON) ═══ */}
        <section className="space-y-4">
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase tracking-widest text-amber-400 block">
              The Problem
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase">
              The <span className="text-amber-400">Reality Gap</span>
            </h2>
          </div>

          {/* Visual Timeline Diagram Card */}
          <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-5">
            {/* Path A: Traditional */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-400">Without Diagnostic Feedback</span>
                <span className="text-rose-400 flex items-center gap-1">
                  <XCircle size={14} /> Too Late
                </span>
              </div>
              <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden flex items-center">
                <div className="h-full bg-slate-600 w-3/4 rounded-l-full" />
                <div className="h-full bg-rose-500 w-1/4 rounded-r-full" />
              </div>
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>Passive studying with false confidence</span>
                <span className="text-rose-300 font-bold">Exam Day Shock</span>
              </div>
            </div>

            <div className="h-px bg-slate-800" />

            {/* Path B: With DakshAI */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-amber-400">With DakshAI Retrieval Testing</span>
                <span className="text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 size={14} /> Adjusted Early
                </span>
              </div>
              <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden flex items-center">
                <div className="h-full bg-amber-500 w-full rounded-full" />
              </div>
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>Continuous retrieval & true pace</span>
                <span className="text-emerald-400 font-bold">Target Ready</span>
              </div>
            </div>
          </div>

          {/* Dropdown for Deeper Text */}
          <div className="pt-1">
            <button
              onClick={() => toggleDropdown("realityGap")}
              className="text-xs font-bold text-slate-400 hover:text-amber-400 flex items-center gap-1.5 transition-colors cursor-pointer py-1"
            >
              <span>Why students find out too late</span>
              {openDropdown === "realityGap" ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>

            <AnimatePresence>
              {openDropdown === "realityGap" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="pt-2 text-xs text-slate-400 leading-relaxed overflow-hidden space-y-2 border-l-2 border-amber-500/40 pl-3"
                >
                  <p>
                    Passive studying (watching lectures, re-reading notes) creates a feeling of mastery.
                    Real exams test retrieval under time pressure.
                  </p>
                  <p>
                    DakshAI measures your pace continuously through retrieval evidence, so you discover gaps months before the exam.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>

        {/* ═══ 3. DIAGRAM 2: THREE DOORS ═══ */}
        <section className="space-y-4">
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase tracking-widest text-amber-400 block">
              What DakshAI Gives You
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase">
              The Three <span className="text-amber-400">Doors</span>
            </h2>
          </div>

          {/* Connected Flow Diagram */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">

            {/* Box 1: Learn */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold">
                <BookOpen size={16} />
              </div>
              <div>
                <span className="text-[10px] font-black text-blue-400 uppercase tracking-wider block">Door 1</span>
                <h3 className="text-sm font-black text-white">LEARN</h3>
              </div>
              <p className="text-[11px] text-slate-400 leading-snug">
                Understand the story & reason before formulas.
              </p>
            </div>

            {/* Box 2: Practice */}
            <div className="p-4 rounded-2xl bg-slate-900 border-2 border-amber-500/40 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold">
                <Target size={16} />
              </div>
              <div>
                <span className="text-[10px] font-black text-amber-400 uppercase tracking-wider block">Door 2</span>
                <h3 className="text-sm font-black text-amber-400">PRACTICE</h3>
              </div>
              <p className="text-[11px] text-slate-400 leading-snug">
                Test yourself against real PYQs and timer pressure.
              </p>
            </div>

            {/* Box 3: World */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold">
                <Globe size={16} />
              </div>
              <div>
                <span className="text-[10px] font-black text-indigo-400 uppercase tracking-wider block">Door 3</span>
                <h3 className="text-sm font-black text-white">WORLD</h3>
              </div>
              <p className="text-[11px] text-slate-400 leading-snug">
                Discover science and tech projects outside syllabus.
              </p>
            </div>

          </div>

          {/* Dropdown for Rooms */}
          <div className="pt-1">
            <button
              onClick={() => toggleDropdown("rooms")}
              className="text-xs font-bold text-slate-400 hover:text-amber-400 flex items-center gap-1.5 transition-colors cursor-pointer py-1"
            >
              <span>How the doors work</span>
              {openDropdown === "rooms" ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>

            <AnimatePresence>
              {openDropdown === "rooms" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="pt-2 text-xs text-slate-400 leading-relaxed overflow-hidden space-y-2 border-l-2 border-amber-500/40 pl-3"
                >
                  <p>
                    When you enter <strong>Learn</strong>, you build intuition and context.
                  </p>
                  <p>
                    When you enter <strong>Practice</strong>, you test retention under real exam conditions.
                  </p>
                  <p>
                    When you enter <strong>World</strong>, you discover real-world applications of what you study.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>

        {/* ═══ 4. FINAL INVITATION ═══ */}
        <section className="space-y-6 border-t border-slate-800/80 pt-12 pb-16 text-center sm:text-left">
          <div className="space-y-2">
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight uppercase leading-tight">
              Don't wait for <span className="text-amber-400">exam day</span>.
            </h2>
            <p className="text-sm sm:text-base text-slate-400 font-medium">
              Start building real evidence with your target syllabus.
            </p>
          </div>

          <button
            onClick={handleStart}
            className="w-full sm:w-auto bg-amber-500 hover:bg-amber-400 text-slate-950 px-8 py-4 rounded-2xl text-sm font-black flex items-center justify-center gap-2 cursor-pointer shadow-xl hover:scale-[1.01] transition-all"
          >
            <span>Start with DakshAI</span>
            <ArrowRight size={16} />
          </button>
        </section>

      </main>
    </div>
  );
}
