/**
 * themes.js — LinkedInCity
 * Six professional themes for LinkedIn activity visualization.
 */

export const THEMES = {
  professional: {
    key: "professional",
    label: "Professional",
    bg: "#04080f",
    surface: "#0a1628",
    accent: "#0A66C2",
    glow: "#0A66C2",
    text: "#cce0ff",
    muted: "#3a5a80",
    border: "#0d1e35",
    levels: ["#0c1525", "#0d3060", "#0e5090", "#1080c0", "#0A66C2"],
  },
  corporate: {
    key: "corporate",
    label: "Corporate",
    bg: "#060d06",
    surface: "#0a140a",
    accent: "#00ff41",
    glow: "#00ff41",
    text: "#b0ffb0",
    muted: "#2d5a2d",
    border: "#0e2a0e",
    levels: ["#0a1a0a", "#0e4020", "#1a7535", "#27ae60", "#00ff41"],
  },
  recruiter: {
    key: "recruiter",
    label: "Recruiter",
    bg: "#030710",
    surface: "#080d1e",
    accent: "#a855f7",
    glow: "#a855f7",
    text: "#d0e8ff",
    muted: "#2a1a50",
    border: "#120a2e",
    levels: ["#0a1428", "#2d1060", "#5b20a0", "#8b35d0", "#a855f7"],
  },
  sales: {
    key: "sales",
    label: "Sales",
    bg: "#020c14",
    surface: "#05111e",
    accent: "#00b4d8",
    glow: "#00b4d8",
    text: "#cceeff",
    muted: "#0a2a3a",
    border: "#061828",
    levels: ["#061828", "#0a3060", "#0a6090", "#0090c0", "#00b4d8"],
  },
  premium: {
    key: "premium",
    label: "Premium",
    bg: "#0c0900",
    surface: "#150e00",
    accent: "#ffd700",
    glow: "#ffd700",
    text: "#fff3cc",
    muted: "#4a3800",
    border: "#1a1200",
    levels: ["#1a1200", "#4a3000", "#806000", "#c09000", "#ffd700"],
  },
  executive: {
    key: "executive",
    label: "Executive",
    bg: "#060810",
    surface: "#0a0d1a",
    accent: "#a8c8ff",
    glow: "#a8c8ff",
    text: "#e8f0ff",
    muted: "#1a2240",
    border: "#0d1220",
    levels: ["#0d1220", "#1a2a50", "#2a4a90", "#4a70d0", "#a8c8ff"],
  },
};

export const DEFAULT_THEME = "professional";
export const themeKeys = Object.keys(THEMES);
