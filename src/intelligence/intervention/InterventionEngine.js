// src/intelligence/intervention/InterventionEngine.js
// Companion Dependency Decay — Relationship Maturity & Game Director Engine.
// Relationship stage is derived from earned Relationship Maturity Score (0–100):
// 0–19 (GUIDE) → 20–39 (TEACHER) → 40–59 (MENTOR) → 60–79 (COMPANION) → 80–100 (GUARDIAN).
// Daksh adopts page-specific roles: Planner, Teacher, Challenger, Memory Coach, Analyst, Explorer, Reflector.

import { MOMENT_TYPES } from "../context/ContextEngine";

// ── Action types — maps to backend CatalystMessage.trigger ───────────────────
export const ACTIONS = {
  ASK:        "CURIOSITY_PROMPT",    // Ask before notes — retrieval
  CHALLENGE:  "DIRECT_CHALLENGE",    // High mastery — skip reading
  ENCOURAGE:  "ENCOURAGEMENT",       // Fear area / low confidence
  CELEBRATE:  "CELEBRATION",         // Milestone just hit
  EXPLAIN:    "FOCUSED_EXPLAIN",     // Repeated failure, stuck
  REFLECT:    "REFLECTION_PROMPT",   // Long session, idle drift
  PREDICT:    "PREDICTION_NARRATIVE",// Growth page story
  IDENTITY:   "IDENTITY_ARRIVAL",    // Energy log mood ritual
  SILENCE:    null,                  // Say nothing
};

// ── PAGE-SPECIFIC GAME DIRECTOR ROLES ─────────────────────────────────────────
export const PAGE_ROLES = {
  "/": {
    role: "Planner",
    promptPrefix: "Today's Mission",
    desc: "Guides daily mission focus & momentum.",
  },
  "/learn": {
    role: "Teacher",
    promptPrefix: "Concept Foundation",
    desc: "Focuses on deep concept understanding before rushing.",
  },
  "/practice": {
    role: "Challenger",
    promptPrefix: "Application Duel",
    desc: "Pushes speed, accuracy, and retrieval under pressure.",
  },
  "/notes": {
    role: "Memory Coach",
    promptPrefix: "Active Recall",
    desc: "Prompts formula retrieval before passive reading.",
  },
  "/growth": {
    role: "Analyst",
    promptPrefix: "Trajectory Story",
    desc: "Translates progress metrics into predicted target dates.",
  },
  "/community": {
    role: "Explorer",
    promptPrefix: "World Impact",
    desc: "Connects concepts to real student projects & applications.",
  },
  "/profile": {
    role: "Reflector",
    promptPrefix: "Growth Reflection",
    desc: "Highlights how far the student's knowledge universe has grown.",
  },
};

