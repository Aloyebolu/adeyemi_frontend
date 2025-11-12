"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/Card";
import useUser from "@/hooks/useUser";
import { Table } from "@/components/ui/Table";
// import { Table } from "@/components/Table";
// import { useUser } from "@/hooks/useUser";

export default function AuditLogsPage() {
  const { user } = useUser();
  const [logs, setLogs] = useState<any[]>([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(false);

  // 🧱 Mock Data (for testing before backend)
  const mockData = [
    {
      _id: "1",
      timestamp: new Date().toISOString(),
      userId: { username: "admin_user" },
      role: "admin",
      action: "Updated course records",
      endpoint: "/api/courses/update",
      ipAddress: "192.168.1.15",
      method: "PUT",
    },
    {
      _id: "2",
      timestamp: new Date().toISOString(),
      userId: { username: "hod_science" },
      role: "hod",
      action: "Approved lecturer registration",
      endpoint: "/api/lecturers/approve",
      ipAddress: "192.168.1.40",
      method: "POST",
    },
    {
      _id: "3",
      timestamp: new Date().toISOString(),
      userId: { username: "lecturer_chem" },
      role: "lecturer",
      action: "Uploaded assignment marks",
      endpoint: "/api/assignments/upload",
      ipAddress: "192.168.1.70",
      method: "POST",
    },
    {
      _id: "4",
      timestamp: new Date().toISOString(),
      userId: { username: "student_001" },
      role: "student",
      action: "Viewed course materials",
      endpoint: "/api/materials/view",
      ipAddress: "192.168.1.120",
      method: "GET",
    },
  ];

  // 🧠 Fetch Logs (Server Mode)
  const fetchLogs = async (query?: {
    page?: number;
    pageSize?: number;
    search?: string;
    sortField?: string;
    sortOrder?: "asc" | "desc";
    filterId?: string;
  }) => {
    setLoading(true);
    try {
      // 🔹 Simulate API latency
      await new Promise((res) => setTimeout(res, 400));

      // 🔹 Use mock data (replace with actual fetch later)
      const filtered =
        query?.filterId && query.filterId !== ""
          ? mockData.filter((log) => log.role === query.filterId)
          : mockData;

      const paginated = filtered.slice(0, query?.pageSize || 10);

      setLogs(paginated);
      setPagination({ page: 1, totalPages: 1 });
    } catch (err) {
      console.error("Failed to fetch logs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs({ page: 1 });
  }, []);

  // 🧱 Columns Definition
  const columns = [
    {
      accessorKey: "timestamp",
      header: "Timestamp",
      cell: ({ row }: any) =>
        new Date(row.original.timestamp).toLocaleString(),
    },
    {
      accessorKey: "user",
      header: "User",
      cell: ({ row }: any) => row.original.userId?.username || "Anonymous",
    },
    {
      accessorKey: "role",
      header: "Role",
    },
    {
      accessorKey: "action",
      header: "Action",
    },
    {
      accessorKey: "endpoint",
      header: "Endpoint",
    },
    {
      accessorKey: "ipAddress",
      header: "IP Address",
    },
    {
      accessorKey: "method",
      header: "Method",
    },
  ];

  return (
    <div className="p-6 space-y-4">
      <Card className="shadow-sm">
        <CardContent className="p-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold">Audit Logs</h1>
          <p className="text-sm text-gray-500">
            System-wide actions recorded automatically
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardContent>
          <Table
            columns={columns}
            data={logs}
            enableSearch
            enablePagination
            enableFilter
            enableExport
            enableSelection={false}
            showNumbering
            numberingType="(1)"
            serverMode
            onServerQuery={fetchLogs}
            pagination={pagination}
            isLoading={loading}
            variant="corporate"
            dropDownText="Filter by Role"
            // dropDownData={[
            //   { text: "All Roles", id: "" },
            //   { text: "Admin", id: "admin" },
            //   { text: "HOD", id: "hod" },
            //   { text: "Lecturer", id: "lecturer" },
            //   { text: "Student", id: "student" },
            // ]}
            tableEmptyMessage="No audit records found"
          />
        </CardContent>
      </Card>
    </div>
  );
}
