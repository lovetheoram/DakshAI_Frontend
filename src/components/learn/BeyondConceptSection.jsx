// src/components/learn/BeyondConceptSection.jsx
import React from "react";
import { motion } from "framer-motion";
import { Compass, ExternalLink, Cpu, Car, Satellite, Play, ArrowUpRight } from "lucide-react";
import { getConceptTheme } from "./ConceptVisualTheme";

export default function BeyondConceptSection({ conceptName, chapterName }) {
  const theme = getConceptTheme(conceptName, chapterName);

  const applications = [
    {
      icon: Cpu,
      title: "Smart Home Automation",
      subtitle: "Relays, Sensors & Power Distribution",
      badge: "Real World Tech",
      color: "from-blue-500/20 to-cyan-500/20",
      border: "border-blue-500/30",
      tagColor: "text-blue-400"
    },
    {
      icon: Car,
      title: "Electric Vehicles (EVs)",
      subtitle: "Regenerative Braking & High-Voltage Packs",
      badge: "Automotive",
      color: "from-amber-500/20 to-orange-500/20",
      border: "border-amber-500/30",
      tagColor: "text-amber-400"
    },
    {
      icon: Satellite,
      title: "Satellite Solar Arrays",
      subtitle: "Off-Grid Space Power & PV Cells",
      badge: "Space Tech",
      color: "from-purple-500/20 to-indigo-500/20",
      border: "border-purple-500/30",
      tagColor: "text-purple-400"
    }
  ];

  return (
    <div className="space-y-4 pt-4 border-t border-white/10">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Compass size={18} className="text-amber-400" />
            Beyond This Concept
          </h3>
          <p className="text-xs text-gray-400">Discover where this concept powers the modern world</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {applications.map((app, idx) => {
          const Icon = app.icon;

          return (
            <motion.div
              key={idx}
              whileHover={{ y: -3 }}
              className={`p-4 rounded-2xl bg-gradient-to-br ${app.color} border ${app.border} bg-slate-900/80 space-y-3 cursor-pointer group backdrop-blur-md shadow-lg`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-black/40 border border-white/10 ${app.tagColor}`}>
                  {app.badge}
                </span>
                <ArrowUpRight size={14} className="text-gray-400 group-hover:text-white transition-colors" />
              </div>

              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl bg-black/40 border border-white/10 ${app.tagColor}`}>
                  <Icon size={18} />
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-white group-hover:text-amber-300 transition-colors">
                    {app.title}
                  </h4>
                  <p className="text-[11px] text-gray-400">{app.subtitle}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
