// src/components/ui/InfoTooltip.jsx
// Informative explanation popover / modal for telemetry metrics and system logic.

import React, { useState } from "react";
import { Info, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function InfoTooltip({
  title = "Metric Explanation",
  formula = "",
  howToIncrease = "",
  meaning = "",
  className = "",
  size = 14,
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`inline-flex items-center relative ${className}`}>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="w-4 h-4 rounded-full bg-[var(--color-gold-pale)] hover:bg-[var(--color-gold)] text-[var(--color-gold-dark)] hover:text-white flex items-center justify-center transition-all cursor-pointer border border-[var(--color-gold)]/30"
        title={`Explain: ${title}`}
      >
        <Info size={size - 2} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.18 }}
              className="max-w-md w-full daksh-card p-6 space-y-4 shadow-[var(--shadow-lg)] relative border-t-3 border-t-[var(--color-gold)]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-[var(--color-gold-pale)] text-[var(--color-gold-dark)] flex items-center justify-center">
                    <Info size={14} />
                  </div>
                  <h3 className="text-sm font-bold text-[var(--color-text-primary)]">{title}</h3>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-7 h-7 rounded-full border border-[var(--color-border)] flex items-center justify-center text-[var(--color-mid-gray)] hover:text-[var(--color-text-primary)] cursor-pointer"
                >
                  <X size={14} />
                </button>
              </div>

              {/* Body explanation */}
              <div className="space-y-3 text-xs text-[var(--color-text-secondary)] leading-relaxed">
                {meaning && (
                  <div className="p-3 rounded-xl bg-[var(--color-bg-primary)] border border-[var(--color-border)] space-y-1">
                    <span className="text-[10px] font-bold text-[var(--color-gold-dark)] uppercase tracking-wider block">What this means</span>
                    <p className="text-[var(--color-text-primary)]">{meaning}</p>
                  </div>
                )}

                {formula && (
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-[var(--color-mid-gray)] uppercase tracking-wider block">How it is calculated</span>
                    <p className="font-mono text-[11px] bg-[var(--color-bg-secondary)] p-2.5 rounded-lg border border-[var(--color-border)] text-[var(--color-text-primary)]">{formula}</p>
                  </div>
                )}

                {howToIncrease && (
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-[var(--color-success)] uppercase tracking-wider block">How to improve it</span>
                    <p>{howToIncrease}</p>
                  </div>
                )}
              </div>

              {/* Action */}
              <button
                onClick={() => setIsOpen(false)}
                className="w-full py-2.5 rounded-xl btn-gold text-xs font-bold"
              >
                Got it
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
