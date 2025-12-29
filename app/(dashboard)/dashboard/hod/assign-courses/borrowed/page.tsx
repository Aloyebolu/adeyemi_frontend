'use client';

import { Table } from "@/components/ui/table/Table2";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { LucideCalendar } from "lucide-react";
import { useEffect } from "react";
import { usePage } from "@/hooks/usePage";
import { useCourse } from "@/hooks/useCourse";

export default function BorrowedFromMyDepartmentPage() {
  const {
    borrowedCoursesFromMyDepartment,
    fetchBorrowedCoursesFromMyDepartment,
    pagination2,
    isLoading,
    error,
    handleAssignLecturer,
    handleUnassignLecturer,

    checkDetails,
  } = useCourse();

  const { setPage } = usePage();

  useEffect(() => {
    setPage("Borrowed From My Department");
    fetchBorrowedCoursesFromMyDepartment();
  }, [setPage]);

  const columns = [
    {
      accessorKey: "name",
      header: "Course Name",
      cell: ({ row }: any) => {
        const courseName = row.original.name || "Unknown";
        return (
          <Badge variant="neutral" className="capitalize">
            {courseName}
          </Badge>
        );
      },
    },

    { accessorKey: "code", header: "Course Code" },
    { accessorKey: "unit", header: "Unit" },

    {
      accessorKey: "borrowing_department",
      header: "Borrowing Department",
      cell: ({ row }: any) => (
        <Badge variant="info">
          {row.original.department || "Unknown"}
        </Badge>
      ),
    },

    {
      accessorKey: "assigned_to_name",
      header: "Lecturer Assigned",
      cell: ({ row }: any) => {
        const lecturer = row.original.lecturer?.name || null;
        return lecturer ? (
          <Badge variant="success" className="capitalize">{lecturer}</Badge>
        ) : (
          <Badge variant="neutral">Not Assigned</Badge>
        );
      },
    },

    {
      accessorKey: "actions",
      header: "Actions",
      cell: ({ row }: any) => {
        const course = row.original;
        const hasLecturer = !!course.lecturer?.name;

        return (
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => checkDetails(course)}
            >
              Details
            </Button>

            {hasLecturer ? (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleUnassignLecturer(course)}
              >
                Unassign
              </Button>
            ) : (
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleAssignLecturer(course)}
              >
                Assign
              </Button>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      {/* PAGE HEADER */}
      <div className="flex justify-between items-center gap-4">
        <h2 className="text-2xl font-bold">
          Courses Borrowed From My Department
        </h2>

        <Button
          variant="primary"
          onClick={fetchBorrowedCoursesFromMyDepartment}
        >
          <LucideCalendar className="w-4 h-4 mr-2" /> Refresh
        </Button>
      </div>

      {/* TABLE */}
      <Table
        pagination={pagination2}
        columns={columns}
        data={borrowedCoursesFromMyDepartment}
        enableSelection={false}
        serverMode={true}
        onServerQuery={fetchBorrowedCoursesFromMyDepartment}
        enableExport={false}
        isLoading={isLoading}
        error={error}
        enableDropDown={true}
        dropDownData={[
          { text: "Course Name", id: "courseTitle" },
          { text: "Course Code", id: "courseCode" },
          { text: "Unit", id: "unit" },
          { text: "Borrowing Department", id: "borrowingDepartment" },
        ]}
        dropDownText="Choose a filter"
      />
    </div>
  );
}
