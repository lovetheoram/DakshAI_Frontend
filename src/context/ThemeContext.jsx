// src/context/ThemeContext.jsx
import React, { createContext, useState, useEffect, useContext } from "react";

export const THEMES = [
  {
    id: "classic",
    name: "Classic Focus",
    badge: "⚡",
    feeling: "Structured & Clean",
    audience: "College students, Teachers & Minimalists",
    palette: ["#090d16", "#0f172a", "#3b82f6", "#e2e8f0"],
    previewGradient: "from-slate-950 via-slate-900 to-blue-950",
    accentColor: "#3b82f6",
    glowColor: "rgba(59, 130, 246, 0.3)",
    description: "Crisp slate navy with electric blue accents. Built for structured, focused study.",
    tokens: {
      surfaces: {
        primaryBg: "bg-slate-950",
        cardBg: "bg-slate-900/80",
        glassBg: "bg-slate-900/60 backdrop-blur-xl",
        borderGlow: "border-blue-500/30",
        activeBorder: "border-blue-400",
      },
      shadows: {
        soft: "shadow-lg shadow-blue-500/10",
        strong: "shadow-2xl shadow-blue-500/30",
      },
      typography: {
        headingClass: "font-extrabold tracking-tight text-white",
        bodyClass: "text-gray-300 font-normal",
        quoteClass: "text-blue-300 italic font-medium",
      },
      motion: {
        speed: 0.3,
        curve: "easeOut",
        hoverScale: 1.02,
      },
      illustration: {
        particleType: "minimal",
        badgeIcon: "⚡",
        emptyTitle: "No concepts added yet",
        emptySubtitle: "Select a syllabus topic to initialize your practice queue.",
      },
      copy: {
        greeting: "Welcome back. Let's focus on key concepts today.",
        mission: "Daily Practice Mission",
        completion: "Solid progress recorded cleanly.",
      },
    },
  },
  {
    id: "galaxy",
    name: "Galaxy Explorer",
    badge: "⭐",
    feeling: "Curiosity & Cosmic Discovery",
    audience: "DakshAI Core Explorers",
    palette: ["#0a081d", "#130f30", "#8b5cf6", "#06b6d4"],
    previewGradient: "from-indigo-950 via-purple-950/80 to-slate-950",
    accentColor: "#8b5cf6",
    glowColor: "rgba(139, 92, 246, 0.4)",
    description: "Cosmic void and deep nebula purple. The signature identity of the Knowledge Galaxy.",
    tokens: {
      surfaces: {
        primaryBg: "bg-slate-950",
        cardBg: "bg-purple-950/40",
        glassBg: "bg-slate-950/80 backdrop-blur-2xl",
        borderGlow: "border-purple-500/40",
        activeBorder: "border-purple-400",
      },
      shadows: {
        soft: "shadow-lg shadow-purple-500/20",
        strong: "shadow-2xl shadow-purple-500/40",
      },
      typography: {
        headingClass: "font-black tracking-tight text-white",
        bodyClass: "text-purple-100 font-normal",
        quoteClass: "text-cyan-300 italic font-semibold",
      },
      motion: {
        speed: 0.4,
        curve: "easeInOut",
        hoverScale: 1.03,
      },
      illustration: {
        particleType: "stars",
        badgeIcon: "⭐",
        emptyTitle: "Your galaxy is still empty.",
        emptySubtitle: "Complete one mission to discover your first constellation.",
      },
      copy: {
        greeting: "One more constellation awaits your focus.",
        mission: "Launch Space Mission",
        completion: "A new star has been added to your map.",
      },
    },
  },
  {
    id: "forest",
    name: "Focused Forest",
    badge: "🍃",
    feeling: "Calm & Deep Organic Focus",
    audience: "Long study sessions & Revision",
    palette: ["#081c15", "#112a22", "#10b981", "#86efac"],
    previewGradient: "from-emerald-950 via-slate-950 to-green-950",
    accentColor: "#10b981",
    glowColor: "rgba(16, 185, 129, 0.35)",
    description: "Deep pine forest darks with soothing sage accents. Reduces eye strain during intense sessions.",
    tokens: {
      surfaces: {
        primaryBg: "bg-emerald-950/90",
        cardBg: "bg-emerald-950/50",
        glassBg: "bg-slate-950/70 backdrop-blur-xl",
        borderGlow: "border-emerald-500/30",
        activeBorder: "border-emerald-400",
      },
      shadows: {
        soft: "shadow-lg shadow-emerald-500/15",
        strong: "shadow-2xl shadow-emerald-500/30",
      },
      typography: {
        headingClass: "font-bold tracking-normal text-emerald-50",
        bodyClass: "text-emerald-200/90 font-medium",
        quoteClass: "text-emerald-300 italic font-normal",
      },
      motion: {
        speed: 0.5,
        curve: "easeOut",
        hoverScale: 1.01,
      },
      illustration: {
        particleType: "leaves",
        badgeIcon: "🍃",
        emptyTitle: "Nothing planted here yet.",
        emptySubtitle: "Let's plant your first chapter today.",
      },
      copy: {
        greeting: "Welcome back. Small progress every day grows into mastery.",
        mission: "Deep Focus Session",
        completion: "The forest grows one tree at a time.",
      },
    },
  },
  {
    id: "sunrise",
    name: "Morning Sunrise",
    badge: "🌅",
    feeling: "Optimistic & Energetic Sunlight",
    audience: "Early risers & Morning motivation",
    palette: ["#1c100b", "#2a180f", "#f97316", "#fef08a"],
    previewGradient: "from-stone-950 via-amber-950/70 to-orange-950",
    accentColor: "#f97316",
    glowColor: "rgba(249, 115, 22, 0.35)",
    description: "Warm radiant amber and sunrise glow. Brings energy and optimism to your morning routines.",
    tokens: {
      surfaces: {
        primaryBg: "bg-stone-950",
        cardBg: "bg-amber-950/40",
        glassBg: "bg-stone-950/80 backdrop-blur-xl",
        borderGlow: "border-amber-500/30",
        activeBorder: "border-amber-400",
      },
      shadows: {
        soft: "shadow-lg shadow-amber-500/20",
        strong: "shadow-2xl shadow-amber-500/40",
      },
      typography: {
        headingClass: "font-extrabold tracking-tight text-amber-50",
        bodyClass: "text-amber-100/90 font-medium",
        quoteClass: "text-yellow-300 italic font-semibold",
      },
      motion: {
        speed: 0.3,
        curve: "easeOut",
        hoverScale: 1.02,
      },
      illustration: {
        particleType: "sunbeams",
        badgeIcon: "🌅",
        emptyTitle: "A fresh morning awaits.",
        emptySubtitle: "Start your day with one focused learning goal.",
      },
      copy: {
        greeting: "Good morning! Ready to shine through your targets?",
        mission: "Sunrise Learning Goal",
        completion: "Radiant effort! Goal achieved.",
      },
    },
  },
  {
    id: "candy",
    name: "Candy Studio",
    badge: "🍬",
    feeling: "Fun, Playful & Bouncy",
    audience: "Class 6–10 Students & Creative minds",
    palette: ["#180b1e", "#2a1236", "#ec4899", "#38bdf8"],
    previewGradient: "from-fuchsia-950 via-pink-950/60 to-purple-950",
    accentColor: "#ec4899",
    glowColor: "rgba(236, 72, 153, 0.4)",
    description: "Vibrant pinks, sky blue, and pastel pops. Makes learning feel friendly and joyful.",
    tokens: {
      surfaces: {
        primaryBg: "bg-purple-950/90",
        cardBg: "bg-pink-950/40",
        glassBg: "bg-slate-950/70 backdrop-blur-xl",
        borderGlow: "border-pink-500/40",
        activeBorder: "border-pink-400",
      },
      shadows: {
        soft: "shadow-lg shadow-pink-500/20",
        strong: "shadow-2xl shadow-pink-500/40",
      },
      typography: {
        headingClass: "font-black tracking-normal text-pink-100",
        bodyClass: "text-pink-200/90 font-medium",
        quoteClass: "text-sky-300 italic font-bold",
      },
      motion: {
        speed: 0.25,
        curve: "spring",
        hoverScale: 1.04,
      },
      illustration: {
        particleType: "bubbles",
        badgeIcon: "🍬",
        emptyTitle: "Ready for some fun?",
        emptySubtitle: "Pick any topic to start your quest!",
      },
      copy: {
        greeting: "Hey there! Let's make learning super fun today!",
        mission: "Playful Quest",
        completion: "Woohoo! Awesome job!",
      },
    },
  },
  {
    id: "midnight",
    name: "Midnight Focus",
    badge: "🌙",
    feeling: "Pure Stealth OLED Dark",
    audience: "Late-night owls & OLED battery saver",
    palette: ["#000000", "#09090b", "#64748b", "#cbd5e1"],
    previewGradient: "from-black via-zinc-950 to-neutral-950",
    accentColor: "#94a3b8",
    glowColor: "rgba(148, 163, 184, 0.25)",
    description: "Pitch black obsidian with cool steel slate accents. Utter clarity with minimal distraction.",
    tokens: {
      surfaces: {
        primaryBg: "bg-black",
        cardBg: "bg-zinc-950",
        glassBg: "bg-black/90 backdrop-blur-md",
        borderGlow: "border-zinc-800",
        activeBorder: "border-slate-400",
      },
      shadows: {
        soft: "shadow-none",
        strong: "shadow-md shadow-zinc-950",
      },
      typography: {
        headingClass: "font-semibold tracking-tight text-white",
        bodyClass: "text-zinc-400 font-normal",
        quoteClass: "text-slate-300 italic font-normal",
      },
      motion: {
        speed: 0.15,
        curve: "linear",
        hoverScale: 1.0,
      },
      illustration: {
        particleType: "minimal",
        badgeIcon: "🌙",
        emptyTitle: "Stealth mode active.",
        emptySubtitle: "Select a concept to work without distraction.",
      },
      copy: {
        greeting: "Late night focus session active.",
        mission: "Stealth Mission",
        completion: "Session logged silently.",
      },
    },
  },
];

