'use client'
import { useState, useEffect } from "react";
import { Table } from "@/components/ui/Table";
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle } from "@/components/ui/dialog/dialog";
import { Button } from "@/components/ui/Button";
import { useDataFetcher } from "@/lib/dataFetcher";
import { Download, PencilIcon, PlusCircle, Trash2, Trash2Icon, Upload } from "lucide-react";
import UniversalDialog from "@/components/ui/dialog/UniversalDialog";
import { useDialog } from "@/context/DialogContext";
import { useNotifications } from "@/hooks/useNotification";

type Faculty = {
  _id: string;
  name: string;
  description: string;
};

export default function FacultyDashboard() {
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { fetchData } = useDataFetcher();
  const [editingFaculty, setEditingFaculty] = useState<Faculty | null>(null);
  const [formData, setFormData] = useState({ name: "", description: "" });
  const { openDialog, closeDialog } = useDialog()
  const { addNotification } = useNotifications()

  const fetchFaculties = async () => {
    setIsLoading(true);
    try {
      const { data } = await fetchData("faculty");
      setFaculties(data.data);
    } catch (err) {
      setError("Failed to fetch faculties");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchFaculties(); }, []);

  // const openDialog = (faculty: Faculty | null = null) => {
  //   setEditingFaculty(faculty);
  //   setFormData(faculty ? { name: faculty.name, description: faculty.description } : { name: "", description: "" });
  //   setShowDialog(true);
  // };

  const handleSave = () => {
    if (editingFaculty) {
      setFaculties(prev =>
        prev.map(f => (f._id === editingFaculty._id ? { ...f, ...formData } : f))
      );
    } else {
      setFaculties(prev => [...prev, { _id: Date.now().toString(), ...formData }]);
    }
    closeDialog()
    setEditingFaculty(null);
  };

  const Delete = async (id: string) => {
    await fetchData('faculty', 'DELETE', null, { params: `${id}` })
    setFaculties(prev => prev.filter(f => f._id !== id));
    closeDialog()
    addNotification({ message: "Delete Success", variant: 'success' })
    console.log(id)
  }
  const handleEdit = (row_data: any) => {
    openDialog("form", {
      title: "Edit Faculty",
      confirmText: "Submit",
      loaderOnSubmit: true,
      fields: [
        {
          name: "name",
          label: "Name",
          defaultValue: row_data.name,
          placeholder: "Enter faculty name",
          required: true,
        },
        {
          name: "email",
          label: "Email",
          type: "text",
          defaultValue: row_data.code,
          placeholder: "Enter Code",
        },
      ],
      onSubmit: async (data: any) => {
        try {
          await fetchData("faculty", "PATCH", { ...data }, { params: row_data._id });
          closeDialog()
          addNotification({ message: "Edit Success", variant: 'success' })
          

        } catch {
          closeDialog()

          addNotification({ message: "Edit Failed", variant: 'error' })

        }
      },
    });
  };

  const handleDelete = (id: string) => {
    openDialog("confirm", {
      loaderOnConfirm: true,
      title: "Delete Course",
      message: "Are you sure you want to delete this course?",
      confirmText: "Yes, Delete",
      cancelText: "Cancel",
      icon: <Trash2 className="text-red-500" />,
      onConfirm: () => { Delete(id) },
    });

  };

  /** ✅ File Upload Handlers */
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
    ];
    if (!allowedTypes.includes(file.type)) {
      setUploadError("Only Excel files (.xlsx or .xls) are allowed.");
      return;
    }

    setUploadError(null);
    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/faculties/upload", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Upload failed");

      const data: Faculty[] = await res.json(); // assuming API returns updated faculties
      setFaculties(data);
    } catch (err) {
      setUploadError((err as Error).message);
    } finally {
      setUploading(false);
      e.target.value = ""; // reset file input
    }
  };

  const columns = [
    { accessorKey: "name", header: "Faculty Name" },
    { accessorKey: "code", header: "Code" },
    {
      accessorKey: "actions",
      header: "Actions",
      cell: (row: any) => {
        return (
          <div className="space-x-2">
            <Button onClick={() => handleEdit(row.row.original)} className="text-blue-600"><PencilIcon /></Button>
            <Button onClick={() => handleDelete(row.row.original._id)} variant="outline" className="text-red-600"><Trash2Icon /></Button>
          </div>
        )
      },
    },
  ];

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center gap-4">
        <h2 className="text-xl font-bold">Faculties</h2>

        {/* Upload Button */}
        <div className="flex gap-2">
          <Button variant="outline flex" onClick={() => {
            openDialog('import'), {

            }
          }}>
            <Upload className="w-4 h-4 mr-2" /> Import
          </Button>
          <Button variant="primary" onClick={() => {
            openDialog("form", {
              title: "Edit Faculty",
              confirmText: "Submit",
              loaderOnSubmit: true,
              fields: [
                {
                  name: "name",
                  label: "Faculty Name",
                  defaultValue: null,
                  placeholder: "Enter faculty name",
                  required: true,
                },
                {
                  name: "code",
                  label: "Faculty Ccde",
                  defaultValue: null,
                  placeholder: "Enter Faculty Code",
                  required: true
                },
              ],
              onSubmit: async (dat: any) => {
                try {
                  const {data} = await fetchData("faculty", "POST", { ...dat });
                  closeDialog()
                  addNotification({ message: "Fculty Created Successfully", variant: 'success' })
                  setFaculties(prev => [...prev, data]);

                } catch {
                  closeDialog()

                  addNotification({ message: "Creation Failed", variant: 'error' })

                }
              },
            });
          }}>
            <PlusCircle className="w-4 h-4 mr-2" /> Add
          </Button>
          <Button variant="primary" onClick={() => {
            openDialog("export", {
  fields: {
    name: "Faculty Name",
    code: "Faculty Code"
  },
  fetchableFields: ["code", "name"], // 👈 triggers API calls automatically
  onConfirm: async ({ format, filters }) => {
    console.log("Exporting", format, "with filters", filters);
    // call your backend export endpoint here
  },
});
          }}>
            <Download className="w-4 h-4 mr-2" /> Export
          </Button>
        </div>


        {/* <button onClick={() => openDialog()} className="bg-blue-600 text-white px-4 py-2 rounded">Add Faculty</button> */}
      </div>

      <Table
        columns={columns}
        data={faculties}
        enableSearch
        enableSort={false}
        enableSelection={false}
        enableExport
        isLoading={isLoading}
        error={error}
      />

      {/* Dialog */}

    </div>
  );
}
