// src/components/home/ArrivalExperience.jsx
// Ultra-Clean, Premium Front Page for DakshAI.
// Job: Make users think, "I want to try this."
// Structure:
// 1. Hero: "Study for Exams. Build for Life."
// 2. Interactive Concept Demo: Concept → Application → Real Project
// 3. "Inside DakshAI": Today's Mission, Learn & Practice, World Mirror, Daksh Companion
// 4. Study Environments: Galaxy, Forest, Sunrise, Midnight, Candy, Classic (Live full-page shift)
// 5. Philosophy: 3 clean lines
// 6. Final CTA: Start Your Journey & Login

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Target, Brain, Globe, Sparkles, Moon, Trees, Sun, Compass, Flame, Shield, ArrowUpRight } from "lucide-react";

// ── 6 Study Environments ───────────────────────────────────────────────────────
const STUDY_ENVIRONMENTS = [
  {
    id: "galaxy",
    name: "Galaxy",
    icon: Moon,
    bgClass: "bg-[#030712]",
    cardBg: "bg-slate-900/60 border-purple-500/25",
    glowColor: "bg-purple-600/15",
    orbGradient: "radial-gradient(circle at 35% 35%, #e9d5ff, #7c3aed 50%, #0891b2 100%)",
    accentText: "text-purple-300",
    buttonBg: "from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500",
  },
  {
    id: "forest",
    name: "Forest",
    icon: Trees,
    bgClass: "bg-[#02140f]",
    cardBg: "bg-emerald-950/40 border-emerald-500/25",
    glowColor: "bg-emerald-600/15",
    orbGradient: "radial-gradient(circle at 35% 35%, #a7f3d0, #059669 50%, #064e3b 100%)",
    accentText: "text-emerald-300",
    buttonBg: "from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500",
  },
  {
    id: "sunrise",
    name: "Sunrise",
    icon: Sun,
    bgClass: "bg-[#160b02]",
    cardBg: "bg-amber-950/40 border-amber-500/25",
    glowColor: "bg-amber-600/15",
    orbGradient: "radial-gradient(circle at 35% 35%, #fde68a, #f59e0b 50%, #b45309 100%)",
    accentText: "text-amber-300",
    buttonBg: "from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500",
  },
  {
    id: "midnight",
    name: "Midnight",
    icon: Compass,
    bgClass: "bg-[#060c1a]",
    cardBg: "bg-blue-950/40 border-blue-500/25",
    glowColor: "bg-blue-600/15",
    orbGradient: "radial-gradient(circle at 35% 35%, #93c5fd, #2563eb 50%, #1e3a8a 100%)",
    accentText: "text-blue-300",
    buttonBg: "from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500",
  },
  {
    id: "candy",
    name: "Candy",
    icon: Flame,
    bgClass: "bg-[#180816]",
    cardBg: "bg-pink-950/40 border-pink-500/25",
    glowColor: "bg-pink-600/15",
    orbGradient: "radial-gradient(circle at 35% 35%, #fbcfe8, #db2777 50%, #831843 100%)",
    accentText: "text-pink-300",
    buttonBg: "from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500",
  },
  {
    id: "classic",
    name: "Classic",
    icon: Shield,
    bgClass: "bg-[#090d16]",
    cardBg: "bg-slate-900/80 border-slate-700/40",
    glowColor: "bg-slate-700/15",
    orbGradient: "radial-gradient(circle at 35% 35%, #e2e8f0, #475569 50%, #0f172a 100%)",
    accentText: "text-slate-300",
    buttonBg: "from-slate-700 to-slate-800 hover:from-slate-600 hover:to-slate-700",
  },
];

// ── Interactive Concept Journey Demo ──────────────────────────────────────────
const CONCEPT_DEMOS = [
  {
    id: "electricity",
    concept: "Electricity & Circuits",
    application: "Electric Vehicle Powertrain",
    project: "Student Smart E-Bike ⚡",
  },
  {
    id: "vectors",
    concept: "Vectors & Kinematics",
    application: "Drone Navigation Systems",
    project: "Autonomous Mars Rover Landing 🛰️",
  },
  {
    id: "algorithms",
    concept: "Algorithmic Logic",
    application: "Crop Health Sensors",
    project: "AI Smart Irrigation Drone 🌾",
  },
];

