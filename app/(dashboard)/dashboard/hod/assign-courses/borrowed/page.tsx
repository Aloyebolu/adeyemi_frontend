'use client';

import { Table } from "@/components/ui/table/Table2";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { LucideCalendar } from "lucide-react";
import { useEffect } from "react";
import { usePage } from "@/hooks/usePage";
import { useCourse } from "@/hooks/useCourse";
import NotesCard from "@/components/ui/card/NotesCard";

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

  const departmentNotes = [
    {
      text: "Courses are borrowed by other departments but taught by lecturers from your department",
      type: "info"
    },
    {
      text: "Assign lecturers to borrowed courses to enable teaching and result upload",
      type: "success"
    },
    {
      text: "Unassign lecturers only when they're no longer teaching the course",
      type: "warning"
    },
        {
      text: "Unassigning/Assigning lecturers to a course Automatically assigns them to all same courses regardless of the department",
      type: "warning"
    },
    {
      text: "Click 'Details' to view complete course information",
      type: "default"
    },
    {
      text: "Borrowed courses follow your department's academic calendar",
      type: "info"
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

      {!isLoading && (!borrowedCoursesFromMyDepartment || borrowedCoursesFromMyDepartment.length === 0) ? (
        <NotesCard
          title="No Borrowed Courses Found"
          notes={[
            {
              text: "No other departments are currently borrowing courses from your department",
              type: "info"
            },
            {
              text: "Courses will appear here when other departments borrow them",
              type: "default"
            },
            {
              text: "Check with department heads about inter-department course sharing",
              type: "warning"
            },
            {
              text: "Refresh periodically to check for new borrowed courses",
              type: "default"
            }
          ]}
          icon={<LucideCalendar className="w-5 h-5" />}
          iconColor="text-gray-500"
        />
      ) : (
        <NotesCard
          title="About Borrowed Courses"
          notes={departmentNotes}
          icon={<LucideCalendar className="w-5 h-5" />}
          iconColor="text-blue-600"
        />
      )}
    </div>
  );
}
