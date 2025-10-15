import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog/dialog";
import { Button } from "@/components/ui/Button";
import { Loader2 } from "lucide-react";

interface Field {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  defaultValue?: string;
  required?: boolean;
}

interface UniversalFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  onSubmit?: (data: Record<string, any>) => Promise<void> | void;
  onCancel?: () => void;
  icon?: React.ReactNode;
  loaderOnSubmit?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
  /** Instead of children, pass array of fields */
  fields?: Field[];
  /** Optional custom JSX override */
  children?: React.ReactNode;
}

const sizeMap = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-2xl",
};

const UniversalFormDialog: React.FC<UniversalFormDialogProps> = ({
  open,
  onOpenChange,
  title = "Form Dialog",
  description,
  confirmText = "Save",
  cancelText = "Cancel",
  onSubmit,
  onCancel,
  icon,
  loaderOnSubmit = false,
  size = "md",
  fields = [],
  children,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<Record<string, any>>(
    Object.fromEntries(fields.map(f => [f.name, f.defaultValue || ""]))
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loaderOnSubmit) setIsSubmitting(true);

    try {
      await onSubmit?.(formData);
      setTimeout(() => onOpenChange(false), 200);
    } finally {
      if (loaderOnSubmit) setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`${sizeMap[size]} p-6 rounded-2xl`}>
        <DialogHeader className="text-center space-y-2">
          {icon && <div className="text-4xl mb-2">{icon}</div>}
          <DialogTitle className="text-lg font-semibold">{title}</DialogTitle>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* Render either provided fields or custom children */}
          {fields.length > 0
            ? fields.map(field => (
                <div key={field.name}>
                  <label className="block text-sm font-medium mb-1">
                    {field.label}
                  </label>
                  <input
                    name={field.name}
                    type={field.type || "text"}
                    required={field.required}
                    placeholder={field.placeholder}
                    value={formData[field.name] || ""}
                    onChange={handleChange}
                    className="w-full border p-2 rounded-md"
                  />
                </div>
              ))
            : children}

          <DialogFooter className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel || (() => onOpenChange(false))}
              disabled={isSubmitting}
            >
              {cancelText}
            </Button>

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && loaderOnSubmit ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                confirmText
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UniversalFormDialog;
