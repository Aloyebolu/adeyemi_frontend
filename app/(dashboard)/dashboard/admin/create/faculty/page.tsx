'use client'
import { Table } from "@/components/ui/table/Table";
import { Button } from "@/components/ui/Button";
import { Upload, PlusCircle, UserPlus, GraduationCap, BookText, Building, Users } from "lucide-react";
import { useFaculty } from "@/hooks/useFaculty";
import { useEffect } from "react";
import { usePage } from "@/hooks/usePage";
import { Badge } from "@/components/ui/Badge";
import { createColumns } from "@/lib/utils/table-config";

export default function FacultyDashboard() {
  const {
    faculties,
    isLoading,
    error,
    handleEdit,
    handleDelete,
    handleAdd,
    handleExport,
    handleServerQuery,
    pagination,
    assignDean,
    revokeDean
  } = useFaculty();
  const { setPage } = usePage()
  useEffect(() => {
    console.log(faculties)
    setPage("Faculties")
  })


  const columnConfig = [
    {
      accessorKey: "name",
      header: "Faculty",
      cellType: "faculty" as const,
    },
    {
      accessorKey: "dep_count",
      header: "Departments",
      cellType: "count" as const,
      cellProps: {
        icon: BookText,
        valueKey: "dep_count",
        fallback: 0
      }
    },
    {
      accessorKey: "total_students",
      header: "Students",
      cellType: "count" as const,
      cellProps: {
        icon: GraduationCap,
        valueKey: "total_students",
        fallback: 0
      }
    },
    {
      accessorKey: "lecturerCount",
      header: "Lecturers",
      cellType: "count" as const,
      cellProps: {
        icon: BookText,
        valueKey: "total_lecturers",
        fallback: 0
      }
    },
    {
      accessorKey: "dean_name",
      header: "Dean",
      cellType: "dean" as const,
      cellProps: {
        fallbackText: "Not Assigned"
      }
    },
    {
      accessorKey: "actions",
      header: "Actions",
      cellType: "actions" as const,
      handlers: {
        onEdit: handleEdit,
        onDelete: handleDelete,
        onAssignDean: assignDean,
        onRevokeDean: revokeDean
      }
    },
  ];

  const columns = createColumns(columnConfig);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center gap-4">
        <h2 className="text-xl font-bold">Faculties</h2>

        <div className="flex gap-2">
          {/* <Button variant="outline flex">
            <Upload className="w-4 h-4 mr-2" /> Import
          </Button> */}
          <Button variant="primary" onClick={handleAdd}>
            <PlusCircle className="w-4 h-4 mr-2" /> Add
          </Button>
          {/* <Button variant="primary" onClick={handleExport}>
            Export Faculties
          </Button> */}
        </div>
      </div>

      <Table
        pagination={pagination}
        columns={columns}
        data={faculties}
        // enableSearch
        // enableSort={false}

        enableSelection={false}
        serverMode={true}
        onServerQuery={handleServerQuery}
        enableExport={false}
        isLoading={isLoading}
        error={error}
        enableDropDown={true}
        dropDownData={[{ text: "Faculty Name", id: "name" }, { text: "Faculty Code", id: "code" }]}
        dropDownText="Choose a filter"
      />
    </div>
  );
}
