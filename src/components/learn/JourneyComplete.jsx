// src/components/learn/JourneyComplete.jsx
// Today's Journey Complete Screen — Identity + Celebration + Reflection + Next Step.
// Single conclusion screen when session practice goal is achieved!

import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, CheckCircle2, ArrowRight, Brain, Compass, Award } from "lucide-react";
import WorldMirrorCard from "../ui/WorldMirrorCard";

export default function JourneyComplete({
  conceptName = "Electricity & Circuits",
  questionsSolved = 5,
  nextConcept = "Circuit Networks & Kirchhoff Laws",
  onCompleteSession,
}) {
  const navigate = useNavigate();

  const handleFinish = () => {
    if (onCompleteSession) {
      onCompleteSession();
    } else {
      navigate("/");
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 text-center space-y-6 select-none">
      
      {/* Cognitive Indicator */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-center gap-2 text-xs font-semibold text-teal-400 bg-teal-500/10 border border-teal-500/20 py-2 px-4 rounded-full max-w-xs mx-auto"
      >
        <CheckCircle2 size={15} />
        <span>● Understanding ── ● Applying ── ● Reflecting</span>
      </motion.div>

      {/* Hero Badge */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative inline-block"
      >
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-indigo-600 to-teal-500 flex items-center justify-center text-white shadow-2xl shadow-indigo-500/30 mx-auto">
          <Award size={36} />
        </div>
      </motion.div>

      {/* Identity Promise Kept */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-2"
      >
        <span className="text-xs font-extrabold uppercase tracking-widest text-indigo-400">
          Today's Journey Complete
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Today's Promise: <span className="text-teal-400">✓ Kept</span>
        </h1>
        <p className="text-sm text-gray-300 font-medium max-w-xs mx-auto leading-relaxed">
          You finish what you start. Every completed journey shapes the learner you're becoming.
        </p>
      </motion.div>

      {/* Session Reflection Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="p-5 rounded-2xl bg-slate-900/80 border border-white/10 text-left space-y-3 backdrop-blur-xl shadow-xl"
      >
        <div className="flex items-center justify-between border-b border-white/5 pb-2 text-xs">
          <span className="font-bold text-gray-400 uppercase tracking-wider">Concept Mastery</span>
          <span className="font-extrabold text-teal-400">{conceptName}</span>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs pt-1">
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
            <span className="text-[10px] font-bold text-gray-500 uppercase block">Understood</span>
            <p className="font-bold text-white text-xs">{conceptName}</p>
          </div>
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
            <span className="text-[10px] font-bold text-gray-500 uppercase block">Challenges Solved</span>
            <p className="font-bold text-teal-400 text-xs">{questionsSolved} Questions</p>
          </div>
        </div>

        {/* Tomorrow's Journey Preview */}
        <div className="p-3 rounded-xl bg-indigo-950/30 border border-indigo-500/20 text-xs space-y-1">
          <span className="text-[10px] font-bold text-indigo-300 uppercase flex items-center gap-1">
            <Compass size={12} /> Tomorrow's Journey Preview
          </span>
          <p className="font-bold text-white text-xs">{nextConcept}</p>
        </div>
      </motion.div>

      {/* World Mirror Connection Card */}
      <WorldMirrorCard conceptName={conceptName} compact />

      {/* Single Action Button */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="pt-2"
      >
        <button
          onClick={handleFinish}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-teal-600 hover:from-indigo-500 hover:to-teal-500 text-white font-extrabold text-sm shadow-xl shadow-indigo-900/30 transition-all flex items-center justify-center gap-2 transform active:scale-[0.98] cursor-pointer"
        >
          <span>Return to Studio</span>
          <ArrowRight size={16} />
        </button>
      </motion.div>

    </div>
  );
}
