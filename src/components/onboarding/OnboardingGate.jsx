// src/components/onboarding/OnboardingGate.jsx
// Controls the Welcomer flow for new users.
// Ensures every newly signed up or logged in user who has not been welcomed
// or has no goal set is greeted by the Welcomer to set their Target Date & Promise.

import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import DakshOnboarding from "./DakshOnboarding";

export default function OnboardingGate({ dashboard, exams, onComplete, children }) {
  const { user } = useContext(AuthContext);
  const [forceDone, setForceDone] = useState(false);

  // User-scoped key ensures each user account is treated individually
  const userKey = user ? (user.id || user.username) : null;
  const hasBeenWelcomed = userKey ? localStorage.getItem(`daksh_welcomed_${userKey}`) === "true" : false;

  // A user needs the Welcomer if:
  // 1. User is authenticated
  // 2. Has not completed their welcoming session (!hasBeenWelcomed) OR has no active goal (!dashboard?.goal)
  // 3. Has not skipped in current memory session (!forceDone)
  const needsOnboarding =
    Boolean(user) &&
    dashboard !== null &&
    (!hasBeenWelcomed || !dashboard?.goal) &&
    !forceDone;

  if (needsOnboarding) {
    return (
      <DakshOnboarding
        exams={exams || []}
        existingGoal={dashboard?.goal}
        onComplete={() => {
          if (userKey) {
            localStorage.setItem(`daksh_welcomed_${userKey}`, "true");
          }
          localStorage.setItem("daksh_onboarding_done", "true");
          setForceDone(true);
          if (onComplete) onComplete();
        }}
      />
    );
  }

  return <>{children}</>;
}
