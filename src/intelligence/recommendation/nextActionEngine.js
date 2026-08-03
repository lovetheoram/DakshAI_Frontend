// src/intelligence/recommendation/nextActionEngine.js
// Adaptive Next Action Engine — Replaces hardcoded decimals with explicit confidence levels (HIGH, MEDIUM, LOW).
// Rule: If confidence is LOW, remain silent.

export class NextActionEngine {
  static computeNextAction(learnerState = {}, dashboardData = {}) {
    const decayCount = learnerState?.decay_risk_count ?? 0;
    const activeConcept = dashboardData?.active_concept?.name || dashboardData?.recent_activity?.concept;

    // 1. High Forgetting Risk (HIGH Confidence Recommendation)
    if (decayCount > 0 && dashboardData?.decay_alerts?.[0]) {
      const targetConcept = dashboardData.decay_alerts[0].name || "Core Concept";
      return {
        action: "REVISE_CONCEPT",
        concept: targetConcept,
        durationMinutes: 15,
        confidenceLevel: "HIGH",
        reason: {
          type: "MEMORY_DECAY",
          evidence: { decayCount, targetConcept },
          description: `Mastery retrogression risk detected for ${targetConcept}.`,
        },
      };
    }

    // 2. Active Journey Continuity (MEDIUM Confidence Soft Offer)
    if (activeConcept) {
      return {
        action: "CONTINUE_JOURNEY",
        concept: activeConcept,
        durationMinutes: 20,
        confidenceLevel: "MEDIUM",
        reason: {
          type: "ACTIVE_JOURNEY",
          evidence: { activeConcept },
          description: `Continue active learning journey for ${activeConcept}.`,
        },
      };
    }

    // 3. Low Data / Low Confidence (LOW Confidence -> Silence)
    return {
      action: "NONE",
      concept: null,
      confidenceLevel: "LOW",
      reason: {
        type: "INSUFFICIENT_EVIDENCE",
        evidence: {},
        description: "Insufficient evidence for recommendation. Remaining silent.",
      },
    };
  }
}

export default NextActionEngine;
