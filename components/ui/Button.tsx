/**
 * 🎨 Button Component
 * Uses tokens from theme for colors, radius, and shadows.
 * Consumes: colors.primary, colors.accent, text.textOnPrimary
 */

import React from "react";
import theme from "@/styles/theme";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline";
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  children,
  ...props
}) => {
  const variants: Record<string, string> = {
    primary:
      "bg-primary text-textOnPrimary hover:bg-primaryHover focus:ring-2 focus:ring-accent",
    secondary:
      "bg-surface text-textPrimary hover:bg-surfaceElevated focus:ring-2 focus:ring-accent",
    outline:
      "border border-primary text-primary hover:bg-primary hover:text-textOnPrimary focus:ring-2 focus:ring-accent",
  };

  return (
    <button
      {...props}
      className={`px-4 py-2 rounded-xl shadow-md transition-all duration-200 min-h-[2.5rem] disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]}`}
    >
      {children}
    </button>
  );
};
