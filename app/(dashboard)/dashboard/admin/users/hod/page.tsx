'use client'
import { useState, useEffect } from "react";
import { Table, Column } from "@/components/ui/Table";
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle } from "@/components/ui/dialog/dialog";
import { Button } from "@/components/ui/Button";
import { Delete, PencilIcon, Trash, Trash2, Trash2Icon } from "lucide-react";
import { usePage } from "@/hooks/usePage";

interface Department {
  _id: string;
  name: string;
}

interface Hod {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  departmentId: string;
}

export default function HodDashboard() {
  const [hods, setHods] = useState<Hod[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [showDialog, setShowDialog] = useState(false);
  const [editingHod, setEditingHod] = useState<Hod | null>(null);
  const [formData, setFormData] = useState<Omit<Hod, "_id">>({
    firstName: "",
    lastName: "",
    email: "",
    departmentId: "",
  });
  const {setPage} = usePage()

  useEffect(() => {
    setPage("HODs")
    // Mock fetch
    setDepartments([
      { _id: "101", name: "Computer Science" },
      { _id: "102", name: "Mechanical" },
    ]);
    setHods([
      { _id: "501", firstName: "John", lastName: "Doe", email: "john@example.com", departmentId: "101" },
    ]);
  }, []);

  const openDialog = (hod: Hod | null = null) => {
    setEditingHod(hod);
    setFormData(
      hod
        ? { firstName: hod.firstName, lastName: hod.lastName, email: hod.email, departmentId: hod.departmentId }
        : { firstName: "", lastName: "", email: "", departmentId: "" }
    );
    setShowDialog(true);
  };

  const handleSave = () => {
    if (editingHod) {
      setHods(prev => prev.map(h => (h._id === editingHod._id ? { ...h, ...formData } : h)));
    } else {
      setHods(prev => [...prev, { _id: Date.now().toString(), ...formData }]);
    }
    setShowDialog(false);
    setEditingHod(null);
  };

  const handleDelete = (id: string) => setHods(prev => prev.filter(h => h._id !== id));

  const columns: Column<Hod>[] = [

    { accessorKey: "firstName", header: "First Name" },
    { accessorKey: "lastName", header: "Last Name" },
    { accessorKey: "email", header: "Email" },
    {
      accessorKey: "departmentId",
      header: "Department",
    cell: ({ row }) =>
  departments.find(d => d._id === row.original.departmentId)?.name || ''

    },
    {
      accessorKey: "actions",
      header: "Actions",
      cell: (row: Hod) => (
        <div className="space-x-2">
          <Button onClick={() => openDialog(row)} className="text-blue-600"><PencilIcon /></Button>
          <Button onClick={() => handleDelete(row._id)} variant="outline" className="text-red-600"><Trash2Icon/></Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">HODs</h2>
        <Button onClick={() => openDialog()} className="bg-blue-600 text-white px-4 py-2 rounded">Add HOD</Button>
      </div>

      <Table
        columns={columns}
        data={hods}
        enableSearch
        enableSort
        // enableSelection
        enableExport
        isLoading={false}
      />

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingHod ? "Edit HOD" : "Assign HOD"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="First Name"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              className="border p-2 w-full"
            />
            <input
              type="text"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              className="border p-2 w-full"
            />
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="border p-2 w-full"
            />
            <select
              value={formData.departmentId}
              onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
              className="border p-2 w-full"
            >
              <option value="">Select Department</option>
              {departments.map(d => <option key={d._id} value={d._id}>{d.name}</option>)}
            </select>
          </div>
          <DialogFooter>
            <button onClick={handleSave} className="bg-green-600 text-white px-4 py-2 rounded">
              {editingHod ? "Save Changes" : "Assign"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
