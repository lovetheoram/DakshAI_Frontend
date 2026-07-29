// src/context/MindModelContext.jsx
// Global context that holds the current Catalyst message and mind profile.
// Fetched once on login, dismissible per-session.

import React, { createContext, useState, useEffect, useContext } from "react";
import { AuthContext } from "./AuthContext";
import axiosClient from "../api/axiosClient";
import { getFallbackMessage } from "../intelligence/catalyst/messages";

export const MindModelContext = createContext();

export function MindModelProvider({ children }) {
  const { user } = useContext(AuthContext);
  const [catalyst, setCatalyst] = useState(null);
  const [catalystLoading, setCatalystLoading] = useState(false);
  const [catalystDismissed, setCatalystDismissed] = useState(false);

  useEffect(() => {
    if (!user) {
      setCatalyst(null);
      setCatalystDismissed(false);
      return;
    }

    setCatalystLoading(true);
    axiosClient
      .get("/api/behavior/catalyst/")
      .then((r) => {
        setCatalyst(r.data);
      })
      .catch(() => {
        // Fallback to local message on API failure
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
  }, [user]);

  const dismissCatalyst = () => setCatalystDismissed(true);

  // Refresh catalyst (call after significant events — e.g. goal set, quiz complete)
  const refreshCatalyst = () => {
    if (!user) return;
    axiosClient
      .get("/api/behavior/catalyst/")
      .then((r) => {
        setCatalyst(r.data);
        setCatalystDismissed(false); // Un-dismiss so new message shows
      })
      .catch(() => {});
  };

  return (
    <MindModelContext.Provider
      value={{
        catalyst,
        catalystLoading,
        catalystDismissed,
        dismissCatalyst,
        refreshCatalyst,
      }}
    >
      {children}
    </MindModelContext.Provider>
  );
}

export function useMindModel() {
  return useContext(MindModelContext);
}
