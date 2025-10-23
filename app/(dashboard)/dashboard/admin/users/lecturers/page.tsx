'use client'
import { Table } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { Upload, PlusCircle, UserPlus } from "lucide-react";
import { useLecturer } from "@/hooks/useLecturer";
import { useEffect } from "react";

export default function LecturerDashboard() {
  const {
    lecturers,
    isLoading,
    error,
    handleEdit,
    handleDelete,
    handleAdd,
    handleExport,
    handleServerQuery
  } = useLecturer();
  useEffect(() => {
    console.log(lecturers)
  }, [lecturers]);

  const columns = [
    { accessorKey: "name", header: "Full Name" },
    { accessorKey: "staff_id", header: "Staff No" },
    { accessorKey: "department", header: "Department" },
    // { accessorKey: "email", header: "Email" },
    // { accessorKey: "phone", header: "Phone" },
    { accessorKey: "rank", header: "Rank" },
    {
      accessorKey: "actions",
      header: "Actions",
      cell: (row: any) => (
        <div className="space-x-2">
          <Button onClick={() => handleEdit(row.row.original)} className="text-blue-600">Edit</Button>
          <Button onClick={() => handleDelete(row.row.original._id || row.row.original.id, row.row.original.name)} variant="outline" className="text-red-600">Delete</Button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center gap-4">
        <h2 className="text-xl font-bold">Lecturers</h2>

        <div className="flex gap-2">
          {/* <Button variant="outline">
            <Upload className="w-4 h-4 mr-2" /> Import
          </Button> */}
          <Button variant="primary" onClick={handleAdd}>
            <PlusCircle className="w-4 h-4 mr-2" /> Add
          </Button>
          {/* <Button variant="primary" onClick={handleExport}>
            Export Lecturers
          </Button> */}
        </div>
      </div>

      <Table
        columns={columns}
        data={lecturers}
        enableSelection={false}
        serverMode={true}
        onServerQuery={handleServerQuery}
        enableExport={false}
        isLoading={isLoading}
        error={error}
        enableDropDown={true}
        dropDownData={[
          { text: "Full Name", id: "name" },
          { text: "Staff No", id: "staff_no" },
          { text: "Department", id: "department" },
          { text: "Email", id: "email" },
          { text: "Phone", id: "phone" },
          { text: "Rank", id: "rank" },
        ]}
        dropDownText="Choose a filter"
      />
    </div>
  );
}
