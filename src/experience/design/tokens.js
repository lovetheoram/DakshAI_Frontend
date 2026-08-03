// src/experience/design/tokens.js
// Daksh Brand Identity & Appearance System
// Commandment 34: "Daksh has two environments, not multiple identities. Day and Night change the atmosphere, never the personality."

export const DAKSH_BRAND_TOKENS = {
  skyBlue: "#5CC8FF",   // Intelligence, Curiosity, Exploration
  softPink: "#FF8FB1",  // Human Emotion, Warmth, Encouragement
  platinum: "#F8FAFC",  // Trust, Clean Learning Space
  mistGray: "#94A3B8",  // Stability, Calm Hierarchy
};

export const DAKSH_ENVIRONMENTS = {
  night: {
    key: "night",
    name: "Night Sanctuary",
    background: "#090D16",
    surface: "#111827",
    surfaceGlass: "rgba(17, 24, 39, 0.75)",
    border: "rgba(92, 200, 255, 0.18)",
    borderSubtle: "rgba(255, 255, 255, 0.06)",
    textPrimary: DAKSH_BRAND_TOKENS.platinum,
    textSecondary: DAKSH_BRAND_TOKENS.mistGray,
    accentPrimary: DAKSH_BRAND_TOKENS.skyBlue,
    accentSecondary: DAKSH_BRAND_TOKENS.softPink,
    glow: "rgba(92, 200, 255, 0.15)",
  },
  day: {
    key: "day",
    name: "Daylight Sanctuary",
    background: "#F8FAFC",
    surface: "#FFFFFF",
    surfaceGlass: "rgba(255, 255, 255, 0.85)",
    border: "#E2E8F0",
    borderSubtle: "rgba(0, 0, 0, 0.05)",
    textPrimary: "#0F172A",
    textSecondary: "#64748B",
    accentPrimary: DAKSH_BRAND_TOKENS.skyBlue,
    accentSecondary: DAKSH_BRAND_TOKENS.softPink,
    glow: "rgba(92, 200, 255, 0.12)",
  },
};
