// src/utils/contextMemory.js

const MEMORY_KEYS = {
  LAST_CONCEPT: "daksh_last_concept",
  LAST_QUIZ: "daksh_last_quiz",
  USER_FILTERS: "daksh_user_filters",
  PREFERRED_SUBJECT: "daksh_preferred_subject",
};

export const contextMemory = {
  saveLastConcept: (conceptId, conceptName, chapterName = "Physics") => {
    try {
      const data = { conceptId, conceptName, chapterName, timestamp: Date.now() };
      localStorage.setItem(MEMORY_KEYS.LAST_CONCEPT, JSON.stringify(data));
    } catch (e) {
      // Memory fallback
    }
  },

  getLastConcept: () => {
    try {
      const item = localStorage.getItem(MEMORY_KEYS.LAST_CONCEPT);
      return item ? JSON.parse(item) : { conceptId: "1", conceptName: "Electricity & Circuits", chapterName: "Physics" };
    } catch (e) {
      return { conceptId: "1", conceptName: "Electricity & Circuits", chapterName: "Physics" };
    }
  },

  savePreferredSubject: (subjectName) => {
    try {
      localStorage.setItem(MEMORY_KEYS.PREFERRED_SUBJECT, subjectName);
    } catch (e) {}
  },

  getPreferredSubject: () => {
    try {
      return localStorage.getItem(MEMORY_KEYS.PREFERRED_SUBJECT) || "Physics";
    } catch (e) {
      return "Physics";
    }
  },

  getRecommendedAction: (userDashboard = {}) => {
    const lastConcept = contextMemory.getLastConcept();
    const streak = userDashboard?.streak?.current_streak || 0;

    if (streak === 0) {
      return {
        type: "START_DAILY_MISSION",
        title: "Start Today's Mission",
        subtitle: "10-minute session to protect your daily learning streak",
        conceptId: lastConcept.conceptId,
        conceptName: lastConcept.conceptName,
        actionText: "Begin Mission (10 min)",
      };
    }

    return {
      type: "RESUME_CONCEPT",
      title: `Resume: ${lastConcept.conceptName}`,
      subtitle: "Pick up right where you left off in your current session",
      conceptId: lastConcept.conceptId,
      conceptName: lastConcept.conceptName,
      actionText: "Continue Session",
    };
  },
};
