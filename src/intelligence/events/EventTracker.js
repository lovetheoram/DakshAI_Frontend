// src/intelligence/events/EventTracker.js
// Universal behavioral event logger — fire-and-forget, never blocks UI.
// Also provides a local pub/sub channel so ObserverEngine can react to events
// without polling. Subscribers receive (eventType, metadata) synchronously.

import axiosClient from "../../api/axiosClient";

// ── Local pub/sub ──────────────────────────────────────────────────────────
const _listeners = [];

const EventTracker = {
  /**
   * Subscribe to all behavior events fired locally.
   * Used exclusively by ObserverEngine to trigger OIDPI evaluation.
   * Returns an unsubscribe function.
   */
  subscribe(fn) {
    _listeners.push(fn);
    return () => {
      const idx = _listeners.indexOf(fn);
      if (idx !== -1) _listeners.splice(idx, 1);
    };
  },

  /** Internal — notify all local subscribers. Never throws. */
  _notify(eventType, metadata) {
    _listeners.forEach((fn) => {
      try { fn(eventType, metadata); } catch (_) {}
    });
  },

  /**
   * Core log method. Sends event to backend asynchronously.
   * Also notifies local subscribers synchronously (ObserverEngine).
   * Silently fails — behavioral tracking must never break the app.
   */
  log(eventType, metadata = {}) {
    axiosClient
      .post("/api/behavior/event/", { event_type: eventType, metadata })
      .catch(() => {}); // Always swallow errors
    this._notify(eventType, metadata); // Local notification — synchronous, no network
  },

  // ── Learning ────────────────────────────────────────────────────────────
  conceptStarted(conceptId, conceptName, subjectName = "") {
    this.log("CONCEPT_STARTED", { concept_id: conceptId, concept_name: conceptName, subject_name: subjectName });
  },

  conceptCompleted(conceptId, conceptName, subjectName = "") {
    this.log("CONCEPT_COMPLETED", { concept_id: conceptId, concept_name: conceptName, subject_name: subjectName });
  },

  sessionAbandoned(conceptId, conceptName, durationSeconds = 0) {
    this.log("SESSION_ABANDONED", { concept_id: conceptId, concept_name: conceptName, duration_seconds: durationSeconds });
  },

  // ── Quiz ─────────────────────────────────────────────────────────────────
  quizStarted(conceptId, conceptName) {
    this.log("QUIZ_STARTED", { concept_id: conceptId, concept_name: conceptName });
  },

  quizPassed(conceptId, conceptName, score) {
    this.log("QUIZ_PASSED", { concept_id: conceptId, concept_name: conceptName, score });
  },

  quizFailed(conceptId, conceptName, score, attemptCount = 1) {
    const type = attemptCount >= 3 ? "QUIZ_FAILED_REPEAT" : "QUIZ_FAILED";
    this.log(type, { concept_id: conceptId, concept_name: conceptName, score, attempt_count: attemptCount });
  },

  // ── Behavioral ──────────────────────────────────────────────────────────
  goalSet(examName) {
    this.log("GOAL_SET", { exam_name: examName });
  },

  energyReported(energy, focus, mood) {
    this.log("ENERGY_REPORTED", { energy, focus, mood });
  },

  // ── Milestone ────────────────────────────────────────────────────────────
  conceptMastered(conceptId, conceptName, subjectName = "") {
    this.log("CONCEPT_MASTERED", { concept_id: conceptId, concept_name: conceptName, subject_name: subjectName });
  },

  streakMilestone(days) {
    this.log("STREAK_MILESTONE", { days });
  },

  identityUnlocked(titleId, titleName) {
    this.log("IDENTITY_UNLOCKED", { title_id: titleId, title_name: titleName });
  },

  // ── Onboarding ────────────────────────────────────────────────────────────
  onboardingCompleted(examName) {
    this.log("ONBOARDING_COMPLETED", { exam_name: examName });
  },
};

export default EventTracker;

