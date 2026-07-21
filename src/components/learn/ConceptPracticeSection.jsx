// src/components/learn/ConceptPracticeSection.jsx
import React from "react";
import { motion } from "framer-motion";
import { Swords, Flame, Target, RotateCcw, Clock, ShieldAlert, Award } from "lucide-react";
import GlassCard from "../ui/GlassCard";

export default function ConceptPracticeSection({ onStartQuiz }) {
  const modes = [
    {
      id: "quick",
      numQuestions: 5,
      type: "PYQS",
      title: "Quick Challenge",
      desc: "Test speed & core recall",
      questions: "5 Questions",
      time: "2 mins",
      badge: "Fast Track",
      icon: Flame,
      color: "from-amber-500/20 to-orange-500/20",
      borderColor: "border-amber-500/30",
      textColor: "text-amber-400",
      btnBg: "bg-amber-500 hover:bg-amber-400 text-slate-950"
    },
    {
      id: "exam",
      numQuestions: 20,
      type: "NEW",
      title: "Exam Mode",
      desc: "Full realistic test simulation",
      questions: "20 Questions",
      time: "15 mins",
      badge: "Real Test",
      icon: Swords,
      color: "from-purple-500/20 to-indigo-500/20",
      borderColor: "border-purple-500/30",
      textColor: "text-purple-400",
      btnBg: "bg-purple-600 hover:bg-purple-500 text-white"
    },
    {
      id: "weak",
      numQuestions: 7,
      type: "NEW",
      title: "Weak Areas",
      desc: "Target tricky sub-concepts",
      questions: "7 Questions",
      time: "5 mins",
      badge: "AI Targeted",
      icon: Target,
      color: "from-rose-500/20 to-red-500/20",
      borderColor: "border-rose-500/30",
      textColor: "text-rose-400",
      btnBg: "bg-rose-600 hover:bg-rose-500 text-white"
    },
    {
      id: "mistakes",
      numQuestions: 12,
      type: "PYQS",
      title: "Mistake Revision",
      desc: "Master questions you got wrong",
      questions: "12 Questions",
      time: "8 mins",
      badge: "Memory Retention",
      icon: RotateCcw,
      color: "from-blue-500/20 to-cyan-500/20",
      borderColor: "border-blue-500/30",
      textColor: "text-blue-400",
      btnBg: "bg-blue-600 hover:bg-blue-500 text-white"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Swords size={18} className="text-purple-400" />
            Practice & Test Challenge
          </h3>
          <p className="text-xs text-gray-400">Choose a game mode to test your understanding</p>
        </div>
      </div>

      {/* Mode Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {modes.map((mode) => {
          const Icon = mode.icon;

          return (
            <motion.div
              key={mode.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`relative overflow-hidden rounded-2xl p-5 border ${mode.borderColor} bg-gradient-to-br ${mode.color} backdrop-blur-md bg-slate-900/80 flex flex-col justify-between space-y-4 shadow-xl`}
            >
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <span className={`text-[10px] font-extrabold uppercase tracking-wide px-2.5 py-0.5 rounded-full border border-white/10 bg-black/40 ${mode.textColor}`}>
                    {mode.badge}
                  </span>
                  <h4 className="text-base font-extrabold text-white pt-1">{mode.title}</h4>
                  <p className="text-xs text-gray-300">{mode.desc}</p>
                </div>

                <div className={`p-3 rounded-xl bg-black/40 border border-white/10 ${mode.textColor}`}>
                  <Icon size={22} />
                </div>
              </div>

              {/* Specs */}
              <div className="flex items-center gap-4 text-xs font-semibold text-gray-300 pt-2 border-t border-white/10">
                <span className="flex items-center gap-1">
                  <Award size={13} className="text-gray-400" />
                  {mode.questions}
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={13} className="text-gray-400" />
                  {mode.time}
                </span>
              </div>

              {/* Start CTA */}
              <button
                onClick={() => onStartQuiz(mode.numQuestions, mode.type)}
                className={`w-full py-3 rounded-xl font-extrabold text-xs shadow-lg flex items-center justify-center gap-2 transition-all ${mode.btnBg}`}
              >
                <span>Start Mission</span>
                <Swords size={14} />
              </button>
            </motion.div>
          );
        })}
      </div>

      {/* Focus Mode Banner */}
      <div className="p-4 rounded-2xl bg-purple-950/40 border border-purple-500/20 flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-300">
          <Flame size={18} />
        </div>
        <div className="text-xs">
          <span className="font-bold text-purple-200 block">Focus Mode Enabled</span>
          <span className="text-gray-400">Launching a challenge will isolate your screen for maximum concentration.</span>
        </div>
      </div>
    </div>
  );
}
