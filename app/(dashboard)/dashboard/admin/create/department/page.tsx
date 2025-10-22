'use client'

import { Table } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { Upload, PlusCircle, UserPlus } from "lucide-react";
import { useDepartment } from "@/hooks/useDepartment";
import { useEffect } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/Tooltip";

export default function DepartmentDashboard() {
  const {
    departments,
    isLoading,
    error,
    handleEdit,
    handleDelete,
    handleAdd,
    handleExport,
    assignHod
  } = useDepartment();

  useEffect(()=>{
    console.log(departments)
  })
  const columns = [
    { accessorKey: "name", header: "Department Name" },
    { accessorKey: "code", header: "Department Code" },
    { accessorKey: "faculty_name", header: "Faculty" }, // Optional: populate from backend (joined or populated)
    {
      accessorKey: "actions",
      header: "Actions",
      cell: (row: any) => (
<div className="flex items-center space-x-2">
  <Button
    onClick={() => handleEdit(row.row.original)}
    variant="outline"
    size="sm"
    className="text-blue-600 h-8"
  >
    Edit
  </Button>

  <Button
    onClick={() => handleDelete(row.row.original._id, row.row.original.name)}
    variant="outline"
    size="sm"
    className="text-red-600 h-8"
  >
    Delete
  </Button>

  <Tooltip>
    <TooltipTrigger asChild>
      <Button
        onClick={() => assignHod(row.row.original.name, row.row.original.id, "")}
        variant="outline"
        size="sm"
        className="text-purple-600 h-8 w-8 p-0 flex items-center justify-center"
      >
        <UserPlus className="w-4 h-4" />
      </Button>
    </TooltipTrigger>
    <TooltipContent>Assign HOD</TooltipContent>
  </Tooltip>
</div>

      ),
    },
  ];

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center gap-4">
        <h2 className="text-xl font-bold">Departments</h2>

        <div className="flex gap-2">
          <Button variant="outline flex">
            <Upload className="w-4 h-4 mr-2" /> Import
          </Button>
          <Button variant="primary" onClick={handleAdd}>
            <PlusCircle className="w-4 h-4 mr-2" /> Add
          </Button>
          <Button variant="primary" onClick={handleExport}>
            Export Departments
          </Button>
        </div>
      </div>

      <Table
        columns={columns}
        data={departments}
        enableSearch
        enableSort={false}
        enableSelection={false}
        enableExport
        isLoading={isLoading}
        error={error}
      />
    </div>
  );
}
