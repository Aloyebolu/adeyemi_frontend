/**
 * 🎖 Badge Component
 * Purpose: Displays compact status indicators like “Active”, “Pending”, “Error”, etc.
 * Features: Animated appearance, semantic variants, accessible by default.
 */

import React from "react";

interface BadgeProps {
  variant?: "success" | "warning" | "error" | "info" | "neutral";
  children: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = "neutral",
  children,
}) => {
  const variants: Record<string, string> = {
    success: "bg-success/90 text-textOnPrimary shadow-sm",
    warning: "bg-warning/90 text-textOnPrimary shadow-sm",
    error: "bg-error/90 text-textOnPrimary shadow-sm",
    info: "bg-accent/90 text-textOnPrimary shadow-sm",
    neutral:
      "bg-surfaceElevated text-textPrimary border border-border shadow-sm",
  };

  return (
    <span
      className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${variants[variant]} transition-all duration-200 ease-in-out`}
      role="status"
      aria-label={
        typeof children === "string" ? `${children} badge` : "status badge"
      }
    >
      {children}
    </span>
  );
};
