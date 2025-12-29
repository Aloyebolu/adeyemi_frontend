// components/ui/toggle-group.tsx
import * as React from "react"
import { cn } from "@/lib/utils"
import { Toggle, toggleVariants, type ToggleProps } from "./toggle"
import { cva, type VariantProps } from "class-variance-authority"

const toggleGroupVariants = cva(
  "inline-flex items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
  {
    variants: {
      variant: {
        default: "space-x-1",
        outline: "space-x-1 border",
      },
      orientation: {
        horizontal: "flex-row",
        vertical: "flex-col space-y-1",
      },
    },
    defaultVariants: {
      variant: "default",
      orientation: "horizontal",
    },
  }
)

export interface ToggleGroupProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof toggleGroupVariants> {
  value?: string | string[]
  onValueChange?: (value: string | string[]) => void
  type?: "single" | "multiple"
  disabled?: boolean
}

const ToggleGroupContext = React.createContext<{
  value: string | string[]
  onValueChange: (value: string) => void
  type: "single" | "multiple"
  disabled?: boolean
}>({
  value: [],
  onValueChange: () => {},
  type: "single",
})

const ToggleGroup = React.forwardRef<HTMLDivElement, ToggleGroupProps>(
  (
    {
      className,
      variant,
      orientation,
      value,
      onValueChange,
      type = "single",
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const handleValueChange = (itemValue: string) => {
      if (type === "single") {
        onValueChange?.(itemValue === (value as string) ? "" : itemValue)
      } else {
        const currentValues = (value as string[]) || []
        const newValues = currentValues.includes(itemValue)
          ? currentValues.filter((v) => v !== itemValue)
          : [...currentValues, itemValue]
        onValueChange?.(newValues)
      }
    }

    return (
      <ToggleGroupContext.Provider
        value={{
          value: value || (type === "multiple" ? [] : ""),
          onValueChange: handleValueChange,
          type,
          disabled,
        }}
      >
        <div
          ref={ref}
          className={cn(
            toggleGroupVariants({ variant, orientation, className }),
            disabled && "opacity-50 pointer-events-none"
          )}
          {...props}
        >
          {children}
        </div>
      </ToggleGroupContext.Provider>
    )
  }
)
ToggleGroup.displayName = "ToggleGroup"

export interface ToggleGroupItemProps
  extends Omit<ToggleProps, "value" | "onValueChange"> {
  value: string
}

const ToggleGroupItem = React.forwardRef<HTMLButtonElement, ToggleGroupItemProps>(
  ({ className, variant, size, value, ...props }, ref) => {
    let orientation = 'vertical';
    const context = React.useContext(ToggleGroupContext)
    const isSelected =
      context.type === "single"
        ? value === context.value
        : (context.value as string[]).includes(value)

    return (
      <Toggle
        ref={ref}
        className={cn(
          toggleVariants({ variant: variant || "default", size }),
          orientation === "vertical" && "w-full justify-start",
          isSelected && "bg-accent text-accent-foreground",
          className
        )}
        pressed={isSelected}
        onPressedChange={() => context.onValueChange(value)}
        disabled={context.disabled}
        {...props}
      />
    )
  }
)
ToggleGroupItem.displayName = "ToggleGroupItem"

export { ToggleGroup, ToggleGroupItem }