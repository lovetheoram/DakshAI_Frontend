// src/components/ui/ConceptOrb.jsx
// Cognition Component — Answers: "How are concepts connected?"
// Bounded Scope: Small 2D visual representation of concept relationship (not a 3D animated galaxy).

import React from "react";
import { Network } from "lucide-react";

export default function ConceptOrb({
  parentConcept = "Kirchhoff Laws",
  connectedNodes = ["Current (I)", "Voltage (V)", "Resistance (R)"],
}) {
  return (
    <div className="p-4 rounded-2xl bg-indigo-950/20 border border-indigo-500/20 text-xs space-y-3">
      <div className="flex items-center gap-1.5 text-indigo-300 font-extrabold uppercase text-[10px] tracking-wider">
        <Network size={14} /> Concept Connection Graph
      </div>

      <div className="flex items-center justify-around py-2">
        {/* Parent Center Node */}
        <div className="p-2.5 rounded-xl bg-indigo-600/30 border border-indigo-500/40 text-center space-y-0.5">
          <span className="text-[9px] text-indigo-300 font-bold uppercase block">Core Concept</span>
          <span className="font-extrabold text-white text-xs block">{parentConcept}</span>
        </div>

        <span className="text-gray-500 font-bold">──►</span>

        {/* Connected Sub-Nodes */}
        <div className="flex flex-col gap-1">
          {connectedNodes.map((node, idx) => (
            <span
              key={idx}
              className="px-2.5 py-1 rounded-lg bg-white/[0.03] border border-white/10 text-[11px] font-semibold text-gray-300"
            >
              {node}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
