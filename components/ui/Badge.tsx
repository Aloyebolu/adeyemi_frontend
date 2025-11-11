/**
 * 🎖 Badge Component
 * Purpose: Displays compact status indicators like “Active”, “Pending”, “Error”, etc.
 * Features: Animated appearance, semantic variants, accessible by default.
 */

import React from "react";

interface BadgeProps {
  variant?: "success" | "warning" | "error" | "info" | "neutral";
  children: React.ReactNode;
  className?:React.HTMLAttributes<HTMLSpanElement>["className"];
}

export const Badge: React.FC<BadgeProps> = ({
  variant = "neutral",
  children,
  className ="",
}) => {
  const variants: Record<string, string> = {
success: "bg-success text-text-on-primary shadow-sm",
warning: "bg-warning text-text-on-primary shadow-sm",
error: "bg-error text-text-on-primary shadow-sm",
info: "bg-accent text-text-on-primary shadow-sm",

// 🆕 Newly added ones
secondary: "bg-secondary/90 text-textOnPrimary shadow-sm",
orange: "bg-orange/90 text-textOnPrimary shadow-sm",

    neutral:
      "bg-surfaceElevated text-textPrimary border border-border shadow-sm",
  };

  return (
    <span
      className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${variants[variant]} transition-all duration-200 ease-in-out ${className}`}
      role="status"
      aria-label={
        typeof children === "string" ? `${children} badge` : "status badge"
      }
    >
      {children}
    </span>
  );
};
