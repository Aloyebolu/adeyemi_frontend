'use client'
import { useState, useEffect } from "react";
import { Table } from "@/components/ui/Table";
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle } from "@/components/ui/dialog/dialog";

export default function DepartmentDashboard() {
  const [departments, setDepartments] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState(null);
  const [formData, setFormData] = useState({ name: "", code: "", facultyId: "" });

  useEffect(() => {
    // Mock fetch
    setFaculties([
      { _id: "1", name: "Engineering" },
      { _id: "2", name: "Science" },
    ]);
    setDepartments([
      { _id: "101", name: "Computer Science", code: "CSC", facultyId: "1" },
      { _id: "102", name: "Mechanical", code: "MEC", facultyId: "1" },
    ]);
  }, []);

  const openDialog = (dept = null) => {
    setEditingDepartment(dept);
    setFormData(
      dept ? { name: dept.name, code: dept.code, facultyId: dept.facultyId } : { name: "", code: "", facultyId: "" }
    );
    setShowDialog(true);
  };

  const handleSave = () => {
    if (editingDepartment) {
      setDepartments((prev) =>
        prev.map((d) => (d._id === editingDepartment._id ? { ...d, ...formData } : d))
      );
    } else {
      setDepartments((prev) => [...prev, { _id: Date.now().toString(), ...formData }]);
    }
    setShowDialog(false);
    setEditingDepartment(null);
  };

  const handleDelete = (id) => setDepartments((prev) => prev.filter((d) => d._id !== id));

  const columns = [
    { key: "name", header: "Department Name" },
    { key: "code", header: "Code" },
    { key: "facultyId", header: "Faculty", render: (row) => faculties.find(f => f._id === row.facultyId)?.name },
    {
      key: "actions",
      header: "Actions",
      render: (row) => (
        <div className="space-x-2">
          <button onClick={() => openDialog(row)} className="text-blue-600">Edit</button>
          <button onClick={() => handleDelete(row._id)} className="text-red-600">Delete</button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Departments</h2>
        <button onClick={() => openDialog()} className="bg-blue-600 text-white px-4 py-2 rounded">Add Department</button>
      </div>

      <Table
        columns={columns}
        data={departments}
        enableSearch
        enableSort
        enableSelection
        enableExport
        isLoading={isLoading}
      />

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingDepartment ? "Edit Department" : "Create Department"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Department Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="border p-2 w-full"
            />
            <input
              type="text"
              placeholder="Code"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              className="border p-2 w-full"
            />
            <select
              value={formData.facultyId}
              onChange={(e) => setFormData({ ...formData, facultyId: e.target.value })}
              className="border p-2 w-full"
            >
              <option value="">Select Faculty</option>
              {faculties.map(f => <option key={f._id} value={f._id}>{f.name}</option>)}
            </select>
          </div>
          <DialogFooter>
            <button onClick={handleSave} className="bg-green-600 text-white px-4 py-2 rounded">
              {editingDepartment ? "Save Changes" : "Create"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
