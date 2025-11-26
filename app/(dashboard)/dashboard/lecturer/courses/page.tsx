"use client";
import { useEffect } from "react";
import { Table } from "@/components/ui/table/Table";
import { Button } from "@/components/ui/Button";
import { FileUp, Users, Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/Badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/Tooltip";
import { useCourse } from "@/hooks/useCourse";

export default function MyCoursesPage() {
  const router = useRouter();
  const { courses, fetchLecturerCourses, isLoading, error } = useCourse();

  // ✅ Fetch lecturer's courses automatically
  useEffect(() => {
    fetchLecturerCourses();
  }, []);

  const columns = [
    { accessorKey: "code", header: "Course Code" },
    { accessorKey: "name", header: "Course Title" },
    { accessorKey: "unit", header: "Unit" },
    {
      accessorKey: "semester",
      header: "Semester",
      cell: ({ row }: any) => {
        const sem = row?.original?.semester?.toLowerCase();
        const display = sem?.charAt(0).toUpperCase() + sem?.slice(1);
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Badge variant="neutral">{display}</Badge>
              </TooltipTrigger>
              <TooltipContent>
                {sem === "first"
                  ? "Courses for the First Semester."
                  : sem === "second"
                  ? "Courses for the Second Semester."
                  : "Summer Semester Course."}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      },
    },
    { accessorKey: "students", header: "Students" },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }: any) => (
        <Badge
          variant={row.original.status === "Ongoing" ? "success" : "neutral"}
        >
          {row.original.status}
        </Badge>
      ),
    },
    {
      accessorKey: "actions",
      header: "Actions",
      cell: ({ row }: any) => {
        const { code } = row.original;
        return (
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={() => router.push(`./courses/${code}/students`)}
              variant="ghost"
              title="View Students"
            >
              <Users size={14} />
            </Button>
            <Button
              size="sm"
              onClick={() => router.push(`./courses/${code}/materials`)}
              variant="ghost"
              title="Course Materials"
            >
              <FileUp size={14} />
            </Button>
            <Button
              size="sm"
              onClick={() => router.push(`./courses/${code}/results`)}
              variant="ghost"
              title="View Results"
            >
              <Eye size={14} />
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">My Courses</h2>
      </div>

      <Table
        columns={columns}
        data={courses || []}
        isLoading={isLoading}
        error={error}
        enableSelection={false}
        enableExport={false}
        serverMode={false}
        variant="default"
        controls={false}
        showNumbering={true}
        numberingType="(1)"
        numberingText="(S/N)"
      />
    </div>
  );
}
