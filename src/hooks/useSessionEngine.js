// src/hooks/useSessionEngine.js
// Learning Session Engine — Single source of truth for the learner's journey state.
// Manages states: READY → LEARNING ↔ PAUSED → TESTING → FINISHED.
// Handles Client Persistence & Backend Sync.

import { useState, useEffect, useCallback } from "react";
import progressApi from "../api/progressApi";

const SESSION_STORAGE_KEY = "daksh_active_session_v1";

export function useSessionEngine() {
  const [activeSession, setActiveSession] = useState(() => {
    try {
      const saved = localStorage.getItem(SESSION_STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Sync session changes to local persistence
  useEffect(() => {
    if (activeSession) {
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(activeSession));
    } else {
      localStorage.removeItem(SESSION_STORAGE_KEY);
    }
  }, [activeSession]);

  // ── Start / Initialize Session ──────────────────────────────────────────────
  const startSession = useCallback((concept) => {
    const newSession = {
      conceptId: concept.id || concept.concept_id,
      conceptTitle: concept.name || concept.title || concept.concept || "Concept Mastery",
      subtopicId: concept.subtopic_id || null,
      state: "LEARNING", // LEARNING → TESTING → FINISHED
      progressStep: "Understanding", // 'Understanding' | 'Applying' | 'Reflecting'
      readingOffset: 0,
      activeBlockIdx: 0,
      quizProgress: { attempts: [], currentIdx: 0, score: 0 },
      startTime: new Date().toISOString(),
      lastActiveTime: new Date().toISOString(),
    };
    setActiveSession(newSession);
    return newSession;
  }, []);

  // ── Pause Session (for interrupts) ──────────────────────────────────────────
  const pauseSession = useCallback(() => {
    setActiveSession((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        state: "PAUSED",
        lastActiveTime: new Date().toISOString(),
      };
    });
  }, []);

  // ── Advance State (LEARNING → TESTING → FINISHED) ───────────────────────────
  const advanceState = useCallback((nextState, extraData = {}) => {
    setActiveSession((prev) => {
      if (!prev) return null;
      const updated = {
        ...prev,
        state: nextState,
        progressStep:
          nextState === "TESTING"
            ? "Applying"
            : nextState === "FINISHED"
            ? "Reflecting"
            : "Understanding",
        ...extraData,
        lastActiveTime: new Date().toISOString(),
      };

      // Sync completed session to backend
      if (nextState === "FINISHED") {
        progressApi
          .completeConceptProgress?.(prev.conceptId)
          .catch((err) => console.error("Failed to sync completed session:", err));
      }

      return updated;
    });
  }, []);

  // ── Clear / Archive Session ────────────────────────────────────────────────
  const clearSession = useCallback(() => {
    setActiveSession(null);
    localStorage.removeItem(SESSION_STORAGE_KEY);
  }, []);

  return {
    activeSession,
    startSession,
    pauseSession,
    advanceState,
    clearSession,
    isLearning: activeSession?.state === "LEARNING",
    isTesting: activeSession?.state === "TESTING",
    isFinished: activeSession?.state === "FINISHED",
    isPaused: activeSession?.state === "PAUSED",
  };
}
