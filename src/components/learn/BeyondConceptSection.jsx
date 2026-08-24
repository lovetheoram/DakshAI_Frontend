// src/components/learn/BeyondConceptSection.jsx
// Clean tactile Beyond This Concept section aligned with Warm Ivory + Ink + Antique Gold styling.

import React from "react";
import { Globe, Cpu, Car, Satellite, ArrowUpRight } from "lucide-react";

export default function BeyondConceptSection({ conceptName, chapterName }) {
  const applications = [
    {
      icon: Cpu,
      title: "Smart Automation Systems",
      subtitle: "Relays, Sensors & Power Distribution",
      badge: "Real World Tech",
    },
    {
      icon: Car,
      title: "Electric Vehicles (EVs)",
      subtitle: "Regenerative Braking & Battery Systems",
      badge: "Automotive",
    },
    {
      icon: Satellite,
      title: "Space Electronics & PV Cells",
      subtitle: "Off-Grid Solar & Orbital Power Arrays",
      badge: "Space Tech",
    }
  ];

  return (
    <div className="space-y-4 pt-6 border-t border-[var(--color-border)] select-none">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xs font-bold text-[var(--color-text-primary)] uppercase tracking-wider flex items-center gap-1.5">
            <Globe size={14} className="text-[var(--color-gold)]" />
            Beyond This Concept
          </h3>
          <p className="text-[11px] text-[var(--color-text-secondary)] mt-0.5">Real engineering and computational applications.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {applications.map((app, idx) => {
          const Icon = app.icon;

          return (
            <div
              key={idx}
              className="daksh-card p-4 space-y-2 text-[var(--color-text-primary)] cursor-pointer group hover:border-[var(--color-gold)] transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[var(--color-gold-pale)] text-[var(--color-gold-dark)] border border-[var(--color-gold)]/20">
                  {app.badge}
                </span>
                <ArrowUpRight size={14} className="text-[var(--color-mid-gray)] group-hover:text-[var(--color-gold-dark)] transition-colors" />
              </div>

              <div className="space-y-0.5 pt-1">
                <h4 className="text-xs font-bold text-[var(--color-text-primary)] group-hover:text-[var(--color-gold-dark)] transition-colors">
                  {app.title}
                </h4>
                <p className="text-[11px] text-[var(--color-text-secondary)]">{app.subtitle}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
