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
  loaderOnConfirm?: boolean;
  /** ⚠️ Enables extra safety for destructive actions like delete */
  dangerZone?: boolean;
  /** Optional keyword to confirm deletion, e.g. "DELETE" */
  dangerKeyword?: string;
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
  dangerZone = false,
  dangerKeyword = "DELETE",
}) => {
  const isConfirm = type === "confirm";
  const [isLoading, setIsLoading] = useState(false);
  const [confirmInput, setConfirmInput] = useState("");

  const handleConfirm = async () => {
    if (loaderOnConfirm) {
      setIsLoading(true);
      try {
        await onConfirm?.();
        setTimeout(() => onOpenChange(false), 1000);
      } finally {
        setIsLoading(false);
      }
    } else {
      onConfirm?.();
    }
  };

  const dangerConfirmed =
    !dangerZone || confirmInput.trim() === dangerKeyword.toUpperCase();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-6 rounded-2xl">
        <DialogHeader className="flex flex-col items-center text-center space-y-2">
          {icon && <div className="text-4xl mb-2">{icon}</div>}

          <DialogTitle
            className={`text-lg font-semibold ${
              dangerZone ? "text-red-600" : isConfirm ? "text-primary" : "text-yellow-600"
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

        {dangerZone && (
          <div className="bg-red-50 border border-red-200 p-4 rounded-xl mb-4 text-center">
            <p className="text-sm text-red-600 mb-2">
              This action is <strong>irreversible</strong>. To confirm, type{" "}
              <span className="font-semibold">{dangerKeyword.toUpperCase()}</span> below:
            </p>
            <input
              type="text"
              className="w-full border border-red-300 p-2 rounded-lg text-center outline-none focus:ring-2 focus:ring-red-400"
              placeholder={`Type "${dangerKeyword.toUpperCase()}"`}
              value={confirmInput}
              onChange={(e) => setConfirmInput(e.target.value)}
            />
          </div>
        )}

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

              <Button
                onClick={handleConfirm}
                disabled={isLoading || !dangerConfirmed}
                className={dangerZone ? "bg-red-600 hover:bg-red-700 text-white" : ""}
              >
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
