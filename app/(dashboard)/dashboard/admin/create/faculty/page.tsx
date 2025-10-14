'use client'
import { useState, useEffect } from "react";
import { Table } from "@/components/ui/Table";
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle } from "@/components/ui/dialog/dialog";
import { Button } from "@/components/ui/Button";

type Faculty = {
  _id: string;
  name: string;
  description: string;
};

export default function FacultyDashboard() {
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [showDialog, setShowDialog] = useState(false);
  const [editingFaculty, setEditingFaculty] = useState<Faculty | null>(null);
  const [formData, setFormData] = useState({ name: "", description: "" });

  const fetchFaculties = async () => {
    setIsLoading(true);
    try {
      // Replace with actual API call
      const data = [
        { _id: "1", name: "Engineering", description: "Engineering Faculty" },
        { _id: "2", name: "Science", description: "Science Faculty" },
      ];
      setFaculties(data);
    } catch (err) {
      setError("Failed to fetch faculties");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchFaculties(); }, []);

  const openDialog = (faculty: Faculty | null = null) => {
    setEditingFaculty(faculty);
    setFormData(faculty ? { name: faculty.name, description: faculty.description } : { name: "", description: "" });
    setShowDialog(true);
  };

  const handleSave = () => {
    if (editingFaculty) {
      setFaculties(prev =>
        prev.map(f => (f._id === editingFaculty._id ? { ...f, ...formData } : f))
      );
    } else {
      setFaculties(prev => [...prev, { _id: Date.now().toString(), ...formData }]);
    }
    setShowDialog(false);
    setEditingFaculty(null);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this faculty?")) {
      setFaculties(prev => prev.filter(f => f._id !== id));
    }
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
    { key: "name", header: "Faculty Name" },
    { key: "description", header: "Description" },
    {
      key: "actions",
      header: "Actions",
      render: (row: Faculty) => (
        <div className="space-x-2">
          <button onClick={() => openDialog(row)} className="text-blue-600">Edit</button>
          <button onClick={() => handleDelete(row._id)} className="text-red-600">Delete</button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center gap-4">
        <h2 className="text-xl font-bold">Faculties</h2>

        {/* Upload Button */}
        <div className="flex items-center gap-2">
          <label className="bg-green-600 text-white px-4 py-2 rounded cursor-pointer">
            {uploading ? "Uploading..." : "Upload Excel"}
            <input
              type="file"
              accept=".xls,.xlsx"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
          {uploadError && <p className="text-red-600 text-sm">{uploadError}</p>}
        </div>

        <button onClick={() => openDialog()} className="bg-blue-600 text-white px-4 py-2 rounded">Add Faculty</button>
      </div>

      <Table
        columns={columns}
        data={faculties}
        enableSearch
        enableSort
        enableSelection
        enableExport
        isLoading={isLoading}
        error={error}
      />

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingFaculty ? "Edit Faculty" : "Create New Faculty"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Faculty Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="border p-2 w-full"
            />
            <textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="border p-2 w-full"
            />
          </div>
          <DialogFooter>
            <button onClick={handleSave} className="bg-green-600 text-white px-4 py-2 rounded">
              {editingFaculty ? "Save Changes" : "Create"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
