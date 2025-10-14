// components/ui/switch.tsx
// Consumes: colors.primary, colors.surface, shadows.low, radii.sm

import * as React from "react";
import * as SwitchPrimitives from "@radix-ui/react-switch";

import { cn } from "@/lib/utils";
import theme from "@/styles/theme";

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
<SwitchPrimitives.Root
  className={cn(
    "peer inline-flex h-6 w-12 shrink-0 cursor-pointer items-center rounded-full border transition-colors duration-300 ease-in-out",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2",
    "disabled:cursor-not-allowed disabled:opacity-50",
    // ✅ Checked & unchecked background colors
    "data-[state=checked]:bg-primary data-[state=unchecked]:bg-gray-300",
    className
  )}
  {...props}
  ref={ref}
>
  <SwitchPrimitives.Thumb
    className={cn(
      "pointer-events-none block h-5 w-5 rounded-full shadow-md ring-0 transition-transform duration-300 ease-in-out",
      // ✅ Thumb color & movement
      "bg-white data-[state=checked]:translate-x-6 data-[state=unchecked]:translate-x-0"
    )}
  />
</SwitchPrimitives.Root>

));
Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch };