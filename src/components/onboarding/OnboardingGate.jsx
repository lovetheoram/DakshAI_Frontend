// src/components/onboarding/OnboardingGate.jsx
// Decides whether to show DakshOnboarding or the normal dashboard.
// Condition: user is logged in, has no goal, and hasn't completed onboarding yet.

import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import DakshOnboarding from "./DakshOnboarding";

const STORAGE_KEY = "daksh_onboarding_done";

export function hasCompletedOnboarding() {
  return localStorage.getItem(STORAGE_KEY) === "true";
}

export function markOnboardingDone() {
  localStorage.setItem(STORAGE_KEY, "true");
}

/**
 * Wraps any page. If the user needs onboarding, renders DakshOnboarding
 * fullscreen and calls onComplete when done. Otherwise renders children normally.
 *
 * Props:
 *   dashboard  — from progressApi.getDashboard()
 *   exams      — from syllabusApi.getTree().exams
 *   onComplete — called after onboarding finishes (to reload dashboard data)
 *   children   — the normal page content
 */
export default function OnboardingGate({ dashboard, exams, onComplete, children }) {
  const { user } = useContext(AuthContext);
  const [forceDone, setForceDone] = useState(false);

  const needsOnboarding =
    user &&
    !dashboard?.goal &&
    !hasCompletedOnboarding() &&
    !forceDone;

  if (needsOnboarding) {
    return (
      <DakshOnboarding
        exams={exams || []}
        onComplete={() => {
          markOnboardingDone();
          setForceDone(true);
          if (onComplete) onComplete();
        }}
      />
    );
  }

  return <>{children}</>;
}
