// src/intelligence/curiosity/CuriosityEngine.js
// Curiosity and Challenge Engine (CCE) — Active Recall before Notes.
// Transforms passive reading into interactive curiosity & challenge.

class CuriosityEngine {
  /**
   * Evaluates user recall self-assessment.
   * @param {Array} items - List of items (formulas/rules)
   * @param {Object} selfReport - Map of item index/id to boolean (true = known, false = not sure)
   * @returns {Object} { knownCount, totalCount, ratio, recommendation }
   */
  static evaluateRecall(items = [], selfReport = {}) {
    const total = items.length;
    if (total === 0) {
      return { knownCount: 0, totalCount: 0, ratio: 0, recommendation: "READ_NOTES" };
    }

    let knownCount = 0;
    items.forEach((item, idx) => {
      const key = item.id || idx;
      if (selfReport[key]) {
        knownCount += 1;
      }
    });

    const ratio = knownCount / total;
    let recommendation = "READ_NOTES";
    let message = "Good effort! Take a moment to review the key formulas below.";

    if (ratio === 1) {
      recommendation = "TAKE_QUIZ_DIRECT";
      message = "3/3 perfect confidence! Skip reading and test your speed in a quick challenge.";
    } else if (ratio > 0) {
      recommendation = "TARGETED_QUIZ";
      message = `You know ${knownCount}/${total}. Let's focus your quick check on what's left.`;
    } else {
      recommendation = "READ_NOTES";
      message = "Zero pressure! Now you know exactly what to look for in the notes below.";
    }

    return {
      knownCount,
      totalCount: total,
      ratio,
      recommendation,
      message,
    };
  }
}

export default CuriosityEngine;
