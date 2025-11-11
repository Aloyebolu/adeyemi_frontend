"use client";

import { useRouter, useParams } from "next/navigation";
import { BookOpen, Users, BarChart2 } from "lucide-react";

const mockCourses = [
  {
    id: "csc-401",
    code: "CSC 401",
    title: "Operating Systems",
    unit: 3,
    semester: "First Semester",
    students: 48,
  },
  {
    id: "csc-402",
    code: "CSC 402",
    title: "Compiler Design",
    unit: 2,
    semester: "Second Semester",
    students: 52,
  },
  {
    id: "csc-403",
    code: "CSC 403",
    title: "Software Engineering",
    unit: 3,
    semester: "First Semester",
    students: 45,
  },
];

export default function CourseOverviewPage() {
  const router = useRouter();
  const { course_id } = useParams();

  // Get mock data (you’ll later replace this with API call)
  const course = mockCourses.find((c) => c.id === course_id);

  if (!course) {
    return (
      <div className="p-6 text-center text-gray-600">
        <h2 className="text-xl font-semibold mb-2">Course not found 😢</h2>
        <p>Please check your URL or go back to Manage Courses.</p>
      </div>
    );
  }

  const handleNavigate = (path: string) => {
    router.push(`/lecturer/courses/${course.id}/${path}`);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <h1 className="text-2xl font-bold text-[#0B3D2E] mb-2">
        {course.code}: {course.title}
      </h1>
      <p className="text-gray-600 mb-6">
        {course.unit} Unit • {course.semester} • {course.students} Students
      </p>

      {/* Action Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <button
          onClick={() => handleNavigate("materials")}
          className="flex flex-col items-center justify-center p-6 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md hover:border-[#0B3D2E] transition-all"
        >
          <BookOpen className="text-[#0B3D2E] mb-2" size={28} />
          <span className="font-semibold text-[#0B3D2E]">Materials</span>
          <p className="text-gray-500 text-sm mt-1">Upload and manage content</p>
        </button>

        <button
          onClick={() => handleNavigate("students")}
          className="flex flex-col items-center justify-center p-6 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md hover:border-[#0B3D2E] transition-all"
        >
          <Users className="text-[#0B3D2E] mb-2" size={28} />
          <span className="font-semibold text-[#0B3D2E]">Students</span>
          <p className="text-gray-500 text-sm mt-1">View registered students</p>
        </button>

        <button
          onClick={() => handleNavigate("results")}
          className="flex flex-col items-center justify-center p-6 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md hover:border-[#0B3D2E] transition-all"
        >
          <BarChart2 className="text-[#0B3D2E] mb-2" size={28} />
          <span className="font-semibold text-[#0B3D2E]">Results</span>
          <p className="text-gray-500 text-sm mt-1">Upload or edit scores</p>
        </button>
      </div>
    </div>
  );
}
