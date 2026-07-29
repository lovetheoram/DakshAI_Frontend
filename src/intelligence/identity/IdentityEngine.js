// src/intelligence/identity/IdentityEngine.js
// Identity Engine — Daily Mood & Arrival Ritual.
// Replaces tedious slider-first entry with a single-tap emoji ritual.
// Daksh names the state, provides pre-filled values, and suggests the daily study strategy.

export const MOOD_STATES = {
  CALM: {
    key: "calm",
    emoji: "🙂",
    label: "Calm Focus",
    dakshName: "Steady Voyager",
    prefillEnergy: 70,
    prefillFocus: 75,
    message: "A calm day. One concept, done deeply with full precision. That is enough.",
    recommendedStrategy: "Deep Concept Study (25 mins)",
  },
  ENERGIZED: {
    key: "energized",
    emoji: "🔥",
    label: "Peak Fuel",
    dakshName: "High Performance Mode",
    prefillEnergy: 95,
    prefillFocus: 90,
    message: "Peak fuel detected! Today we tackle your hardest fear areas and sprint.",
    recommendedStrategy: "Challenge Duel / Weak Area Repair",
  },
  EXHAUSTED: {
    key: "exhausted",
    emoji: "😴",
    label: "Low Battery",
    dakshName: "Recovery Mode",
    prefillEnergy: 35,
    prefillFocus: 40,
    message: "Recovery day. We don't push hard today — we just show up and keep the streak alive.",
    recommendedStrategy: "Light Flashcards / Formula Review (10 mins)",
  },
  STRUGGLING: {
    key: "struggling",
    emoji: "😕",
    label: "Friction & Noise",
    dakshName: "Resilient Pioneer",
    prefillEnergy: 45,
    prefillFocus: 50,
    message: "Friction is where growth happens. Zero pressure — let's break one formula down together.",
    recommendedStrategy: "Guided Step-by-Step Walkthrough",
  },
};

class IdentityEngine {
  /**
   * Get mood details by key or emoji.
   */
  static getMoodDetails(keyOrEmoji) {
    const found = Object.values(MOOD_STATES).find(
      (m) => m.key === keyOrEmoji || m.emoji === keyOrEmoji
    );
    return found || MOOD_STATES.CALM;
  }

  /**
   * Returns list of all supported mood options for rendering.
   */
  static getOptions() {
    return Object.values(MOOD_STATES);
  }
}

export default IdentityEngine;
