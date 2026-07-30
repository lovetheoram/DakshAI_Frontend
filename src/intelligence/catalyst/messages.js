// src/intelligence/catalyst/messages.js
// Local fallback Catalyst messages — used when API is unavailable or on cold start.

export const LOCAL_CATALYST_MESSAGES = {
  CURIOSITY_PROMPT: {
    title: "Before we begin.",
    body: "Can I ask you something before we start? Without looking — how many of these formulas do you think you already know?",
    cta_text: "Let me check",
    cta_action: "curiosity:notes",
  },
  DIRECT_CHALLENGE: {
    title: "Ready to prove your mastery?",
    body: "Five questions ahead. Don't worry about the score — I'm watching how you think under pressure.",
    cta_text: "Start Challenge",
    cta_action: "navigate:/learn",
  },
  ENCOURAGEMENT: {
    title: "One step at a time.",
    body: "This concept used to feel difficult. Focus on understanding one core idea first — you don't need to conquer all of it today.",
    cta_text: "Focus on Foundation",
    cta_action: "navigate:/learn",
  },
  CELEBRATION: {
    title: "Breakthrough achieved!",
    body: "You just conquered this concept! Your knowledge universe has expanded. Every step builds true independence.",
    cta_text: "Keep Momentum",
    cta_action: "navigate:/learn",
  },
  FOCUSED_EXPLAIN: {
    title: "I noticed something.",
    body: "Your brain isn't weak here — one foundation piece is missing. When we repair it, everything else will click.",
    cta_text: "Repair Foundation",
    cta_action: "navigate:/learn",
  },
  REFLECTION_PROMPT: {
    title: "Active Recall Coach.",
    body: "Can you derive these formulas from memory, or explain this idea in your own words without looking?",
    cta_text: "Try Recalling",
    cta_action: "curiosity:notes",
  },
  PREDICTION_NARRATIVE: {
    title: "Welcome to your Study Universe.",
    body: "Pick a subject or concept below to start building your foundation. Where would you like to begin today?",
    cta_text: "Explore Syllabus",
    cta_action: "navigate:/learn",
  },
  IDENTITY_ARRIVAL: {
    title: "Daily Focus Ritual.",
    body: "How is your fuel and focus today? Logging your energy helps me tune your daily study load to match your state.",
    cta_text: "Log Today's Energy",
    cta_action: "navigate:/growth",
  },
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
  LOW_ENERGY: {
    title: "Energy scan complete.",
    body: "I detect low fuel today. Choose one small concept — not ten. One deep understanding built on low energy is worth more than ten shallow attempts.",
    cta_text: "One Concept Today",
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
