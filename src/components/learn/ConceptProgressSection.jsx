// src/components/learn/ConceptProgressSection.jsx
import React from "react";
import { motion } from "framer-motion";
import { BarChart2, Clock, CheckCircle2, Award } from "lucide-react";
import GlassCard from "../ui/GlassCard";
import ProgressBar from "../ui/ProgressBar";

export default function ConceptProgressSection({
  readiness = 0,
  examMastery = 0,
  chapterMastery = 0,
  lastPracticed = null,
  questionsSolved = 0,
  historySummary = null,
}) {
  const currentReadiness = Math.min(100, Math.round((readiness || examMastery || chapterMastery) * 100));

  const totalQuestionsDisplay = questionsSolved || (historySummary?.total_attempts ? historySummary.total_attempts * 5 : 0);

  const formattedLastPracticed = lastPracticed
    ? new Date(lastPracticed).toLocaleDateString([], { month: "short", day: "numeric" })
    : "Not practiced yet";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <BarChart2 size={18} className="text-blue-400" />
          Mastery & Retention Analytics
        </h3>
        <p className="text-xs text-gray-400">Essential performance indicators without unnecessary noise</p>
      </div>

      {/* Unified Concept Readiness Bar */}
      <GlassCard padding="p-6" className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs font-bold">
            <span className="text-emerald-300">Unified Concept Readiness</span>
            <span className="text-emerald-400 font-extrabold">{currentReadiness}%</span>
          </div>
          <ProgressBar value={currentReadiness} color="bg-emerald-500" height="h-3" />
        </div>
      </GlassCard>

      {/* 2 Activity Stats Cards */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 text-center space-y-1">
          <Clock size={16} className="mx-auto text-amber-400" />
          <span className="text-xs sm:text-sm font-extrabold text-white block truncate">{formattedLastPracticed}</span>
          <span className="text-[9px] text-gray-400 uppercase font-semibold block">Last Practiced</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 text-center space-y-1">
          <CheckCircle2 size={16} className="mx-auto text-emerald-400" />
          <span className="text-xs sm:text-sm font-extrabold text-white block">{totalQuestionsDisplay}</span>
          <span className="text-[9px] text-gray-400 uppercase font-semibold block">Questions Solved</span>
        </div>
      </div>
    </div>
  );
}
