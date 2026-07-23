// src/context/InteractionContext.jsx
import React, { createContext, useState, useContext } from "react";
import { contextMemory } from "../utils/contextMemory";

export const InteractionContext = createContext();

const STEP_SEQUENCE = ["understand", "practice", "review", "notes", "spark", "summary"];

const DEFAULT_SESSION = {
  conceptId: "1",
  conceptName: "Electricity & Circuits",
  chapterName: "Physics · Chapter 3",
  progress: 65,
  step: "understand",
  sessionGoal: {
    title: "Understand Electricity & Circuits",
    estimatedMinutes: 18,
    difficulty: "Medium",
  },
  metrics: {
    questionsSolved: 25,
    mistakesFixed: 8,
  },
  sparkTitle: "NASA Spacecraft Physics & Newton's Laws",
  nextConceptName: "Magnetism & Magnetic Fields",
};

export function InteractionProvider({ children }) {
  const [focusMode, setFocusMode] = useState(false);
  const [activeSession, setActiveSession] = useState(() => {
    const last = contextMemory?.getLastConcept ? contextMemory.getLastConcept() : {};
    return {
      conceptId: last?.conceptId || "1",
      conceptName: last?.conceptName || "Electricity & Circuits",
      chapterName: last?.chapterName || "Physics · Chapter 3",
      progress: last?.progress || 65,
      step: "understand",
      sessionGoal: {
        title: `Understand ${last?.conceptName || "Electricity & Circuits"}`,
        estimatedMinutes: 18,
        difficulty: "Medium",
      },
      metrics: {
        questionsSolved: 25,
        mistakesFixed: 8,
      },
      sparkTitle: "NASA Spacecraft Physics & Newton's Laws",
      nextConceptName: "Magnetism & Magnetic Fields",
    };
  });

  const toggleFocusMode = () => setFocusMode((prev) => !prev);

  const startConceptSession = (conceptId, conceptName = "Electricity & Circuits", chapterName = "Physics · Chapter 3") => {
    if (contextMemory?.saveLastConcept) {
      contextMemory.saveLastConcept(conceptId, conceptName, chapterName);
    }
    setActiveSession({
      conceptId,
      conceptName,
      chapterName,
      progress: 65,
      step: "understand",
      sessionGoal: {
        title: `Understand ${conceptName}`,
        estimatedMinutes: 18,
        difficulty: "Medium",
      },
      metrics: {
        questionsSolved: 25,
        mistakesFixed: 8,
      },
      sparkTitle: "NASA Spacecraft Physics & Newton's Laws",
      nextConceptName: "Magnetism & Magnetic Fields",
    });
  };

  const setSessionStep = (stepName) => {
    if (STEP_SEQUENCE.includes(stepName)) {
      setActiveSession((prev) => ({ ...prev, step: stepName }));
    }
  };

  const nextSessionStep = () => {
    setActiveSession((prev) => {
      const currentIndex = STEP_SEQUENCE.indexOf(prev.step);
      if (currentIndex < STEP_SEQUENCE.length - 1) {
        return { ...prev, step: STEP_SEQUENCE[currentIndex + 1] };
      }
      return prev;
    });
  };

  const finishSession = () => {
    setActiveSession((prev) => ({ ...prev, step: "summary", progress: 100 }));
  };

  return (
    <InteractionContext.Provider
      value={{
        focusMode,
        setFocusMode,
        toggleFocusMode,
        activeSession,
        startConceptSession,
        setSessionStep,
        nextSessionStep,
        finishSession,
        STEP_SEQUENCE,
      }}
    >
      {children}
    </InteractionContext.Provider>
  );
}

export function useInteraction() {
  const context = useContext(InteractionContext);
  if (!context) {
    return {
      focusMode: false,
      setFocusMode: () => {},
      toggleFocusMode: () => {},
      activeSession: DEFAULT_SESSION,
      startConceptSession: () => {},
      setSessionStep: () => {},
      nextSessionStep: () => {},
      finishSession: () => {},
      STEP_SEQUENCE,
    };
  }
  return context;
}
