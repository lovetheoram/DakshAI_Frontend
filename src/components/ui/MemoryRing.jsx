// src/components/ui/MemoryRing.jsx
// Cognition Component — Answers: "What needs attention?"

import React from "react";
import { ShieldAlert, RotateCcw } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function MemoryRing({ decayAlerts = [], onReview }) {
  const navigate = useNavigate();

  if (!decayAlerts || decayAlerts.length === 0) {
    return (
      <div className="p-4 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-teal-300 text-xs flex items-center justify-between">
        <span className="font-semibold flex items-center gap-2">
          <ShieldAlert size={15} /> All 0 concepts at risk of memory decay. Memory healthy.
        </span>
      </div>
    );
  }

  return (
    <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-200 text-xs space-y-2">
      <div className="flex items-center justify-between">
        <span className="font-extrabold uppercase tracking-wider text-[10px] text-amber-400 flex items-center gap-1.5">
          <ShieldAlert size={14} /> Memory Decay Alert
        </span>
        <span className="font-bold text-[10px] px-2 py-0.5 rounded bg-amber-500/20 border border-amber-500/30">
          {decayAlerts.length} Needs Attention
        </span>
      </div>

      <p className="text-gray-300 font-medium">
        {decayAlerts.length} concepts are losing mastery retention. A quick 5-minute review keeps memory permanent.
      </p>

      <button
        onClick={onReview || (() => navigate("/practice"))}
        className="text-amber-300 hover:text-amber-200 font-bold text-xs flex items-center gap-1 pt-1 cursor-pointer"
      >
        <span>Review Memory Ring Now</span>
        <RotateCcw size={12} />
      </button>
    </div>
  );
}
