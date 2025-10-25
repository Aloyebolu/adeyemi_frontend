// File: src/components/ui/Card.jsx
import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * 🟢 Card — base container with shadow, border & dark mode support
 */
const Card = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-2xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md dark:border-gray-800 dark:bg-gray-900",
      className
    )}
    {...props}
  />
));
Card.displayName = "Card";

/**
 * 🟣 CardHeader — top section for title/subtitle or actions
 */
const CardHeader = ({ className, children, ...props }) => (
  <div
    className={cn(
      "flex flex-col space-y-1.5 border-b border-gray-100 p-4 dark:border-gray-800 md:p-6",
      className
    )}
    {...props}
  >
    {children}
  </div>
);

/**
 * 🔵 CardTitle — main title text
 */
const CardTitle = ({ className, children, ...props }) => (
  <h3
    className={cn(
      "text-lg font-semibold leading-none tracking-tight text-gray-900 dark:text-gray-100",
      className
    )}
    {...props}
  >
    {children}
  </h3>
);

/**
 * 🟠 CardContent — inner body area for details or custom content
 */
const CardContent = ({ className, children, ...props }) => (
  <div className={cn("p-4 md:p-6", className)} {...props}>
    {children}
  </div>
);

/**
 * 🔴 Optional: CardFooter — if you ever want actions at the bottom
 */
const CardFooter = ({ className, children, ...props }) => (
  <div
    className={cn(
      "flex items-center justify-end border-t border-gray-100 p-4 dark:border-gray-800 md:p-6",
      className
    )}
    {...props}
  >
    {children}
  </div>
);

export { Card, CardHeader, CardTitle, CardContent, CardFooter };
