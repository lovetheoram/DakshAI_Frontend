// src/intelligence/trajectory/progressPredictor.js
// Trajectory Intelligence — Reports verifiable behavioral trends without anxiety predictions.

export class ProgressPredictor {
  static evaluateTrajectory(dashboardData = {}, streakStats = {}) {
    const streak = streakStats?.current_streak ?? dashboardData?.weekly_completed_count ?? 0;

    if (streak >= 3) {
      return {
        trajectoryStatus: "STABLE_MOMENTUM",
        headline: "Consistent Mastery Momentum",
        body: `Recent evidence: You maintained a ${streak}-day study streak. Maintain your current pace.`,
        supportingEvidence: `${streak} completed journeys this week.`,
      };
    }

    return {
      trajectoryStatus: "BUILDING_FOUNDATION",
      headline: "Building Study Continuity",
      body: "One concept completed today maintains your study momentum. Every journey counts.",
      supportingEvidence: "Active preparation plan.",
    };
  }
}

export default ProgressPredictor;
