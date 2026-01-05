// ...existing code...
import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * 🟢 Card — base container with shadow, border & dark mode support
 */
const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-2xl border border-gray-200 shadow-sm transition-all hover:shadow-md dark:border-gray-800 ",
        className
      )}
      {...props}
    />
  )
);
Card.displayName = "Card";

/**
 * 🟣 CardHeader — top section for title/subtitle or actions
 */
const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex flex-col space-y-1.5 border-b border-gray-100 p-4 dark:border-gray-800 md:p-6",
        className
      )}
      {...props}
    />
  )
);
CardHeader.displayName = "CardHeader";

/**
 * 🔵 CardTitle — main title text
 */
const CardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn(
        "text-lg font-semibold leading-none tracking-tight text-gray-900 dark:text-gray-100",
        className
      )}
      {...props}
    />
  )
);
CardTitle.displayName = "CardTitle";

/**
 * 🟠 CardContent — inner body area for details or custom content
 */
const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-4 md:p-6", className)} {...props} />
  )
);
CardContent.displayName = "CardContent";

/**
 * 🔴 Optional: CardFooter — if you ever want actions at the bottom
 */
const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex items-center justify-end border-t border-gray-100 p-4 dark:border-gray-800 md:p-6",
        className
      )}
      {...props}
    />
  )
);
CardFooter.displayName = "CardFooter";

const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
);
CardDescription.displayName = "CardDescription";

export { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription };
// ...existing code...