export const SUBJECT_IDENTITIES = {
  Physics: { name: "Physics", icon: "⚡", accent: "#3b82f6", badgeBg: "bg-blue-500/10 border-blue-500/30 text-blue-300", glow: "shadow-blue-500/20" },
  Chemistry: { name: "Chemistry", icon: "🧪", accent: "#10b981", badgeBg: "bg-emerald-500/10 border-emerald-500/30 text-emerald-300", glow: "shadow-emerald-500/20" },
  Mathematics: { name: "Mathematics", icon: "📐", accent: "#f97316", badgeBg: "bg-orange-500/10 border-orange-500/30 text-orange-300", glow: "shadow-orange-500/20" },
  Biology: { name: "Biology", icon: "🧬", accent: "#22c55e", badgeBg: "bg-green-500/10 border-green-500/30 text-green-300", glow: "shadow-green-500/20" },
  "Computer Science": { name: "Computer Science", icon: "💻", accent: "#a855f7", badgeBg: "bg-purple-500/10 border-purple-500/30 text-purple-300", glow: "shadow-purple-500/20" },
  Astronomy: { name: "Astronomy", icon: "🚀", accent: "#6366f1", badgeBg: "bg-indigo-500/10 border-indigo-500/30 text-indigo-300", glow: "shadow-indigo-500/20" },
  Geography: { name: "Geography", icon: "🌍", accent: "#06b6d4", badgeBg: "bg-cyan-500/10 border-cyan-500/30 text-cyan-300", glow: "shadow-cyan-500/20" },
  History: { name: "History", icon: "🏛", accent: "#d97706", badgeBg: "bg-amber-500/10 border-amber-500/30 text-amber-300", glow: "shadow-amber-500/20" },
  Default: { name: "General Science", icon: "✨", accent: "#8b5cf6", badgeBg: "bg-purple-500/10 border-purple-500/30 text-purple-300", glow: "shadow-purple-500/20" },
};

