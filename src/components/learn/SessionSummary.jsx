// src/components/learn/SessionSummary.jsx
import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Sparkles, Trophy, ArrowRight, Home, Compass, RotateCcw, Target } from "lucide-react";

export default function SessionSummary({
  conceptName = "Electricity & Circuits",
  questionsSolved = 25,
  mistakesFixed = 8,
  sparkTitle = "NASA Spacecraft Physics & Newton's Laws",
  nextConceptName = "Magnetism & Magnetic Fields",
  onContinueNext,
  onExploreSpark,
  onGoHome,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="mx-auto max-w-3xl space-y-6"
    >
      {/* Emotional Victory Banner */}
      <div className="glass relative overflow-hidden rounded-3xl border border-purple-500/30 p-8 text-center shadow-2xl backdrop-blur-2xl bg-gradient-to-b from-purple-900/30 via-slate-900/60 to-slate-950/90">
        <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-64 w-64 rounded-full bg-purple-500/20 blur-3xl" />
        
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 }}
          className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 via-purple-500 to-indigo-600 text-white shadow-xl shadow-purple-500/30"
        >
          <Trophy size={40} className="text-amber-200" />
        </motion.div>

        <h1 className="text-3xl font-black text-white tracking-tight sm:text-4xl">
          Mission Complete! 🎉
        </h1>
        <p className="mt-2 text-base font-medium text-purple-200">
          You finished today's session in <span className="font-bold text-white">{conceptName}</span>.
        </p>

        {/* Metrics Grid */}
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center backdrop-blur-md">
            <div className="text-2xl font-black text-emerald-400">✓</div>
            <div className="mt-1 text-xs font-semibold text-gray-300">Mastered</div>
            <div className="text-[11px] text-gray-400 font-medium truncate mt-0.5">{conceptName}</div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center backdrop-blur-md">
            <div className="text-2xl font-black text-purple-400">{questionsSolved}</div>
            <div className="mt-1 text-xs font-semibold text-gray-300">Questions</div>
            <div className="text-[11px] text-gray-400 font-medium mt-0.5">Solved Cleanly</div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center backdrop-blur-md">
            <div className="text-2xl font-black text-amber-400">{mistakesFixed}</div>
            <div className="mt-1 text-xs font-semibold text-gray-300">Mistakes</div>
            <div className="text-[11px] text-gray-400 font-medium mt-0.5">Resolved</div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center backdrop-blur-md">
            <div className="text-2xl font-black text-indigo-400">1</div>
            <div className="mt-1 text-xs font-semibold text-gray-300">Spark</div>
            <div className="text-[11px] text-gray-400 font-medium mt-0.5">Connected</div>
          </div>
        </div>

        {/* Today's Spark Connection */}
        {sparkTitle && (
          <div className="mt-6 rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4 text-left backdrop-blur-md">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-300 uppercase tracking-wider">
              <Sparkles size={14} />
              Today's Real-World Spark
            </div>
            <div className="mt-1 text-sm font-semibold text-white">{sparkTitle}</div>
          </div>
        )}

        {/* Next Concept Preview */}
        <div className="mt-6 rounded-2xl border border-white/10 bg-slate-900/80 p-4 flex items-center justify-between text-left">
          <div>
            <div className="text-xs font-medium text-gray-400">Up Next in Syllabus</div>
            <div className="text-sm font-bold text-white mt-0.5">{nextConceptName}</div>
          </div>
          <button
            onClick={onContinueNext}
            className="flex items-center gap-2 rounded-xl bg-purple-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-purple-600/30 hover:bg-purple-500 transition-all active:scale-95"
          >
            <span>Start Next Session</span>
            <ArrowRight size={14} />
          </button>
        </div>

        {/* Navigation Action Buttons */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={onExploreSpark}
            className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-semibold text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <Compass size={14} />
            <span>Explore World Mirror</span>
          </button>

          <button
            onClick={onGoHome}
            className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-semibold text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <Home size={14} />
            <span>Return Home</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
