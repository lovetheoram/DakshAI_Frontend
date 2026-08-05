// src/intelligence/learner_state/learnerStateBuilder.js
// Learner State Model — Builds unified learner state from verified DB API evidence.

export class LearnerStateBuilder {
  static buildState(dashboardData = {}, streakStats = {}) {
    const streak = streakStats?.current_streak ?? dashboardData?.weekly_completed_count ?? 0;
    const accuracyGain = dashboardData?.accuracy_gain ?? 0;
    const decayAlerts = dashboardData?.decay_alerts || [];

    let confidenceState = "Stable";
    if (accuracyGain >= 15) {
      confidenceState = "Growing (+15% Hard Accuracy)";
    } else if (accuracyGain < 0) {
      confidenceState = "Needs Support";
    }

    let knowledgeState = "Developing";
    const overallScore = dashboardData?.overall_score ?? 0;
    if (overallScore >= 80) {
      knowledgeState = "Advanced";
    } else if (overallScore >= 50) {
      knowledgeState = "Proficient";
    }

    return {
      knowledge_state: knowledgeState,
      confidence_state: confidenceState,
      consistency_streak: streak,
      momentum_score: Math.min(100, streak * 20),
      decay_risk_count: decayAlerts.length,
      struggle_patterns: dashboardData?.struggle_topics || [],
      lastActiveDate: dashboardData?.last_active_date || new Date().toISOString(),
    };
  }
}

export default LearnerStateBuilder;
