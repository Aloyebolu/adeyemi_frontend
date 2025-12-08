'use client'
import { Table } from "@/components/ui/table/Table";
import { Button } from "@/components/ui/Button";
import { Upload, PlusCircle, UserPlus, GraduationCap, Star, Award, StarHalf, StarIcon, StarsIcon, Calendar, Cable, Calendar1, CalendarX2, LucideCalendar } from "lucide-react";
import { useCourse } from "@/hooks/useCourse";
import { useEffect } from "react";
import { usePage } from "@/hooks/usePage";
import { Badge } from "@/components/ui/Badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/Tooltip";

export default function CourseDashboard({ role = "admin" }: { role?: string }) {
  const {
    courses,
    isLoading,
    error,
    handleEdit,
    handleDelete,
    handleAdd,
    handleExport,
    handleServerQuery,
    handleAssignLecturer,
    fetchCourses,
    fetchLecturerCourses,
    handleAddBorrowed,
    checkDetails,
    pagination
  } = useCourse();
  const { setPage } = usePage();
  useEffect(() => {
    console.log(courses);
    setPage("Courses");
    async function fetchLogic() {

      await fetchCourses()
    }
    fetchLogic()
  }, [setPage]);

  const columns = [
    {
      accessorKey: "name",
      header: "Course Name",
      cell: ({ row }: any) => {
        const courseName = row.original.name || "Unknown";
        const courseId = row.original._id; // assuming backend provides this
        const borrowed = row.original.borrowed
        const borrowed_department = row.original.borrowed_department
        let tooltipText;
        borrowed ? tooltipText = `This is a borrowed course from department of ${borrowed_department}` : ''

        return (
          <>
            {borrowed ? (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger >
                    <Badge variant="neutral" className="flex items-center gap-1">
                      {courseName} {/* corrected typo */}
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>{tooltipText}</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ) : (
              courseName // corrected variable typo: was coursName
            )}

          </>
        );
      },
    },

    { accessorKey: "code", header: "Course Code" },
    { accessorKey: "unit", header: "Unit" },
    role !== "hod" ? { accessorKey: "department", header: "Department" } : null,
    // 🧩 Show assigned lecturer name
    {
      accessorKey: "assigned_to_name",
      header: "Lecturer Assigned",
      cell: ({ row }: any) => {
        const lecturer = row.original.lecturer?.name || null;
        return lecturer ? (
          <Badge variant="success" className="capitalize">{lecturer}</Badge>
        ) : (
          <Badge variant="neutral" className="whitespace-nowrap">Not Assigned</Badge>
        );
      },
    },

    {
      accessorKey: "level",
      header: "Level",
      cell: ({ row }: any) => {
        const level = row.original.level
          ? row.original.level.toString()
          : "unknown";

        let variant: "success" | "warning" | "error" | "info" | "neutral" = "neutral";
        let tooltipText = "Academic level"; // default tooltip
        let Icon = GraduationCap; // default icon

        switch (level) {
          case "100":
            variant = "info"; // 📘 beginner
            tooltipText = "100-level: Introductory courses for new students.";
            Icon = Star; // small star
            break;
          case "200":
            variant = "success"; // ✅ intermediate
            tooltipText = "200-level: Intermediate courses building on foundational knowledge.";
            Icon = StarsIcon; // filled star
            break;
          case "300":
            variant = "warning"; // ⚠️ advanced
            tooltipText = "300-level: Advanced courses for deeper study.";
            Icon = Award; // award icon for higher level
            break;
          case "400":
            variant = "error"; // ❌ highest undergraduate level
            tooltipText = "400-level: Final year courses preparing for graduation.";
            Icon = GraduationCap; // graduation cap icon
            break;
          default:
            variant = "neutral";
            tooltipText = "Unknown or unspecified level.";
            Icon = GraduationCap;
            break;
        }

        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge variant={"neutral"} className="flex items-center gap-1">
                  <Icon className="w-4 h-4" />
                  {level}
                </Badge>
              </TooltipTrigger>
              <TooltipContent>{tooltipText}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      },
    },

    {
      accessorKey: "semester",
      header: "Semester",
      cell: ({ row }: any) => {
        const semester = row.original.semester?.toLowerCase();

        let variant: "success" | "warning" | "error" | "info" | "neutral" = "neutral";
        let tooltipText = "Semester information"; // default tooltip

        switch (semester) {
          case "first":
            variant = "warning"; // 📘 could use blue
            tooltipText = "Courses offered in the First Semester.";
            break;
          case "second":
            variant = "error"; // ✅ could use green
            tooltipText = "Courses offered in the Second Semester.";
            break;
          default:
            variant = "neutral";
            tooltipText = "Unknown or unspecified semester.";
            break;
        }

        // Capitalize first letter for display
        const displaySemester = semester
          ? semester.charAt(0).toUpperCase() + semester.slice(1)
          : "Unknown";

        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger >
                <Badge variant={"neutral"} className="flex items-center gap-3">
                  {/* <LucideCalendar className="w‑1 h‑1" /> */}
                  {
                    displaySemester
                  }</Badge>
              </TooltipTrigger>
              <TooltipContent>{tooltipText}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      },
    },

    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }: any) => {
        const type = row.original.type?.toLowerCase();

        let variant: "success" | "warning" | "error" | "info" | "neutral" = "neutral";
        let tooltipText = "Course type description"; // default

        switch (type) {
          case "compulsory":
          case "core":
            variant = "success";
            tooltipText = "Must be taken and passed by all students in the program.";
            break;
          case "required":
            break;
          case "borrowed":
            variant = "info";
            tooltipText = "Important courses mandated by the faculty, often foundational.";
            break;
          case "elective":
            variant = "warning";
            tooltipText = "Optional courses chosen within the department to fulfill credit requirements.";
            break;
          case "optional":
            variant = "error";
            tooltipText = "Courses that students may take freely; not required for graduation.";
            break;
          case "general":
          case "gst":
            variant = "neutral";
            tooltipText = "University-wide general courses for all students, usually foundational knowledge.";
            break;
          default:
            variant = "neutral";
            tooltipText = "Unknown or unspecified course type.";
            break;
        }

        const displayType = type
          ? type.charAt(0).toUpperCase() + type.slice(1)
          : "Unknown";

        return (
          <TooltipProvider >
            <Tooltip >
              <TooltipTrigger asChild >
                <Badge variant={variant}>{displayType}</Badge>
              </TooltipTrigger>
              <TooltipContent>{tooltipText}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      },
    },




