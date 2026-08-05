// src/intelligence/identity/IdentityEngine.js
// Identity Interpretation Layer — Centralized service interpreting learning data into human identity meaning.
// Enforces strict evidence threshold rules: Evidence ──► Reflection ──► Identity.

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
  static getMoodDetails(keyOrEmoji) {
    const found = Object.values(MOOD_STATES).find(
      (m) => m.key === keyOrEmoji || m.emoji === keyOrEmoji
    );
    return found || MOOD_STATES.CALM;
  }

  static getOptions() {
    return Object.values(MOOD_STATES);
  }

  // ── 1. Interpret Weekly Journey Story from DB Evidence ─────────────────────
  static generateJourneyStory(dashboardData = {}, streakStats = {}) {
    const totalJourneys = streakStats?.current_streak ?? dashboardData?.weekly_completed_count ?? 0;
    const currentConcept =
      dashboardData?.active_concept?.name ||
      dashboardData?.recent_activity?.concept ||
      "Active Syllabus Topic";
    const nextConcept =
      dashboardData?.next_recommended?.name ||
      dashboardData?.recent_activity?.next_concept ||
      "Next Recommended Topic";

    // Evidence Threshold Rules (Zero Fabrication)
    let breakthroughConcept = null;
    if (
      dashboardData?.recent_breakthrough &&
      typeof dashboardData.recent_breakthrough.previous_mastery === "number" &&
      dashboardData.recent_breakthrough.previous_mastery < 50
    ) {
      breakthroughConcept = dashboardData.recent_breakthrough.name;
    }

    let confidenceTrend = null;
    if (typeof dashboardData?.accuracy_gain === "number" && dashboardData.accuracy_gain > 0) {
      confidenceTrend = `Confidence Improving (+${Math.round(dashboardData.accuracy_gain)}% Hard-Question Accuracy)`;
    }

    let memoryHealth = null;
    if (Array.isArray(dashboardData?.decay_alerts) && dashboardData.decay_alerts.length > 0) {
      memoryHealth = `${dashboardData.decay_alerts.length} concepts losing mastery`;
    } else if (dashboardData?.memory_status === "healthy") {
      memoryHealth = "Memory Healthy (0 Decay Risk)";
    }

    return {
      completedCount: totalJourneys,
      currentFocus: currentConcept,
      nextConcept: nextConcept,
      // Optional evidence-backed items (only present if threshold passes)
      breakthroughConcept,
      confidenceTrend,
      memoryHealth,
    };
  }

  // ── 2. Interpret Evidence-Based Identity Reflection ────────────────────────
  static getIdentityReflection(sessionResult = {}) {
    const questionsSolved = sessionResult.questionsSolved || sessionResult.total_questions || 0;
    const conceptName = sessionResult.conceptName || sessionResult.concept_name || "Concept";

    return {
      promiseStatus: "Today's Promise: ✓ Kept",
      identityAffirmation: "You finish what you start. You're becoming someone who follows through.",
      evidenceSummary: questionsSolved > 0
        ? `Mastered ${conceptName} with ${questionsSolved} verified challenges solved.`
        : `Completed study journey for ${conceptName}.`,
      characterReflection: "Every completed journey strengthens your study habit and builds mastery momentum.",
    };
  }
}

export default IdentityEngine;
