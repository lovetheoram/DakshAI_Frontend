// src/components/ui/EmptyState.jsx
// Clean empty state with gold accent

import React from "react";
import { Compass, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function EmptyState({
  title = "Your learning map is empty.",
  description = "Start your first journey to build your knowledge map.",
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
    <div className="p-8 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)] text-center space-y-4 max-w-sm mx-auto">
      <div className="w-12 h-12 rounded-2xl bg-[var(--color-gold-pale)] text-[var(--color-gold)] flex items-center justify-center mx-auto">
        <Icon size={22} />
      </div>

      <div className="space-y-1">
        <h3 className="text-sm font-bold text-[var(--color-text-primary)] tracking-tight">{title}</h3>
        <p className="text-xs text-[var(--color-text-secondary)] font-medium leading-relaxed">
          {description}
        </p>
      </div>

      <button
        onClick={handleAction}
        className="btn-gold px-5 py-2.5 text-xs flex items-center justify-center gap-1.5 mx-auto rounded-xl"
      >
        <span>{actionText}</span>
        <ArrowRight size={13} />
      </button>
    </div>
  );
}
