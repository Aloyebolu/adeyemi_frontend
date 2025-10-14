"use client";

/**
 * 🧩 AFUED Advanced Export Dialog
 * Integrates Smart Filters + Export Options (CSV, XLSX, PDF)
 * Used across all admin pages for controlled data exports.
 */

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog/dialog";
import { Button } from "@/components/ui/Button";
import { Download } from "lucide-react";
import AdvancedFilterSystem from "@/components/ui/AdvancedFilterSystem"; // Your filter builder component

interface ExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (options: { format: string; filters: any }) => void;
}

export const ExportDialog: React.FC<ExportDialogProps> = ({
  open,
  onOpenChange,
  onConfirm,
}) => {
  const [selectedFormat, setSelectedFormat] = useState("csv");
  const [filters, setFilters] = useState({});

  const handleConfirm = () => {
    onConfirm({ format: selectedFormat, filters });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl p-0 overflow-hidden">
        <DialogHeader className="p-4 border-b border-border">
          <DialogTitle className="text-lg font-semibold text-primary flex items-center gap-2">
            <Download className="w-5 h-5" /> Export Student Records
          </DialogTitle>
        </DialogHeader>

        <div className="max-h-[70vh] overflow-y-auto p-4">
          <p className="text-sm text-textSecondary mb-4">
            Choose your export format and optionally apply filters before exporting.
          </p>

          <div className="flex gap-3 mb-6">
            {["csv", "xlsx", "pdf"].map((f) => (
              <Button
                key={f}
                variant={selectedFormat === f ? "primary" : "outline"}
                onClick={() => setSelectedFormat(f)}
              >
                {f.toUpperCase()}
              </Button>
            ))}
          </div>

          {/* Integrate your full Advanced Filter UI inside the dialog */}
          <div className="border border-border rounded-xl overflow-hidden">
            <AdvancedFilterSystem />
          </div>
        </div>

        <DialogFooter className="flex justify-between p-4 border-t border-border bg-surfaceElevated">
          <p className="text-sm text-textSecondary">
            Your filters will be applied to the exported data.
          </p>
          <Button onClick={handleConfirm} variant="primary">
            Confirm Export
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
