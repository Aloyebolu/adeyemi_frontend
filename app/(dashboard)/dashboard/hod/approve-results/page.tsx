"use client"
// File: app/dashboard/hod/approve-results/page.tsx
// Tokens consumed: theme.colors.primary, theme.colors.accent, theme.colors.surface, spacing scale (p-4, p-6), radii (rounded-xl), shadows (shadow-md)
// Description: HOD "Approve Results" page. Lists submitted results awaiting HOD approval with search, export, and approve/reject actions.
// Uses: @/components/ui/Table, @/components/ui/Badge, @/components/ui/dialog, @/components/ui/Button, lucide-react icons
import React, { useEffect, useMemo, useState } from "react";
import { CheckCircle, XCircle, MoreHorizontal, Download } from "lucide-react";
import { Table } from "@/components/ui/table/Table2";
import { Badge } from "@/components/ui/Badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog/dialog";
import {Button }from "@/components/ui/Button";
import { useNotifications } from "@/hooks/useNotification";
import { usePage } from "@/hooks/usePage";
import theme from "@/styles/theme";

interface ResultRow {
  id: string;
  student_name: string;
  student_id: string;
  course_code: string;
  course_title: string;
  lecturer: string;
  score: number;
  grade: string;
  semester: string;
  session: string;
  status: "pending" | "approved" | "rejected";
  submitted_at: string;
}

/**
 * Mock data - in real app, replace with API call
 * Keep mock in /data/ when project moves to mock-phase as AFUED rules require.
 */
const MOCK_RESULTS: ResultRow[] = [
  {
    id: "r1",
    student_name: "Amina Oladipo",
    student_id: "STU/2022/001",
    course_code: "CSE101",
    course_title: "Intro to Programming",
    lecturer: "Dr. Funmi Ade",
    score: 68,
    grade: "B",
    semester: "First",
    session: "2024/2025",
    status: "pending",
    submitted_at: "2025-10-30T09:15:00Z",
  },
  {
    id: "r2",
    student_name: "Emeka Chukwu",
    student_id: "STU/2021/215",
    course_code: "MTH201",
    course_title: "Linear Algebra",
    lecturer: "Prof. J. Olu",
    score: 45,
    grade: "D",
    semester: "Second",
    session: "2024/2025",
    status: "pending",
    submitted_at: "2025-10-31T11:02:00Z",
  },
  {
    id: "r3",
    student_name: "Grace Ife",
    student_id: "STU/2023/012",
    course_code: "PHY120",
    course_title: "Mechanics",
    lecturer: "Dr. K. Bello",
    score: 82,
    grade: "A",
    semester: "First",
    session: "2024/2025",
    status: "approved",
    submitted_at: "2025-10-28T14:22:00Z",
  },
];

