// import type { Config } from "tailwindcss";
// import theme from "./styles/theme"; // 👈 your centralized theme file

// const config: Config = {
//   darkMode: "class",
//   content: [
//     "./app/**/*.{ts,tsx,js,jsx,mdx}",
//     "./pages/**/*.{ts,tsx,js,jsx,mdx}",
//     "./components/**/*.{ts,tsx,js,jsx,mdx}",
//   ],
//   theme: {
//     extend: {
//       colors: {
//         background: "var(--background)",
//         foreground: "var(--foreground)",

//         // 🎨 Use your theme system
//         primary: theme.colors.primary,
//         accent: theme.colors.accent,
//         surface: theme.colors.surface,
//         border: theme.colors.border,
//         "text-primary": theme.colors.textPrimary,
//         "on-brand": "var(--color-on-brand)",
//         "textOnPrimary": theme.colors.textOnPrimary,
//         "info": theme.colors.info,
//         "error": theme.colors.error,
//         "danger": theme.colors.error,
//         "success": theme.colors.success,
//         "warning": theme.colors.warning,
//         "surfaceElevated": theme.colors.surfaceElevated,
//         "orange": theme.colors.orange,
//         secondary: theme.colors.secondary,


//       },
//       spacing: theme.spacing,
//       borderRadius: {
//         card: theme.radii.card,
//         sm: theme.radii.sm,
//       },
//       boxShadow: {
//         medium: theme.shadows.medium,
//       },
//     },
//   },
//   plugins: [],
// };

// export default config;
// tailwind.config.js
const theme = require("./styles/theme");

module.exports = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx,js,jsx,mdx}",
    "./pages/**/*.{ts,tsx,js,jsx,mdx}",
    "./components/**/*.{ts,tsx,js,jsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: theme.colors.primary,
        accent: theme.colors.accent,
        surface: theme.colors.surface,
        border: theme.colors.border,
        "text-primary": theme.colors.textPrimary,
        "on-brand": "var(--color-on-brand)",
        "textOnPrimary": theme.colors.textOnPrimary,
        info: theme.colors.info,
        error: theme.colors.error,
        danger: theme.colors.error,
        success: theme.colors.success,
        warning: theme.colors.warning,
        surfaceElevated: theme.colors.surfaceElevated,
        orange: theme.colors.orange,
        secondary: theme.colors.secondary,
      },
      spacing: theme.spacing,
      borderRadius: {
        card: theme.radii.card,
        sm: theme.radii.sm,
      },
      boxShadow: {
        medium: theme.shadows.medium,
      },
    },
  },
  plugins: [],
};
