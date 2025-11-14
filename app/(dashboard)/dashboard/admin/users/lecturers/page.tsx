'use client'
import { Table } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { Upload, PlusCircle, UserPlus } from "lucide-react";
import { useLecturer } from "@/hooks/useLecturer";
import { useEffect } from "react";
import { usePage } from "@/hooks/usePage";
import { Badge } from "@/components/ui/Badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/Tooltip";

export default function LecturerDashboard({role}: {role: "hod" | "lecturer"}) {
  const {
    pagination,
    lecturers,
    isLoading,
    error,
    handleEdit,
    handleDelete,
    handleAdd,
    handleExport,
    handleServerQuery,
    fetchLecturers,
    fetchHods
  } = useLecturer();
  const {setPage} = usePage()
  useEffect(() => {
    setPage("Lecturers")
    async function fetchLogic(){
    
      role=="hod"?await fetchHods() : await fetchLecturers()
    }
    fetchLogic()
  }, []);

  const columns = [
    { accessorKey: "name", header: "Full Name" },
    { accessorKey: "staff_id", header: "Staff No" },
    { accessorKey: "department", header: "Department" },
    // { accessorKey: "email", header: "Email" },
    // { accessorKey: "phone", header: "Phone" },
{
  accessorKey: "rank",
  header: "Lecturer Rank",
  cell: ({ row }: any) => {
    const rank = row.original.rank?.toLowerCase();

    let variant: "success" | "warning" | "error" | "info" | "neutral" = "neutral";
    let tooltipText = "Academic staff rank"; // default description

    switch (rank) {
      case "assistant_lecturer":
        variant = "info";
        tooltipText = "Entry-level academic responsible for assisting in teaching and research.";
        break;
      case "lecturer_ii":
        variant = "success";
        tooltipText = "Early-career lecturer focusing on teaching and developing research output.";
        break;
      case "lecturer_i":
        variant = "success";
        tooltipText = "Experienced lecturer with solid teaching and some research responsibilities.";
        break;
      case "senior_lecturer":
        variant = "warning";
        tooltipText = "Mid-career academic involved in advanced teaching, supervision, and research.";
        break;
      case "associate_professor":
        variant = "info";
        tooltipText = "Senior academic recognized for research excellence and departmental leadership.";
        break;
      case "professor":
        variant = "success";
        tooltipText = "Highest academic rank, responsible for leading research, mentorship, and scholarship.";
        break;
      default:
        variant = "neutral";
        tooltipText = "Unknown or unspecified lecturer rank.";
        break;
    }

    const displayRank = rank
      ? rank
          .split("_")
          .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ")
      : "Unknown";

    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger >
            <Badge variant={variant}>{displayRank}</Badge>
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
      cell: (row: any) => (
        <div className="space-x-2 flex">
          <Button  onClick={() => handleEdit(row.row.original)} className="text-blue-600">Edit</Button>
          <Button onClick={() => handleDelete(row.row.original._id || row.row.original.id, row.row.original.name)} variant="outline" className="text-red-600">Delete</Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
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
        pagination={pagination}
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
