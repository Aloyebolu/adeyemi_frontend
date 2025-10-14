"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FileUp, Users, Eye } from "lucide-react";
import theme from "@/styles/theme";

interface Course {
  code: string;
  title: string;
  unit: number;
  semester: string;
  students: number;
  status: string;
}

export default function MyCoursesPage() {
  const router = useRouter();

  const [courses] = useState<Course[]>([
    {
      code: "CSC401",
      title: "Operating Systems",
      unit: 3,
      semester: "First Semester",
      students: 48,
      status: "Ongoing",
    },
    {
      code: "CSC403",
      title: "Software Engineering",
      unit: 3,
      semester: "Second Semester",
      students: 45,
      status: "Completed",
    },
  ]);

  const goToPage = (path: string) => router.push(path);

  return (
    <div className="max-w-6xl mx-auto p-6 min-h-screen bg-bg text-text">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">My Courses</h1>
          <p className="text-text-muted">
            View and manage courses assigned to you this session.
          </p>
        </div>
      </div>

      {/* Courses Table */}
      <div className="bg-surface border border-border rounded-xl shadow-md overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-surface-elevated border-b border-border text-text-muted">
            <tr>
              <th className="text-left p-3">Course Code</th>
              <th className="text-left p-3">Course Title</th>
              <th className="text-left p-3">Unit</th>
              <th className="text-left p-3">Semester</th>
              <th className="text-left p-3">Students</th>
              <th className="text-left p-3">Status</th>
              <th className="text-left p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr
                key={course.code}
                className="border-b border-border hover:bg-bg/60 transition-colors"
              >
                <td className="p-3 font-semibold text-brand">{course.code}</td>
                <td className="p-3">{course.title}</td>
                <td className="p-3">{course.unit}</td>
                <td className="p-3">{course.semester}</td>
                <td className="p-3">{course.students}</td>
                <td
                  className={`p-3 font-medium ${
                    course.status === "Ongoing" ? "text-brand" : "text-accent"
                  }`}
                >
                  {course.status}
                </td>
                <td className="p-3 flex items-center justify-center gap-3">
                  <button
                    onClick={() =>
                      goToPage(`/lecturer/courses/${course.code}/students`)
                    }
                    className="p-2 rounded-md hover:bg-brand/10 text-brand"
                    title="View Students"
                  >
                    <Users size={16} />
                  </button>
                  <button
                    onClick={() =>
                      goToPage(`/lecturer/courses/${course.code}/materials`)
                    }
                    className="p-2 rounded-md hover:bg-brand/10 text-brand"
                    title="Upload Material"
                  >
                    <FileUp size={16} />
                  </button>
                  <button
                    onClick={() =>
                      goToPage(`/lecturer/courses/${course.code}/results`)
                    }
                    className="p-2 rounded-md hover:bg-accent/10 text-accent"
                    title="View Results"
                  >
                    <Eye size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
