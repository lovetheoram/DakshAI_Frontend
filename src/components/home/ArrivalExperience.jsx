// src/components/home/ArrivalExperience.jsx
// Core Marketing Foundation Landing Page
// Primary Hook: "Don't find out on exam day."
// Brand Promise: "Know before it matters. DakshAI helps you find out today."

import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ShieldCheck,
  Brain,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  Eye,
  Activity,
  Layers,
  ChevronRight,
  Compass,
} from "lucide-react";

export default function ArrivalExperience() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center relative overflow-hidden select-none font-sans">
      {/* Background Glow Spheres */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-amber-500/15 via-indigo-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Bar */}
      <header className="w-full max-w-6xl px-6 py-6 flex items-center justify-between z-20 border-b border-slate-800/80 backdrop-blur-md sticky top-0 bg-slate-950/80">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center shadow-lg border border-amber-400/30">
            <span className="text-white font-black text-base">D</span>
          </div>
          <span className="text-lg font-black tracking-tight text-white">
            Daksh<span className="text-amber-400">AI</span>
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/login")}
            className="text-xs font-bold text-slate-300 hover:text-white transition-colors px-4 py-2 rounded-xl border border-slate-800 hover:border-slate-700 bg-slate-900 cursor-pointer"
          >
            Sign In
          </button>
          <button
            onClick={() => navigate("/signup")}
            className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-md hover:shadow-amber-500/20 transition cursor-pointer"
          >
            Find Out Today
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 w-full max-w-5xl px-5 py-12 space-y-24 flex flex-col items-center text-center">
        
        {/* ═══ 1. HERO SECTION ═══ */}
        <section className="space-y-8 max-w-3xl py-10 flex flex-col items-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-extrabold tracking-widest uppercase shadow-sm"
          >
            <Sparkles size={13} className="text-amber-400" />
            EVIDENCE-BASED PREPARATION INTELLIGENCE
          </motion.div>

          {/* Primary Emotional Hook Headline */}
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-6xl font-black text-slate-100 tracking-tight leading-[1.1]">
              Don’t find out on <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-amber-400 via-amber-200 to-yellow-400 bg-clip-text text-transparent">
                exam day.
              </span>
            </h1>
            <h2 className="text-xl sm:text-2xl font-black text-slate-300 tracking-tight">
              Know before it matters. <span className="text-amber-400">DakshAI helps you find out today.</span>
            </h2>
            <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed font-medium">
              Most students discover reality only when the consequence arrives. DakshAI replaces assumptions, feeling, and blind confidence with hard evidence.
            </p>
          </div>

          {/* Hero CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-4 pt-2 w-full max-w-md">
            <button
              onClick={() => navigate("/signup")}
              className="w-full sm:w-auto flex-1 bg-gradient-to-r from-amber-600 via-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white px-8 py-4 rounded-2xl text-sm font-bold shadow-xl hover:shadow-amber-500/25 transition active:scale-[0.98] flex items-center justify-center gap-2.5 cursor-pointer"
            >
              <span>See Where You Stand Today</span>
              <ArrowRight size={18} />
            </button>
            <button
              onClick={() => navigate("/login")}
              className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-indigo-500/40 px-6 py-4 rounded-2xl text-sm font-bold transition cursor-pointer"
            >
              Sign In
            </button>
          </div>
        </section>

        {/* ═══ 2. CORE HUMAN INSIGHT: ASSUMPTIONS VS REALITY ═══ */}
        <section className="w-full space-y-8">
          <div className="space-y-3 max-w-xl mx-auto">
            <span className="text-xs font-black uppercase tracking-widest text-amber-400">
              The Core Human Problem
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-100 tracking-tight">
              What you think about yourself is not always what is true.
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-medium">
              We make critical decisions based on assumptions. The painful truth is discovered only when the consequence arrives.
            </p>
          </div>

          {/* Dangerous Assumptions Matrix */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
            {[
              {
                assumption: "“I am preparing well and on track.”",
                pain: "Find out on exam day that your pace wasn't enough.",
                evidence: "DakshAI calculates your exact target growth velocity and syllabus completion date.",
              },
              {
                assumption: "“I understand this concept thoroughly.”",
                pain: "Find out on exam day that you can't solve unfamiliar questions.",
                evidence: "DakshAI tests multi-layer recall, application constraints, and prerequisite mastery.",
              },
              {
                assumption: "“I have enough time left to finish.”",
                pain: "Find out on exam day that you ran out of revision weeks.",
                evidence: "DakshAI projects total readiness vs total remaining exam days in real-time.",
              },
              {
                assumption: "“I will revise this chapter later.”",
                pain: "Find out on exam day that you forgot 80% of what you read.",
                evidence: "DakshAI tracks memory decay curves and flags decay alerts before memory fades.",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-slate-900/80 border border-indigo-500/20 hover:border-indigo-400/50 p-6 rounded-2xl space-y-3 shadow-lg shadow-slate-950/40 relative overflow-hidden group transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2.5 py-0.5 rounded-md uppercase tracking-wider">
                    Dangerous Assumption #{idx + 1}
                  </span>
                  <AlertTriangle size={14} className="text-rose-400" />
                </div>

                <h3 className="text-sm font-black text-slate-200">{item.assumption}</h3>
                
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider">The Consequence:</span>
                  <p className="text-xs text-slate-300 font-medium">{item.pain}</p>
                </div>

                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-1">
                  <span className="text-[10px] font-extrabold text-amber-300 uppercase tracking-wider flex items-center gap-1">
                    <ShieldCheck size={12} className="text-amber-400" />
                    How DakshAI Closes The Gap:
                  </span>
                  <p className="text-xs text-amber-100 font-medium">{item.evidence}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ═══ 3. THE REALITY FEEDBACK CYCLE ═══ */}
        <section className="w-full space-y-8 bg-slate-900/60 border border-slate-800 p-8 sm:p-10 rounded-3xl relative overflow-hidden shadow-2xl">
          <div className="space-y-3 max-w-xl mx-auto">
            <span className="text-xs font-black uppercase tracking-widest text-amber-400">
              The Engine of Truth
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-100">
              Reality Before Consequence
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 font-medium">
              DakshAI makes reality harder to ignore — so you can make informed choices before it matters.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-6 gap-3 pt-2">
            {[
              { step: "1", title: "See Reality", desc: "View actual mastery stats" },
              { step: "2", title: "Understand", desc: "Identify root cause gaps" },
              { step: "3", title: "Make Choice", desc: "Select high-impact topic" },
              { step: "4", title: "Act", desc: "Solve active recall quiz" },
              { step: "5", title: "Gather Evidence", desc: "Capture accuracy signals" },
              { step: "6", title: "See Again", desc: "Watch readiness score rise" },
            ].map((cycle, idx) => (
              <div
                key={idx}
                className="bg-slate-950 border border-slate-800 p-4 rounded-xl text-center space-y-2 relative"
              >
                <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center justify-center font-black text-xs mx-auto">
                  {cycle.step}
                </div>
                <h4 className="text-xs font-bold text-slate-200">{cycle.title}</h4>
                <p className="text-[10px] text-slate-400 leading-tight">{cycle.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ═══ 4. CORE BRAND PROMISE & HORIZON ═══ */}
        <section className="w-full space-y-8">
          <div className="space-y-3 max-w-xl mx-auto">
            <span className="text-xs font-black uppercase tracking-widest text-amber-400">
              Beyond Exams
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-100">
              Know before it matters.
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 font-medium">
              This fundamental human problem exists across every milestone in life. DakshAI moves discovery earlier.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 py-4">
            {["Student", "Exam", "College", "Skills", "Career", "Life"].map((horizon, idx, arr) => (
              <React.Fragment key={horizon}>
                <div className="px-5 py-3 rounded-2xl bg-slate-900 border border-indigo-500/30 shadow-md flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  <span className="text-xs sm:text-sm font-black text-slate-100">{horizon}</span>
                </div>
                {idx < arr.length - 1 && (
                  <ChevronRight size={16} className="text-slate-600 hidden sm:inline" />
                )}
              </React.Fragment>
            ))}
          </div>
        </section>

        {/* ═══ 5. FOUNDATIONAL BELIEF BANNER ═══ */}
        <section className="w-full">
          <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-amber-600/20 via-slate-900 to-indigo-900/20 border border-amber-500/30 text-center space-y-4 max-w-2xl mx-auto shadow-2xl relative">
            <div className="w-12 h-1 bg-amber-400 rounded-full mx-auto" />
            <p className="text-base sm:text-xl font-bold text-slate-100 leading-relaxed italic">
              “What you think about yourself is not always what is true. Evidence can close that gap.”
            </p>
            <span className="block text-xs font-extrabold text-amber-400 uppercase tracking-widest">
              — The DakshAI Foundation
            </span>
          </div>
        </section>

        {/* ═══ 6. FINAL CTA ═══ */}
        <section className="w-full pb-12 flex flex-col items-center space-y-6">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-100">
            Ready to find out today?
          </h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md">
            <button
              onClick={() => navigate("/signup")}
              className="w-full sm:w-auto flex-1 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white py-4 px-8 rounded-2xl text-sm font-bold shadow-xl hover:shadow-amber-500/25 transition active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Get Started Free</span>
              <ArrowRight size={18} />
            </button>
            <button
              onClick={() => navigate("/login")}
              className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 px-6 py-4 rounded-2xl text-sm font-bold transition cursor-pointer"
            >
              Sign In
            </button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full py-6 text-center text-xs text-slate-500 border-t border-slate-800 relative z-10 font-medium">
        DakshAI — Don't find out on exam day. Know before it matters.
      </footer>
    </div>
  );
}
