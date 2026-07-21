// src/components/learn/ConceptTabNav.jsx
import React from "react";
import { motion } from "framer-motion";
import { Swords, BookOpen, BarChart2, History } from "lucide-react";

export default function ConceptTabNav({ activeTab, onChangeTab }) {
  const tabs = [
    { id: "practice", label: "1. Practice", icon: Swords, color: "text-purple-400" },
    { id: "learn", label: "2. Revision Notes", icon: BookOpen, color: "text-amber-400" },
    { id: "progress", label: "3. Progress", icon: BarChart2, color: "text-blue-400" },
    { id: "history", label: "4. History", icon: History, color: "text-emerald-400" },
  ];

  return (
    <div className="flex items-center justify-between p-1.5 rounded-2xl bg-slate-900/90 border border-white/10 backdrop-blur-md shadow-lg">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => onChangeTab(tab.id)}
            className={`relative flex-1 py-3 px-2 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all select-none ${
              isActive ? "text-white shadow-md" : "text-gray-400 hover:text-gray-200"
            }`}
          >
            {isActive && (
              <motion.div
                layoutId="activeConceptTab"
                className="absolute inset-0 bg-gradient-to-r from-purple-600/40 via-indigo-600/40 to-blue-600/40 border border-purple-500/50 rounded-xl"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <Icon size={16} className={`relative z-10 ${isActive ? tab.color : "text-gray-400"}`} />
            <span className="relative z-10">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
