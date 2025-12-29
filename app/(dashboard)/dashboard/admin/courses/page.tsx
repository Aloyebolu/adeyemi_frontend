'use client'

import { useMemo, useCallback, useEffect, memo } from "react";
import { Table } from "@/components/ui/table/Table2";
import { Button } from "@/components/ui/Button";
import { PlusCircle } from "lucide-react";
import { useCourse } from "@/hooks/useCourse";
import { usePage } from "@/hooks/usePage";
import { Badge } from "@/components/ui/Badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/Tooltip";
import { GraduationCap, Star, Award, StarsIcon } from "lucide-react";

// Memoized cell components to prevent unnecessary re-renders
const CourseNameCell = memo(({ row }: any) => {
  const courseName = row.original.name || "Unknown";
  const borrowed = row.original.borrowed;
  const borrowedDepartment = row.original.borrowed_department;

  if (!borrowed) return courseName;

  return (
    <Tooltip>
      <TooltipTrigger>
        <Badge variant="neutral" className="flex items-center gap-1">
          {courseName}
        </Badge>
      </TooltipTrigger>
      <TooltipContent>
        {`This is a borrowed course from department of ${borrowedDepartment}`}
      </TooltipContent>
    </Tooltip>
  );
});
CourseNameCell.displayName = 'CourseNameCell';

const LecturerCell = memo(({ row }: any) => {
  const lecturer = row.original.lecturer?.name || null;
  return lecturer ? (
    <Badge variant="success" className="capitalize">{lecturer}</Badge>
  ) : (
    <Badge variant="neutral" className="whitespace-nowrap">Not Assigned</Badge>
  );
});
LecturerCell.displayName = 'LecturerCell';

// Predefined configurations to avoid switch statements in render
const LEVEL_CONFIG = {
  "100": { 
    variant: "info" as const, 
    tooltipText: "100-level: Introductory courses for new students.", 
    Icon: Star 
  },
  "200": { 
    variant: "success" as const, 
    tooltipText: "200-level: Intermediate courses building on foundational knowledge.", 
    Icon: StarsIcon 
  },
  "300": { 
    variant: "warning" as const, 
    tooltipText: "300-level: Advanced courses for deeper study.", 
    Icon: Award 
  },
  "400": { 
    variant: "error" as const, 
    tooltipText: "400-level: Final year courses preparing for graduation.", 
    Icon: GraduationCap 
  },
  default: { 
    variant: "neutral" as const, 
    tooltipText: "Unknown or unspecified level.", 
    Icon: GraduationCap 
  }
};

const SEMESTER_CONFIG = {
  first: { 
    variant: "warning" as const, 
    tooltipText: "Courses offered in the First Semester." 
  },
  second: { 
    variant: "error" as const, 
    tooltipText: "Courses offered in the Second Semester." 
  },
  default: { 
    variant: "neutral" as const, 
    tooltipText: "Unknown or unspecified semester." 
  }
};

const TYPE_CONFIG = {
  compulsory: { 
    variant: "success" as const, 
    tooltipText: "Must be taken and passed by all students in the program." 
  },
  core: { 
    variant: "success" as const, 
    tooltipText: "Must be taken and passed by all students in the program." 
  },
  borrowed: { 
    variant: "info" as const, 
    tooltipText: "Important courses mandated by the faculty, often foundational." 
  },
  elective: { 
    variant: "warning" as const, 
    tooltipText: "Optional courses chosen within the department to fulfill credit requirements." 
  },
  optional: { 
    variant: "error" as const, 
    tooltipText: "Courses that students may take freely; not required for graduation." 
  },
  general: { 
    variant: "neutral" as const, 
    tooltipText: "University-wide general courses for all students, usually foundational knowledge." 
  },
  gst: { 
    variant: "neutral" as const, 
    tooltipText: "University-wide general courses for all students, usually foundational knowledge." 
  },
  default: { 
    variant: "neutral" as const, 
    tooltipText: "Unknown or unspecified course type." 
  }
};

const LevelCell = memo(({ row }: any) => {
  const level = row.original.level?.toString() || "unknown";
  const config = LEVEL_CONFIG[level as keyof typeof LEVEL_CONFIG] || LEVEL_CONFIG.default;
  const { variant, tooltipText, Icon } = config;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Badge variant={variant} className="flex items-center gap-1">
          <Icon className="w-4 h-4" />
          {level}
        </Badge>
      </TooltipTrigger>
      <TooltipContent>{tooltipText}</TooltipContent>
    </Tooltip>
  );
});
LevelCell.displayName = 'LevelCell';

const SemesterCell = memo(({ row }: any) => {
  const semester = row.original.semester?.toLowerCase() || "";
  const config = SEMESTER_CONFIG[semester as keyof typeof SEMESTER_CONFIG] || SEMESTER_CONFIG.default;
  const displaySemester = semester 
    ? semester.charAt(0).toUpperCase() + semester.slice(1)
    : "Unknown";

  return (
    <Tooltip>
      <TooltipTrigger>
        <Badge variant={config.variant} className="flex items-center gap-3">
          {displaySemester}
        </Badge>
      </TooltipTrigger>
      <TooltipContent>{config.tooltipText}</TooltipContent>
    </Tooltip>
  );
});
SemesterCell.displayName = 'SemesterCell';

