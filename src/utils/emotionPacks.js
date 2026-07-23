// src/utils/emotionPacks.js

export const GREETING_PACKS = {
  morning: [
    "Good morning. Let's build something today.",
    "One chapter today is better than none.",
    "Morning! Great time to sharpen your concepts.",
    "Small steps this morning add up fast.",
  ],
  afternoon: [
    "Good afternoon. Ready for today's mission?",
    "Welcome back. Let's keep the momentum going.",
    "A quick session now will set up a great evening.",
    "Consistency is becoming your superpower.",
  ],
  evening: [
    "Good evening. Time for a calm review session.",
    "Your future self will thank you for this time.",
    "Wrapping up the day with deep learning.",
    "Focus mode on. Let's dive in.",
  ],
  welcomeBack: [
    "Welcome back. Let's start with something easy.",
    "Glad to see you again. Progress beats perfection.",
    "Ready when you are. Step by step.",
  ],
};

export const QUIZ_FEEDBACK_PACKS = {
  perfect: [
    "Excellent precision! Ready to challenge yourself with something harder?",
    "Mastery demonstrated! You've really grasped this core concept.",
    "Flawless score! Your recall is razor-sharp today.",
  ],
  good: [
    "Solid performance! You've got the core principles down.",
    "Great effort! A quick review will make this 100%.",
    "Consistency pays off! Keep building on this foundation.",
  ],
  tough: [
    "Tough session. That's where improvement begins.",
    "Mistakes are where memory grows. Review the notes and try again.",
    "No stress — every struggle strengthens your brain's neural connections.",
  ],
};

export const CURIOSITY_CARDS = [
  {
    topic: "Physics",
    fact: "🌍 Did you know? NASA uses Newton's Third Law (action-reaction) to stabilize spacecraft in deep space vacuum.",
  },
  {
    topic: "Chemistry",
    fact: "🧪 Did you know? Diamond and graphite are made of the exact same carbon atoms — only their crystal geometry differs!",
  },
  {
    topic: "Mathematics",
    fact: "📐 Did you know? The Fibonacci sequence describes natural spirals found in sunflower seeds, pinecones, and galaxies.",
  },
  {
    topic: "Biology",
    fact: "🧬 Did you know? A single human cell contains about 2 meters of DNA tightly coiled inside its nucleus.",
  },
  {
    topic: "Computer Science",
    fact: "💻 Did you know? Binary numbers (0s and 1s) are inspired by Boolean logic created back in 1847 by George Boole.",
  },
];

export const IDENTITY_TITLES = [
  {
    id: "scholar",
    title: "Scholar",
    icon: "📜",
    themeId: "sunrise",
    themeName: "Sunrise Theme",
    requirement: "Complete 1st Daily Target",
    description: "Consistent learner building daily momentum.",
    checkUnlock: (stats) => stats.completedTargets >= 1 || stats.streak >= 1,
  },
  {
    id: "researcher",
    title: "Researcher",
    icon: "🌲",
    themeId: "forest",
    themeName: "Forest Theme",
    requirement: "Complete 10 Practice Sessions",
    description: "Deep focus explorer devoted to mastering concepts.",
    checkUnlock: (stats) => stats.totalAttempts >= 10 || stats.questionsSolved >= 20,
  },
  {
    id: "builder",
    title: "Builder",
    icon: "🛠️",
    themeId: "candy",
    themeName: "Candy Theme",
    requirement: "Maintain a 3-Day Streak",
    description: "Active creator crafting structured concept notes.",
    checkUnlock: (stats) => stats.streak >= 3,
  },
  {
    id: "explorer",
    title: "Explorer",
    icon: "🌌",
    themeId: "galaxy",
    themeName: "Galaxy Theme",
    requirement: "Master 5 Concepts",
    description: "Curious space discoverer navigating the Knowledge Galaxy.",
    checkUnlock: (stats) => stats.masteredConcepts >= 5,
  },
  {
    id: "innovator",
    title: "Innovator",
    icon: "💡",
    themeId: "midnight",
    themeName: "Midnight Theme",
    requirement: "Earn 1,000 XP (or 7-Day Streak)",
    description: "Courageous problem solver achieving high exam readiness.",
    checkUnlock: (stats) => stats.xp >= 1000 || stats.streak >= 7,
  },
];

export function getRandomMessage(packArray = []) {
  if (!packArray.length) return "";
  const idx = Math.floor(Math.random() * packArray.length);
  return packArray[idx];
}
