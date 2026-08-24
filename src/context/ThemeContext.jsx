// src/context/ThemeContext.jsx
// Simplified for unified White+Gold theme
// Kept structure for backwards compatibility (many components import from here)

import React, { createContext, useContext } from "react";

const UNIFIED_THEME = {
  id: "day",
  name: "DakshAI",
  badge: "✦",
  feeling: "White + Gold",
  tokens: {
    surfaces: {
      primaryBg: "bg-white",
      cardBg: "bg-white",
      glassBg: "bg-white",
      borderGlow: "border-[var(--color-gold)]/20",
      activeBorder: "border-[var(--color-gold)]",
    },
    typography: {
      headingClass: "font-bold tracking-tight text-[var(--color-text-primary)]",
      bodyClass: "text-[var(--color-text-secondary)] font-normal",
    },
    motion: {
      hoverScale: 1.005,
    },
  },
};

export const THEMES = [UNIFIED_THEME];

export const ThemeContext = createContext();
export const ExperienceContext = ThemeContext;

export function ThemeProvider({ children }) {
  const value = {
    theme: "day",
    setTheme: () => {},
    toggleTheme: () => {},
    THEMES,
    activeThemeMeta: UNIFIED_THEME,
    experienceTokens: UNIFIED_THEME.tokens,
    isCustomizerOpen: false,
    openCustomizer: () => {},
    closeCustomizer: () => {},
    toggleCustomizer: () => {},
  };

  return (
    <ThemeContext.Provider value={value}>
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
    return {
      theme: "day",
      setTheme: () => {},
      toggleTheme: () => {},
      THEMES,
      activeThemeMeta: UNIFIED_THEME,
      experienceTokens: UNIFIED_THEME.tokens,
      isCustomizerOpen: false,
      openCustomizer: () => {},
      closeCustomizer: () => {},
      toggleCustomizer: () => {},
    };
  }
  return context;
}
