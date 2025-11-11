"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, X } from "lucide-react";
import theme from "@/styles/theme";

interface Course {
  code: string;
  title: string;
  unit: number;
  semester: string;
  students: number;
}

export default function ManageCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [form, setForm] = useState<Course>({
    code: "",
    title: "",
    unit: 0,
    semester: "",
    students: 0,
  });
  const [message, setMessage] = useState("");

  // Simulate API fetch
  useEffect(() => {
    setTimeout(() => {
      setCourses([
        { code: "CSC 401", title: "Operating Systems", unit: 3, semester: "First Semester", students: 48 },
        { code: "CSC 402", title: "Compiler Design", unit: 2, semester: "Second Semester", students: 52 },
        { code: "CSC 403", title: "Software Engineering", unit: 3, semester: "First Semester", students: 45 },
      ]);
      setLoading(false);
    }, 800);
  }, []);

  const handleOpenModal = (course?: Course) => {
    if (course) {
      setEditingCourse(course);
      setForm(course);
    } else {
      setEditingCourse(null);
      setForm({ code: "", title: "", unit: 0, semester: "", students: 0 });
    }
    setShowModal(true);
  };

  const handleSaveCourse = () => {
    if (!form.code.trim() || !form.title.trim() || !form.semester) {
      setMessage("⚠️ All fields are required!");
      return;
    }

    if (editingCourse) {
      setCourses((prev) =>
        prev.map((c) => (c.code === editingCourse.code ? form : c))
      );
      setMessage("✅ Course updated successfully!");
    } else {
      setCourses((prev) => [...prev, form]);
      setMessage("✅ New course added!");
    }

    setShowModal(false);
    setEditingCourse(null);
  };

  const handleDelete = (code: string) => {
    if (confirm(`Remove course ${code}?`)) {
      setCourses(courses.filter((c) => c.code !== code));
      setMessage("🗑️ Course removed.");
    }
  };

  const handleChange = (key: keyof Course, value: string | number) => {
    setForm({ ...form, [key]: value });
  };

  return (
    <div className="max-w-6xl mx-auto p-6 min-h-screen bg-bg text-text transition-all">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Manage Courses</h1>
          <p className="text-text-muted">
            View, edit, or remove courses you’re handling this session.
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-brand text-on-brand font-semibold px-4 py-2 rounded-lg hover:bg-brand/90 transition-colors"
          style={{ backgroundColor: theme.colors.primary }}
        >
          <Plus size={18} />
          Add Course
        </button>
      </div>

      {/* Feedback Message */}
      {message && (
        <div className="mb-4 p-3 bg-brand/10 border border-border rounded-lg text-sm text-brand">
          {message}
        </div>
      )}

      {/* Courses Table */}
      <div className="bg-surface border border-border rounded-xl shadow-md overflow-x-auto">
        {loading ? (
          <div className="text-center py-8 text-text-muted">Loading courses...</div>
        ) : courses.length === 0 ? (
          <div className="text-center py-8 text-text-muted">
            No courses found. Click “Add Course” to begin.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-surface-elevated border-b border-border text-text-muted">
              <tr>
                <th className="text-left p-3">Course Code</th>
                <th className="text-left p-3">Course Title</th>
                <th className="text-left p-3">Unit</th>
                <th className="text-left p-3">Semester</th>
                <th className="text-left p-3">Students</th>
                <th className="text-center p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => (
                <tr
                  key={course.code}
                  className="border-b border-border hover:bg-bg/60 transition-colors"
                >
                  <td className="p-3 font-semibold text-brand uppercase">{course.code}</td>
                  <td className="p-3">{course.title}</td>
                  <td className="p-3">{course.unit}</td>
                  <td className="p-3">{course.semester}</td>
                  <td className="p-3">{course.students}</td>
                  <td className="p-3 flex items-center justify-center gap-3">
                    <button
                      onClick={() => handleOpenModal(course)}
                      className="p-2 rounded-md hover:bg-brand/10 text-brand"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(course.code)}
                      className="p-2 rounded-md hover:bg-accent/10 text-accent"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50">
          <div className="bg-surface rounded-xl shadow-lg w-full max-w-md border border-border p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {editingCourse ? "Edit Course" : "Add New Course"}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-text-muted hover:text-text">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block mb-1 font-medium text-text-muted">
                  Course Code
                </label>
                <input
                  type="text"
                  value={form.code}
                  onChange={(e) =>
                    handleChange("code", e.target.value.toUpperCase())
                  }
                  className="w-full border border-border rounded-lg px-3 py-2 focus:ring-2 focus:ring-brand outline-none"
                  placeholder="e.g. CSC 405"
                  autoFocus
                />
              </div>

              <div>
                <label className="block mb-1 font-medium text-text-muted">
                  Course Title
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                  className="w-full border border-border rounded-lg px-3 py-2 focus:ring-2 focus:ring-brand outline-none"
                  placeholder="e.g. Artificial Intelligence"
                />
              </div>

              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="block mb-1 font-medium text-text-muted">
                    Unit
                  </label>
                  <input
                    type="number"
                    value={form.unit}
                    onChange={(e) =>
                      handleChange("unit", Number(e.target.value))
                    }
                    className="w-full border border-border rounded-lg px-3 py-2 focus:ring-2 focus:ring-brand outline-none"
                  />
                </div>

                <div className="flex-1">
                  <label className="block mb-1 font-medium text-text-muted">
                    Semester
                  </label>
                  <select
                    value={form.semester}
                    onChange={(e) => handleChange("semester", e.target.value)}
                    className="w-full border border-border rounded-lg px-3 py-2 focus:ring-2 focus:ring-brand outline-none bg-bg"
                  >
                    <option value="">Select</option>
                    <option value="First Semester">First Semester</option>
                    <option value="Second Semester">Second Semester</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-5 py-2 rounded-lg border border-border text-text hover:bg-bg/80 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveCourse}
                className="px-5 py-2 rounded-lg bg-brand text-on-brand font-semibold hover:bg-brand/90 transition-colors"
                style={{ backgroundColor: theme.colors.primary }}
              >
                {editingCourse ? "Save Changes" : "Add Course"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
