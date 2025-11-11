"use client";

import { useEffect, useState } from "react";
import { usePage } from "@/hooks/usePage";
import { Card, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { User, Search } from "lucide-react";

// Tokens used: bg-surface, text-primary, text-muted, border, surfaceElevated

interface Student {
  id: string;
  name: string;
  matric_no: string;
  department: string;
  course_count: number;
}

export default function LecturerStudentsPage() {
  const { setPage } = usePage();
  const [students, setStudents] = useState<Student[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setPage("Students");
    // TODO: Replace with real API call later
    setStudents([
      { id: "1", name: "Aloye Breakthrough", matric_no: "CSC/22/001", department: "Computer Science", course_count: 4 },
      { id: "2", name: "Muna Love", matric_no: "CSC/22/002", department: "Computer Science", course_count: 3 },
      { id: "3", name: "James Bright", matric_no: "CSC/22/003", department: "Computer Science", course_count: 5 },
    ]);
  }, [setPage]);

  const filtered = students.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.matric_no.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto p-6">
      <Card className="rounded-xl shadow-lg bg-surface">
        <CardContent className="p-4">
          {/* Search Header */}
          <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
            <h1 className="text-2xl font-semibold text-primary">
              Registered Students
            </h1>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Input
                placeholder="Search by name or matric no."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full sm:w-64"
              />
              <Button variant="secondary" size="icon">
                <Search className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Student Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full border border-border rounded-xl overflow-hidden">
              <thead className="bg-surfaceElevated text-sm text-muted">
                <tr>
                  <th className="text-left py-3 px-4">Name</th>
                  <th className="text-left py-3 px-4">Matric No</th>
                  <th className="text-left py-3 px-4">Department</th>
                  <th className="text-left py-3 px-4">Courses</th>
                  <th className="text-left py-3 px-4">Action</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {filtered.length > 0 ? (
                  filtered.map((s) => (
                    <tr key={s.id} className="border-t border-border hover:bg-surfaceElevated">
                      <td className="py-3 px-4 flex items-center gap-2">
                        <User className="w-4 h-4 text-muted" />
                        {s.name}
                      </td>
                      <td className="py-3 px-4">{s.matric_no}</td>
                      <td className="py-3 px-4">{s.department}</td>
                      <td className="py-3 px-4">{s.course_count}</td>
                      <td className="py-3 px-4">
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="text-center py-6 text-muted"
                    >
                      No students found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
