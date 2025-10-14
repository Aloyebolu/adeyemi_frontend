"use client";

/**
 * 🧱 Admin Students Management Page
 * Features: Server-side table, export/import dialogs, filtering, selection, actions.
 */

import React, { useEffect, useState } from "react";
import { Table } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog/dialog";
import { Download, Upload } from "lucide-react";
import { usePage } from "@/hooks/usePage";
import { useNotifications } from "@/hooks/useNotification";
import { ExportDialog } from "@/components/ui/dialog/ExportDialog";
import { ImportDialog } from "@/components/ui/dialog/ImportDialog";

export default function AdminStudentsPage() {
  const { setPage } = usePage();
  const { addNotification } = useNotifications();

  useEffect(() => {
    setPage("Admin - Manage Students");
  }, [setPage]);

  // 🧠 States
  const [students, setStudents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(5);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [exportFormat, setExportFormat] = useState("csv");
  const [importFile, setImportFile] = useState<File | null>(null);

  // 📦 Columns
  const  columns = [
    { header: "Student ID", accessorKey: "id" },
    { header: "Name", accessorKey: "name" },
    { header: "Department", accessorKey: "department" },
    { header: "Level", accessorKey: "level" },
    {
      header: "Status",
      accessorKey: "status",
      cell: ({ row }: any) => {
        const status = row.original.status;
        const variant =
          status === "Active"
            ? "success"
            : status === "Probation"
              ? "warning"
              : "error";
        return <Badge variant={variant}>{status}</Badge>;
      },
    },
    { header: "CGPA", accessorKey: "cgpa" },
  ];

  // 🔄 Fetch students (serverMode)
  const fetchStudents = async ({ page, pageSize, search }: any) => {
    try {
      setIsLoading(true);
      setError(null);

      // Simulate delay + mock data
      await new Promise((res) => setTimeout(res, 500));
      const start = (page - 1) * pageSize + 1;
      const mock = Array.from({ length: pageSize }, (_, i) => ({
        id: `STU${String(start + i).padStart(3, "0")}`,
        name: ["Aloye Breakthrough", "Muna Love", "Joshua Okafor", "Tobi Hassan"][
          (start + i) % 4
        ],
        department: ["Computer Science", "Mathematics", "Biology", "Chemistry"][
          (start + i) % 4
        ],
        level: [100, 200, 300, 400][(start + i) % 4],
        status: ["Active", "Probation", "Inactive"][(start + i) % 3],
        cgpa: (Math.random() * 5).toFixed(2),
      }));

      setStudents(mock);
      setTotalPages(10);
    } catch (err) {
      setError("Failed to load data");
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchStudents({ page: 1, pageSize: 10 });
  }, []);

  // 🧠 Export handler
  const handleExport = async () => {
    setShowExportDialog(false);
    addNotification({ message: `Exporting data as ${exportFormat.toUpperCase()}...`, variant: "info" });

    // Simulate backend call
    await new Promise((res) => setTimeout(res, 1000));

    addNotification({ message: "Export completed successfully ✅", variant: "success" });
  };

  // 📂 Import handler
  const handleImport = async () => {
    if (!importFile) {
      addNotification({ message: "Please select a file", variant: "warning" });
      return;
    }

    setShowImportDialog(false);
    addNotification({ message: `Importing file: ${importFile.name}`, variant: "info" });

    // Simulate backend upload delay
    await new Promise((res) => setTimeout(res, 1500));

    addNotification({ message: "Import completed successfully ✅", variant: "success" });
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-surface rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-textPrimary">Manage Students</h2>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowImportDialog(true)}>
              <Upload className="w-4 h-4 mr-2" /> Import
            </Button>
            <Button variant="primary" onClick={() => setShowExportDialog(true)}>
              <Download className="w-4 h-4 mr-2" /> Export
            </Button>
          </div>
        </div>

        <Table
          columns={columns}
          data={students}
          enableSearch
          enableSort
          enablePagination
          enableFilter
          enableSelection
          enableActions
          serverMode
          pageSize={10}
          isLoading={isLoading}
          error={error}
          onServerQuery={({ page, pageSize, search }) => {
            setPageNumber(page);
            fetchStudents({ page, pageSize, search });
          }}
          onBulkAction={(action, selected) =>
            addNotification({ message: `${action} ${selected.length} records`, variant: "info" })
          }
        />

        <p className="text-center text-sm text-textSecondary mt-4">
          Page {page} of {totalPages}
        </p>
      </div>


      <ExportDialog
        open={showExportDialog}
        onOpenChange={setShowExportDialog}
        onConfirm={({ format, filters }) => {
          console.log("Export format:", format);
          console.log("Filters applied:", filters);
          // Pass filters & format to your exportFromServer() or backend call
        }}
      />

      {/* 📁 Import Dialog */}
      
      <ImportDialog
        open={showImportDialog}
        onOpenChange={setShowImportDialog}
        apiUrl="/api/students/import"
        acceptedFormats={["csv", "xlsx"]}
        onSuccess={(data) => console.log("Imported data:", data)}
      />
    </div>
  );
}
