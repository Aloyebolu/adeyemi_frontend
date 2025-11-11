// /hooks/useMyCourses.ts
"use client";
import { useState, useEffect } from "react";

interface Course {
  code: string;
  title: string;
  unit: number;
  semester: string;
  students: number;
  status: string;
}

export const useMyCourses = (useMock = true) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCourses() {
      try {
        setIsLoading(true);

        if (useMock) {
          // Mock data
          await new Promise((r) => setTimeout(r, 500));
          setCourses([
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
        } else {
          // Real API call placeholder
          const res = await fetch("/api/courses");
          if (!res.ok) throw new Error("Failed to fetch courses");
          const data = await res.json();
          setCourses(data);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchCourses();
  }, [useMock]);

  return {
    courses,
    isLoading,
    error,
    refresh: () => fetchCourses(),
  };
};
