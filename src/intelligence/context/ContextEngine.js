// src/intelligence/context/ContextEngine.js
// Pure function: takes an ObservationSnapshot and returns a MomentInterpretation.
// No side effects. Fully unit-testable with mock data.

/**
 * MomentType — the classified interpretation of the current situation.
 * ContextEngine maps behavioral signals to one of these types.
 * InterventionEngine maps momentType to an OIDPI action.
 */
export const MOMENT_TYPES = {
  FIRST_ENCOUNTER:        "first_encounter",        // User opened a concept for the first time
  LEARN_ARRIVAL:          "learn_arrival",          // Arrived on /learn or /syllabus main view
  NOTES_ARRIVAL:          "notes_arrival",          // Arrived on /notes or opened Revision Notes tab
  RETURNING_TO_STRUGGLE:  "returning_to_struggle",  // Fear area, returning
  READY_FOR_CHALLENGE:    "ready_for_challenge",     // High mastery, rising momentum
  LOST_IN_CONTENT:        "lost_in_content",         // Long time on page, low interaction
  DAILY_ARRIVAL:          "daily_arrival",           // Home page, first event of session
  LOW_ENERGY_SESSION:     "low_energy_session",      // Energy < 40 from diary
  FLOW_STATE:             "flow_state",              // inFlow = true
  MILESTONE_HIT:          "milestone_hit",           // mastery/streak/identity event just fired
  REPEATED_FAILURE:       "repeated_failure",        // QUIZ_FAILED_REPEAT just fired
  GROWTH_REVIEW:          "growth_review",           // User is on /growth page
  ENERGY_LOG_PROMPT:      "energy_log_prompt",       // On /growth, diary not logged today
  IDLE_DRIFT:             "idle_drift",              // isIdle = true, no interaction
  UNKNOWN:                "unknown",                 // Catch-all — intervention engine will silence
};

/**
 * interpret(snapshot, conceptMeta?)
 *
 * @param {Object} snapshot — from ObserverEngine.snapshot()
 * @param {Object} conceptMeta — optional: { id, name, mastery, isFirstVisit, isFearConcept }
 * @returns {MomentInterpretation}
 */
export function interpret(snapshot, conceptMeta = null) {
  const {
    lastEvent,
    page,
    confidence,
    momentum,
    fearAreas,
    inFlow,
    idleSeconds,
    todayEnergyLogged,
    todayEnergy,
    sessionEventCount,
  } = snapshot;

  // ── Compute tone ─────────────────────────────────────────────────────────
  let tone = "companion";
  if (confidence < 0.40) tone = "mentor";
  else if (confidence > 0.75) tone = "challenger";

  // ── Milestone just fired ──────────────────────────────────────────────────
  const MILESTONE_EVENTS = [
    "CONCEPT_MASTERED", "STREAK_MILESTONE", "IDENTITY_UNLOCKED", "QUIZ_PERFECT",
  ];
  if (lastEvent && MILESTONE_EVENTS.includes(lastEvent)) {
    return _moment(MOMENT_TYPES.MILESTONE_HIT, snapshot, tone, conceptMeta);
  }

  // ── Repeated failure just fired ───────────────────────────────────────────
  if (lastEvent === "QUIZ_FAILED_REPEAT") {
    return _moment(MOMENT_TYPES.REPEATED_FAILURE, snapshot, tone, conceptMeta);
  }

  // ── Flow state — never interrupt ──────────────────────────────────────────
  if (inFlow) {
    return _moment(MOMENT_TYPES.FLOW_STATE, snapshot, tone, conceptMeta);
  }

  // ── Growth page ───────────────────────────────────────────────────────────
  if (page.startsWith("/growth")) {
    if (!todayEnergyLogged) {
      return _moment(MOMENT_TYPES.ENERGY_LOG_PROMPT, snapshot, tone, conceptMeta);
    }
    return _moment(MOMENT_TYPES.GROWTH_REVIEW, snapshot, tone, conceptMeta);
  }

  // ── Notes page ────────────────────────────────────────────────────────────
  if (page.startsWith("/notes")) {
    return _moment(MOMENT_TYPES.NOTES_ARRIVAL, snapshot, tone, conceptMeta);
  }

  // ── Learn & Syllabus main page ─────────────────────────────────────────────
  if (page.startsWith("/learn") || page.startsWith("/syllabus")) {
    return _moment(MOMENT_TYPES.LEARN_ARRIVAL, snapshot, tone, conceptMeta);
  }

  // ── Concept / Topic view ──────────────────────────────────────────────────
  if (page.startsWith("/concept") || page.startsWith("/topic")) {
    return _moment(MOMENT_TYPES.FIRST_ENCOUNTER, snapshot, tone, conceptMeta);
  }

  // ── Practice page ─────────────────────────────────────────────────────────
  if (page.startsWith("/practice")) {
    return _moment(MOMENT_TYPES.READY_FOR_CHALLENGE, snapshot, tone, conceptMeta);
  }

  // ── Community / World page ────────────────────────────────────────────────
  if (page.startsWith("/community") || page.startsWith("/world")) {
    return _moment(MOMENT_TYPES.DAILY_ARRIVAL, snapshot, tone, conceptMeta);
  }

  // ── Profile page ──────────────────────────────────────────────────────────
  if (page.startsWith("/profile")) {
    return _moment(MOMENT_TYPES.GROWTH_REVIEW, snapshot, tone, conceptMeta);
  }

  // ── Concept page with meta ────────────────────────────────────────────────
  if (conceptMeta) {
    const { mastery = 0, isFirstVisit = false, isFearConcept = false } = conceptMeta;

    if (isFearConcept || fearAreas.includes(conceptMeta.name)) {
      return _moment(MOMENT_TYPES.RETURNING_TO_STRUGGLE, snapshot, tone, conceptMeta);
    }
    if (mastery >= 0.70 && confidence > 0.60) {
      return _moment(MOMENT_TYPES.READY_FOR_CHALLENGE, snapshot, tone, conceptMeta);
    }
    if (isFirstVisit) {
      return _moment(MOMENT_TYPES.FIRST_ENCOUNTER, snapshot, tone, conceptMeta);
    }
  }

  // ── Low energy ────────────────────────────────────────────────────────────
  if (todayEnergyLogged && todayEnergy !== null && todayEnergy < 40) {
    return _moment(MOMENT_TYPES.LOW_ENERGY_SESSION, snapshot, tone, conceptMeta);
  }

  // ── Daily arrival (first event of session, home page) ─────────────────────
  if (page === "/" || page.startsWith("/#")) {
    return _moment(MOMENT_TYPES.DAILY_ARRIVAL, snapshot, tone, conceptMeta);
  }

  // ── Idle drift ────────────────────────────────────────────────────────────
  if (idleSeconds > 90) {
    return _moment(MOMENT_TYPES.IDLE_DRIFT, snapshot, tone, conceptMeta);
  }

  // ── Default — not enough signal to classify ───────────────────────────────
  return _moment(MOMENT_TYPES.UNKNOWN, snapshot, tone, conceptMeta);
}

// ── Internal builder ──────────────────────────────────────────────────────────

function _moment(momentType, snapshot, tone, conceptMeta) {
  return {
    momentType,
    tone,
    page: snapshot.page,
    confidence: snapshot.confidence,
    momentum: snapshot.momentum,
    fearAreas: snapshot.fearAreas,
    conceptName: conceptMeta?.name ?? null,
    conceptId: conceptMeta?.id ?? null,
    conceptMastery: conceptMeta?.mastery ?? null,
    lastEvent: snapshot.lastEvent,
    lastEventMeta: snapshot.lastEventMeta,
  };
}
