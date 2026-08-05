// src/components/ui/EmptyState.jsx
// Premium Actionable Empty States — Treats empty states as beginnings rather than errors.
// Formula: Current Reality + Meaning + Next Action.

import React from "react";
import { Compass, Sparkles, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function EmptyState({
  title = "Your learning map is empty.",
  description = "Start your first journey to build your knowledge constellation.",
  actionText = "Start Journey",
  onAction,
  icon: Icon = Compass,
}) {
  const navigate = useNavigate();

  const handleAction = () => {
    if (onAction) {
      onAction();
    } else {
      navigate("/learn");
    }
  };

  return (
    <div className="p-8 rounded-3xl bg-slate-900/60 border border-white/5 text-center space-y-4 max-w-sm mx-auto backdrop-blur-xl">
      <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mx-auto border border-indigo-500/20">
        <Icon size={22} />
      </div>

      <div className="space-y-1">
        <h3 className="text-sm font-bold text-white tracking-tight">{title}</h3>
        <p className="text-xs text-gray-400 font-medium leading-relaxed">
          {description}
        </p>
      </div>

      <button
        onClick={handleAction}
        className="px-5 py-2.5 rounded-xl bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/30 text-indigo-200 font-extrabold text-xs transition-all flex items-center justify-center gap-1.5 mx-auto cursor-pointer"
      >
        <span>{actionText}</span>
        <ArrowRight size={13} />
      </button>
    </div>
  );
}
