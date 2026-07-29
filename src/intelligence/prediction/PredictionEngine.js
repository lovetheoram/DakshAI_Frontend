// src/intelligence/prediction/PredictionEngine.js
// Prediction Engine — Converts raw metrics and target dates into a data-as-a-story narrative.

class PredictionEngine {
  /**
   * Narrate current goal velocity and completion projection.
   * @param {Object} predictionData - { targetDate, predictedFinishDate, daysDelta, dailyMinutes, status }
   * @param {string} tone - "mentor" | "challenger" | "companion"
   * @returns {Object} { headline, body, ctaText, ctaAction, deltaType }
   */
  static narrate(predictionData = {}, tone = "companion") {
    const {
      targetDate = "Target Date",
      predictedFinishDate = "March 18",
      daysDelta = 0,
      dailyMinutes = 20,
      status = "on_track", // "behind" | "ahead" | "on_track"
    } = predictionData;

    const isBehind = daysDelta > 0 || status === "behind";
    const isAhead = daysDelta < 0 || status === "ahead";
    const absDays = Math.abs(daysDelta);

    if (isBehind) {
      if (tone === "challenger") {
        return {
          headline: "Gap Detected.",
          body: `${absDays} days behind schedule. Pushing +15 mins daily closes this gap completely by ${targetDate}.`,
          ctaText: "Accelerate Plan (+15m/day)",
          ctaAction: "growth:adjust_add_15",
          deltaType: "behind",
        };
      }
      if (tone === "mentor") {
        return {
          headline: "Gentle Course Correction",
          body: `At your current pace of ${dailyMinutes}m/day, you'll complete your syllabus around ${predictedFinishDate} (${absDays} days past target). 12 extra minutes a day brings you right back on track.`,
          ctaText: "Adjust Schedule (+12m)",
          ctaAction: "growth:adjust_add_12",
          deltaType: "behind",
        };
      }
      // companion
      return {
        headline: "Let's align your trajectory.",
        body: `You are currently ${absDays} days behind your target completion. A small 10-minute adjustment keeps your momentum healthy.`,
        ctaText: "Adjust Daily Goal",
        ctaAction: "growth:adjust_add_10",
        deltaType: "behind",
      };
    }

    if (isAhead) {
      return {
        headline: "Ahead of Schedule! 🚀",
        body: `You are ${absDays} days ahead of target (${predictedFinishDate}). Excellent momentum! Use this buffer to repair weak areas.`,
        ctaText: "Redirect to Fear Areas",
        ctaAction: "navigate:/learn",
        deltaType: "ahead",
      };
    }

    // On Track
    return {
      headline: "Pace Locked & Synchronized.",
      body: `You are perfectly on track to finish by ${predictedFinishDate}. Today's ${dailyMinutes}m session keeps your trajectory solid.`,
      ctaText: "Start Today's Session",
      ctaAction: "navigate:/learn",
      deltaType: "on_track",
    };
  }
}

export default PredictionEngine;
