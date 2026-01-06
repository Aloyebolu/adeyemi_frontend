import React, { 
  useEffect, 
  useState, 
  useMemo, 
  useCallback, 
  memo,
  useRef 
} from "react";
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
import { 
  Select, 
  SelectContent, 
  SelectGroup, 
  SelectItem, 
  SelectLabel, 
  SelectTrigger, 
  SelectValue 
} from "../select";
import { Input } from "@/components/placeholder/input";

interface Field {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  defaultValue?: string;
  required?: boolean;
  fetchData?: ((field: string, input: string) => Promise<any[]>) | undefined;
  fetchableFields?: string[];
  displayFormat?: (record: any) => React.ReactNode;
  onSelect?: (record: any, setFormData: React.Dispatch<React.SetStateAction<Record<string, any>>>) => void;
  options?: { value: string; label: string }[];
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
  inlineError?: string | null;
}

const sizeMap = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-2xl",
};

// Memoized Field Component to prevent unnecessary re-renders
const FieldRenderer = memo(({ 
  field, 
  value, 
  onFieldChange,
  onSmartInputSelect,
  validationStatus
}: { 
  field: Field; 
  value: any;
  onFieldChange: (name: string, value: any) => void;
  onSmartInputSelect: (name: string, record: any) => void;
  validationStatus: 'default' | 'error' | 'valid';
}) => {
  const fieldKey = `${field.name}-${field.type}`;
  
  console.log('FieldRenderer rendering:', field.name);
  
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onFieldChange(field.name, e.target.value);
  }, [field.name, onFieldChange]);

  const handleSelectChange = useCallback((value: string) => {
    onFieldChange(field.name, value);
  }, [field.name, onFieldChange]);

  const handleSmartInputSelect = useCallback((record: any) => {
    onSmartInputSelect(field.name, record);
  }, [field.name, onSmartInputSelect]);

  // Determine border color based on validation status
  const getBorderClass = useMemo(() => {
    switch(validationStatus) {
      case 'error':
        return 'border-red-500 focus:ring-red-500 focus:border-red-500';
      case 'valid':
        return 'border-green-500 focus:ring-green-500 focus:border-green-500';
      default:
        return 'border-border focus:ring-2 focus:ring-primary focus:outline-none';
    }
  }, [validationStatus]);

  const renderField = useMemo(() => {
    switch (field.type) {
      case "smart":
        return (
          <SmartInput
            fieldName={field.name}
            value={value || ""}
            onValueChange={(val) => onFieldChange(field.name, val)}
            fetchData={field.fetchData}
            fetchableFields={field.fetchableFields || []}
            displayFormat={field.displayFormat}
            label=""
            placeholder={field.placeholder}
            onSelect={handleSmartInputSelect}
            className={validationStatus === 'error' ? 'border-red-500' : 
                     validationStatus === 'valid' ? 'border-green-500' : ''}
          />
        );
      
      case "dropdown":
        return (
          <Select
            onValueChange={handleSelectChange}
            value={value || ""}
          >
            <SelectTrigger className={`w-full border p-2 rounded-md focus:outline-none ${getBorderClass}`}>
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
        );
      
      default:
        return (
          <Input
            name={field.name}
            type={field.type || "text"}
            required={field.required}
            placeholder={field.placeholder}
            value={value || ""}
            onChange={handleChange}
            className={getBorderClass}
          />
        );
    }
  }, [
    field, 
    value, 
    onFieldChange, 
    handleSelectChange, 
    handleSmartInputSelect, 
    handleChange,
    getBorderClass,
    validationStatus
  ]);

  return (
    <div key={fieldKey}>
      <label className="block text-sm font-medium mb-1">
        {field.label}
      </label>
      {renderField}
    </div>
  );
});

FieldRenderer.displayName = 'FieldRenderer';

