// src/components/ui/JourneyCard.jsx
// Cognition Component — Answers: "Where am I going?"

import React from "react";
import { Compass, ArrowRight, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function JourneyCard({
  conceptName = "Electricity & Circuits",
  chapterName = "Physics Basics",
  estimatedTime = "About 20 minutes",
  onStart,
}) {
  const navigate = useNavigate();

  return (
    <div className="p-5 rounded-3xl bg-slate-900/80 border border-indigo-500/20 backdrop-blur-xl shadow-xl space-y-4 relative overflow-hidden group">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-400 flex items-center gap-1.5">
          <Compass size={13} /> Active Journey Target
        </span>
        <span className="text-[11px] font-semibold text-gray-400 flex items-center gap-1">
          <Clock size={11} /> {estimatedTime}
        </span>
      </div>

      <div className="space-y-1">
        <span className="text-[11px] text-gray-500 font-bold block uppercase">{chapterName}</span>
        <h3 className="text-lg font-black text-white tracking-tight">{conceptName}</h3>
      </div>

      <button
        onClick={onStart || (() => navigate("/learn"))}
        className="w-full py-3 rounded-2xl bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/30 text-indigo-200 text-xs font-extrabold transition-all flex items-center justify-center gap-2 cursor-pointer"
      >
        <span>Continue Active Journey</span>
        <ArrowRight size={14} />
      </button>
    </div>
  );
}
