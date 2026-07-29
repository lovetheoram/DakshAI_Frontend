// src/components/intelligence/DakshPersona.jsx
// Interactive Architecture: Permanent Living Floating Orb + Proactive Speech Bubble.
// The Orb is ALWAYS floating in the bottom-left corner as a permanent living companion.
// The Speech Bubble is 100% proactive — driven by OIDPI without requiring any user click.

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useMindModel } from "../../context/MindModelContext";

// ── Action → icon mapping ─────────────────────────────────────────────────────
const ACTION_ICONS = {
  CURIOSITY_PROMPT:     "✦",  // spark of curiosity
  DIRECT_CHALLENGE:     "⚡", // strike
  ENCOURAGEMENT:        "◈",  // support
  CELEBRATION:          "◉",  // glow
  FOCUSED_EXPLAIN:      "◎",  // focus
  REFLECTION_PROMPT:    "◇",  // reflect
  PREDICTION_NARRATIVE: "▸",  // forward
  IDENTITY_ARRIVAL:     "●",  // identity dot
};

// ── Typing animation hook ─────────────────────────────────────────────────────
function useTypingText(text, speed = 28) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!text) { setDisplayed(""); setDone(false); return; }
    setDisplayed("");
    setDone(false);

    let i = 0;
    const charDelay = Math.min(speed, (2500 / text.length));

    const tick = setInterval(() => {
      i += 1;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(tick);
        setDone(true);
      }
    }, charDelay);

    return () => clearInterval(tick);
  }, [text, speed]);

  return { displayed, done };
}

// ── CTA action handler ────────────────────────────────────────────────────────
function useCtaHandler(navigate, dismissIntervention) {
  return (ctaAction) => {
    if (!ctaAction) { dismissIntervention(); return; }

    if (ctaAction.startsWith("navigate:")) {
      const path = ctaAction.replace("navigate:", "");
      navigate(path);
      dismissIntervention();
      return;
    }

    if (ctaAction.startsWith("curiosity:") ||
        ctaAction.startsWith("identity:") ||
        ctaAction.startsWith("reflect:") ||
        ctaAction.startsWith("growth:")) {
      window.dispatchEvent(new CustomEvent("daksh:cta", {
        detail: { action: ctaAction },
        bubbles: true,
      }));
      dismissIntervention();
      return;
    }

    dismissIntervention();
  };
}

// ── Main component ────────────────────────────────────────────────────────────
export default function DakshPersona() {
  const { intervention, dismissIntervention } = useMindModel();
  const navigate = useNavigate();
  const handleCta = useCtaHandler(navigate, dismissIntervention);
  const autoDismissRef = useRef(null);

  const shouldSpeak = !!(intervention && intervention.shouldSpeak);

  // Typing animation on body text
  const { displayed: typedBody, done: typingDone } = useTypingText(
    shouldSpeak ? (intervention?.body ?? "") : "",
    28
  );

  // Auto-dismiss transient speech bubble after 10 seconds (returns to permanent orb)
  useEffect(() => {
    if (!shouldSpeak) return;
    if (autoDismissRef.current) clearTimeout(autoDismissRef.current);
    autoDismissRef.current = setTimeout(() => {
      dismissIntervention();
    }, 10_000);
    return () => clearTimeout(autoDismissRef.current);
  }, [shouldSpeak, intervention, dismissIntervention]);

  const icon = ACTION_ICONS[intervention?.action] ?? "👽";

  return (
    <div className="fixed bottom-24 md:bottom-8 left-5 z-50 flex flex-col items-start gap-3 pointer-events-none">
      {/* 1. Proactive Transient Speech Bubble — Slides in automatically on OIDPI intervention */}
      <AnimatePresence mode="wait">
        {shouldSpeak && (
          <motion.div
            key={(intervention.action || "") + (intervention.momentType || "")}
            initial={{ opacity: 0, x: -20, y: 10, scale: 0.94 }}
            animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: -16, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 420, damping: 30 }}
            className="pointer-events-auto max-w-xs md:max-w-sm glass-card border border-purple-500/30 p-4 rounded-2xl shadow-2xl shadow-purple-900/40 bg-slate-950/95 backdrop-blur-2xl text-white flex flex-col gap-2.5 relative group mb-1"
            onMouseEnter={() => {
              if (autoDismissRef.current) clearTimeout(autoDismissRef.current);
            }}
            onMouseLeave={() => {
              autoDismissRef.current = setTimeout(dismissIntervention, 6_000);
            }}
          >
            {/* Top row: Label & dismiss */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping" />
                <span className="text-[11px] font-black tracking-widest text-purple-300 uppercase">
                  DAKSH {intervention.stageLabel ? `• ${intervention.stageLabel.split('—')[1] || intervention.stageLabel}` : ""}
                </span>
              </div>
              <button
                onClick={dismissIntervention}
                className="text-gray-400 hover:text-white text-xs w-5 h-5 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors"
                aria-label="Dismiss"
              >
                ✕
              </button>
            </div>

            {/* Title */}
            {intervention.title && (
              <h4 className="text-sm font-bold text-white tracking-tight leading-snug">
                {intervention.title}
              </h4>
            )}

            {/* Typed Body */}
            <p className="text-xs text-gray-300 leading-relaxed font-normal">
              {typedBody}
              {!typingDone && (
                <span className="inline-block w-1.5 h-3 bg-purple-400 ml-1 animate-pulse" />
              )}
            </p>

            {/* CTA Button Row */}
            <AnimatePresence>
              {typingDone && intervention.ctaText && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.2 }}
                  className="flex items-center gap-2 pt-1"
                >
                  <button
                    onClick={() => handleCta(intervention.ctaAction)}
                    className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md shadow-purple-500/25 transition-all cursor-pointer"
                  >
                    {intervention.ctaText}
                  </button>
                  <button
                    onClick={dismissIntervention}
                    className="px-2.5 py-1.5 rounded-xl text-gray-400 hover:text-white text-xs font-medium hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    Not now
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Permanent Living Floating Orb — Always present in corner */}
      <motion.button
        onClick={() => window.dispatchEvent(new CustomEvent("daksh:summon", { bubbles: true }))}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        className={`pointer-events-auto relative w-12 h-12 rounded-2xl flex items-center justify-center shadow-xl backdrop-blur-xl border transition-all duration-300 cursor-pointer ${
          shouldSpeak
            ? "bg-gradient-to-br from-purple-600 to-indigo-600 border-purple-400 shadow-purple-500/40"
            : "bg-slate-900/90 border-purple-500/30 hover:border-purple-400/60 shadow-indigo-900/30"
        }`}
        title="Daksh Companion (Click to talk)"
      >
        {/* Halo Glow Ring */}
        <div className={`absolute -inset-1 rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-500 blur-sm opacity-40 transition-opacity ${
          shouldSpeak ? "animate-pulse opacity-80" : "group-hover:opacity-60"
        }`} />

        {/* Inner Icon */}
        <span className="relative text-xl z-10 select-none">
          {shouldSpeak ? icon : "👽"}
        </span>

        {/* Active Signal Badge */}
        {shouldSpeak && (
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-slate-950 animate-bounce" />
        )}
      </motion.button>
    </div>
  );
}

