// src/product/frictionSignals.js
// Product Reliability Layer — Measures interaction friction without personal tracking.

const FRICTION_LOG_KEY = "daksh_friction_signals_v1";

export class FrictionSignals {
  static recordSignal(signalType, metadata = {}) {
    try {
      const existing = JSON.parse(localStorage.getItem(FRICTION_LOG_KEY) || "[]");
      const newSignal = {
        signalType, // 'ABANDONED_JOURNEY' | 'REPEATED_BACK_NAV' | 'ERROR_ENCOUNTERED'
        timestamp: new Date().toISOString(),
        metadata,
      };
      const updated = [newSignal, ...existing].slice(0, 50); // Keep last 50 signals
      localStorage.setItem(FRICTION_LOG_KEY, JSON.stringify(updated));
    } catch (err) {
      console.error("Failed to record friction signal:", err);
    }
  }

  static getFrictionHistory() {
    try {
      return JSON.parse(localStorage.getItem(FRICTION_LOG_KEY) || "[]");
    } catch {
      return [];
    }
  }
}

export default FrictionSignals;