const UniversalFormDialog: React.FC<UniversalFormDialogProps> = memo(({
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
  console.log('UniversalFormDialog rendering, fields count:', fields.length);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [localError, setLocalError] = useState<string | null>(null);
  const [fieldValidation, setFieldValidation] = useState<Record<string, 'default' | 'error' | 'valid'>>({});
  const [hasSubmitted, setHasSubmitted] = useState(false);
  
  const prevFieldsRef = useRef<Field[]>([]);
  const fieldsHashRef = useRef<string>('');
  
  // Generate a hash of fields to detect changes
  const currentFieldsHash = useMemo(() => {
    return fields.map(f => `${f.name}:${f.defaultValue}`).join('|');
  }, [fields]);

  // Initialize form data only when fields actually change
  useEffect(() => {
    if (currentFieldsHash !== fieldsHashRef.current) {
      console.log('Fields changed, initializing form data');
      const initialData: Record<string, any> = {};
      const initialValidation: Record<string, 'default' | 'error' | 'valid'> = {};
      
      fields.forEach(field => {
        if (field.defaultValue !== undefined) {
          initialData[field.name] = field.defaultValue;
          // Set initial validation state based on default value
          if (field.required) {
            initialValidation[field.name] = field.defaultValue ? 'valid' : 'default';
          } else {
            initialValidation[field.name] = 'default';
          }
        } else {
          initialValidation[field.name] = 'default';
        }
      });
      
      setFormData(initialData);
      setFieldValidation(initialValidation);
      fieldsHashRef.current = currentFieldsHash;
      prevFieldsRef.current = fields;
    }
  }, [fields, currentFieldsHash]);

  // Reset form when dialog closes
  useEffect(() => {
    if (!open) {
      setLocalError(null);
      setIsSubmitting(false);
      setHasSubmitted(false);
      // Reset validation states
      const resetValidation: Record<string, 'default'> = {};
      fields.forEach(field => {
        resetValidation[field.name] = 'default';
      });
      setFieldValidation(resetValidation);
    }
  }, [open]);

  // Update validation status when form data changes
  useEffect(() => {
    const newValidation = { ...fieldValidation };
    let hasChanges = false;
    
    fields.forEach(field => {
      if (field.required) {
        const currentStatus = fieldValidation[field.name];
        const value = formData[field.name];
        const isEmpty = value === undefined || value === null || value === '';
        
        if (isEmpty && (hasSubmitted || currentStatus === 'valid')) {
          newValidation[field.name] = 'error';
          hasChanges = true;
        } else if (!isEmpty && currentStatus !== 'valid') {
          newValidation[field.name] = 'valid';
          hasChanges = true;
        }
      }
    });
    
    if (hasChanges) {
      setFieldValidation(newValidation);
    }
  }, [formData, fields]);

  // Optimized form data update
  const handleFieldChange = useCallback((name: string, value: any) => {
    setFormData(prev => {
      // Only update if value actually changed
      if (prev[name] === value) return prev;
      return { ...prev, [name]: value };
    });
  }, []);

  // Optimized smart input select handler
  const handleSmartInputSelect = useCallback((fieldName: string, record: any) => {
    setFormData(prev => {
      const field = fields.find(f => f.name === fieldName);
      if (!field) return prev;
      
      if (field.onSelect) {
        // Create a new object to trigger re-render
        const newData = { ...prev };
        field.onSelect(record, (updater) => {
          if (typeof updater === 'function') {
            setFormData(updater);
          }
        });
        return newData;
      } else {
        return {
          ...prev,
          [`${fieldName}_id`]: record.id || record._id,
          [fieldName]: record.name || record.label || "",
        };
      }
    });
  }, [fields]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    setHasSubmitted(true);
    
    // Check for missing required fields
    const missingFields: string[] = [];
    
    fields.forEach(field => {
      if (field.required && !formData[field.name]) {
        missingFields.push(field.label);
        // Set error state for this field
        setFieldValidation(prev => ({
          ...prev,
          [field.name]: 'error'
        }));
      }
    });
    
    if (missingFields.length > 0) {
      const fieldNames = missingFields.join(', ');
      setLocalError(`Missing required fields: ${fieldNames}`);
      if (loaderOnSubmit) setIsSubmitting(false);
      return;
    }

    if (loaderOnSubmit) setIsSubmitting(true);

    try {
      await onSubmit?.(formData);
      
      // Only close dialog if submission was successful and no error
      if (!localError) {
        // setTimeout(() => onOpenChange(false), 200);
      }
    } catch (err: any) {
      console.error('Form submission error:', err);
      setLocalError(err.message || "Something went wrong. Please try again.");
    } finally {
      if (loaderOnSubmit) setIsSubmitting(false);
    }
  }, [formData, fields, onSubmit, loaderOnSubmit, onOpenChange, localError]);

  const handleCancel = useCallback(() => {
    setLocalError(null);
    setHasSubmitted(false);
    // Reset validation states
    const resetValidation: Record<string, 'default'> = {};
    fields.forEach(field => {
      resetValidation[field.name] = 'default';
    });
    setFieldValidation(resetValidation);
    onCancel?.() || onOpenChange(false);
  }, [onCancel, onOpenChange, fields]);

  // Memoize the error display
  const errorDisplay = useMemo(() => {
    if (!localError && !inlineError) return null;
    
    return (
      <div className="mt-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-3">
        {localError || inlineError}
      </div>
    );
  }, [localError, inlineError]);

  // Memoize dialog content
  const dialogContent = useMemo(() => (
    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
      {fields.length > 0 ? (
        fields.map(field => (
          <FieldRenderer
            key={`${field.name}-${field.type}`}
            field={field}
            value={formData[field.name]}
            onFieldChange={handleFieldChange}
            onSmartInputSelect={handleSmartInputSelect}
            validationStatus={fieldValidation[field.name] || 'default'}
          />
        ))
      ) : (
        children
      )}
      
      {errorDisplay}
    </form>
  ), [fields, formData, handleSubmit, handleFieldChange, handleSmartInputSelect, children, errorDisplay, fieldValidation]);

  if (!open) return null;

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

        {dialogContent}

        <DialogFooter className="flex justify-end gap-3 pt-4 border-t border-border">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            {cancelText}
          </Button>

          <Button type="submit" onClick={handleSubmit} disabled={isSubmitting}>
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
      </AnimatedDialogContent>
    </Dialog>
  );
});

UniversalFormDialog.displayName = 'UniversalFormDialog';

export default UniversalFormDialog;