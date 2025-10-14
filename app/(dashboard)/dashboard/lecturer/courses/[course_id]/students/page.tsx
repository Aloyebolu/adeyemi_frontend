"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { User, BookOpen } from "lucide-react";
import theme from "@/styles/theme";

interface Student {
  id: string;
  name: string;
  matric: string;
  department: string;
  level: string;
}

export default function CourseStudentsPage() {
  const { course_id } = useParams();
  const [students, setStudents] = useState<Student[]>([]);

  useEffect(() => {
    // mock data simulation
    const mockData = [
      {
        id: "1",
        name: "Muna David",
        matric: "CSC/20/001",
        department: "Computer Science",
        level: "400L",
      },
      {
        id: "2",
        name: "James Peter",
        matric: "CSC/20/002",
        department: "Computer Science",
        level: "400L",
      },
      {
        id: "3",
        name: "Sarah Johnson",
        matric: "CSC/20/003",
        department: "Computer Science",
        level: "400L",
      },
    ];
    setStudents(mockData);
  }, [course_id]);

  return (
    <div className="max-w-6xl mx-auto p-6 min-h-screen bg-bg text-text">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <BookOpen className="text-brand" /> {course_id} - Registered Students
          </h1>
          <p className="text-text-muted">
            View all students enrolled in this course.
          </p>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-surface border border-border rounded-xl shadow-md overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-surface-elevated border-b border-border text-text-muted">
            <tr>
              <th className="text-left p-3">#</th>
              <th className="text-left p-3">Name</th>
              <th className="text-left p-3">Matric No</th>
              <th className="text-left p-3">Department</th>
              <th className="text-left p-3">Level</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student, index) => (
              <tr
                key={student.id}
                className="border-b border-border hover:bg-bg/60 transition-colors"
              >
                <td className="p-3">{index + 1}</td>
                <td className="p-3 flex items-center gap-2 font-semibold">
                  <User className="text-brand" size={16} /> {student.name}
                </td>
                <td className="p-3">{student.matric}</td>
                <td className="p-3">{student.department}</td>
                <td className="p-3">{student.level}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