{
  accessorKey: "actions",
  header: "Actions",
  cell: ({ row }: any) => {
    const course = row.original;
    const borrowed = course.borrowed;

    return (
      <div className="flex items-center gap-2">
        {/* Always show Details */}
        <Button
          variant="secondary"
          onClick={() => checkDetails(course)}
        >
          Details
        </Button>

        {/* Only show extra actions if NOT borrowed */}
        {!borrowed && (
          <>
            <Button
              className="text-blue-600"
              onClick={() => handleEdit(course)}
            >
              Edit
            </Button>

            <Button
              variant="outline"
              className="text-red-600"
              onClick={() => handleDelete(course._id, course.name)}
            >
              Delete
            </Button>

            <Button
              variant="primary"
              onClick={() => handleAssignLecturer(course)}
            >
              Assign
            </Button>
          </>
        )}
      </div>
    );
  },
},

  ].filter(Boolean);

return (
  <div className="space-y-4">
    <div className="flex justify-between items-center gap-4">
      <h2 className="text-xl font-bold">Courses</h2>

      <div className="flex gap-2">
        {/* <Button variant="outline">
            <Upload className="w-4 h-4 mr-2" /> Import
          </Button> */}
        <Button variant="primary" onClick={() => handleAdd(role == 'admin' ? 'admin' : 'hod')}>
          <PlusCircle className="w-4 h-4 mr-2" /> Add
        </Button>
        <Button variant="primary" onClick={() => handleAddBorrowed(role == 'admin' ? 'admin' : 'hod')}>
          <PlusCircle className="w-4 h-4 mr-2" /> Add
        </Button>
        {/* <Button variant="primary" onClick={handleExport}>
            Export Courses
          </Button> */}
      </div>
    </div>

    <Table
      pagination={pagination}
      columns={columns}
      data={courses}
      enableSelection={false}
      serverMode={true}
      onServerQuery={handleServerQuery}
      enableExport={false}
      isLoading={isLoading}
      error={error}
      enableDropDown={true}
      dropDownData={[
        { text: "Course Name", id: "courseTitle" },
        { text: "Course Code", id: "courseCode" },
        { text: "Unit", id: "unit" },
        { text: "Department", id: "departmentName" },
      ]}
      dropDownText="Choose a filter"

    />
  </div>
);
}
