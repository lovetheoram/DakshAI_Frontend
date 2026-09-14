// src/components/about/About.jsx
// Purpose & Architectural Vision aligned with Ivory + Ink + Antique Gold identity.

import React, { useState } from "react";
import { Network, Users, Rocket, Compass, ChevronDown, ChevronUp, Sparkles, Brain, Target, Award } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function About() {
  const [showLargeView, setShowLargeView] = useState(false);

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] px-5 py-10 select-none">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* ================= SHORT VIEW (CORE PURPOSE) ================= */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[var(--color-gold-pale)] border border-[var(--color-gold)]/30 text-[var(--color-gold-dark)] text-xs font-bold tracking-wide uppercase">
            <Sparkles size={14} /> The Purpose of DakshAI
          </div>
          
          <h1 className="text-2xl sm:text-4xl font-bold tracking-tight leading-tight text-[var(--color-text-primary)]">
            A <span className="text-[var(--color-gold-dark)] font-extrabold">Concept Graph</span> connected to a <span className="text-[var(--color-gold-dark)] font-extrabold">Human Graph</span>.
          </h1>

          <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] max-w-xl mx-auto font-normal leading-relaxed">
            DakshAI links learning, projects, people, opportunities, and innovation through structured relationships. 
            Students begin by preparing for exams—and over time, the architecture naturally exposes them to a broader world of ideas, builders, and opportunities.
          </p>

          <div className="pt-2 flex justify-center">
            <button
              onClick={() => setShowLargeView(!showLargeView)}
              className="btn-gold px-6 py-3 rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <span>{showLargeView ? "Hide Architectural Vision" : "Explore Full Architectural Vision"}</span>
              {showLargeView ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
            </button>
          </div>
        </motion.div>

        {/* 3 Core Highlights (Short Summary) */}
        <div className="grid md:grid-cols-3 gap-4">
          <div className="daksh-card p-6 text-center space-y-3">
            <div className="w-10 h-10 mx-auto rounded-xl bg-[var(--color-gold-pale)] flex items-center justify-center text-[var(--color-gold-dark)]">
              <Network size={20} />
            </div>
            <h3 className="font-bold text-[var(--color-text-primary)] text-sm">1. The Concept Graph</h3>
            <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
              Knowledge isn't isolated. Every formula, rule, and concept links directly to its history, applications, and mastery.
            </p>
          </div>

          <div className="daksh-card p-6 text-center space-y-3">
            <div className="w-10 h-10 mx-auto rounded-xl bg-[var(--color-gold-pale)] flex items-center justify-center text-[var(--color-gold-dark)]">
              <Users size={20} />
            </div>
            <h3 className="font-bold text-[var(--color-text-primary)] text-sm">2. The Human Graph</h3>
            <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
              Connecting learners by what they are mastering. Discover what peers worldwide are building with the same concepts.
            </p>
          </div>

          <div className="daksh-card p-6 text-center space-y-3">
            <div className="w-10 h-10 mx-auto rounded-xl bg-[var(--color-gold-pale)] flex items-center justify-center text-[var(--color-gold-dark)]">
              <Rocket size={20} />
            </div>
            <h3 className="font-bold text-[var(--color-text-primary)] text-sm">3. Innovation & Proof</h3>
            <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
              Transforming exam prep into real-world projects, Olympiads, competitions, and self-earning trust.
            </p>
          </div>
        </div>

        {/* ================= LARGE VIEW & DETAILED ARCHITECTURE ================= */}
        <AnimatePresence>
          {showLargeView && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-4 overflow-hidden pt-2 border-t border-[var(--color-border)]"
            >
              <div className="text-center space-y-1">
                <h2 className="text-lg font-bold text-[var(--color-text-primary)] tracking-tight">Full System Architecture</h2>
                <p className="text-xs text-[var(--color-text-secondary)]">How DakshAI expands a student's surface area with the world.</p>
              </div>

              <div className="space-y-3">
                {/* Layer 1 */}
                <div className="daksh-card p-5 border-l-3 border-l-[var(--color-gold)]">
                  <div className="flex items-start gap-3.5">
                    <div className="p-2.5 rounded-xl bg-[var(--color-gold-pale)] text-[var(--color-gold-dark)] shrink-0">
                      <Brain size={20} />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-[var(--color-text-primary)]">Phase 1 — Solve Today's Problem (Exam Prep & Mastery)</h4>
                      <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                        A student joins DakshAI to solve an immediate goal—crack JEE, excel in school, or master Physics. 
                        They use adaptive practice, visual notes, and mistake review without any cognitive overwhelm.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Layer 2 */}
                <div className="daksh-card p-5 border-l-3 border-l-[var(--color-gold)]">
                  <div className="flex items-start gap-3.5">
                    <div className="p-2.5 rounded-xl bg-[var(--color-gold-pale)] text-[var(--color-gold-dark)] shrink-0">
                      <Compass size={20} />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-[var(--color-text-primary)]">Phase 2 — Expand The Horizon (World Mirror)</h4>
                      <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                        While learning a chapter like *Vectors*, the system quietly surfaces real-world context: 
                        *"A Class 10 student built a drone using vectors."* Exposure expands their baseline of what is possible.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Layer 3 */}
                <div className="daksh-card p-5 border-l-3 border-l-[var(--color-gold)]">
                  <div className="flex items-start gap-3.5">
                    <div className="p-2.5 rounded-xl bg-[var(--color-gold-pale)] text-[var(--color-gold-dark)] shrink-0">
                      <Rocket size={20} />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-[var(--color-text-primary)]">Phase 3 — Become an Innovator & Contributor</h4>
                      <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                        Students transition from knowledge consumers to creators. They publish project showcases, 
                        enter global Olympiads, mentor junior peers, and participate in self-earning trust initiatives.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Guiding Principle Card */}
              <div className="daksh-card p-6 border border-[var(--color-gold)]/30 bg-[var(--color-gold-pale)]/40 text-center space-y-2">
                <p className="text-caption font-bold text-[var(--color-gold-dark)] tracking-widest">Guiding Principle</p>
                <p className="text-xs text-[var(--color-text-primary)] italic max-w-lg mx-auto leading-relaxed">
                  "DakshAI should never ask users to leave learning to explore the world. Instead, every learning experience should naturally reveal how that knowledge connects to real people, real projects, real opportunities, and real innovation."
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
