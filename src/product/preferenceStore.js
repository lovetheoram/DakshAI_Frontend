// src/product/preferenceStore.js
// Product Reliability Layer — Manages persistent user preferences & accessibility settings.

const PREFERENCES_KEY = "daksh_product_preferences_v1";

export const DEFAULT_PREFERENCES = {
  activeThemeKey: "classic",
  motionIntensity: "standard", // 'standard' | 'reduced'
  mentorIntensity: "balanced", // 'low' | 'balanced' | 'guided'
  annoyanceDismissals: {},     // { [interventionType]: dismissalCount }
};

export class PreferenceStore {
  static getPreferences() {
    try {
      const saved = localStorage.getItem(PREFERENCES_KEY);
      return saved ? { ...DEFAULT_PREFERENCES, ...JSON.parse(saved) } : DEFAULT_PREFERENCES;
    } catch {
      return DEFAULT_PREFERENCES;
    }
  }

  static updatePreferences(updates = {}) {
    try {
      const current = PreferenceStore.getPreferences();
      const updated = { ...current, ...updates };
      localStorage.setItem(PREFERENCES_KEY, JSON.stringify(updated));
      return updated;
    } catch (err) {
      console.error("Failed to update preferences:", err);
      return DEFAULT_PREFERENCES;
    }
  }

  static recordDismissal(interventionType) {
    const prefs = PreferenceStore.getPreferences();
    const currentCount = prefs.annoyanceDismissals[interventionType] || 0;
    const updatedDismissals = {
      ...prefs.annoyanceDismissals,
      [interventionType]: currentCount + 1,
    };
    PreferenceStore.updatePreferences({ annoyanceDismissals: updatedDismissals });
  }

  static isAnnoyanceBlocked(interventionType) {
    const prefs = PreferenceStore.getPreferences();
    return (prefs.annoyanceDismissals[interventionType] || 0) >= 2;
  }
}

export default PreferenceStore;
