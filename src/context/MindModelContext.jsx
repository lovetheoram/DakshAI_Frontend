// src/context/MindModelContext.jsx
// Global context: Catalyst message, MindProfile, and the full OIDPI loop.
// Phase 5: ObserverEngine subscribes to EventTracker events (event-driven, not timer-driven).
// On each event: Observe → Interpret → Decide → Prioritize → expose `intervention` state.

import React, { createContext, useState, useEffect, useContext, useCallback, useRef } from "react";
import { useLocation } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import axiosClient from "../api/axiosClient";
import { getFallbackMessage } from "../intelligence/catalyst/messages";

// ── OIDPI Engines ─────────────────────────────────────────────────────────────
import observerEngine from "../intelligence/observer/ObserverEngine";
import { interpret } from "../intelligence/context/ContextEngine";
import { decide, ACTIONS } from "../intelligence/intervention/InterventionEngine";
import PriorityEngine from "../intelligence/priority/PriorityEngine";

export const MindModelContext = createContext();

export function MindModelProvider({ children }) {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  // ── Phase 4: Catalyst (existing) ─────────────────────────────────────────
  const [catalyst, setCatalyst] = useState(null);
  const [catalystLoading, setCatalystLoading] = useState(false);
  const [catalystDismissed, setCatalystDismissed] = useState(false);

  // ── Phase 5: OIDPI intervention state ────────────────────────────────────
  // intervention = null → Daksh is silent
  // intervention = { shouldSpeak, action, tone, trigger, momentType, ... } → Daksh may speak
  const [intervention, setIntervention] = useState(null);
  const [mindProfile, setMindProfile] = useState(null);
  const pendingDecisions = useRef([]); // accumulates decisions, PriorityEngine picks winner

  // ── Fetch MindProfile + Catalyst on login ─────────────────────────────────
  useEffect(() => {
    if (!user) {
      setCatalyst(null);
      setCatalystDismissed(false);
      setIntervention(null);
      setMindProfile(null);
      return;
    }

    setCatalystLoading(true);

    // Fetch Catalyst (Phase 4)
    axiosClient
      .get("/api/behavior/catalyst/")
      .then((r) => setCatalyst(r.data))
      .catch(() => {
        setCatalyst({
          ...getFallbackMessage("GENERIC_INSIGHT"),
          trigger: "GENERIC_INSIGHT",
          mind_state: "on_track",
          momentum: "steady",
          fear_areas: [],
          context: {},
        });
      })
      .finally(() => setCatalystLoading(false));

    // Fetch MindProfile (Phase 5) — feeds ObserverEngine
    axiosClient
      .get("/api/behavior/mind/")
      .then((r) => {
        setMindProfile(r.data);
        observerEngine.setMindProfile(r.data);
      })
      .catch(() => {});
  }, [user]);

  // ── Notify ObserverEngine on route change ─────────────────────────────────
  useEffect(() => {
    observerEngine.onRouteChange(location.pathname);
  }, [location.pathname]);

  // ── OIDPI Evaluation callback ─────────────────────────────────────────────
  // Called by ObserverEngine on every EventTracker event.
  // Runs: Interpret → Decide → Prioritize → setIntervention
  const onObserverEvent = useCallback((snapshot, eventType, metadata) => {
    // Build moment interpretation
    const moment = interpret(snapshot);

    // Get intervention decision (default: silence)
    const decision = decide(snapshot, moment);

    if (!decision.shouldSpeak) return; // silence — do nothing

    // Accumulate candidates, then select the best one
    pendingDecisions.current.push(decision);

    // PriorityEngine selects winner
    const winner = PriorityEngine.select(pendingDecisions.current, snapshot);
    if (winner.shouldSpeak) {
      // Fetch the actual message from backend by action/tone
      axiosClient
        .get("/api/behavior/catalyst/intervention/", {
          params: { trigger: winner.action, tone: winner.tone },
        })
        .then((r) => {
          if (r.data && r.data.body) {
            setIntervention({
              ...winner,
              title: r.data.title,
              body: r.data.body,
              ctaText: r.data.cta_text,
              ctaAction: r.data.cta_action,
            });
          } else {
            const fallback = getFallbackMessage(winner.action);
            setIntervention({
              ...winner,
              title: fallback.title,
              body: fallback.body,
              ctaText: fallback.cta_text,
              ctaAction: fallback.cta_action,
            });
          }
          // Record the intervention in ObserverEngine (for cooldown tracking)
          observerEngine.recordIntervention();
          // Clear pending decisions after selection
          pendingDecisions.current = [];
        })
        .catch(() => {
          // Fallback to local handcrafted message if backend API is offline or returns error
          const fallback = getFallbackMessage(winner.action);
          setIntervention({
            ...winner,
            title: fallback.title,
            body: fallback.body,
            ctaText: fallback.cta_text,
            ctaAction: fallback.cta_action,
          });
          observerEngine.recordIntervention();
          pendingDecisions.current = [];
        });
    }
  }, []);

  // ── Start ObserverEngine once ─────────────────────────────────────────────
  useEffect(() => {
    if (!user) return;
    observerEngine.start(onObserverEvent);

    // Listen for manual summon trigger
    const handleSummon = () => {
      const snapshot = observerEngine.snapshot();
      const moment = interpret(snapshot);
      const decision = decide(snapshot, moment);
      const action = decision.action || ACTIONS.ASK;
      const fallback = getFallbackMessage(action);

      setIntervention({
        shouldSpeak: true,
        action,
        tone: decision.tone || "mentor",
        title: fallback.title || "Greetings! I am Daksh 👽",
        body: fallback.body || "I am watching your momentum. Let's build something extraordinary today!",
        ctaText: fallback.cta_text || "Explore Today's Mission",
        ctaAction: fallback.cta_action || "navigate:/",
        relationshipStage: decision.relationshipStage || "GUIDE",
        stageLabel: decision.stageLabel || "Stage 1 — Guide",
        pageRole: decision.pageRole || "Planner",
      });
    };

    window.addEventListener("daksh:summon", handleSummon);

    // Listen for module scroll events to announce modules automatically
    const handleModuleView = (e) => {
      const moduleId = e.detail?.moduleId;
      if (!moduleId) return;

      const MODULE_MESSAGES = {
        // Notes Page Modules
        "module-formulas": {
          action: "REFLECTION_PROMPT",
          title: "Part 1 — Hard Formulas.",
          body: "Review these core equations. Click the recall status on each formula card below to mark what you know!",
          ctaText: "Check Formulas",
          ctaAction: "curiosity:notes",
          shouldSpeak: true,
        },
        "module-rules": {
          action: "ENCOURAGEMENT",
          title: "Part 2 — Rule-Based Logics.",
          body: "These are the fundamental laws governing this concept. Make sure you understand when each rule applies.",
          ctaText: "Review Rules",
          ctaAction: "curiosity:notes",
          shouldSpeak: true,
        },
        "module-consequences": {
          action: "FOCUSED_EXPLAIN",
          title: "Part 3 — Traps & Consequences.",
          body: "Exam questions frequently test these derived consequences. Pay close attention to these traps!",
          ctaText: "Got it",
          ctaAction: "curiosity:notes",
          shouldSpeak: true,
        },

        // Home Page Sections
        "section-hero": {
          action: "IDENTITY_ARRIVAL",
          title: "Study for Exams. Build for Life.",
          body: "Welcome to DakshAI. Learn concepts deeply, remember longer, and discover how they shape the real world.",
          ctaText: "Get Started",
          ctaAction: "navigate:/learn",
          shouldSpeak: true,
        },
        "section-demo": {
          action: "CURIOSITY_PROMPT",
          title: "Interactive Concept Journey.",
          body: "Notice how abstract vectors evolve into drones and Mars rovers? That's how Daksh connects theory to reality.",
          ctaText: "See How It Works",
          ctaAction: "navigate:/learn",
          shouldSpeak: true,
        },
        "section-features": {
          action: "ENCOURAGEMENT",
          title: "Inside DakshAI.",
          body: "Explore your 4 core tools: Today's Mission, Learn & Practice, World Mirror, and Daksh Companion.",
          ctaText: "Explore Tools",
          ctaAction: "navigate:/learn",
          shouldSpeak: true,
        },
        "section-environments": {
          action: "CELEBRATION",
          title: "Atmospheric Focus Spaces.",
          body: "Switch between Galaxy, Forest, Sunrise, and Midnight environments to match your study mood.",
          ctaText: "Choose Atmosphere",
          ctaAction: "navigate:/learn",
          shouldSpeak: true,
        },

        // Growth Page Sections
        "section-growth-forecast": {
          action: "PREDICTION_NARRATIVE",
          title: "Trajectory Forecast.",
          body: "Here is your predicted completion velocity — at this daily pace, you will reach total mastery before target.",
          ctaText: "View Forecast",
          ctaAction: "navigate:/growth",
          shouldSpeak: true,
        },
        "section-growth-mastery": {
          action: "REFLECTION_PROMPT",
          title: "Mind Mastery Breakdown.",
          body: "Here is your live balance between Exam Readiness and Chapter Understanding across all subjects.",
          ctaText: "Review Mastery",
          ctaAction: "navigate:/growth",
          shouldSpeak: true,
        },

        // Profile Page Sections
        "section-profile-pace": {
          action: "ENCOURAGEMENT",
          title: "Companion Guidance Pace.",
          body: "Set how frequently Daksh proactively guides you (0% to 100%). Default is set to 100% maximum guidance!",
          ctaText: "Set Pace",
          ctaAction: "navigate:/profile",
          shouldSpeak: true,
        },
      };

      const msg = MODULE_MESSAGES[moduleId];
      if (msg) {
        setIntervention({
          ...msg,
          stageLabel: "Module Guide",
        });
      }
    };

    window.addEventListener("daksh:module_view", handleModuleView);

    return () => {
      observerEngine.stop();
      window.removeEventListener("daksh:summon", handleSummon);
      window.removeEventListener("daksh:module_view", handleModuleView);
    };
  }, [user, onObserverEvent]);

  // ── Controls ─────────────────────────────────────────────────────────────
  const dismissCatalyst = () => setCatalystDismissed(true);

  const dismissIntervention = () => {
    setIntervention(null);
    observerEngine.recordDismissal();
  };

  const refreshCatalyst = () => {
    if (!user) return;
    axiosClient
      .get("/api/behavior/catalyst/")
      .then((r) => {
        setCatalyst(r.data);
        setCatalystDismissed(false);
      })
      .catch(() => {});
  };

  return (
    <MindModelContext.Provider
      value={{
        // Phase 4
        catalyst,
        catalystLoading,
        catalystDismissed,
        dismissCatalyst,
        refreshCatalyst,
        // Phase 5
        intervention,
        mindProfile,
        dismissIntervention,
        observerEngine, // exposed so pages can call setScrollDepth etc.
      }}
    >
      {children}
    </MindModelContext.Provider>
  );
}

export function useMindModel() {
  return useContext(MindModelContext);
}

