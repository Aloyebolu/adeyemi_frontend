import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog/dialog";
import { Button } from "@/components/ui/Button";
import { Loader2 } from "lucide-react"; // or any spinner icon you like

interface UniversalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type?: "confirm" | "alert";
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => Promise<void> | void;
  onCancel?: () => void;
  icon?: React.ReactNode;
  course?: string;
  /** Switch confirm button to loader on confirm */
  loaderOnConfirm?: boolean;
}

const UniversalDialog: React.FC<UniversalDialogProps> = ({
  open,
  onOpenChange,
  type = "confirm",
  title = "",
  message = "",
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  icon,
  course,
  loaderOnConfirm = false,
}) => {
  const isConfirm = type === "confirm";
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    if (loaderOnConfirm) {
      setIsLoading(true);
      try {
        await onConfirm?.();
        // onOpenChange(false);
      setIsLoading(true);

        setTimeout(() => onOpenChange(false), 10000);
      } finally {
        // setIsLoading(false);
      setIsLoading(true);

      }
    } else {
      onConfirm?.();
    }
  };
//   const handleConfirm = async () => {
//   if (loaderOnConfirm) {
//     setIsLoading(true);
//     try {
//       await onConfirm?.();
//       // Wait a tick before closing so spinner can show
//     } finally {
//       setIsLoading(false);
//     }
//   } else {
//     await onConfirm?.();
//   }
// };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-6 rounded-2xl">
        <DialogHeader className="flex flex-col items-center text-center space-y-2">
          {icon && <div className="text-4xl mb-2">{icon}</div>}

          <DialogTitle
            className={`text-lg font-semibold ${
              isConfirm ? "text-primary" : "text-yellow-600"
            }`}
          >
            {title}
          </DialogTitle>
        </DialogHeader>

        <p className="text-muted text-sm mb-5 text-center">
          {message ||
            (isConfirm &&
              `Are you sure you want to proceed${
                course ? ` with ${course}` : ""
              }?`)}
        </p>

        <DialogFooter className="flex justify-center gap-3">
          {isConfirm ? (
            <>
              <Button
                variant="outline"
                onClick={onCancel || (() => onOpenChange(false))}
                disabled={isLoading}
              >
                {cancelText}
              </Button>

              <Button onClick={handleConfirm} disabled={isLoading}>
                {isLoading && loaderOnConfirm ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                {isLoading && loaderOnConfirm ? null : confirmText}
              </Button>
            </>
          ) : (
            <Button onClick={onCancel || (() => onOpenChange(false))}>
              OK
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UniversalDialog;
