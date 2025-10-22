"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog/dialog";
import { Button } from "@/components/ui/Button";
import { Download, Loader2 } from "lucide-react";
import AdvancedFilterSystem from "@/components/ui/AdvancedFilterSystem";

interface ExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (options: { format: string; filters: any }) => void;
  fields?: Record<string, string>;
  fetchableFields?: string[];
  inlineError?: string | null; // 💫 new optional prop from DialogProvider
}

export const ExportDialog: React.FC<ExportDialogProps> = ({
  open,
  onOpenChange,
  onConfirm,
  fields = {},
  fetchableFields = [],
  inlineError = null, // receives inlineError from DialogProvider if available
}) => {
  const [selectedFormat, setSelectedFormat] = useState("csv");
  const [filters, setFilters] = useState({});
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null); // 💎 local error

  const handleConfirm = async () => {
    setLoading(true);
    setLocalError(null); // reset local error
    try {
      if (!selectedFormat) {
        throw new Error("Please select an export format first.");
      }


      await onConfirm({ format: selectedFormat, filters });
      // onOpenChange(false);
    } catch (err: any) {
      setLocalError(err.message || "Export failed. Please try again.");
    } finally {
      setLoading(false);
    }
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

          {/* Format Buttons */}
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

          {/* Advanced Filter System */}
          <div className="border border-border rounded-xl overflow-hidden">
            <AdvancedFilterSystem
              fields={fields}
              fetchableFields={fetchableFields}
              onFiltersChange={setFilters}
            />
          </div>

          {/* 💥 Inline Error Display */}
          {(localError || inlineError) && (
            <div className="mt-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-3 animate-fade-in">
              {localError || inlineError}
            </div>
          )}
        </div>

        <DialogFooter className="flex justify-between p-4 border-t border-border bg-surfaceElevated">
          <p className="text-sm text-textSecondary">
            Your filters will be applied to the exported data.
          </p>

          <Button onClick={handleConfirm} variant="primary" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Exporting...
              </>
            ) : (
              "Confirm Export"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ExportDialog;
