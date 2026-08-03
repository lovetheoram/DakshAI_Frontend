// src/context/ExperienceContext.jsx
// ExperienceContext — Passive distributor of experience state across DakshAI.
// Consumes outputs from ExperienceInterpreter (interpreter.js) and exposes context to components.

import React, { createContext, useContext, useState, useCallback, useMemo } from "react";
import ExperienceInterpreter from "../experience/interpreter";

const ExperienceContext = createContext(null);

export function ExperienceProvider({ children }) {
  const [sessionContext, setSessionContext] = useState({
    consecutiveFailures: 0,
    isFinished: false,
    activeThemeKey: "classic",
  });

  // Evaluate current experience state
  const currentExperience = useMemo(() => {
    return ExperienceInterpreter.interpretExperience(sessionContext);
  }, [sessionContext]);

  // Telemetry updates from components
  const updateSessionContext = useCallback((updates) => {
    setSessionContext((prev) => ({ ...prev, ...updates }));
  }, []);

  const value = useMemo(
    () => ({
      ...currentExperience,
      updateSessionContext,
    }),
    [currentExperience, updateSessionContext]
  );

  return (
    <ExperienceContext.Provider value={value}>
      {children}
    </ExperienceContext.Provider>
  );
}

export function useExperience() {
  const ctx = useContext(ExperienceContext);
  if (!ctx) {
    // Return fallback focused state if called outside provider
    return ExperienceInterpreter.interpretExperience();
  }
  return ctx;
}