const TypeCell = memo(({ row }: any) => {
  const type = row.original.type?.toLowerCase() || "";
  const config = TYPE_CONFIG[type as keyof typeof TYPE_CONFIG] || TYPE_CONFIG.default;
  const displayType = type 
    ? type.charAt(0).toUpperCase() + type.slice(1)
    : "Unknown";

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Badge variant={config.variant}>{displayType}</Badge>
      </TooltipTrigger>
      <TooltipContent>{config.tooltipText}</TooltipContent>
    </Tooltip>
  );
});
TypeCell.displayName = 'TypeCell';

interface ActionsCellProps {
  row: any;
  checkDetails: (course: any) => void;
  handleEdit: (course: any) => void;
  handleDelete: (id: string, name: string) => void;
  handleAssignLecturer: (course: any) => void;
  handleUnassignLecturer: (course: any) => void;

}

const ActionsCell = memo(({ 
  row, 
  checkDetails, 
  handleEdit, 
  handleDelete, 
  handleAssignLecturer,
  handleUnassignLecturer

}: ActionsCellProps) => {
  const course = row.original;
  const borrowed = course.borrowed;
  const hasLecturer = !!course.lecturer?.name;

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="secondary"
        onClick={() => checkDetails(course)}
      >
        Details
      </Button>

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

                  {hasLecturer ? (
          <Button
            variant="destructive"
            onClick={() => handleUnassignLecturer(course)}
          >
            Unassign
          </Button>
        ) : (
          <Button
            variant="primary"
            onClick={() => handleAssignLecturer(course)}
          >
            Assign
          </Button>
        )}
        </>
      )}
    </div>
  );
});
ActionsCell.displayName = 'ActionsCell';

interface CourseDashboardProps {
  role?: string;
}

export default function CourseDashboard({ role = "admin" }: CourseDashboardProps) {
  const {
    courses,
    isLoading,
    error,
    handleEdit,
    handleDelete,
    handleAdd,
    handleAddBorrowed,
    handleServerQuery,
    handleAssignLecturer,
    handleUnassignLecturer,

    fetchCourses,
    checkDetails,
    pagination,
  } = useCourse();
  
  const { setPage } = usePage();

  // Memoize event handlers
  const memoizedCheckDetails = useCallback((course: any) => {
    checkDetails(course);
  }, [checkDetails]);

  const memoizedHandleEdit = useCallback((course: any) => {
    handleEdit(course);
  }, [handleEdit]);

  const memoizedHandleDelete = useCallback((id: string, name: string) => {
    handleDelete(id, name);
  }, [handleDelete]);

  const memoizedHandleAssignLecturer = useCallback((course: any) => {
    handleAssignLecturer(course);
  }, [handleAssignLecturer]);
    const memoizedHandleUnassignLecturer = useCallback((course: any) => {
    handleUnassignLecturer(course);
  }, [handleUnassignLecturer]);

  // Fetch courses on mount
  useEffect(() => {
    setPage("Courses");
    fetchCourses();
  }, [setPage, ]);

  // Memoize columns configuration
  const columns = useMemo(() => {
    const baseColumns = [
      {
        accessorKey: "name",
        header: "Course Name",
        cell: CourseNameCell,
      },
      { accessorKey: "code", header: "Course Code" },
      { accessorKey: "unit", header: "Unit" },
      ...(role !== "hod" ? [{ accessorKey: "department", header: "Department" }] : []),
      {
        accessorKey: "assigned_to_name",
        header: "Lecturer Assigned",
        cell: LecturerCell,
      },
      {
        accessorKey: "level",
        header: "Level",
        cell: LevelCell,
      },
      {
        accessorKey: "semester",
        header: "Semester",
        cell: SemesterCell,
      },
      {
        accessorKey: "type",
        header: "Type",
        cell: TypeCell,
      },
      {
        accessorKey: "actions",
        header: "Actions",
        cell: ({ row }: any) => (
          <ActionsCell
            row={row}
            checkDetails={memoizedCheckDetails}
            handleEdit={memoizedHandleEdit}
            handleDelete={memoizedHandleDelete}
            handleAssignLecturer={memoizedHandleAssignLecturer}
            handleUnassignLecturer={memoizedHandleUnassignLecturer}

          />
        ),
      },
    ];

    return baseColumns.filter(Boolean);
  }, [
    role,
    memoizedCheckDetails,
    memoizedHandleEdit,
    memoizedHandleDelete,
    memoizedHandleAssignLecturer
  ]);

  // Memoize dropdown data
  const dropdownData = useMemo(() => [
    { text: "Course Name", id: "courseTitle" },
    { text: "Course Code", id: "courseCode" },
    { text: "Unit", id: "unit" },
    { text: "Department", id: "departmentName" },
  ], []);

  return (
    <TooltipProvider>
      <div className="space-y-4">
        <div className="flex justify-between items-center gap-4">
          <h2 className="text-xl font-bold">Courses</h2>

          <div className="flex gap-2">
            <Button 
              variant="primary" 
              onClick={() => handleAdd(role === 'admin' ? 'admin' : 'hod')}
            >
              <PlusCircle className="w-4 h-4 mr-2" /> Add
            </Button>
            <Button 
              variant="primary" 
              onClick={() => handleAddBorrowed(role === 'admin' ? 'admin' : 'hod')}
            >
              <PlusCircle className="w-4 h-4 mr-2" /> Add Borrowed
            </Button>
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
          dropDownData={dropdownData}
          dropDownText="Choose a filter"
        />
      </div>
    </TooltipProvider>
  );
}