"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";
import UniversalDialog from "@/components/ui/dialog/UniversalDialog";
import { ExportDialog } from "@/components/ui/dialog/ExportDialog";
import { ImportDialog } from "@/components/ui/dialog/ImportDialog";
import UniversalFormDialog from "@/components/ui/dialog/UniversalFormDialog";

type DialogType = "none" | "confirm" | "alert" | "export" | "import" | "form";

interface DialogState {
  type: DialogType;
  props?: any;
}

interface DialogContextValue {
  openDialog: (type: DialogType, props?: any) => void;
  closeDialog: () => void;
}

const DialogContext = createContext<DialogContextValue | undefined>(undefined);

export const DialogProvider = ({ children }: { children: ReactNode }) => {
  const [dialog, setDialog] = useState<DialogState>({ type: "none" });

  const openDialog = (type: DialogType, props: any = {}) => {
    setDialog({ type, props });
  };

  const closeDialog = () => setDialog({ type: "none" });

  const sharedProps = {
    open: dialog.type !== "none",
    onOpenChange: (open: boolean) => {
      if (!open) closeDialog();
    },
  };

  return (
    <DialogContext.Provider value={{ openDialog, closeDialog }}>
      {children}

      {/* ✅ Automatically handles all dialog types */}
{dialog.type === "confirm" || dialog.type === "alert" ? (
  <UniversalDialog {...sharedProps} {...dialog.props} />
) : dialog.type === "export" ? (
  <ExportDialog {...sharedProps} {...dialog.props} />
) : dialog.type === "import" ? (
  <ImportDialog {...sharedProps} {...dialog.props} />
) : dialog.type === "form" ? (
  <UniversalFormDialog {...sharedProps} {...dialog.props} />
) : null}

    </DialogContext.Provider>
  );
};

export const useDialog = () => {
  const context = useContext(DialogContext);
  if (!context) throw new Error("useDialog must be used within a DialogProvider");
  return context;
};
