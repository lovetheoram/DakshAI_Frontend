// src/components/learn/ConceptTabNav.jsx
// Clean tactile Tab Navigation for Concept Session.

import React from "react";
import { BookOpen, Target, BarChart2 } from "lucide-react";

export default function ConceptTabNav({ activeTab, onChangeTab }) {
  const tabs = [
    { id: "learn", label: "Formula & Concept Notes", icon: BookOpen },
    { id: "practice", label: "PYQs Practice & Quiz", icon: Target },
    { id: "progress", label: "Telemetry & History", icon: BarChart2 },
  ];

  return (
    <div className="flex gap-2 border-b border-[var(--color-border)] pb-3 overflow-x-auto scrollbar-hide select-none">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => onChangeTab(tab.id)}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition-all border flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              isActive
                ? "bg-[var(--color-gold-pale)] text-[var(--color-gold-dark)] border-[var(--color-gold)]/30 font-bold shadow-xs"
                : "bg-white text-[var(--color-text-secondary)] border-[var(--color-border)] hover:text-[var(--color-text-primary)]"
            }`}
          >
            <Icon size={14} className={isActive ? "text-[var(--color-gold-dark)]" : "text-[var(--color-mid-gray)]"} />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
