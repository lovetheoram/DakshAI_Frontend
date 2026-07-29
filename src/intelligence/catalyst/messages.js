// src/intelligence/catalyst/messages.js
// Local fallback Catalyst messages — used when API is unavailable or on cold start.
// Mirrors the seed data in seed_catalyst_messages.py.

export const LOCAL_CATALYST_MESSAGES = {
  FIRST_LOGIN: {
    title: "Transmission received.",
    body: "Hello, explorer. I am Daksh. I have been waiting for someone who wants to upgrade their mind. Your journey starts now — and I will be with you for all of it.",
    cta_text: "Begin Journey",
    cta_action: "navigate:/learn",
  },
  RETURN_AFTER_BREAK: {
    title: "Explorer detected.",
    body: "Your ship was quiet for a while. No damage detected — your knowledge is intact. The universe has been waiting. Shall we restart the engines?",
    cta_text: "Restart Engines",
    cta_action: "navigate:/learn",
  },
  QUIZ_FAILED_REPEAT: {
    title: "I noticed something.",
    body: "Your brain is not weak here. This concept is missing one foundation piece. When we find it, everything else will click. Let's repair it — together.",
    cta_text: "Repair Foundation",
    cta_action: "navigate:/learn",
  },
  CONCEPT_MASTERED: {
    title: "Signal received.",
    body: "You just conquered this concept. Your knowledge universe grew stronger. A new path has opened — and it leads somewhere worth exploring.",
    cta_text: "Explore Next",
    cta_action: "navigate:/learn",
  },
  STREAK_MILESTONE: {
    title: "Consistency detected.",
    body: "You have studied for consecutive days without stopping. Momentum is a rare force in the universe. You have it. Do not waste it.",
    cta_text: "Keep Going",
    cta_action: "navigate:/learn",
  },
  AT_RISK: {
    title: "Transmission incoming.",
    body: "Your universe has been quiet. I am detecting signal loss. Even 10 minutes today restores the connection and protects what you have already built.",
    cta_text: "Restore Signal",
    cta_action: "navigate:/learn",
  },
  LOW_ENERGY: {
    title: "Energy scan complete.",
    body: "I detect low fuel today. Choose one small concept — not ten. One deep understanding built on low energy is worth more than ten shallow attempts.",
    cta_text: "One Concept Today",
    cta_action: "navigate:/learn",
  },
  THRIVING: {
    title: "Outstanding signal.",
    body: "Your knowledge field is expanding rapidly. You are operating at one of the highest levels I have observed. Keep this pace.",
    cta_text: "Push Further",
    cta_action: "navigate:/learn",
  },
  DAILY_TARGET_HIT: {
    title: "Mission complete.",
    body: "Today's target reached. Everything beyond this point is bonus momentum. Most learners stop here. You do not have to.",
    cta_text: "Go Beyond",
    cta_action: "navigate:/learn",
  },
  GOAL_SET: {
    title: "Mission coordinates locked.",
    body: "Your target has been set. I have computed your path. The journey ahead is real — and every day you study brings it closer. Let's begin.",
    cta_text: "Start First Session",
    cta_action: "navigate:/learn",
  },
  GENERIC_INSIGHT: {
    title: "Observation.",
    body: "Consistency beats intensity. One focused session every day builds more knowledge than five exhausting ones per week.",
    cta_text: "Begin Session",
    cta_action: "navigate:/learn",
  },
};

export function getFallbackMessage(trigger = "GENERIC_INSIGHT") {
  return LOCAL_CATALYST_MESSAGES[trigger] || LOCAL_CATALYST_MESSAGES.GENERIC_INSIGHT;
}
