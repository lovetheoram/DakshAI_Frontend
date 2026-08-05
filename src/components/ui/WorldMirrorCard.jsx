// src/components/ui/WorldMirrorCard.jsx
// Reusable World Mirror Connection Card — used across Home, Learn, Community, and Journey Complete.
// Connects textbook formulas to real-world engineering, scientific, and software projects.

import React from "react";
import { Globe, ArrowRight, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function WorldMirrorCard({
  conceptName = "Electricity & Circuits",
  application = "Electric Vehicle Powertrains & Battery Systems",
  compact = false,
}) {
  const navigate = useNavigate();

  if (compact) {
    return (
      <div className="flex items-center justify-between text-xs text-gray-400 p-3 rounded-xl bg-white/[0.02] border border-white/5">
        <div className="flex items-center gap-2 max-w-[80%]">
          <Globe size={14} className="text-indigo-400 shrink-0" />
          <span className="truncate">
            <strong className="text-gray-300">{conceptName}</strong> is used in {application}.
          </span>
        </div>
        <button
          onClick={() => navigate("/community")}
          className="text-indigo-400 hover:text-indigo-300 font-bold text-[11px] whitespace-nowrap cursor-pointer flex items-center gap-1"
        >
          <span>Explore</span>
          <ArrowRight size={12} />
        </button>
      </div>
    );
  }

  return (
    <div className="p-5 rounded-2xl bg-indigo-950/20 border border-indigo-500/20 backdrop-blur-xl space-y-3 relative overflow-hidden group">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400">
            <Globe size={16} />
          </div>
          <span className="text-xs font-extrabold uppercase tracking-widest text-indigo-300">
            World Mirror Connection
          </span>
        </div>
        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 flex items-center gap-1">
          <Sparkles size={10} /> Real Impact
        </span>
      </div>

      <div className="space-y-1">
        <h4 className="text-sm font-bold text-white">
          {conceptName}
        </h4>
        <p className="text-xs text-gray-300 leading-relaxed font-medium">
          Powers {application}. See how real engineers and researchers apply these principles.
        </p>
      </div>

      <div className="pt-2 flex items-center justify-between border-t border-white/5">
        <span className="text-[11px] text-gray-400">
          Discover student projects built on this concept
        </span>
        <button
          onClick={() => navigate("/community")}
          className="text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1 cursor-pointer"
        >
          <span>Explore World Mirror</span>
          <ArrowRight size={13} />
        </button>
      </div>
    </div>
  );
}
