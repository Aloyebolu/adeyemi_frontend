'use client'
import { Table } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { Upload, PlusCircle, UserPlus } from "lucide-react";
import { useStudent } from "@/hooks/useStudent";
import { useEffect } from "react";
import { usePage } from "@/hooks/usePage";

export default function StudentDashboard() {
  const {
    students,
    isLoading,
    error,
    handleEdit,
    handleDelete,
    handleAdd,
    handleExport,
    handleServerQuery
  } = useStudent();
  const {setPage}= usePage()
  useEffect(()=>{
    setPage("Students")
  })
  useEffect(() => {
    console.log(students)
  }, [students]);

  const columns = [
    { accessorKey: "name", header: "Full Name" },
    { accessorKey: "matric_no", header: "Matric No" },
    { accessorKey: "department", header: "Department" },
    { accessorKey: "level", header: "Level" },
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
    <div className="space-y-4">
      <div className="flex justify-between items-center gap-4">
        <h2 className="text-xl font-bold">Students</h2>

        <div className="flex gap-2">
          {/* <Button variant="outline flex">
            <Upload className="w-4 h-4 mr-2" /> Import
          </Button> */}
          <Button variant="primary" onClick={handleAdd}>
            <PlusCircle className="w-4 h-4 mr-2" /> Add
          </Button>
          {/* <Button variant="primary" onClick={handleExport}>
            Export Students
          </Button> */}
        </div>
      </div>

      <Table
        columns={columns}
        data={students}
        enableSelection={false}
        serverMode={true}
        onServerQuery={handleServerQuery}
        enableExport={false}
        isLoading={isLoading}
        error={error}
        enableDropDown={true}
        dropDownData={[
          { text: "Full Name", id: "name" },
          { text: "Matric No", id: "matric_no" },
          { text: "Department", id: "department" },
        ]}
        dropDownText="Choose a filter"
      />
    </div>
  );
}
