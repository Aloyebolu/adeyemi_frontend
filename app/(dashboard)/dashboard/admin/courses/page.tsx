"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/Card";
import theme from "@/styles/theme";
import { Plus, Search, Trash2, Edit3 } from "lucide-react";
import { usePage } from "@/hooks/usePage";

/**
 * Admin Course Management Page
 * Consumes: theme.colors.primary, textOnPrimary, accent, radius, spacing
 */
export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({ code: "", title: "", unit: "", lecturer: "" });
  const [loading, setLoading] = useState(false);
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const {setPage} = usePage()

  // 🔹 Fetch all courses
  const fetchCourses = async () => {
    try {
      const res = await fetch("/api/courses", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setCourses(data || []);
    } catch (err) {
      console.error(err);
      setCourses([]);
    }
  };

  useEffect(() => {
    setPage("Manage Courses")
    fetchCourses();
  }, []);

  // 🔹 Add new course
  const handleAddCourse = async () => {
    if (!form.code || !form.title || !form.unit)
      return alert("Please fill all required fields.");

    setLoading(true);
    try {
      const res = await fetch("/api/courses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed");
      alert("Course added successfully");
      setForm({ code: "", title: "", unit: "", lecturer: "" });
      fetchCourses();
    } catch (err: any) {
      console.error(err);
      alert("Error adding course: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Delete course
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this course?")) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/courses/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed");
      alert("Course deleted");
      fetchCourses();
    } catch (err) {
      console.error(err);
      alert("Error deleting course");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Filter logic
  const filtered = courses.filter(
    (c) =>
      c.code.toLowerCase().includes(search.toLowerCase()) ||
      c.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="max-w-6xl mx-auto min-h-screen">

      {/* Add new course */}
      <Card className="mb-6 rounded-xl shadow-md">
        <CardContent className="p-4">
          <h2 className="text-lg font-semibold mb-4">Add New Course</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div>
              <Label>Course Code</Label>
              <Input
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value })}
                placeholder="e.g. CSC 101"
              />
            </div>
            <div>
              <Label>Title</Label>
              <Input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. Introduction to Computing"
              />
            </div>
            <div>
              <Label>Unit</Label>
              <Input
                type="number"
                value={form.unit}
                onChange={(e) => setForm({ ...form, unit: e.target.value })}
                placeholder="e.g. 3"
              />
            </div>
            <div>
              <Label>Assign Lecturer (optional)</Label>
              <Input
                value={form.lecturer}
                onChange={(e) => setForm({ ...form, lecturer: e.target.value })}
                placeholder="e.g. Dr. Muna 💖"
              />
            </div>
          </div>
          <Button
            onClick={handleAddCourse}
            disabled={loading}
            className="bg-primary text-on-primary min-h-[2.5rem]"
          >
            <Plus size={16} className="mr-2" /> {loading ? "Adding..." : "Add Course"}
          </Button>
        </CardContent>
      </Card>

      {/* Course list */}
      <Card className="rounded-xl shadow-md">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row justify-between mb-4 gap-3">
            <h2 className="text-lg font-semibold">All Courses</h2>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                className="pl-9"
                placeholder="Search courses..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {filtered.length === 0 ? (
            <p className="text-gray-500 text-sm">No courses found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border text-sm">
                <thead className="bg-surfaceElevated border-b">
                  <tr className="text-left">
                    <th className="p-2">Code</th>
                    <th className="p-2">Title</th>
                    <th className="p-2">Unit</th>
                    <th className="p-2">Lecturer</th>
                    <th className="p-2 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((course, idx) => (
                    <tr
                      key={course._id || idx}
                      className="border-b hover:bg-gray-50 transition"
                    >
                      <td className="p-2">{course.code}</td>
                      <td className="p-2">{course.title}</td>
                      <td className="p-2">{course.unit}</td>
                      <td className="p-2">{course.lecturer || "—"}</td>
                      <td className="p-2 text-center">
                        <button
                          className="inline-flex items-center px-2 py-1 text-xs border rounded-md mr-2"
                          onClick={() => alert("Edit feature coming soon!")}
                        >
                          <Edit3 size={14} className="mr-1" /> Edit
                        </button>
                        <button
                          className="inline-flex items-center px-2 py-1 text-xs border border-red-400 text-red-500 rounded-md"
                          onClick={() => handleDelete(course._id)}
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