// ── RELATIONSHIP STAGES (Companion Dependency Decay) ─────────────────────────
export const RELATIONSHIP_STAGES = {
  GUIDE: {
    key: "GUIDE",
    label: "Stage 1 — Guide (0-19 pts)",
    quote: "I'll walk with you.",
    minScore: 0,
    maxScore: 19,
    guidance: 5,
    questions: 1,
    observations: 1,
    celebrations: 4,
    cooldownMinutes: 0.5, // 30 seconds
    pageSettleSeconds: 1,
    maxSessionInterventions: 6,
    defaultTone: "mentor",
    allowedActions: ["CURIOSITY_PROMPT", "ENCOURAGEMENT", "FOCUSED_EXPLAIN", "PREDICTION_NARRATIVE", "IDENTITY_ARRIVAL"],
  },
  TEACHER: {
    key: "TEACHER",
    label: "Stage 2 — Teacher (20-39 pts)",
    quote: "Let's think together.",
    minScore: 20,
    maxScore: 39,
    guidance: 3,
    questions: 5,
    observations: 3,
    celebrations: 3,
    cooldownMinutes: 4,
    pageSettleSeconds: 4,
    maxSessionInterventions: 4,
    defaultTone: "mentor",
    allowedActions: ["CURIOSITY_PROMPT", "DIRECT_CHALLENGE", "ENCOURAGEMENT", "CELEBRATION", "REFLECTION_PROMPT"],
  },
  MENTOR: {
    key: "MENTOR",
    label: "Stage 3 — Mentor (40-59 pts)",
    quote: "You know more than you think.",
    minScore: 40,
    maxScore: 59,
    guidance: 2,
    questions: 4,
    observations: 4,
    celebrations: 4,
    cooldownMinutes: 8,
    pageSettleSeconds: 7,
    maxSessionInterventions: 3,
    defaultTone: "companion",
    allowedActions: ["DIRECT_CHALLENGE", "ENCOURAGEMENT", "CELEBRATION", "FOCUSED_EXPLAIN", "REFLECTION_PROMPT"],
  },
  COMPANION: {
    key: "COMPANION",
    label: "Stage 4 — Companion (60-79 pts)",
    quote: "I'm here if you need me.",
    minScore: 60,
    maxScore: 79,
    guidance: 1,
    questions: 2,
    observations: 5,
    celebrations: 4,
    cooldownMinutes: 15,
    pageSettleSeconds: 10,
    maxSessionInterventions: 2,
    defaultTone: "companion",
    allowedActions: ["CELEBRATION", "FOCUSED_EXPLAIN", "REFLECTION_PROMPT"],
  },
  GUARDIAN: {
    key: "GUARDIAN",
    label: "Stage 5 — Silent Guardian (80-100 pts)",
    quote: "I trust you.",
    minScore: 80,
    maxScore: 100,
    guidance: 0,
    questions: 0,
    observations: 5,
    celebrations: 5,
    cooldownMinutes: 35,
    pageSettleSeconds: 15,
    maxSessionInterventions: 1,
    defaultTone: "challenger",
    allowedActions: ["CELEBRATION", "FOCUSED_EXPLAIN"],
  },
};

/**
 * Calculates Relationship Maturity Score (0–100) based on earned student progress.
 */
export function calculateMaturityScore(snapshot) {
  let score = 0;

  // Score components
  score += Math.min(30, (snapshot.sessionEventCount || 0) * 2);
  score += Math.min(25, (snapshot.accountAgeDays || 0) * 3);
  score += Math.min(25, (snapshot.sessionInterventionCount || 0) * 5);
  if (snapshot.todayEnergyLogged) score += 10;
  if (snapshot.confidence > 0.75) score += 10;

  return Math.min(100, Math.floor(score));
}

/**
 * Derives the active Relationship Stage from earned Relationship Maturity Score.
 */
export function getRelationshipStage(snapshot) {
  const score = calculateMaturityScore(snapshot);

  if (score < 20) return RELATIONSHIP_STAGES.GUIDE;
  if (score < 40) return RELATIONSHIP_STAGES.TEACHER;
  if (score < 60) return RELATIONSHIP_STAGES.MENTOR;
  if (score < 80) return RELATIONSHIP_STAGES.COMPANION;
  return RELATIONSHIP_STAGES.GUARDIAN;
}

/**
 * Returns Daksh's active Game Director role based on current page path.
 */
export function getPageRole(pagePath = "/") {
  const matchedKey = Object.keys(PAGE_ROLES).find(key => 
    key === "/" ? pagePath === "/" : pagePath.startsWith(key)
  );
  return PAGE_ROLES[matchedKey] || PAGE_ROLES["/"];
}

