import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog/dialog";
import { Button } from "@/components/ui/Button";

const UniversalDialog = ({
  open,
  onOpenChange,
  type = "confirm", // "confirm" | "alert"
  title = "",
  message = "",
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  icon,
  course,
}) => {
  const isConfirm = type === "confirm";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-6 rounded-2xl shadow-xl">
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
          {message || (isConfirm && `Are you sure you want to proceed${course ? ` with ${course}` : ""}?`)}
        </p>

        <DialogFooter className="flex justify-center gap-3">
          {isConfirm ? (
            <>
              <Button variant="outline" onClick={onCancel || (() => onOpenChange(false))}>
                {cancelText}
              </Button>
              <Button onClick={onConfirm}>{confirmText}</Button>
            </>
          ) : (
            <Button onClick={onCancel || (() => onOpenChange(false))}>OK</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UniversalDialog;
