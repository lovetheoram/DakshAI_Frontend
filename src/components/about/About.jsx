import React, { useState } from "react";
import { Network, Users, Rocket, Compass, ChevronDown, ChevronUp, Sparkles, Brain, Target, Award } from "lucide-react";
import GlassCard from "../ui/GlassCard";
import { motion, AnimatePresence } from "framer-motion";

export default function About() {
  const [showLargeView, setShowLargeView] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-white px-4 py-12">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* ================= SHORT VIEW (CORE PURPOSE) ================= */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-bold tracking-wide uppercase">
            <Sparkles size={14} /> The Purpose of DakshAI
          </div>
          
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight text-white">
            A <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-400">Concept Graph</span> connected to a <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-400">Human Graph</span>.
          </h1>

          <p className="text-base sm:text-xl text-gray-300 max-w-2xl mx-auto font-normal leading-relaxed">
            DakshAI links learning, projects, people, opportunities, and innovation through structured relationships. 
            Students begin by preparing for exams—and over time, the architecture naturally exposes them to a broader world of ideas, builders, and opportunities.
          </p>

          <div className="pt-4 flex justify-center">
            <button
              onClick={() => setShowLargeView(!showLargeView)}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-purple-500/20 transition-all flex items-center gap-2"
            >
              <span>{showLargeView ? "Hide Architectural Vision" : "Explore Full Architectural Vision"}</span>
              {showLargeView ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          </div>
        </motion.div>

        {/* 3 Core Highlights (Short Summary) */}
        <div className="grid md:grid-cols-3 gap-4">
          <GlassCard padding="p-6" className="text-center space-y-2">
            <div className="w-10 h-10 mx-auto rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400">
              <Network size={20} />
            </div>
            <h3 className="font-bold text-white text-base">1. The Concept Graph</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Knowledge isn't isolated. Every formula, rule, and concept links directly to its history, applications, and mastery.
            </p>
          </GlassCard>

          <GlassCard padding="p-6" className="text-center space-y-2">
            <div className="w-10 h-10 mx-auto rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
              <Users size={20} />
            </div>
            <h3 className="font-bold text-white text-base">2. The Human Graph</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Connecting learners by what they are mastering. Discover what peers worldwide are building with the same concepts.
            </p>
          </GlassCard>

          <GlassCard padding="p-6" className="text-center space-y-2">
            <div className="w-10 h-10 mx-auto rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <Rocket size={20} />
            </div>
            <h3 className="font-bold text-white text-base">3. Innovation & Proof</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Transforming exam prep into real-world projects, Olympiads, competitions, and self-earning trust.
            </p>
          </GlassCard>
        </div>

        {/* ================= LARGE VIEW & DETAILED ARCHITECTURE ================= */}
        <AnimatePresence>
          {showLargeView && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-6 overflow-hidden pt-4 border-t border-white/[0.06]"
            >
              <div className="text-center">
                <h2 className="text-2xl font-black text-white tracking-tight">Full System Architecture</h2>
                <p className="text-xs text-gray-400 mt-1">How DakshAI expands a student's surface area with the world.</p>
              </div>

              <div className="space-y-4">
                {/* Layer 1 */}
                <GlassCard padding="p-6" className="border-l-4 border-l-purple-500">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400">
                      <Brain size={24} />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-base font-bold text-white">Phase 1 — Solve Today's Problem (Exam Prep & Mastery)</h4>
                      <p className="text-xs text-gray-300 leading-relaxed">
                        A student joins DakshAI to solve an immediate goal—crack JEE, excel in school, or master Physics. 
                        They use adaptive practice, visual notes, and mistake review without any cognitive overwhelm.
                      </p>
                    </div>
                  </div>
                </GlassCard>

                {/* Layer 2 */}
                <GlassCard padding="p-6" className="border-l-4 border-l-indigo-500">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400">
                      <Compass size={24} />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-base font-bold text-white">Phase 2 — Expand The Horizon (World Mirror)</h4>
                      <p className="text-xs text-gray-300 leading-relaxed">
                        While learning a chapter like *Vectors*, the system quietly surfaces real-world context: 
                        *"A Class 10 student built a drone using vectors."* Exposure expands their baseline of what is possible.
                      </p>
                    </div>
                  </div>
                </GlassCard>

                {/* Layer 3 */}
                <GlassCard padding="p-6" className="border-l-4 border-l-emerald-500">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400">
                      <Rocket size={24} />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-base font-bold text-white">Phase 3 — Become an Innovator & Contributor</h4>
                      <p className="text-xs text-gray-300 leading-relaxed">
                        Students transition from knowledge consumers to creators. They publish project showcases, 
                        enter global Olympiads, mentor junior peers, and participate in self-earning trust initiatives.
                      </p>
                    </div>
                  </div>
                </GlassCard>
              </div>

              {/* Guiding Principle Card */}
              <GlassCard padding="p-6" className="bg-gradient-to-r from-purple-950/30 to-indigo-950/30 border border-purple-500/20 text-center space-y-2">
                <p className="text-xs font-bold text-purple-300 uppercase tracking-widest">Guiding Principle</p>
                <p className="text-sm text-gray-200 italic max-w-xl mx-auto">
                  "DakshAI should never ask users to leave learning to explore the world. Instead, every learning experience should naturally reveal how that knowledge connects to real people, real projects, real opportunities, and real innovation."
                </p>
              </GlassCard>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
