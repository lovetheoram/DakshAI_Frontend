// src/intelligence/memory/decayPredictor.js
// Memory Intelligence Protection System — Identifies concepts with increasing decay risk.

export class DecayPredictor {
  static predictDecayRisks(concepts = []) {
    if (!Array.isArray(concepts) || concepts.length === 0) return [];

    return concepts
      .filter((c) => {
        const mastery = c.mastery ?? c.efficiency ?? 100;
        const daysInactive = c.days_inactive ?? c.daysInactive ?? 0;
        // Risk condition: Mastery < 70 OR inactive > 7 days
        return mastery < 70 || daysInactive > 7;
      })
      .map((c) => ({
        id: c.id,
        name: c.name || c.title || "Concept",
        mastery: Math.round(c.mastery ?? c.efficiency ?? 60),
        daysInactive: c.days_inactive ?? c.daysInactive ?? 7,
        recommendedRevisionTime: 15, // Standardized 15-min revision window
      }));
  }
}

export default DecayPredictor;
