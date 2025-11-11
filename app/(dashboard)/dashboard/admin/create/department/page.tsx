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
    handleServerQuery,
    revokeHod
  } = useDepartment();
  const {setPage} = usePage()
  useEffect(()=>{
    setPage("Departments")
  })
  const columns = [
    { accessorKey: "name", header: "Department Name" },
    { accessorKey: "code", header: "Department Code" },
{
  accessorKey: "faculty_name",
  header: "Faculty",
  cell: ({ row }: any) => {
    const facultyName = row.original.faculty_name;
    const facultyId = row.original.faculty_id; // ensure this exists in your data

    return (
      <div className="flex items-center space-x-2">
        {facultyName ? (
          <a
            href={`/dashboard/admin/create/faculty/${facultyId}`}
            className="text-indigo-600 hover:text-indigo-800 font-medium underline underline-offset-2 transition-all"
          >
            {facultyName}
          </a>
        ) : (
          <span className="text-gray-400 italic">No Faculty assigned</span>
        )}
      </div>
    );
  },
},

    {
  accessorKey: "hod_name",
  header: "HOD",
  cell: ({ row }: any) => {
    const hodName = row.original.hod_name;
    const hodId = row.original.hod_id; // assuming you have this in your data

    return (
      <div className="flex items-center space-x-2">
        {hodName ? (
          <a
            href={`/lecturers/${hodId}`}
            className="text-blue-600 hover:text-blue-800 font-medium underline underline-offset-2 transition-all"
          >
            {hodName}
          </a>
        ) : (
          <span className="text-gray-400 italic">No HOD assigned</span>
        )}
      </div>
    );
  },
},


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
      size="sm"    >
      {/* <Pencil className="w-4 h-4" /> */}
      Edit Department
    </Button>
  </TooltipTrigger>
  <TooltipContent>
    Edit Department
  </TooltipContent>
</Tooltip>

<Tooltip>
  <TooltipTrigger asChild>
    <Button
      onClick={() => handleDelete(row.row.original._id, row.row.original.name)}
      variant="danger"
      size="sm"
      // disabled={!row.row.original.hod_name} // 👈 disable if no HOD
    >
      <Trash2 className="w-4 h-4" />
    </Button>
  </TooltipTrigger>
  <TooltipContent>
    {row.row.original.hod_name ? "Delete Department" : "Assign a HOD first"}
  </TooltipContent>
</Tooltip>

<Tooltip>
  <TooltipTrigger asChild>
    <Button
      onClick={() => {
        if (row.row.original.hod_name) {
          // Revoke HOD
          revokeHod(row.row.original.name, row.row.original.id, row.row.original._id); // or call a revoke function
        } else {
          // Assign HOD
          assignHod(row.row.original.name, row.row.original.id, "", row.row.original._id);
        }
      }}
      variant="primary"
      size="sm"
    >
      {row.row.original.hod_name ? "Revoke HOD" : "Assign HOD"}
    </Button>
  </TooltipTrigger>
  <TooltipContent>
    {row.row.original.hod_name
      ? `Click to revoke HOD (${row.row.original.hod_name})`
      : "Assign HOD"}
  </TooltipContent>
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
          {/* <Button variant="outline">
            <Upload className="w-4 h-4 mr-2" /> Import
          </Button> */}
          <Button variant="primary" onClick={handleAdd}>
            <PlusCircle className="w-4 h-4 mr-2" /> Add
          </Button>
          {/* <Button variant="primary" onClick={handleExport}>
            Export Departments
          </Button> */}
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
        enableExport={false}
        isLoading={isLoading}
        error={error}
        enableDropDown={true}
        dropDownData={[{text: "Department Name", id: "name"}, {text: "Department Code", id: "code"}]}
        dropDownText="Choose a filter"
      />
    </div>
  );
}
