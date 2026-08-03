// src/intelligence/intervention/interventionEvaluator.js
// Intervention Engine — Evaluates interventions with user agency & annoyance protection.

import PreferenceStore from "../../product/preferenceStore";

export class InterventionEvaluator {
  static evaluateIntervention(sessionTelemetry = {}) {
    const { consecutiveFailures = 0, interventionType = "STRUGGLE_PATTERN" } = sessionTelemetry;
    const prefs = PreferenceStore.getPreferences();

    // 1. Annoyance Protection Check: Suppress if user dismissed this type >= 2 times
    if (PreferenceStore.isAnnoyanceBlocked(interventionType)) {
      return { shouldIntervene: false, reason: "Suppressed by annoyance protection rule." };
    }

    // 2. Mentor Intensity Setting Check
    const mentorIntensity = prefs.mentorIntensity || "balanced";
    if (mentorIntensity === "low" && consecutiveFailures < 5) {
      return { shouldIntervene: false, reason: "Suppressed by low mentor intensity preference." };
    }

    // 3. Struggle Pattern Trigger: 3+ failures (or 5+ if low intensity)
    const threshold = mentorIntensity === "guided" ? 2 : 3;
    if (consecutiveFailures >= threshold) {
      return {
        shouldIntervene: true,
        interventionType,
        message: "This concept seems tricky. Would a simpler breakdown help?",
        action: "OFFER_SIMPLIFIED_EXPLANATION",
      };
    }

    return { shouldIntervene: false, reason: "Normal progress. Remaining quiet." };
  }
}

export default InterventionEvaluator;
