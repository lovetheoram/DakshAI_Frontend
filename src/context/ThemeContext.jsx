// src/context/ThemeContext.jsx
import React, { createContext, useState, useEffect, useContext } from "react";

export const THEMES = [
  {
    id: "classic",
    name: "Classic",
    feeling: "Professional & Clean",
    audience: "College students, Teachers & Minimalists",
    palette: ["#090d16", "#0f172a", "#3b82f6", "#e2e8f0"],
    previewGradient: "from-slate-950 via-slate-900 to-blue-950",
    accentColor: "#3b82f6",
    glowColor: "rgba(59, 130, 246, 0.3)",
    description: "Crisp slate navy with electric blue accents. Built for structured, focused study.",
  },
  {
    id: "sunrise",
    name: "Sunrise",
    feeling: "Optimistic & Energetic",
    audience: "Early risers & Morning motivation",
    palette: ["#1c100b", "#2a180f", "#f97316", "#fef08a"],
    previewGradient: "from-stone-950 via-amber-950/70 to-orange-950",
    accentColor: "#f97316",
    glowColor: "rgba(249, 115, 22, 0.35)",
    description: "Warm radiant amber and sunrise glow. Brings energy and optimism to your morning routines.",
  },
  {
    id: "forest",
    name: "Forest",
    feeling: "Calm & Deep Focus",
    audience: "Long study sessions & Revision",
    palette: ["#081c15", "#112a22", "#10b981", "#86efac"],
    previewGradient: "from-emerald-950 via-slate-950 to-green-950",
    accentColor: "#10b981",
    glowColor: "rgba(16, 185, 129, 0.35)",
    description: "Deep pine forest darks with soothing sage accents. Reduces eye strain during intense sessions.",
  },
  {
    id: "galaxy",
    name: "Galaxy",
    feeling: "Curiosity & Space Discovery",
    audience: "DakshAI Core Explorers",
    palette: ["#0a081d", "#130f30", "#8b5cf6", "#06b6d4"],
    previewGradient: "from-indigo-950 via-purple-950/80 to-slate-950",
    accentColor: "#8b5cf6",
    glowColor: "rgba(139, 92, 246, 0.4)",
    description: "Cosmic void and deep nebula purple. The signature identity of the Knowledge Galaxy.",
  },
  {
    id: "candy",
    name: "Candy",
    feeling: "Fun, Playful & Welcoming",
    audience: "Class 6–10 Students & Creative minds",
    palette: ["#180b1e", "#2a1236", "#ec4899", "#38bdf8"],
    previewGradient: "from-fuchsia-950 via-pink-950/60 to-purple-950",
    accentColor: "#ec4899",
    glowColor: "rgba(236, 72, 153, 0.4)",
    description: "Vibrant pinks, sky blue, and pastel pops. Makes learning feel friendly and joyful.",
  },
  {
    id: "midnight",
    name: "Midnight",
    feeling: "Pure Stealth & OLED Dark",
    audience: "Late-night owls & OLED battery saver",
    palette: ["#000000", "#09090b", "#64748b", "#cbd5e1"],
    previewGradient: "from-black via-zinc-950 to-neutral-950",
    accentColor: "#94a3b8",
    glowColor: "rgba(148, 163, 184, 0.25)",
    description: "Pitch black obsidian with cool steel slate accents. Utter clarity with minimal distraction.",
  },
];

