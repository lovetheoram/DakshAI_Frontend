// src/components/home/JourneyStory.jsx
// Identity Story Component — Replaces raw streak counters with a meaningful weekly story.
// Renders required story elements + evidence-backed optional insights.

import React from "react";
import { Sparkles, CheckCircle2, Compass, TrendingUp, ShieldCheck, Flame } from "lucide-react";
import IdentityEngine from "../../intelligence/identity/IdentityEngine";

export default function JourneyStory({ dashboardData, streakStats }) {
  const story = IdentityEngine.generateJourneyStory(dashboardData, streakStats);

  return (
    <div className="p-5 rounded-3xl bg-slate-900/80 border border-purple-500/20 backdrop-blur-xl shadow-xl space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/5 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400">
            <Flame size={16} />
          </div>
          <h3 className="text-xs font-extrabold uppercase tracking-widest text-purple-300">
            This Week's Journey Story
          </h3>
        </div>
        <span className="text-xs font-bold text-teal-400 px-2.5 py-0.5 rounded-full bg-teal-500/10 border border-teal-500/20">
          ✓ {story.completedCount} Journeys Complete
        </span>
      </div>

      {/* Core Required Story Timeline */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Current Focus</span>
          <p className="font-bold text-white text-xs">{story.currentFocus}</p>
        </div>

        <div className="p-3.5 rounded-2xl bg-indigo-950/20 border border-indigo-500/20 space-y-1">
          <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-wider block flex items-center gap-1">
            <Compass size={12} /> Tomorrow's Journey
          </span>
          <p className="font-bold text-white text-xs">{story.nextConcept}</p>
        </div>
      </div>

      {/* Optional Evidence-Backed Insights (Rendered ONLY when evidence exists) */}
      {(story.breakthroughConcept || story.confidenceTrend || story.memoryHealth) && (
        <div className="pt-2 border-t border-white/5 space-y-2">
          {story.breakthroughConcept && (
            <div className="flex items-center gap-2 text-xs text-amber-300 bg-amber-500/10 border border-amber-500/20 p-2.5 rounded-xl font-medium">
              <Sparkles size={14} className="shrink-0 text-amber-400" />
              <span>Breakthrough: Mastered <strong>{story.breakthroughConcept}</strong></span>
            </div>
          )}

          {story.confidenceTrend && (
            <div className="flex items-center gap-2 text-xs text-teal-300 bg-teal-500/10 border border-teal-500/20 p-2.5 rounded-xl font-medium">
              <TrendingUp size={14} className="shrink-0 text-teal-400" />
              <span>{story.confidenceTrend}</span>
            </div>
          )}

          {story.memoryHealth && (
            <div className="flex items-center gap-2 text-xs text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 p-2.5 rounded-xl font-medium">
              <ShieldCheck size={14} className="shrink-0 text-indigo-400" />
              <span>{story.memoryHealth}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
