"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, AnimatedDialogContent } from "@/components/ui/dialog/dialog";
import { Button } from "@/components/ui/Button";
import { useNotifications } from "@/hooks/useNotification";

type ImportDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  apiUrl: string; // endpoint to POST the file
  title?: string;
  acceptedFormats?: string[]; // e.g., ["csv","xlsx"]
  onSuccess?: (data: any) => void;
};

export const ImportDialog: React.FC<ImportDialogProps> = ({
  open,
  onOpenChange,
  apiUrl,
  title = "Import Records",
  acceptedFormats = ["csv", "xlsx"],
  onSuccess,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const { addNotification } = useNotifications();

  const handleUpload = async () => {
    if (!file) {
      addNotification({ message: "Please select a file to upload.", variant: "warning" });
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(apiUrl, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error(`Upload failed with status ${res.status}`);
      }

      const data = await res.json();
      addNotification({ message: "Import successful ✅", variant: "success" });
      onSuccess?.(data);
      onOpenChange(false);
    } catch (err) {
      addNotification({ message: (err as Error).message || "Upload failed", variant: "error" });
    } finally {
      setLoading(false);
      setFile(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <AnimatedDialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-primary text-lg">{title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <input
            type="file"
            accept={acceptedFormats.map((f) => `.${f}`).join(",")}
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="block w-full text-sm border p-2 rounded-md"
          />
          <p className="text-sm text-textSecondary">
            Supported formats: {acceptedFormats.join(", ").toUpperCase()}.
          </p>
        </div>

        <DialogFooter>
          <Button onClick={handleUpload} variant="primary" disabled={loading}>
            {loading ? "Uploading..." : "Upload File"}
          </Button>
        </DialogFooter>
      </AnimatedDialogContent>
    </Dialog>
  );
};