// ── Inside DakshAI Core Pillars ───────────────────────────────────────────────
const CORE_PILLARS = [
  {
    icon: Target,
    title: "Today's Mission",
    desc: "Micro-learning goals tailored to your cognitive energy & study rhythm.",
  },
  {
    icon: Brain,
    title: "Learn & Practice",
    desc: "Active recall, retrieval challenges, and formula checks before reading notes.",
  },
  {
    icon: Globe,
    title: "World Mirror",
    desc: "Connect textbook formulas to real engineering, software, and scientific projects.",
  },
  {
    icon: Sparkles,
    title: "Daksh Companion",
    desc: "An observer-based behavioral engine that provides quiet guidance when needed.",
  },
];

export default function ArrivalExperience() {
  const navigate = useNavigate();
  const [currentEnv, setCurrentEnv] = useState(STUDY_ENVIRONMENTS[0]);
  const [activeDemoIdx, setActiveDemoIdx] = useState(0);

  // Section observer — dispatches section_view events to Daksh as user scrolls
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

    ["section-hero", "section-demo", "section-features", "section-environments"].forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className={`min-h-screen ${currentEnv.bgClass} text-white flex flex-col items-center justify-between relative overflow-hidden select-none transition-colors duration-700 font-sans`}>
      
      {/* Ambient background glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className={`absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] ${currentEnv.glowColor} rounded-full blur-[150px] transition-all duration-700`} />
        <div className={`absolute bottom-1/4 right-1/4 w-[450px] h-[450px] ${currentEnv.glowColor} rounded-full blur-[130px] transition-all duration-700`} />
      </div>

      {/* Header Bar */}
      <header className="w-full max-w-6xl px-6 py-6 flex items-center justify-between z-20">
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-full transition-all duration-500"
            style={{ background: currentEnv.orbGradient }}
          />
          <span className="text-base font-black tracking-wider text-white">DakshAI</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/login")}
            className="text-xs font-bold text-gray-300 hover:text-white transition-colors px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10"
          >
            Login
          </button>
          <button
            onClick={() => navigate("/signup")}
            className={`text-xs font-extrabold px-5 py-2 rounded-xl bg-gradient-to-r ${currentEnv.buttonBg} text-white shadow-lg transition-all transform active:scale-95`}
          >
            Get Started
          </button>
        </div>
      </header>

      {/* Main Content Sections */}
      <main className="relative z-10 w-full max-w-4xl px-4 py-8 space-y-20 flex flex-col items-center text-center">

        {/* ════════════════ 1. HERO ════════════════ */}
        <section id="section-hero" className="space-y-6 max-w-2xl py-6 flex flex-col items-center">
          {/* Subtle floating orb */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative"
          >
            <div
              className="w-20 h-20 rounded-full transition-all duration-700"
              style={{
                background: currentEnv.orbGradient,
                boxShadow: "0 0 50px rgba(139,92,246,0.35)",
              }}
            />
          </motion.div>

          <div className="space-y-3">
            <span className={`text-xs font-extrabold uppercase tracking-widest ${currentEnv.accentText}`}>
              Behavioral Operating System for Learning
            </span>
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              Study for Exams.
              <br />
              <span className={`bg-gradient-to-r from-white via-purple-200 to-indigo-300 bg-clip-text text-transparent`}>
                Build for Life.
              </span>
            </h1>
            <p className="text-sm sm:text-base text-gray-300 max-w-md mx-auto leading-relaxed font-medium">
              Learn concepts, remember longer, and discover how they shape the real world.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <button
              onClick={() => navigate("/signup")}
              className={`w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r ${currentEnv.buttonBg} text-white font-extrabold text-sm shadow-xl transition-all flex items-center justify-center gap-2 transform active:scale-95`}
            >
              <span>Get Started</span>
              <ArrowRight size={16} />
            </button>
            <button
              onClick={() => navigate("/login")}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-white/[0.04] border border-white/10 hover:bg-white/[0.08] text-gray-300 hover:text-white font-bold text-sm transition-all"
            >
              Login
            </button>
          </div>
        </section>

        {/* ════════════════ 2. INTERACTIVE CONCEPT DEMO ════════════════ */}
        <section id="section-demo" className="w-full space-y-4">
          <div className="space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400">
              Interactive Concept Journey
            </span>
            <h2 className="text-lg font-extrabold text-white">From Textbook Formula to Real Impact</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
            {CONCEPT_DEMOS.map((demo, idx) => {
              const isActive = activeDemoIdx === idx;
              return (
                <button
                  key={demo.id}
                  onClick={() => setActiveDemoIdx(idx)}
                  className={`p-4 rounded-2xl border transition-all text-left space-y-3 ${
                    isActive
                      ? `${currentEnv.cardBg} scale-[1.02] shadow-xl`
                      : "bg-white/[0.02] border-white/10 hover:bg-white/[0.05]"
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] font-extrabold text-gray-400">
                    <span>STEP {idx + 1}</span>
                    {isActive && <Sparkles size={12} className={currentEnv.accentText} />}
                  </div>

                  <div className="space-y-1">
                    <span className="text-[11px] text-gray-400 block uppercase font-bold">Concept</span>
                    <p className="text-xs font-black text-white">{demo.concept}</p>
                  </div>

                  <div className="text-[10px] text-gray-400">↓</div>

                  <div className="space-y-1">
                    <span className="text-[11px] text-gray-400 block uppercase font-bold">Application</span>
                    <p className="text-xs font-bold text-gray-200">{demo.application}</p>
                  </div>

                  <div className="pt-2 border-t border-white/10 text-xs font-extrabold text-purple-300">
                    {demo.project}
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* ════════════════ 3. INSIDE DAKSHAI ════════════════ */}
        <section id="section-features" className="w-full space-y-4">
          <div className="space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400">
              Platform Architecture
            </span>
            <h2 className="text-lg font-extrabold text-white">Inside DakshAI</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
            {CORE_PILLARS.map((pillar, idx) => {
              const PillarIcon = pillar.icon;
              return (
                <div
                  key={idx}
                  className={`p-5 rounded-2xl border ${currentEnv.cardBg} space-y-2 transition-all`}
                >
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-white/10 text-purple-300">
                      <PillarIcon size={18} />
                    </div>
                    <h3 className="text-sm font-extrabold text-white">{pillar.title}</h3>
                  </div>
                  <p className="text-xs text-gray-300 leading-relaxed font-medium">{pillar.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* ════════════════ 4. STUDY ENVIRONMENTS ════════════════ */}
        <section id="section-environments" className="w-full space-y-4">
          <div className="space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400">
              Atmosphere Engine
            </span>
            <h2 className="text-lg font-extrabold text-white">Choose Your Study Environment</h2>
            <p className="text-xs text-gray-400">Click any space to switch the entire environment live:</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
            {STUDY_ENVIRONMENTS.map((env) => {
              const EnvIcon = env.icon;
              const isSelected = currentEnv.id === env.id;
              return (
                <button
                  key={env.id}
                  onClick={() => setCurrentEnv(env)}
                  className={`p-3 rounded-2xl border text-center flex flex-col items-center gap-1.5 transition-all ${
                    isSelected
                      ? "bg-white/15 border-white/40 text-white scale-105 shadow-xl"
                      : "bg-white/[0.03] border-white/10 text-gray-400 hover:bg-white/[0.08]"
                  }`}
                >
                  <EnvIcon size={16} className={isSelected ? env.accentText : "text-gray-400"} />
                  <span className="text-xs font-extrabold">{env.name}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* ════════════════ 5. PHILOSOPHY ════════════════ */}
        <section className="w-full py-6">
          <div className={`p-8 rounded-3xl border ${currentEnv.cardBg} max-w-xl mx-auto space-y-3 shadow-2xl`}>
            <span className={`text-[10px] font-extrabold uppercase tracking-widest ${currentEnv.accentText} block`}>
              Our Philosophy
            </span>
            <div className="space-y-1 text-sm sm:text-base font-bold text-gray-200 leading-relaxed">
              <p>School teaches subjects.</p>
              <p>The world rewards what you build with them.</p>
              <p className="text-white font-black pt-1">DakshAI helps you connect the two.</p>
            </div>
          </div>
        </section>

        {/* ════════════════ 6. FINAL CTA ════════════════ */}
        <section className="w-full pb-8 flex flex-col items-center space-y-4">
          <h2 className="text-xl sm:text-2xl font-black text-white">Ready to transform how you learn?</h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-xs">
            <button
              onClick={() => navigate("/signup")}
              className={`w-full py-4 rounded-2xl bg-gradient-to-r ${currentEnv.buttonBg} text-white font-extrabold text-sm shadow-xl transition-all flex items-center justify-center gap-2 transform active:scale-95`}
            >
              <span>Start Your Journey</span>
              <ArrowRight size={16} />
            </button>
            <button
              onClick={() => navigate("/login")}
              className="w-full py-4 rounded-2xl bg-white/[0.04] border border-white/10 hover:bg-white/[0.08] text-gray-300 hover:text-white font-bold text-sm transition-all"
            >
              Login
            </button>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="w-full py-6 text-center text-[11px] text-gray-500 border-t border-white/5 relative z-10">
        DakshAI — Behavioral Operating System for Learning
      </footer>
    </div>
  );
}
