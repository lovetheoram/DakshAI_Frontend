// src/components/learn/ConceptProgressSection.jsx
import React from "react";
import { motion } from "framer-motion";
import { BarChart2, ShieldCheck, Clock, CheckCircle2, Award } from "lucide-react";
import GlassCard from "../ui/GlassCard";
import ProgressBar from "../ui/ProgressBar";

export default function ConceptProgressSection({ examMastery = 0, chapterMastery = 0, historySummary = null }) {
  // Knowledge, Retention, Confidence calculation
  const knowledgePercent = Math.min(100, Math.round(chapterMastery * 100));
  const retentionPercent = Math.min(100, Math.round((examMastery * 0.6 + chapterMastery * 0.4) * 100));
  const confidencePercent = Math.min(100, Math.round(examMastery * 100));

  const questionsSolved = historySummary?.total_attempts ? historySummary.total_attempts * 5 : 42;
  const timeStudied = historySummary?.total_attempts ? (historySummary.total_attempts * 0.4).toFixed(1) : "2.4";

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

      {/* 3 Core Bars */}
      <GlassCard padding="p-6" className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs font-bold">
            <span className="text-purple-300">Knowledge Acquisition</span>
            <span className="text-purple-400 font-extrabold">{knowledgePercent}%</span>
          </div>
          <ProgressBar value={knowledgePercent} color="bg-purple-500" height="h-3" />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs font-bold">
            <span className="text-blue-300">Retention & Recall</span>
            <span className="text-blue-400 font-extrabold">{retentionPercent}%</span>
          </div>
          <ProgressBar value={retentionPercent} color="bg-blue-500" height="h-3" />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs font-bold">
            <span className="text-emerald-300">Exam Confidence</span>
            <span className="text-emerald-400 font-extrabold">{confidencePercent}%</span>
          </div>
          <ProgressBar value={confidencePercent} color="bg-emerald-500" height="h-3" />
        </div>
      </GlassCard>

      {/* 3 Activity Stats Cards */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 text-center space-y-1">
          <Clock size={16} className="mx-auto text-amber-400" />
          <span className="text-xs sm:text-sm font-extrabold text-white block">Yesterday</span>
          <span className="text-[10px] text-gray-400 uppercase font-semibold block">Last Practiced</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 text-center space-y-1">
          <CheckCircle2 size={16} className="mx-auto text-emerald-400" />
          <span className="text-xs sm:text-sm font-extrabold text-white block">{questionsSolved}</span>
          <span className="text-[10px] text-gray-400 uppercase font-semibold block">Questions Solved</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 text-center space-y-1">
          <Award size={16} className="mx-auto text-blue-400" />
          <span className="text-xs sm:text-sm font-extrabold text-white block">{timeStudied} Hours</span>
          <span className="text-[10px] text-gray-400 uppercase font-semibold block">Time Studied</span>
        </div>
      </div>
    </div>
  );
}
