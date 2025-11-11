// styles/theme.ts
// Single source of truth for colors, spacing, type, radii, shadows, breakpoints.
// Keep this file authoritative — never hardcode colors/spacing in components.

export const theme = {
  // Core palette (keeps AFUED required hexes)
  colors: {
    primary: "#0B3D2E",         // brand
    primaryHover: "#11543E",
    accent: "#F4C430",          // highlight
    accentHover: "#e4b828",
    background: "#F9FAFB",
    surface: "#FFFFFF",
    surfaceElevated: "#F7F8F9",
    border: "#D1D5DB",
    textPrimary: "#1F2937",
    textSecondary: "#6B7280",
    textOnPrimary: "#FFFFFF",
    success: "#16A34A",
    error: "#DC2626",
    warning: "#D97706",
    info: "#0EA5E9",
secondary: "#6B7280",   // 🩶 Grayish neutral tone (Secondary)
orange: "#F97316",      // 🧡 Vivid orange tone (Alert/Highlight)
  },

  // Neutral scale for UI surfaces, borders and text variants (use these, not ad-hoc grays)
  neutral: {
    50:  "#F9FAFB",
    100: "#F3F4F6",
    200: "#E5E7EB",
    300: "#D1D5DB",
    400: "#9CA3AF",
    500: "#6B7280",
    600: "#4B5563",
    700: "#374151",
    800: "#1F2937",
    900: "#111827"
  },

  // Semantic tokens (use these across components)
  semantic: {
    bg: "background",
    surface: "surface",
    surfaceElevated: "surfaceElevated",
    border: "border",
    text: "textPrimary",
    textMuted: "textSecondary",
    brand: "primary",
    accent: "accent"
  },

  // Spacing scale (use rems — consistent & responsive)
  spacing: {
    px: "1px",
    0: "0rem",
    1: "0.25rem",  // 4px
    2: "0.5rem",   // 8px
    3: "0.75rem",  // 12px
    4: "1rem",     // 16px
    5: "1.25rem",  // 20px
    6: "1.5rem",   // 24px
    8: "2rem",     // 32px
    10: "2.5rem",  // 40px
  },

  // Type scale (rem units — change base font-size in globals if needed)
  type: {
    fontFamily: {
      heading: "Poppins, Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
      body: "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial"
    },
    h1: "2rem",    // 32px
    h2: "1.5rem",  // 24px
    h3: "1.25rem", // 20px
    bodyLarge: "1rem",   // 16px
    body: "0.9375rem",   // 15px
    small: "0.8125rem"   // 13px
  },

  // Radii
  radii: {
    sm: "0.375rem",   // small
    card: "1rem",     // rounded-xl (MANDATE)
    lg: "1.5rem",
    pill: "9999px",
  },

  // Elevation / shadows (consistent elevation tokens)
  shadows: {
    low: "0 1px 2px rgba(16,24,40,0.04)",
    medium: "0 6px 20px rgba(16,24,40,0.08)",
    high: "0 12px 40px rgba(16,24,40,0.12)"
  },

  // Breakpoints (for layout and responsive decisions)
  breakpoints: {
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px"
  },

  // Motion & z-index tokens
  motion: {
    fast: "150ms",
    normal: "300ms",
    slow: "500ms",
  },

  zIndex: {
    dropdown: 1000,
    sticky: 1100,
    modal: 1200,
    toast: 1300
  }
};

export type Theme = typeof theme;
module.exports = theme;
export default theme;

