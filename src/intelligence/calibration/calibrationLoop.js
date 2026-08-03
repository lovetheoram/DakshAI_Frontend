// src/intelligence/calibration/calibrationLoop.js
// Intelligence Calibration Loop — Measures recommendation acceptance & outcome performance.

const CALIBRATION_LOG_KEY = "daksh_calibration_loop_v1";

export class CalibrationLoop {
  static recordOutcome(recommendationType, outcome = "ACCEPTED", metadata = {}) {
    try {
      const existing = JSON.parse(localStorage.getItem(CALIBRATION_LOG_KEY) || "[]");
      const record = {
        recommendationType,
        outcome, // 'ACCEPTED' | 'DISMISSED' | 'IGNORED'
        timestamp: new Date().toISOString(),
        metadata,
      };
      const updated = [record, ...existing].slice(0, 100);
      localStorage.setItem(CALIBRATION_LOG_KEY, JSON.stringify(updated));
    } catch (err) {
      console.error("Failed to log calibration outcome:", err);
    }
  }

  static getAcceptanceRate(recommendationType) {
    try {
      const history = JSON.parse(localStorage.getItem(CALIBRATION_LOG_KEY) || "[]");
      const filtered = history.filter((h) => h.recommendationType === recommendationType);
      if (filtered.length === 0) return 1.0;

      const accepted = filtered.filter((h) => h.outcome === "ACCEPTED").length;
      return accepted / filtered.length;
    } catch {
      return 1.0;
    }
  }
}

export default CalibrationLoop;
