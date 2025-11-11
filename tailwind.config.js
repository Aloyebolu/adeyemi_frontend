/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",   // for Next.js 13+ app directory
    "./pages/**/*.{js,ts,jsx,tsx}", // for pages directory
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class", // enables toggling dark/light themes
  theme: {
    extend: {
      colors: {
        background: "var(--color-background)",
        foreground: "var(--color-foreground)",
        primary: "var(--color-primary)",
        "primary-hover": "var(--color-primary-hover)",

        accent: "var(--color-accent)",
        surface: "var(--color-surface)",
        border: "var(--color-border)",
        "text-primary": "var(--color-text-primary)",
        "on-brand": "var(--color-on-brand)",
        "text-on-primary": "var(--color-text-on-primary)",
        info: "var(--color-info)",
        error: "var(--color-error)",
        danger: "var(--color-error)",
        success: "var(--color-success)",
        warning: "var(--color-warning)",
        "surface-elevated": "var(--color-surface-elevated)",
        orange: "var(--color-orange)",
        secondary: "var(--color-secondary)",
      },
      spacing: {
        // example: use CSS variables if you want dynamic spacing
        1: "var(--spacing-1)",
        2: "var(--spacing-2)",
        4: "var(--spacing-4)",
        8: "var(--spacing-8)",
      },
      borderRadius: {
        card: "var(--radius-card)",
        sm: "var(--radius-sm)",
      },
      boxShadow: {
        medium: "var(--shadow-medium)",
      },
    },
  },
  plugins: [],
};
