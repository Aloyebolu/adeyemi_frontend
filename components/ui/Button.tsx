/**
 * 🎨 Button Component
 * Uses tokens from theme for colors, radius, and shadows.
 * Consumes: colors.primary, colors.accent, text.textOnPrimary, etc.
 */

import React from "react";
import theme from "@/styles/theme";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "danger" | "success" | "ghost";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  fullWidth = false,
  children,
  className,
  ...props
}) => {
  const variants: Record<string, string> = {
    primary:
      "bg-primary text-text-on-primary hover:bg-primary-hover hover:text-text focus:ring-2 focus:ring-accent",
    secondary:
      "bg-surface text-textPrimary hover:bg-surface-elevated focus:ring-2 focus:ring-accent",
    outline:
      "border border-primary text-primary hover:bg-primary hover:text-text-on-primary focus:ring-2 focus:ring-accent",
    danger:
      "bg-danger text-textOnPrimary hover:bg-dangerHover focus:ring-2 focus:ring-accent",
    success:
      "bg-success text-textOnPrimary hover:bg-successHover focus:ring-2 focus:ring-accent",
    ghost:
      "bg-transparent text-primary hover:bg-surface focus:ring-2 focus:ring-accent",
  };

  const sizes: Record<string, string> = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <button
      {...props}
      className={`${
        fullWidth ? "w-full" : "inline-block"
      } rounded-xl shadow-md transition-all duration-200 min-h-[2.5rem] disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </button>
  );
};
1