export const SUBJECT_IDENTITIES = {
  Physics: {
    name: "Physics",
    icon: "⚡",
    accent: "#3b82f6",
    badgeBg: "bg-blue-500/10 border-blue-500/30 text-blue-300",
    glow: "shadow-blue-500/20",
  },
  Chemistry: {
    name: "Chemistry",
    icon: "🧪",
    accent: "#10b981",
    badgeBg: "bg-emerald-500/10 border-emerald-500/30 text-emerald-300",
    glow: "shadow-emerald-500/20",
  },
  Mathematics: {
    name: "Mathematics",
    icon: "📐",
    accent: "#f97316",
    badgeBg: "bg-orange-500/10 border-orange-500/30 text-orange-300",
    glow: "shadow-orange-500/20",
  },
  Biology: {
    name: "Biology",
    icon: "🧬",
    accent: "#22c55e",
    badgeBg: "bg-green-500/10 border-green-500/30 text-green-300",
    glow: "shadow-green-500/20",
  },
  "Computer Science": {
    name: "Computer Science",
    icon: "💻",
    accent: "#a855f7",
    badgeBg: "bg-purple-500/10 border-purple-500/30 text-purple-300",
    glow: "shadow-purple-500/20",
  },
  Astronomy: {
    name: "Astronomy",
    icon: "🚀",
    accent: "#6366f1",
    badgeBg: "bg-indigo-500/10 border-indigo-500/30 text-indigo-300",
    glow: "shadow-indigo-500/20",
  },
  Geography: {
    name: "Geography",
    icon: "🌍",
    accent: "#06b6d4",
    badgeBg: "bg-cyan-500/10 border-cyan-500/30 text-cyan-300",
    glow: "shadow-cyan-500/20",
  },
  History: {
    name: "History",
    icon: "🏛",
    accent: "#d97706",
    badgeBg: "bg-amber-500/10 border-amber-500/30 text-amber-300",
    glow: "shadow-amber-500/20",
  },
  Default: {
    name: "General Science",
    icon: "✨",
    accent: "#8b5cf6",
    badgeBg: "bg-purple-500/10 border-purple-500/30 text-purple-300",
    glow: "shadow-purple-500/20",
  },
};

export const CELEBRATION_COLORS = {
  missionComplete: {
    gradient: "from-amber-500 via-orange-500 to-yellow-400",
    text: "text-amber-300",
    border: "border-amber-500/40",
  },
  achievement: {
    gradient: "from-purple-600 via-pink-500 to-amber-400",
    text: "text-purple-300",
    border: "border-purple-500/40",
  },
  streak: {
    gradient: "from-orange-500 via-amber-500 to-rose-500",
    text: "text-orange-400",
    border: "border-orange-500/40",
  },
  softError: {
    bg: "bg-amber-500/10",
    border: "border-amber-500/30",
    text: "text-amber-300",
  },
};

export function getSubjectIdentity(subjectName = "") {
  if (!subjectName) return SUBJECT_IDENTITIES.Default;
  const key = Object.keys(SUBJECT_IDENTITIES).find((k) =>
    subjectName.toLowerCase().includes(k.toLowerCase())
  );
  return SUBJECT_IDENTITIES[key] || SUBJECT_IDENTITIES.Default;
}

export function getChapterIcon(chapterName = "") {
  const name = chapterName.toLowerCase();
  if (name.includes("electric") || name.includes("current") || name.includes("voltage")) return "⚡";
  if (name.includes("magnet") || name.includes("induction")) return "🧲";
  if (name.includes("motion") || name.includes("force") || name.includes("gravity")) return "🏃";
  if (name.includes("atom") || name.includes("nucleus") || name.includes("particle")) return "⚛️";
  if (name.includes("plant") || name.includes("photo") || name.includes("cell")) return "🌱";
  if (name.includes("wave") || name.includes("sound") || name.includes("optics") || name.includes("light")) return "🌊";
  if (name.includes("space") || name.includes("star") || name.includes("orbit")) return "🚀";
  if (name.includes("acid") || name.includes("base") || name.includes("reaction") || name.includes("bond")) return "🧪";
  if (name.includes("algo") || name.includes("code") || name.includes("data")) return "💻";
  return "📖";
}

export const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(() => {
    return localStorage.getItem("daksh_theme") || "classic";
  });

  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);

  const setTheme = (newThemeId) => {
    const found = THEMES.find((t) => t.id === newThemeId);
    if (!found) return;
    setThemeState(newThemeId);
    localStorage.setItem("daksh_theme", newThemeId);
    document.documentElement.setAttribute("data-theme", newThemeId);
  };

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);

    const handleOpen = () => setIsCustomizerOpen(true);
    window.addEventListener("openThemeCustomizer", handleOpen);
    return () => window.removeEventListener("openThemeCustomizer", handleOpen);
  }, [theme]);

  const openCustomizer = () => setIsCustomizerOpen(true);
  const closeCustomizer = () => setIsCustomizerOpen(false);
  const toggleCustomizer = () => setIsCustomizerOpen((prev) => !prev);

  const activeThemeMeta = THEMES.find((t) => t.id === theme) || THEMES[0];

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        THEMES,
        activeThemeMeta,
        SUBJECT_IDENTITIES,
        CELEBRATION_COLORS,
        getSubjectIdentity,
        getChapterIcon,
        isCustomizerOpen,
        openCustomizer,
        closeCustomizer,
        toggleCustomizer,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
