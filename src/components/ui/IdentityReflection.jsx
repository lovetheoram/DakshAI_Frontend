// src/components/ui/IdentityReflection.jsx
// Identity Reflection Component — Calm, evidence-backed identity reflection.
// Zero fake praise, zero confetti, zero XP coins.

import React from "react";
import { CheckCircle2, ShieldCheck, Sparkles } from "lucide-react";
import IdentityEngine from "../../intelligence/identity/IdentityEngine";

export default function IdentityReflection({ sessionResult = {}, onDismiss }) {
  const reflection = IdentityEngine.getIdentityReflection(sessionResult);

  return (
    <div className="p-6 rounded-3xl bg-slate-900 border border-teal-500/30 text-white space-y-4 max-w-md mx-auto shadow-2xl backdrop-blur-xl">
      <div className="flex items-center gap-2">
        <div className="p-2 rounded-xl bg-teal-500/10 text-teal-400">
          <ShieldCheck size={20} />
        </div>
        <div>
          <span className="text-xs font-extrabold uppercase tracking-widest text-teal-400 block">
            {reflection.promiseStatus}
          </span>
          <h3 className="text-sm font-bold text-gray-200">
            Session Identity Reflection
          </h3>
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2 text-xs">
        <p className="font-bold text-white leading-relaxed">
          "{reflection.identityAffirmation}"
        </p>
        <p className="text-gray-400 leading-relaxed font-medium">
          {reflection.characterReflection}
        </p>
      </div>

      <div className="flex items-center justify-between text-xs text-gray-400 pt-2 border-t border-white/5">
        <span className="flex items-center gap-1.5 text-teal-300 font-semibold">
          <CheckCircle2 size={14} /> Evidence Verified
        </span>
        <span className="text-gray-300 font-medium">{reflection.evidenceSummary}</span>
      </div>

      {onDismiss && (
        <button
          onClick={onDismiss}
          className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all cursor-pointer"
        >
          Continue Journey
        </button>
      )}
    </div>
  );
}
