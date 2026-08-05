// src/context/ThemeContext.jsx
// Daksh Brand Identity & Appearance System
// Commandment 34: "Daksh has two environments, not multiple identities. Day and Night change the atmosphere, never the personality."

import React, { createContext, useState, useEffect, useContext } from "react";
import { DAKSH_BRAND_TOKENS, DAKSH_ENVIRONMENTS } from "../experience/design/tokens";

export const THEMES = [
  {
    id: "night",
    name: "Night Sanctuary",
    badge: "🌙",
    feeling: "Deep Obsidian Sanctuary",
    previewGradient: "from-slate-950 via-slate-900 to-indigo-950",
    accentColor: DAKSH_BRAND_TOKENS.skyBlue,
    glowColor: "rgba(92, 200, 255, 0.25)",
    description: "Deep obsidian learning space for low-light focus.",
    tokens: {
      surfaces: {
        primaryBg: "bg-[#090D16]",
        cardBg: "bg-[#111827]/80",
        glassBg: "bg-[#111827]/75 backdrop-blur-xl",
        borderGlow: "border-sky-400/30",
        activeBorder: "border-sky-400",
      },
      typography: {
        headingClass: "font-extrabold tracking-tight text-white",
        bodyClass: "text-slate-300 font-normal",
      },
    },
  },
  {
    id: "day",
    name: "Daylight Sanctuary",
    badge: "☀️",
    feeling: "Clean Daylight Sanctuary",
    previewGradient: "from-slate-100 via-white to-sky-50",
    accentColor: DAKSH_BRAND_TOKENS.skyBlue,
    glowColor: "rgba(92, 200, 255, 0.15)",
    description: "Clean platinum learning space for bright environment focus.",
    tokens: {
      surfaces: {
        primaryBg: "bg-[#F8FAFC]",
        cardBg: "bg-white",
        glassBg: "bg-white/85 backdrop-blur-xl",
        borderGlow: "border-sky-500/20",
        activeBorder: "border-sky-500",
      },
      typography: {
        headingClass: "font-extrabold tracking-tight text-slate-900",
        bodyClass: "text-slate-600 font-normal",
      },
    },
  },
];

export const ThemeContext = createContext();
export const ExperienceContext = ThemeContext;

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(() => {
    const saved = localStorage.getItem("daksh_theme");
    return saved === "day" || saved === "night" ? saved : "night";
  });

  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);

  const setTheme = (newThemeId) => {
    const validTheme = newThemeId === "day" ? "day" : "night";
    setThemeState(validTheme);
    localStorage.setItem("daksh_theme", validTheme);
    document.documentElement.setAttribute("data-theme", validTheme);
  };

  const toggleTheme = () => {
    setTheme(theme === "night" ? "day" : "night");
  };

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const activeThemeMeta = THEMES.find((t) => t.id === theme) || THEMES[0];
  const experienceTokens = activeThemeMeta.tokens;

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        toggleTheme,
        THEMES,
        activeThemeMeta,
        experienceTokens,
        isCustomizerOpen,
        openCustomizer: () => setIsCustomizerOpen(true),
        closeCustomizer: () => setIsCustomizerOpen(false),
        toggleCustomizer: () => setIsCustomizerOpen((prev) => !prev),
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
      theme: "night",
      setTheme: () => {},
      toggleTheme: () => {},
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
