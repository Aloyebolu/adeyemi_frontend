import React from "react";
import { cn } from "@/lib/utils"; // optional utility for combining classNames

// 🟢 Card Wrapper
export const Card = ({ className, children, ...props }) => {
  return (
    <div
      className={cn(
        "rounded-2xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md dark:bg-gray-900 dark:border-gray-700",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

// 🟣 Card Content
export const CardContent = ({ className, children, ...props }) => {
  return (
    <div className={cn("p-4 md:p-6", className)} {...props}>
      {children}
    </div>
  );
};
