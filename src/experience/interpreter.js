// src/experience/interpreter.js
// Experience Interpreter — Single source of truth converting learning data into explainable experience payloads.
// Implements explicit evidence contracts for atmosphere decisions.

import { DAKSH_BRAND_TOKENS, DAKSH_ENVIRONMENTS } from "./design/tokens";

class ExperienceInterpreter {
  /**
   * Evaluates session context & identity outputs to decide experience state.
   */
  static interpretExperience(sessionContext = {}, identityOutput = {}) {
    const { consecutiveFailures = 0, isFinished = false, environmentKey = "night" } = sessionContext;
    const environment = DAKSH_ENVIRONMENTS[environmentKey] || DAKSH_ENVIRONMENTS.night;

    // 1. RECOVERY Atmosphere (Triggered on verified 3 consecutive failures)
    if (consecutiveFailures >= 3) {
      return {
        atmosphere: "RECOVERY",
        reason: {
          type: "STRUGGLE_PATTERN",
          evidence: { consecutiveFailures, window: "current_session" },
          description: "Recent friction detected. Pacing calmed to support recovery.",
        },
        visual: {
          density: "minimal",
          motion: "calm",
          background: environment.background,
          primary: environment.accentPrimary,
          surface: environment.surface,
          ambientGlow: "rgba(92, 200, 255, 0.12)", // Calming atmosphere
        },
      };
    }

    // 2. REFLECTION Atmosphere (Triggered upon completing a journey)
    if (isFinished) {
      return {
        atmosphere: "REFLECTION",
        reason: {
          type: "JOURNEY_COMPLETED",
          evidence: { promiseStatus: "Kept" },
          description: "Journey complete. Calm completion reflection active.",
        },
        visual: {
          density: "balanced",
          motion: "settled",
          background: environment.background,
          primary: environment.accentSecondary,
          surface: environment.surface,
          ambientGlow: "rgba(255, 143, 177, 0.15)", // Soft pink completion
        },
      };
    }

    // 3. FOCUSED Atmosphere (Default active study mode)
    return {
      atmosphere: "FOCUSED",
      reason: {
        type: "ACTIVE_STUDY",
        evidence: { sessionActive: true },
        description: "Active focus mode. High contrast and zero distractions.",
      },
      visual: {
        density: "focused",
        motion: "standard",
        background: environment.background,
        primary: environment.accentPrimary,
        surface: environment.surface,
        ambientGlow: environment.glow,
      },
    };
  }
}

export default ExperienceInterpreter;