const ApproveResultsPage: React.FC = () => {
  const { setPage } = usePage();
  const { addNotification } = useNotifications();

  useEffect(() => {
    setPage("Approve Results");
  }, [setPage]);

  const [rows, setRows] = useState<ResultRow[]>([]);
  const [loading, setLoading] = useState(false);

  // Dialog state
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogAction, setDialogAction] = useState<"approve" | "reject" | null>(null);
  const [selectedRow, setSelectedRow] = useState<ResultRow | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // simulate fetch
  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => {
      setRows(MOCK_RESULTS);
      setLoading(false);
    }, 600);
    return () => clearTimeout(t);
  }, []);

  const pendingCount = useMemo(
    () => rows.filter((r) => r.status === "pending").length,
    [rows]
  );

  // Table columns (TanStack-style)
  const columns = useMemo(
    () => [
      {
        header: "Student",
        accessorKey: "student_name",
        cell: (info: any) => {
          const row = info.row.original as ResultRow;
          return (
            <div className="flex flex-col">
              <span className="font-medium">{row.student_name}</span>
              <span className="text-sm text-muted-foreground">{row.student_id}</span>
            </div>
          );
        },
      },
      {
        header: "Course",
        accessorKey: "course_code",
        cell: (info: any) => {
          const row = info.row.original as ResultRow;
          return (
            <div className="flex flex-col">
              <span className="font-medium">{row.course_code} — {row.course_title}</span>
              <span className="text-sm text-muted-foreground">{row.lecturer}</span>
            </div>
          );
        },
      },
      {
        header: "Score",
        accessorKey: "score",
        cell: (info: any) => {
          const score = info.getValue<number>();
          return <span className="font-semibold">{score}</span>;
        },
      },
      {
        header: "Grade",
        accessorKey: "grade",
        cell: (info: any) => {
          const grade = info.getValue<string>();
          const variant =
            grade === "A" || grade === "B"
              ? "success"
              : grade === "C"
              ? "info"
              : "warning";
          return <Badge variant={variant}>{grade}</Badge>;
        },
      },
      {
        header: "Semester",
        accessorKey: "semester",
      },
      {
        header: "Session",
        accessorKey: "session",
      },
      {
        header: "Submitted",
        accessorKey: "submitted_at",
        cell: (info: any) => {
          const d = new Date(info.getValue<string>());
          return <span className="text-sm">{d.toLocaleString()}</span>;
        },
      },
      {
        header: "Status",
        accessorKey: "status",
        cell: (info: any) => {
          const status = info.getValue<string>();
          if (status === "approved")
            return <Badge variant="success">Approved</Badge>;
          if (status === "rejected")
            return <Badge variant="error">Rejected</Badge>;
          return <Badge variant="warning">Pending</Badge>;
        },
      },
    ],
    []
  );

  // Actions (table-level actions prop supports rowActions)
  const handleOpenConfirm = (row: ResultRow, action: "approve" | "reject") => {
    setSelectedRow(row);
    setDialogAction(action);
    setOpenDialog(true);
  };

  const performAction = async () => {
    if (!selectedRow || !dialogAction) return;
    setActionLoading(true);

    // Simulate API call
    setTimeout(() => {
      setRows((prev) =>
        prev.map((r) =>
          r.id === selectedRow.id ? { ...r, status: dialogAction === "approve" ? "approved" : "rejected" } : r
        )
      );
      addNotification({
        message:
          dialogAction === "approve"
            ? `Result for ${selectedRow.student_name} approved.`
            : `Result for ${selectedRow.student_name} rejected.`,
        variant: dialogAction === "approve" ? "success" : "error",
      });
      setActionLoading(false);
      setOpenDialog(false);
      setSelectedRow(null);
      setDialogAction(null);
    }, 900);
  };

  const exportAll = () => {
    // Let Table's enableExport handle exports. Provide a manual quick-export fallback
    addNotification({ message: "Export started (CSV).", variant: "info" });
    // A real implementation would call export util or Table's export API
  };

  return (
    <main className="max-w-6xl mx-auto p-6 min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Approve Results</h2>
          <p className="text-sm text-muted-foreground">
            Review and approve submitted course results for your department.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-sm text-muted-foreground">Pending</div>
            <div className="text-lg font-semibold">{pendingCount}</div>
          </div>
          <Button
            onClick={exportAll}
            className="min-h-10"
            aria-label="Export results"
          >
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="p-4 rounded-xl shadow-md bg-white">
        <Table
          columns={columns}
          data={rows}
          enableSearch
          enableSort
          enableExport
          enableActions
          loading={loading}
          // rowActions is a custom prop in our Table that renders action buttons per row.
          rowActions={(row: ResultRow) => (
            <div className="flex items-center gap-2">
              {row.status === "pending" && (
                <>
                  <Button
                    size="sm"
                    onClick={() => handleOpenConfirm(row, "approve")}
                    aria-label={`Approve result ${row.id}`}
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Approve
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleOpenConfirm(row, "reject")}
                    aria-label={`Reject result ${row.id}`}
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    Reject
                  </Button>
                </>
              )}

              {row.status !== "pending" && (
                <Badge variant={row.status === "approved" ? "success" : "error"}>
                  {row.status === "approved" ? "Approved" : "Rejected"}
                </Badge>
              )}
            </div>
          )}
        />
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-md rounded-xl p-6">
          <DialogHeader>
            <DialogTitle>
              {dialogAction === "approve" ? "Confirm Approve" : "Confirm Reject"}
            </DialogTitle>
          </DialogHeader>

          <div className="my-4">
            <p className="text-sm">
              Are you sure you want to{" "}
              <span className="font-semibold">
                {dialogAction === "approve" ? "approve" : "reject"}
              </span>{" "}
              the result for{" "}
              <span className="font-medium">{selectedRow?.student_name}</span> —{" "}
              <span className="text-muted-foreground">{selectedRow?.course_code}</span>?
            </p>
          </div>

          <DialogFooter className="flex items-center justify-end gap-3">
            <Button variant="ghost" onClick={() => setOpenDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={performAction}
              disabled={actionLoading}
              aria-busy={actionLoading}
            >
              {actionLoading ? "Processing..." : dialogAction === "approve" ? "Approve" : "Reject"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
};

export default ApproveResultsPage;
