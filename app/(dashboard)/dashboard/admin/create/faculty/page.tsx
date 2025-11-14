'use client'
import { Table } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { Upload, PlusCircle, UserPlus } from "lucide-react";
import { useFaculty } from "@/hooks/useFaculty";
import { useEffect } from "react";
import { usePage } from "@/hooks/usePage";

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
  } = useFaculty();
  const {setPage}= usePage()
  useEffect(()=>{
    console.log(faculties)
    setPage("Faculties")
  })


  const columns = [
    { accessorKey: "name", header: "Faculty Name" },
    { accessorKey: "code", header: "Code" },
    { accessorKey: "dep_count", header: "Department Count" },

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
        dropDownData={[{text: "Faculty Name", id: "name"}, {text: "Faculty Code", id: "code"}]}
        dropDownText="Choose a filter"
      />
    </div>
  );
}
