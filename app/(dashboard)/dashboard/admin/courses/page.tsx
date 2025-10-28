'use client'
import { Table } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { Upload, PlusCircle, UserPlus } from "lucide-react";
import { useCourse } from "@/hooks/useCourse";
import { useEffect } from "react";
import { usePage } from "@/hooks/usePage";
import { Badge } from "@/components/ui/Badge";

export default function CourseDashboard() {
  const {
    courses,
    isLoading,
    error,
    handleEdit,
    handleDelete,
    handleAdd,
    handleExport,
    handleServerQuery
  } = useCourse();
  const { setPage } = usePage();
  useEffect(() => {
    console.log(courses);
    setPage("Courses");
  }, [courses, setPage]);

  const columns = [
    { accessorKey: "name", header: "Course Name" },
    { accessorKey: "code", header: "Course Code" },
    { accessorKey: "unit", header: "Unit" },
    { accessorKey: "department", header: "Department" },
    { accessorKey: "description", header: "Description" },
    { accessorKey: "level", header: "Level" },
    { accessorKey: "semester", header: "Semester" },
{
  accessorKey: "type",
  header: "Type",
  cell: ({ row }: any) => {
    // Get the type from database (e.g. "compulsory", "elective", etc.)
    const type = row.original.type?.toLowerCase();

    // Map type to your badge variant
    let variant: "success" | "warning" | "error" | "info" | "neutral" = "neutral";

    switch (type) {
      case "compulsory":
      case "core":
        variant = "success"; // ✅ Must take and pass
        break;
      case "required":
      case "faculty":
        variant = "info"; // 📘 Important but external
        break;
      case "elective":
        variant = "warning"; // ⚠️ Optional within department
        break;
      case "optional":
        variant = "error"; // ❌ Least important / free elective
        break;
      case "general":
      case "gst":
        variant = "neutral"; // 🩶 University-wide
        break;
      default:
        variant = "neutral"; // fallback
        break;
    }

    // Capitalize the first letter for display
    const displayType = type
      ? type.charAt(0).toUpperCase() + type.slice(1)
      : "Unknown";

    return <Badge variant={variant}>{displayType}</Badge>;
  },
},



    {
      accessorKey: "actions",
      header: "Actions",
      cell: (row: any) => (
        <div className="space-x-2">
          <Button onClick={() => handleEdit(row.row.original)} className="text-blue-600">Edit</Button>
          <Button onClick={() => handleDelete(row.row.original._id, row.row.original.name)} variant="outline" className="text-red-600">Delete</Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center gap-4">
        <h2 className="text-xl font-bold">Courses</h2>

        <div className="flex gap-2">
          {/* <Button variant="outline">
            <Upload className="w-4 h-4 mr-2" /> Import
          </Button> */}
          <Button variant="primary" onClick={handleAdd}>
            <PlusCircle className="w-4 h-4 mr-2" /> Add
          </Button>
          {/* <Button variant="primary" onClick={handleExport}>
            Export Courses
          </Button> */}
        </div>
      </div>

      <Table
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
          { text: "Course Name", id: "name" },
          { text: "Course Code", id: "code" },
          { text: "Unit", id: "unit" },
          { text: "Department", id: "department" },
        ]}
        dropDownText="Choose a filter"
      />
    </div>
  );
}
