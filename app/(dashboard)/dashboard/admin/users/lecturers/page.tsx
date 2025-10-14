"use client";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/label";
import { Plus, Search, Trash2, ShieldCheck } from "lucide-react";
import theme from "@/styles/theme";
import { usePage } from "@/hooks/usePage";

/**
 * Admin Lecturer Management Page
 * Consumes: theme.colors.primary, theme.colors.accent, theme.colors.textPrimary
 */
export default function AdminLecturersPage() {
  const [lecturers, setLecturers] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({ name: "", email: "", department: "", role: "Lecturer" });
  const [loading, setLoading] = useState(false);
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const {setPage} = usePage()

  // 🔹 Fetch lecturers
  const fetchLecturers = async () => {
    try {
      const res = await fetch("/api/lecturers", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setLecturers(data || []);
    } catch (err) {
      console.error(err);
      setLecturers([]);
    }
  };

  useEffect(() => {
    setPage('Manage Lecturers')
    fetchLecturers();
  }, []);

  // 🔹 Add lecturer
  const handleAddLecturer = async () => {
    if (!form.name || !form.email || !form.department) {
      return alert("Please fill in all required fields.");
    }
    setLoading(true);
    try {
      const res = await fetch("/api/lecturers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed");
      alert("Lecturer added successfully!");
      setForm({ name: "", email: "", department: "", role: "Lecturer" });
      fetchLecturers();
    } catch (err: any) {
      console.error(err);
      alert("Error adding lecturer: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Delete lecturer
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this lecturer?")) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/lecturers/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed");
      alert("Lecturer deleted.");
      fetchLecturers();
    } catch (err) {
      console.error(err);
      alert("Error deleting lecturer.");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Promote / Demote lecturer
  const handleRoleToggle = async (id: string, currentRole: string) => {
    const newRole = currentRole === "HOD" ? "Lecturer" : "HOD";
    if (!confirm(`Change role to ${newRole}?`)) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/lecturers/${id}/role`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role: newRole }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed");
      alert(`Role updated to ${newRole}`);
      fetchLecturers();
    } catch (err: any) {
      console.error(err);
      alert("Error updating role: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Search
  const filtered = lecturers.filter(
    (l) =>
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="max-w-6xl mx-auto  min-h-screen">

      {/* Add lecturer */}
      <Card className="mb-6 rounded-xl shadow-md">
        <CardContent className="p-4">
          <h2 className="text-lg font-semibold mb-4">Add Lecturer</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div>
              <Label>Full Name</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Dr. Muna 💖"
              />
            </div>
            <div>
              <Label>Email</Label>
              <Input
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="e.g. muna@afued.edu.ng"
              />
            </div>
            <div>
              <Label>Department</Label>
              <Input
                value={form.department}
                onChange={(e) => setForm({ ...form, department: e.target.value })}
                placeholder="e.g. Computer Science"
              />
            </div>
            <div>
              <Label>Role</Label>
              <select
                className="w-full border rounded-md p-2"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
              >
                <option value="Lecturer">Lecturer</option>
                <option value="HOD">HOD</option>
              </select>
            </div>
          </div>
          <Button
            onClick={handleAddLecturer}
            disabled={loading}
            className="bg-primary text-on-primary min-h-[2.5rem]"
          >
            <Plus size={16} className="mr-2" />
            {loading ? "Adding..." : "Add Lecturer"}
          </Button>
        </CardContent>
      </Card>

      {/* Lecturer list */}
      <Card className="rounded-xl shadow-md">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row justify-between mb-4 gap-3">
            <h2 className="text-lg font-semibold">All Lecturers</h2>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                className="pl-9"
                placeholder="Search lecturers..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {filtered.length === 0 ? (
            <p className="text-gray-500 text-sm">No lecturers found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border text-sm">
                <thead className="bg-surfaceElevated border-b">
                  <tr className="text-left">
                    <th className="p-2">Name</th>
                    <th className="p-2">Email</th>
                    <th className="p-2">Department</th>
                    <th className="p-2">Role</th>
                    <th className="p-2 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((lecturer, idx) => (
                    <tr
                      key={lecturer._id || idx}
                      className="border-b hover:bg-gray-50 transition"
                    >
                      <td className="p-2">{lecturer.name}</td>
                      <td className="p-2">{lecturer.email}</td>
                      <td className="p-2">{lecturer.department}</td>
                      <td className="p-2">{lecturer.role}</td>
                      <td className="p-2 text-center flex justify-center gap-2">
                        <button
                          className="inline-flex items-center px-2 py-1 text-xs border rounded-md"
                          onClick={() => handleRoleToggle(lecturer._id, lecturer.role)}
                        >
                          <ShieldCheck size={14} className="mr-1" /> 
                          {lecturer.role === "HOD" ? "Demote" : "Promote"}
                        </button>
                        <button
                          className="inline-flex items-center px-2 py-1 text-xs border border-red-400 text-red-500 rounded-md"
                          onClick={() => handleDelete(lecturer._id)}
                        >
                          <Trash2 size={14} className="mr-1" /> Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