// ── momentType → action mapping ───────────────────────────────────────────────
const MOMENT_ACTION_MAP = {
  [MOMENT_TYPES.FIRST_ENCOUNTER]:       ACTIONS.ASK,
  [MOMENT_TYPES.LEARN_ARRIVAL]:         ACTIONS.PREDICT,
  [MOMENT_TYPES.NOTES_ARRIVAL]:         ACTIONS.ASK,
  [MOMENT_TYPES.RETURNING_TO_STRUGGLE]: ACTIONS.ENCOURAGE,
  [MOMENT_TYPES.READY_FOR_CHALLENGE]:   ACTIONS.CHALLENGE,
  [MOMENT_TYPES.LOST_IN_CONTENT]:       ACTIONS.REFLECT,
  [MOMENT_TYPES.DAILY_ARRIVAL]:         ACTIONS.PREDICT,
  [MOMENT_TYPES.LOW_ENERGY_SESSION]:    ACTIONS.ENCOURAGE,
  [MOMENT_TYPES.FLOW_STATE]:            ACTIONS.SILENCE,  // never interrupt flow
  [MOMENT_TYPES.MILESTONE_HIT]:         ACTIONS.CELEBRATE,
  [MOMENT_TYPES.REPEATED_FAILURE]:      ACTIONS.EXPLAIN,
  [MOMENT_TYPES.GROWTH_REVIEW]:         ACTIONS.PREDICT,
  [MOMENT_TYPES.ENERGY_LOG_PROMPT]:     ACTIONS.IDENTITY,
  [MOMENT_TYPES.IDLE_DRIFT]:            ACTIONS.REFLECT,
  [MOMENT_TYPES.UNKNOWN]:               ACTIONS.SILENCE,
};

/**
 * decide(snapshot, moment)
 *
 * @param {Object} snapshot — from ObserverEngine.snapshot()
 * @param {Object} moment — from ContextEngine.interpret()
 * @returns {InterventionDecision}
 */
export function decide(snapshot, moment) {
  const stage = getRelationshipStage(snapshot);
  const pageRole = getPageRole(snapshot.page);
  const maturityScore = calculateMaturityScore(snapshot);

  // ── Step 1: Silence Engine — should we stay quiet? ───────────────────────
  const silenceReason = _shouldStaySilent(snapshot, moment, stage);
  if (silenceReason) {
    return {
      shouldSpeak: false,
      action: ACTIONS.SILENCE,
      tone: moment.tone || stage.defaultTone,
      silenceReason,
      relationshipStage: stage.key,
      stageLabel: stage.label,
      stageQuote: stage.quote,
      maturityScore,
      pageRole: pageRole.role,
    };
  }

  // ── Step 2: Map momentType → action ──────────────────────────────────────
  const candidateAction = MOMENT_ACTION_MAP[moment.momentType] ?? ACTIONS.SILENCE;

  // Check if candidateAction is allowed by the current relationship stage
  const action = (candidateAction && stage.allowedActions.includes(candidateAction))
    ? candidateAction
    : ACTIONS.SILENCE;

  if (!action) {
    return {
      shouldSpeak: false,
      action: ACTIONS.SILENCE,
      tone: moment.tone || stage.defaultTone,
      silenceReason: "action_not_allowed_in_stage",
      relationshipStage: stage.key,
      stageLabel: stage.label,
      stageQuote: stage.quote,
      maturityScore,
      pageRole: pageRole.role,
    };
  }

  // ── Step 3: Return decision ───────────────────────────────────────────────
  return {
    shouldSpeak: true,
    action,
    tone: moment.tone || stage.defaultTone,
    momentType: moment.momentType,
    conceptId: moment.conceptId,
    conceptName: moment.conceptName,
    fearAreas: moment.fearAreas,
    silenceReason: null,
    relationshipStage: stage.key,
    stageLabel: stage.label,
    stageQuote: stage.quote,
    maturityScore,
    pageRole: pageRole.role,
  };
}

// ── Silence Engine ────────────────────────────────────────────────────────────

function _shouldStaySilent(snapshot, moment, stage) {
  // 1. Never interrupt a quiz in progress
  if (snapshot.page && snapshot.page.startsWith("/quiz/")) {
    return "quiz_in_progress";
  }

  // 2. Respect explicit dismissal — user recently closed Daksh card (within last 10 seconds)
  if (snapshot.userJustDismissed) {
    return "just_dismissed";
  }

  // 3. User Profile Pace Control (0% to 100%, default: 100%)
  const companionPace = Number(localStorage.getItem("daksh_companion_pace") ?? "100");
  if (companionPace === 0) {
    return "user_pace_silent_mode";
  }

  if (companionPace < 100 && Math.random() > (companionPace / 100)) {
    return "user_pace_throttled";
  }

  // 100% Pace (Default): Proceed — Daksh WILL speak proactively!
  return null;
}



