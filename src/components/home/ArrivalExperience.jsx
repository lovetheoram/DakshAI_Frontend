// src/components/home/ArrivalExperience.jsx
// Landing Page — White + Black + Gold. Clean, premium, purposeful.
// "Know where you stand. See where you're going."

import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, MapPin, Brain, Globe, Sparkles } from "lucide-react";

const CORE_PILLARS = [
  {
    icon: MapPin,
    title: "Reality Map",
    desc: "See exactly where you stand. No guessing, no false confidence. Evidence-backed clarity.",
  },
  {
    icon: Brain,
    title: "Learn & Practice",
    desc: "Active recall, retrieval challenges, and concept mastery that produces real evidence.",
  },
  {
    icon: Globe,
    title: "World Calibration",
    desc: "Compare with real peers. Know if your preparation is ahead, behind, or on track.",
  },
  {
    icon: Sparkles,
    title: "Intelligent Guidance",
    desc: "Quiet intelligence that shows you what to do next — based on evidence, not motivation.",
  },
];

export default function ArrivalExperience() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white text-[var(--color-text-primary)] flex flex-col items-center relative overflow-hidden select-none">

      {/* Header */}
      <header className="w-full max-w-6xl px-6 py-6 flex items-center justify-between z-20">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[var(--color-gold)] flex items-center justify-center shadow-sm">
            <span className="text-white font-black text-sm">D</span>
          </div>
          <span className="text-base font-bold text-[var(--color-text-primary)] tracking-tight">
            Daksh<span className="text-[var(--color-gold)]">AI</span>
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/login")}
            className="text-xs font-semibold text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors px-4 py-2 rounded-xl border border-[var(--color-border)] hover:bg-[var(--color-bg-secondary)] cursor-pointer"
          >
            Login
          </button>
          <button
            onClick={() => navigate("/signup")}
            className="btn-gold text-xs font-bold px-5 py-2 rounded-xl"
          >
            Get Started
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 w-full max-w-3xl px-5 py-12 space-y-20 flex flex-col items-center text-center">

        {/* ═══ HERO ═══ */}
        <section className="space-y-6 max-w-xl py-8 flex flex-col items-center">
          {/* Gold accent line */}
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: 48 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="h-[3px] bg-[var(--color-gold)] rounded-full"
          />

          <div className="space-y-4">
            <h1 className="text-3xl sm:text-5xl font-bold text-[var(--color-text-primary)] tracking-tight leading-tight">
              Know where you stand.
              <br />
              <span className="text-[var(--color-gold)]">See where you're going.</span>
            </h1>
            <p className="text-sm sm:text-base text-[var(--color-text-secondary)] max-w-md mx-auto leading-relaxed">
              DakshAI removes uncertainty from exam preparation. Not with motivation — with evidence.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 pt-4">
            <button
              onClick={() => navigate("/signup")}
              className="w-full sm:w-auto btn-gold px-8 py-3.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2"
            >
              Start Your Journey
              <ArrowRight size={16} />
            </button>
            <button
              onClick={() => navigate("/login")}
              className="w-full sm:w-auto btn-ghost px-8 py-3.5 rounded-xl text-sm"
            >
              Login
            </button>
          </div>
        </section>

        {/* ═══ THE FIVE QUESTIONS ═══ */}
        <section className="w-full space-y-6">
          <div className="space-y-2">
            <span className="text-[11px] font-semibold uppercase tracking-widest text-[var(--color-gold)]">
              What DakshAI Answers
            </span>
            <h2 className="text-lg font-bold text-[var(--color-text-primary)]">
              Every student has five terrifying questions
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
            {[
              "Where do I actually stand?",
              "How far am I from my goal?",
              "What should I do today?",
              "Is my effort actually working?",
              "How do I compare with reality?",
            ].map((question, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08 }}
                className="p-4 rounded-xl border border-[var(--color-border)] bg-white flex items-center gap-3"
              >
                <div className="w-7 h-7 rounded-lg bg-[var(--color-gold-pale)] text-[var(--color-gold)] flex items-center justify-center text-xs font-bold shrink-0">
                  {idx + 1}
                </div>
                <p className="text-sm font-medium text-[var(--color-text-primary)]">{question}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ═══ INSIDE DAKSHAI ═══ */}
        <section className="w-full space-y-6">
          <div className="space-y-2">
            <span className="text-[11px] font-semibold uppercase tracking-widest text-[var(--color-gold)]">
              How It Works
            </span>
            <h2 className="text-lg font-bold text-[var(--color-text-primary)]">Inside DakshAI</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
            {CORE_PILLARS.map((pillar, idx) => {
              const PillarIcon = pillar.icon;
              return (
                <div
                  key={idx}
                  className="p-5 rounded-2xl border border-[var(--color-border)] bg-white space-y-3 hover:shadow-[var(--shadow-md)] transition-shadow"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-[var(--color-gold-pale)] text-[var(--color-gold)]">
                      <PillarIcon size={18} />
                    </div>
                    <h3 className="text-sm font-bold text-[var(--color-text-primary)]">{pillar.title}</h3>
                  </div>
                  <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">{pillar.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* ═══ PHILOSOPHY ═══ */}
        <section className="w-full py-4">
          <div className="p-8 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)] max-w-xl mx-auto space-y-3 text-center">
            <div className="w-8 h-[3px] bg-[var(--color-gold)] rounded-full mx-auto mb-4" />
            <div className="space-y-2 text-sm sm:text-base font-medium text-[var(--color-text-secondary)] leading-relaxed">
              <p>"I don't have to be fearless.</p>
              <p>I just need to know where I am."</p>
            </div>
            <p className="text-xs text-[var(--color-gold)] font-semibold pt-2">— The DakshAI Philosophy</p>
          </div>
        </section>

        {/* ═══ FINAL CTA ═══ */}
        <section className="w-full pb-8 flex flex-col items-center space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-[var(--color-text-primary)]">
            Ready to see where you stand?
          </h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-xs">
            <button
              onClick={() => navigate("/signup")}
              className="w-full btn-gold py-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2"
            >
              Start Your Journey
              <ArrowRight size={16} />
            </button>
            <button
              onClick={() => navigate("/login")}
              className="w-full btn-ghost py-4 rounded-xl text-sm"
            >
              Login
            </button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full py-6 text-center text-[11px] text-[var(--color-mid-gray)] border-t border-[var(--color-border)] relative z-10">
        DakshAI — Know where you stand
      </footer>
    </div>
  );
}