export const CELEBRATION_COLORS = {
  missionComplete: { gradient: "from-amber-500 via-orange-500 to-yellow-400", text: "text-amber-300", border: "border-amber-500/40" },
  achievement: { gradient: "from-purple-600 via-pink-500 to-amber-400", text: "text-purple-300", border: "border-purple-500/40" },
  streak: { gradient: "from-orange-500 via-amber-500 to-rose-500", text: "text-orange-400", border: "border-orange-500/40" },
  softError: { bg: "bg-amber-500/10", border: "border-amber-500/30", text: "text-amber-300" },
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

// Function to compute time-of-day theme automatically
function getAutoThemeForTime() {
  const hour = new Date().getHours();
  if (hour >= 6 && hour < 12) return "sunrise"; // Morning: Sunrise 🌅
  if (hour >= 12 && hour < 18) return "classic"; // Afternoon: Classic ⚡
  if (hour >= 18 && hour < 22) return "forest";  // Evening: Forest 🍃
  return "midnight";                             // Late Night: Midnight 🌙
}

export const ThemeContext = createContext();
export const ExperienceContext = ThemeContext;

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(() => {
    return localStorage.getItem("daksh_theme") || "classic";
  });

  const [autoAdapt, setAutoAdaptState] = useState(() => {
    return localStorage.getItem("daksh_auto_adapt") === "true";
  });

  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);

  const setTheme = (newThemeId) => {
    const found = THEMES.find((t) => t.id === newThemeId);
    if (!found) return;
    setThemeState(newThemeId);
    localStorage.setItem("daksh_theme", newThemeId);
    document.documentElement.setAttribute("data-theme", newThemeId);
  };

  const setAutoAdapt = (enable) => {
    setAutoAdaptState(enable);
    localStorage.setItem("daksh_auto_adapt", String(enable));
    if (enable) {
      const timeTheme = getAutoThemeForTime();
      setTheme(timeTheme);
    }
  };

  useEffect(() => {
    if (autoAdapt) {
      const timeTheme = getAutoThemeForTime();
      setTheme(timeTheme);
    } else {
      document.documentElement.setAttribute("data-theme", theme);
    }

    const handleOpen = () => setIsCustomizerOpen(true);
    window.addEventListener("openThemeCustomizer", handleOpen);
    return () => window.removeEventListener("openThemeCustomizer", handleOpen);
  }, [theme, autoAdapt]);

  const openCustomizer = () => {
    setIsCustomizerOpen(true);
    try {
      window.dispatchEvent(new Event("openThemeCustomizer"));
    } catch (e) {}
  };

  const closeCustomizer = () => setIsCustomizerOpen(false);
  const toggleCustomizer = () => setIsCustomizerOpen((prev) => !prev);

  const activeThemeMeta = THEMES.find((t) => t.id === theme) || THEMES[0];
  const experienceTokens = activeThemeMeta.tokens;

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        autoAdapt,
        setAutoAdapt,
        THEMES,
        activeThemeMeta,
        experienceTokens,
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

export const ExperienceProvider = ThemeProvider;

export function useTheme() {
  return useContext(ThemeContext);
}

export function useExperience() {
  const context = useContext(ExperienceContext);
  if (!context) {
    const defaultMeta = THEMES[0];
    return {
      theme: "classic",
      setTheme: () => {},
      autoAdapt: false,
      setAutoAdapt: () => {},
      THEMES,
      activeThemeMeta: defaultMeta,
      experienceTokens: defaultMeta.tokens,
      isCustomizerOpen: false,
      openCustomizer: () => {},
      closeCustomizer: () => {},
      toggleCustomizer: () => {},
    };
  }
  return context;
}
