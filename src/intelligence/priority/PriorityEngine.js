// src/intelligence/priority/PriorityEngine.js
// When multiple interventions are possible in a session, PriorityEngine
// selects the single highest-value one using a scored ranking system.
// This prevents ambiguity and ensures the most meaningful intervention wins.

import { ACTIONS } from "../intervention/InterventionEngine";

// ── Base priority scores ──────────────────────────────────────────────────────
// Higher = more important. SILENCE always loses to any real action.
const BASE_PRIORITY = {
  [ACTIONS.CELEBRATE]:  9,   // milestone just hit — never miss this
  [ACTIONS.CHALLENGE]:  8,   // high confidence + rising — strike while hot
  [ACTIONS.ASK]:        7,   // curiosity before content — core of Phase 5
  [ACTIONS.ENCOURAGE]:  6,   // fear area + low confidence
  [ACTIONS.PREDICT]:    6,   // growth page narrative
  [ACTIONS.IDENTITY]:   6,   // energy log mood ritual
  [ACTIONS.EXPLAIN]:    5,   // repeated failure
  [ACTIONS.REFLECT]:    4,   // long session, drift
  [ACTIONS.SILENCE]:    0,   // always loses
};

/**
 * PriorityEngine.score(decision, snapshot)
 *
 * Returns a numeric priority score for a given InterventionDecision.
 * Higher score = more important = should be shown.
 *
 * @param {Object} decision — from InterventionEngine.decide()
 * @param {Object} snapshot — from ObserverEngine.snapshot()
 * @returns {number}
 */
export function score(decision, snapshot) {
  if (!decision.shouldSpeak || !decision.action) return 0;

  let s = BASE_PRIORITY[decision.action] ?? 0;

  // ── Amplifiers ────────────────────────────────────────────────────────────

  // Long silence → higher urgency for any intervention
  if (snapshot.lastSpokeMinutesAgo > 60) s += 2;
  if (snapshot.lastSpokeMinutesAgo > 120) s += 1; // additional

  // Low confidence → ENCOURAGE gets amplified
  if (decision.action === ACTIONS.ENCOURAGE && snapshot.confidence < 0.35) s += 2;

  // Milestone freshness — must be celebrated immediately
  if (decision.action === ACTIONS.CELEBRATE) s += 2;

  // Energy log not done + on growth page → IDENTITY is urgent
  if (decision.action === ACTIONS.IDENTITY && !snapshot.todayEnergyLogged) s += 2;

  // ── Suppressors ───────────────────────────────────────────────────────────

  // If the same action fired last time Daksh spoke, reduce priority (prevent repetition)
  if (decision.action === snapshot._lastActionShown) s -= 4;

  return Math.max(0, s);
}

/**
 * PriorityEngine.select(decisions, snapshot)
 *
 * Given multiple possible InterventionDecisions (e.g., from different evaluations
 * in a session), returns the single highest-priority one.
 *
 * @param {Array<Object>} decisions — array of InterventionDecision objects
 * @param {Object} snapshot — from ObserverEngine.snapshot()
 * @returns {Object} the highest-priority decision
 */
export function select(decisions, snapshot) {
  if (!decisions || decisions.length === 0) {
    return { shouldSpeak: false, action: ACTIONS.SILENCE, tone: "companion", silenceReason: "no_candidates" };
  }

  // Filter to only decisions that should speak
  const candidates = decisions.filter(d => d.shouldSpeak);
  if (candidates.length === 0) {
    return decisions[0]; // return the first silence decision (they're all equivalent)
  }

  // Score each and return the winner
  let best = candidates[0];
  let bestScore = score(candidates[0], snapshot);

  for (let i = 1; i < candidates.length; i++) {
    const s = score(candidates[i], snapshot);
    if (s > bestScore) {
      bestScore = s;
      best = candidates[i];
    }
  }

  return best;
}

const PriorityEngine = { score, select };
export default PriorityEngine;
