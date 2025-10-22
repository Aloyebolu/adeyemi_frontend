'use client'

import { Table } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { Upload, PlusCircle, UserPlus, PencilIcon, Pencil, Trash2 } from "lucide-react";
import { useDepartment } from "@/hooks/useDepartment";
import { useEffect } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/Tooltip";
import { usePage } from "@/hooks/usePage";

export default function DepartmentDashboard() {
  const {
    departments,
    isLoading,
    error,
    handleEdit,
    handleDelete,
    handleAdd,
    handleExport,
    assignHod,
    handleServerQuery
  } = useDepartment();
  const {setPage} = usePage()
  useEffect(()=>{
    setPage("Departments")
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
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={() => handleEdit(row.row.original)}
            variant="outline"
            size="sm"
          >
            <Pencil className="w-4 h-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Edit</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={() => handleDelete(row.row.original._id, row.row.original.name)}
            variant="danger"
            size="sm"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Delete</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={() => assignHod(row.row.original.name, row.row.original.id, "")}
            variant="primary"
            size="sm"
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
    <div className=" space-y-4">
      <div className="flex justify-between items-center gap-4">
        <h2 className="text-xl font-bold">Departments</h2>

        <div className="flex gap-2">
          <Button variant="outline">
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
        // enableSearch
        // enableSort={false}
        serverMode={true}
        enableSelection={false}
        onServerQuery={handleServerQuery}
        enableExport
        isLoading={isLoading}
        error={error}
        enableDropDown={true}
        dropDownData={[{text: "Department Name", id: "name"}, {text: "Department Code", id: "code"}]}
        dropDownText="Choose a filter"
      />
    </div>
  );
}
