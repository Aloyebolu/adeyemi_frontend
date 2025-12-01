"use client";

/**
 * 🎓 Student Records Demo Page (AFUED Table v3.0)
 * Showcases full table functionality — instant sort, search, filters, selection, exports, and pagination.
 */

import React, { useEffect, useState } from "react";
import { Table } from "@/components/ui/table/Table";
import { Badge } from "@/components/ui/Badge";
import { usePage } from "@/hooks/usePage";

export default function StudentRecordsPage() {
  const { setPage } = usePage();
  useEffect(() => {
    setPage("Student Records");
  }, [setPage]);

  // 🧠 State
  const [students, setStudents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(5);

  // 🧱 Table Columns
  const columns = [
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

  // ⚙️ Simulate API Request
  const fetchStudents = async ({
    page,
    pageSize,
    search,
    sortField,
    sortOrder,
  }: {
    page: number;
    pageSize: number;
    search?: string;
    sortField?: string;
    sortOrder?: "asc" | "desc";
  }) => {
    try {
      setIsLoading(true);
      setError(null);

      await new Promise((res) => setTimeout(res, 500)); // simulate delay

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

      // simulate total page count
      setTotalPages(10);
      setStudents(mock);
      setIsLoading(false);
    } catch (err) {
      setError("Failed to fetch data");
      setIsLoading(false);
    }
  };

  // 🔄 Load first page
  useEffect(() => {
    fetchStudents({ page, pageSize: 10 });
  }, [page]);

  // 📦 Handle bulk actions
  const handleBulkAction = (action: string, selected: any[]) => {
    if (action === "export") {
      alert(`📦 Exporting ${selected.length} selected students...`);
    } else if (action === "delete") {
      alert(`🗑️ Deleting ${selected.length} selected records...`);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-surface rounded-xl shadow-md p-4">
        <h2 className="text-2xl font-semibold mb-4 text-textPrimary">
          Student Records (Interactive Demo)
        </h2>

        <Table
          columns={columns}
          data={students}
          enableSearch
          enableSort
          enablePagination
          enableSelection
          enableExport
          enableFilter
          serverMode
          pageSize={10}
          isLoading={isLoading}
          error={error}
          onBulkAction={handleBulkAction}
          onServerQuery={({ page }) => {
            setPageNumber(page);
            fetchStudents({ page, pageSize: 10 });
          }}
        />

        <p className="text-center text-sm text-textSecondary mt-4">
          Page {page} of {totalPages}
        </p>
      </div>
    </div>
  );
}
