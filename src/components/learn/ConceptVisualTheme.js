// src/components/learn/ConceptVisualTheme.js

export const RANDOM_STEM_ICONS = [
  "⚡", "🧲", "🌊", "🚀", "🧪", "💡", "⚛️", "🔭", 
  "🧬", "🔮", "💎", "🔋", "🌌", "📐", "🧮", "🧩", 
  "🪐", "🛰️", "⚙️", "🔥", "🎯", "📊", "🌡️", "🔬"
];

export function getConceptIcon(conceptName = "", conceptId = 0) {
  if (!conceptName) return "💎";
  
  const text = conceptName.toLowerCase();
  if (text.includes("electric") || text.includes("current") || text.includes("charge") || text.includes("potential")) return "⚡";
  if (text.includes("magnet") || text.includes("solenoid") || text.includes("magnetic")) return "🧲";
  if (text.includes("wave") || text.includes("sound") || text.includes("frequency") || text.includes("oscillation")) return "🌊";
  if (text.includes("space") || text.includes("gravit") || text.includes("orbit") || text.includes("satellite")) return "🚀";
  if (text.includes("chem") || text.includes("acid") || text.includes("base") || text.includes("reaction") || text.includes("bond")) return "🧪";
  if (text.includes("light") || text.includes("optic") || text.includes("lens") || text.includes("mirror") || text.includes("refract")) return "💡";
  if (text.includes("atom") || text.includes("nuclear") || text.includes("particle") || text.includes("quantum")) return "⚛️";
  if (text.includes("cell") || text.includes("gene") || text.includes("dna") || text.includes("bio")) return "🧬";
  if (text.includes("math") || text.includes("matrix") || text.includes("calculus") || text.includes("equation") || text.includes("function")) return "📐";
  if (text.includes("set") || text.includes("relation") || text.includes("probability")) return "📊";

  // Deterministic hash for all other concepts
  let hash = 0;
  const str = `${conceptName}-${conceptId}`;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % RANDOM_STEM_ICONS.length;
  return RANDOM_STEM_ICONS[index];
}

export const CONCEPT_THEMES = {
  electricity: {
    icon: "⚡",
    name: "Electricity",
    badge: "Physics",
    primaryColor: "#3b82f6", // Blue
    accentColor: "#eab308",  // Yellow
    glowColor: "rgba(59, 130, 246, 0.3)",
    gradient: "linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(234, 179, 8, 0.15) 100%)",
    headerBg: "from-blue-600/20 via-yellow-500/10 to-transparent",
    borderGlow: "border-blue-500/30",
    pillBg: "bg-blue-500/10 text-yellow-300 border-blue-500/30",
  },
  magnetism: {
    icon: "🧲",
    name: "Magnetism",
    badge: "Physics",
    primaryColor: "#a855f7", // Purple
    accentColor: "#ec4899",  // Pink
    glowColor: "rgba(168, 85, 247, 0.3)",
    gradient: "linear-gradient(135deg, rgba(168, 85, 247, 0.2) 0%, rgba(236, 72, 153, 0.15) 100%)",
    headerBg: "from-purple-600/20 via-pink-500/10 to-transparent",
    borderGlow: "border-purple-500/30",
    pillBg: "bg-purple-500/10 text-purple-300 border-purple-500/30",
  },
  waves: {
    icon: "🌊",
    name: "Waves & Sound",
    badge: "Physics",
    primaryColor: "#06b6d4", // Cyan
    accentColor: "#3b82f6",  // Blue
    glowColor: "rgba(6, 182, 212, 0.3)",
    gradient: "linear-gradient(135deg, rgba(6, 182, 212, 0.2) 0%, rgba(59, 130, 246, 0.15) 100%)",
    headerBg: "from-cyan-600/20 via-blue-500/10 to-transparent",
    borderGlow: "border-cyan-500/30",
    pillBg: "bg-cyan-500/10 text-cyan-300 border-cyan-500/30",
  },
  space: {
    icon: "🚀",
    name: "Space & Gravitation",
    badge: "Astronomy",
    primaryColor: "#6366f1", // Indigo
    accentColor: "#a855f7",  // Purple
    glowColor: "rgba(99, 102, 241, 0.3)",
    gradient: "linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(99, 102, 241, 0.2) 100%)",
    headerBg: "from-indigo-900/40 via-purple-900/20 to-transparent",
    borderGlow: "border-indigo-500/30",
    pillBg: "bg-indigo-500/10 text-indigo-300 border-indigo-500/30",
  },
  chemistry: {
    icon: "🧪",
    name: "Chemistry",
    badge: "Chemistry",
    primaryColor: "#10b981", // Emerald
    accentColor: "#34d399",  // Mint
    glowColor: "rgba(16, 185, 129, 0.3)",
    gradient: "linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(52, 211, 153, 0.15) 100%)",
    headerBg: "from-emerald-600/20 via-teal-500/10 to-transparent",
    borderGlow: "border-emerald-500/30",
    pillBg: "bg-emerald-500/10 text-emerald-300 border-emerald-500/30",
  },
  optics: {
    icon: "💡",
    name: "Optics & Light",
    badge: "Physics",
    primaryColor: "#f59e0b", // Amber
    accentColor: "#ef4444",  // Red
    glowColor: "rgba(245, 158, 11, 0.3)",
    gradient: "linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(239, 68, 68, 0.15) 100%)",
    headerBg: "from-amber-600/20 via-orange-500/10 to-transparent",
    borderGlow: "border-amber-500/30",
    pillBg: "bg-amber-500/10 text-amber-300 border-amber-500/30",
  },
  default: {
    icon: "🔮",
    name: "Concept Space",
    badge: "Core Learning",
    primaryColor: "#8b5cf6",
    accentColor: "#6366f1",
    glowColor: "rgba(139, 92, 246, 0.3)",
    gradient: "linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(99, 102, 241, 0.15) 100%)",
    headerBg: "from-purple-600/20 via-indigo-500/10 to-transparent",
    borderGlow: "border-purple-500/30",
    pillBg: "bg-purple-500/10 text-purple-300 border-purple-500/30",
  }
};

export function getConceptTheme(conceptName = "", subtopicName = "", conceptId = 0) {
  const icon = getConceptIcon(conceptName, conceptId);
  const text = `${conceptName} ${subtopicName}`.toLowerCase();
  
  let baseTheme = CONCEPT_THEMES.default;

  if (text.includes("electric") || text.includes("current") || text.includes("charge") || text.includes("potential")) {
    baseTheme = CONCEPT_THEMES.electricity;
  } else if (text.includes("magnet") || text.includes("solenoid") || text.includes("magnetic")) {
    baseTheme = CONCEPT_THEMES.magnetism;
  } else if (text.includes("wave") || text.includes("sound") || text.includes("frequency") || text.includes("oscillation")) {
    baseTheme = CONCEPT_THEMES.waves;
  } else if (text.includes("space") || text.includes("gravit") || text.includes("orbit") || text.includes("satellite")) {
    baseTheme = CONCEPT_THEMES.space;
  } else if (text.includes("chem") || text.includes("acid") || text.includes("base") || text.includes("reaction") || text.includes("bond")) {
    baseTheme = CONCEPT_THEMES.chemistry;
  } else if (text.includes("light") || text.includes("optic") || text.includes("lens") || text.includes("mirror") || text.includes("refract")) {
    baseTheme = CONCEPT_THEMES.optics;
  }

  return { ...baseTheme, icon };
}
