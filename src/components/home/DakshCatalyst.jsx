// src/components/home/DakshCatalyst.jsx
// The Daksh companion card — replaces AICoach on the Home page.
// Uses typing animation for the title, fade-in for the body, and routes CTA actions.

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useMindModel } from "../../context/MindModelContext";

// Parse "navigate:/learn" → "/learn"
function parseCTAAction(action = "") {
  if (action.startsWith("navigate:")) return action.replace("navigate:", "");
  return null;
}

// Animated typing hook
function useTypingEffect(text = "", speed = 38, startDelay = 400) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDisplayed("");
    setDone(false);
    if (!text) return;

    let i = 0;
    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        i++;
        setDisplayed(text.slice(0, i));
        if (i >= text.length) {
          clearInterval(interval);
          setDone(true);
        }
      }, speed);
      return () => clearInterval(interval);
    }, startDelay);

    return () => clearTimeout(timeout);
  }, [text, speed, startDelay]);

  return { displayed, done };
}

export default function DakshCatalyst() {
  const { catalyst, catalystDismissed, dismissCatalyst } = useMindModel();
  const navigate = useNavigate();

  const { displayed: typedTitle, done: titleDone } = useTypingEffect(
    catalyst?.title || "",
    40,
    600
  );

  if (!catalyst || catalystDismissed) return null;

  const routePath = parseCTAAction(catalyst.cta_action);

  const handleCTA = () => {
    dismissCatalyst();
    if (routePath) navigate(routePath);
  };

  return (
    <AnimatePresence>
      <motion.div
        key="daksh-catalyst"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="relative overflow-hidden rounded-3xl border border-white/[0.07] bg-gradient-to-br from-slate-900/90 via-slate-900/70 to-purple-950/40 backdrop-blur-xl"
      >
        {/* Ambient glow layers */}
        <div className="absolute -top-16 -right-16 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-cyan-500/8 rounded-full blur-3xl pointer-events-none" />
        {/* Top shimmer */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-purple-500/40 to-transparent" />

        <div className="relative px-5 py-5">
          {/* Header row */}
          <div className="flex items-start justify-between gap-3 mb-4">
            <div className="flex items-center gap-3">
              {/* Animated orb */}
              <div className="relative flex-shrink-0">
                <div
                  className="w-9 h-9 rounded-full"
                  style={{
                    background: "radial-gradient(circle at 35% 35%, #c4b5fd, #7c3aed 55%, #0891b2 100%)",
                    boxShadow: "0 0 18px rgba(139,92,246,0.55), 0 0 6px rgba(8,145,178,0.3)",
                    animation: "pulse 2.8s ease-in-out infinite",
                  }}
                />
                {/* Outer ring */}
                <div
                  className="absolute inset-0 rounded-full"
                  style={{
                    boxShadow: "0 0 0 2px rgba(139,92,246,0.2)",
                    animation: "ping 3s cubic-bezier(0, 0, 0.2, 1) infinite",
                  }}
                />
              </div>

              <div>
                <p className="text-[9px] font-black tracking-[0.2em] text-purple-400/80 uppercase mb-0.5">
                  Daksh
                </p>
                {/* Typing title */}
                <p className="text-sm font-bold text-white leading-tight min-h-[20px]">
                  {typedTitle}
                  {!titleDone && (
                    <span className="inline-block w-0.5 h-3.5 bg-purple-400 ml-0.5 animate-pulse" />
                  )}
                </p>
              </div>
            </div>

            {/* Dismiss */}
            <button
              onClick={dismissCatalyst}
              className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-gray-600 hover:text-gray-400 hover:bg-white/5 transition-all text-sm"
              aria-label="Dismiss"
            >
              ×
            </button>
          </div>

          {/* Body — fades in after title is done */}
          <AnimatePresence>
            {titleDone && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.15 }}
              >
                <p className="text-sm text-gray-300 leading-relaxed mb-4">
                  {catalyst.body}
                </p>

                {/* CTA + dismiss row */}
                {catalyst.cta_text && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCTA}
                      className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold transition-all shadow-lg shadow-purple-500/20 active:scale-[0.98]"
                    >
                      {catalyst.cta_text} →
                    </button>
                    <button
                      onClick={dismissCatalyst}
                      className="py-2.5 px-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-gray-500 hover:text-gray-400 text-xs font-semibold transition"
                    >
                      Later
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
