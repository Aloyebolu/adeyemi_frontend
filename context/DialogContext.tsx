"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import UniversalDialog from "@/components/ui/dialog/UniversalDialog";
import { ExportDialog } from "@/components/ui/dialog/ExportDialog";
import { ImportDialog } from "@/components/ui/dialog/ImportDialog";
import UniversalFormDialog from "@/components/ui/dialog/UniversalFormDialog";
import ComponentDialog from "@/components/ui/dialog/CustomDialog";

type DialogType =
  | "none"
  | "confirm"
  | "alert"
  | "export"
  | "import"
  | "form"
  | "custom"; // ⭐ new type

interface DialogState {
  type: DialogType;
  props?: any;
}

interface DialogContextValue {
  openDialog: (type: DialogType, props?: any) => void;
  closeDialog: () => void;
  setError: (message: string) => void;
  clearError: () => void;
}

const DialogContext = createContext<DialogContextValue | undefined>(undefined);

export const DialogProvider = ({ children }: { children: ReactNode }) => {
  const [dialog, setDialog] = useState<DialogState>({ type: "none" });
  const [inlineError, setInlineError] = useState<string | null>(null);

  const openDialog = (type: DialogType, props: any = {}) => {
    setDialog({ type, props });
    setInlineError(null);
  };

  const closeDialog = () => {
    setDialog({ type: "none" });
    setInlineError(null);
  };

  const setError = (message: string) => {
    setInlineError(message);
  };

  const clearError = () => {
    setInlineError(null);
  };

  const sharedProps = {
    open: dialog.type !== "none",
    onOpenChange: (open: boolean) => {
      if (!open) closeDialog();
    },
  };

  const dialogWithErrorProps = {
    ...sharedProps,
    ...dialog.props,
    inlineError,
  };

  // ⭐ Auto-detect custom or missing type
  const CustomComponent = dialog.props?.component;

  return (
    <DialogContext.Provider
      value={{ openDialog, closeDialog, setError, clearError }}
    >
      {children}

      {/* Built-in dialogs */}
      {dialog.type === "confirm" || dialog.type === "alert" ? (
        <UniversalDialog {...dialogWithErrorProps} />
      ) : dialog.type === "export" ? (
        <ExportDialog {...dialogWithErrorProps} />
      ) : dialog.type === "import" ? (
        <ImportDialog {...dialogWithErrorProps} />
      ) : dialog.type === "form" ? (
        <UniversalFormDialog {...dialogWithErrorProps} />
      ) : dialog.type === "custom" && CustomComponent ? (
        <ComponentDialog {...dialogWithErrorProps} /> // ⭐ render custom
      ) : null}
    </DialogContext.Provider>
  );
};

export const useDialog = () => {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error("useDialog must be used within a DialogProvider");
  }
  return context;
};
