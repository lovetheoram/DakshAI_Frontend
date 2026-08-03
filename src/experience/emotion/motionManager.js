// src/experience/emotion/motionManager.js
// Purposeful Motion Language for DakshAI.
// Motion Decision Rule: Every animation MUST answer "What changed for the learner?"
// Zero confetti, zero firework explosions, zero decorative hover noise.

export const MOTION_PRESETS = {
  // ── 1. Arrival (Learner enters new context / page) ──────────────────────────
  arrival: {
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -8 },
    transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
  },

  // ── 2. Completion (State transformation: Incomplete ──► Complete) ───────────
  completion: {
    initial: { scale: 0.96, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
  },

  // ── 3. Transition (Knowledge path or concept step moved) ───────────────────
  transition: {
    initial: { opacity: 0, x: -6 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 6 },
    transition: { duration: 0.25, ease: "easeInOut" },
  },

  // ── 4. Subtle Pulse (Calm focus indicator) ──────────────────────────────────
  focusPulse: {
    animate: { opacity: [0.8, 1, 0.8] },
    transition: { duration: 3, repeat: Infinity, ease: "easeInOut" },
  },
};
