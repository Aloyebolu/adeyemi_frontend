import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  AnimatedDialogContent,
} from "@/components/ui/dialog/dialog";
import { Button } from "@/components/ui/Button";
import { Loader2 } from "lucide-react";
import { SmartInput } from "@/components/SmartInput";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../select";
import { Input } from "@/components/placeholder/input";

interface ComponentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  size?: "sm" | "md" | "lg" | "xl";
  inlineError?: string | null; // 💎 global error from DialogProvider
  component: React.ElementType;
  icon: React.ReactNode;
}

const sizeMap = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-2xl",
};

const ComponentDialog: React.FC<ComponentDialogProps> = ({
  open,
  onOpenChange,
  title = "Title",
  description,
  icon,
  component,
  size = "md",
}) => {

const Compomemt = component
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={`${sizeMap[size]} p-6 rounded-2xl shadow-lg border border-border bg-surface`}
      >
        <DialogHeader className="text-center space-y-2">
          {icon && <div className="text-4xl mb-2">{icon}</div>}
          <DialogTitle className="text-lg font-semibold">{title}</DialogTitle>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </DialogHeader>

        <Compomemt />
      </DialogContent>
    </Dialog>
  );
};

export default ComponentDialog;
