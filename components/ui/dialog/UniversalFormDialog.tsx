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

interface Field {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  defaultValue?: string;
  required?: boolean;
  fetchData: ((field: string, input: string) => Promise<any[]>) | undefined;
  fetchableFields: [],
  displayFormat?: (record: any) => React.ReactNode,
  onSelect?: (record: any, setFormData: React.Dispatch<React.SetStateAction<Record<string, any>>>) => void;
  options?: { value: string, label: string }[]


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
  fields?: Field[];
  children?: React.ReactNode;
  inlineError?: string | null; // 💎 global error from DialogProvider
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
  inlineError = null,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<Record<string, any>>(
    Object.fromEntries(fields.map(f => [f.name, f.defaultValue || ""]))
  );
  const [localError, setLocalError] = useState<string | null>(null); // 💎 local error

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // useEffect(()=>{
  //   console.log(fields)
  // })
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null); // clear previous error
    if (loaderOnSubmit) setIsSubmitting(true);

    console.log(formData)
    try {
      // ✅ Basic validation
      for (const field of fields) {
        if (field.required && !formData[field.name]) {
          throw new Error(`${field.label} is required.`);
        }
      }

      await onSubmit?.(formData);
      // setTimeout(() => onOpenChange(false), 200);
    } catch (err: any) {
      // setLocalError(err.message || "Something went wrong. Please try again.");
    } finally {
      if (loaderOnSubmit) setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <AnimatedDialogContent
        className={`${sizeMap[size]} p-6 rounded-2xl shadow-lg border border-border bg-surface`}
      >
        <DialogHeader className="text-center space-y-2">
          {icon && <div className="text-4xl mb-2">{icon}</div>}
          <DialogTitle className="text-lg font-semibold">{title}</DialogTitle>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* Render provided fields or custom children */}
          {fields.length > 0
            ? fields.map(field => (
              <div key={field.name}>
                <label className="block text-sm font-medium mb-1">
                  {field.label}
                </label>

                {/* 🔥 Dynamically render SmartInput or regular input */}
                {field.type === "smart" ? (
                  <SmartInput
                    fieldName={field.name}
                    value={formData[field.name] || ""}
                    onValueChange={(val) =>
                      setFormData((prev) => ({ ...prev, [field.name]: val }))
                    }
                    fetchData={field.fetchData}
                    fetchableFields={field.fetchableFields}
                    displayFormat={field.displayFormat}
                    label=""
                    placeholder={field.placeholder}
                    onSelect={(record) => {
                      if (field.onSelect) {
                        field.onSelect(record, setFormData); // custom behavior
                      } else {
                        setFormData((prev) => ({
                          ...prev,
                          [`${field.name}_id`]: record.id || record._id, // save id for backend
                          [field.name]: record.name || record.label || "",
                        }));
                      }
                    }}
                  />
                ) : field.type === "dropdown" ? (
                  // 🆕 Dropdown Field Type
                  <Select
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, [field.name]: value }))
                    }
                    value={formData[field.name] || ""}
                  >
                    <SelectTrigger className="w-full border border-border p-2 rounded-md focus:ring-2 focus:ring-primary focus:outline-none">
                      <SelectValue placeholder={field.placeholder || "Select an option"} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {field.label && <SelectLabel>{field.label}</SelectLabel>}
                        {field.options?.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    name={field.name}
                    type={field.type || "text"}
                    required={field.required}
                    placeholder={field.placeholder}
                    value={formData[field.name] || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        [field.name]: e.target.value,
                      }))
                    }
                    // className="w-full border border-border p-2 rounded-md focus:ring-2 focus:ring-primary focus:outline-none"
                  />
                )}

              </div>
            ))
            : children}


          {/* 💥 Inline Error Display */}
          {(localError || inlineError) && (
            <div className="mt-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-3 animate-fade-in">
              {localError || inlineError}
            </div>
          )}

          <DialogFooter className="flex justify-end gap-3 pt-4 border-t border-border">
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
      </AnimatedDialogContent>
    </Dialog>
  );
};

export default UniversalFormDialog;
