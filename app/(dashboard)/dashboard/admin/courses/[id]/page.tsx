"use client";

/**
 * 📘 CourseDetailsPage.tsx
 * Displays full details of a single course with lecturers, outline, and actions.
 * Consumes theme tokens & reusable components per AFUED frontend standards.
 */

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaChalkboardTeacher, FaClipboardList } from "react-icons/fa";
import { Button } from "@/components/ui/Button";
import { useCourse } from "@/hooks/useCourse";
// import { useNotification } from "@/hooks/useNotification";
import { usePage } from "@/hooks/usePage";
import theme from "@/styles/theme";
import { useNotifications } from "@/hooks/useNotification";

interface Lecturer {
  _id: string;
  name: string;
  email: string;
}

interface Course {
  _id: string;
  title: string;
  code: string;
  department: string;
  unit: number;
  level: string;
  semester: string;
  type: string;
  description: string;
  lecturers: Lecturer[];
  outline: string[];
}

const CourseDetailsPage = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const { id } = params;
  const { getCourseById } = useCourse();
  const { addNotification } = useNotifications();
  const { setPage } = usePage();

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setPage("Course Details");
  }, [setPage]);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const data = await getCourseById(id);
        const final = Array.isArray(data) ? data[0] : data;
        setCourse(final ?? null);
      } catch (error) {
        console.error("Error fetching course:", error);
        addNotification({
          message: "Failed to fetch course details.",
          variant: "error",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id]);

  if (loading)
    return (
      <p className="text-center mt-10 text-muted animate-pulse">
        Loading course details...
      </p>
    );

  if (!course)
    return (
      <p className="text-center mt-10 text-error">
        Course not found or unavailable.
      </p>
    );

  return (
    <div className="max-w-6xl mx-auto p-6 bg-surface rounded-xl shadow-md min-h-screen">
      {/* Header Section */}
      <div className="border-b border-border pb-4 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-primary mb-1">
          {course.title}
        </h1>
        <p className="text-sm text-muted font-medium">{course.code}</p>
        <p className="mt-1 text-sm text-secondary">
          {course.department} Department
        </p>
      </div>

      {/* Course Info Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Credit Unit", value: course.unit },
          { label: "Level", value: course.level },
          { label: "Semester", value: course.semester },
          { label: "Type", value: course.type },
        ].map((item, index) => (
          <div
            key={index}
            className="p-4 bg-background rounded-xl border border-border hover:shadow-lg transition duration-300"
          >
            <p className="text-sm text-muted">{item.label}</p>
            <p className="font-semibold text-accent">{item.value}</p>
          </div>
        ))}
      </div>

      {/* Course Description */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-primary mb-3">
          Course Description
        </h2>
        <p className="text-text leading-relaxed">{course.description}</p>
      </section>

      {/* Lecturers */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-primary mb-4 flex items-center gap-2">
          <FaChalkboardTeacher className="text-accent" /> Lecturers
        </h2>

        {course.lecturers?.length > 0 ? (
          <ul className="space-y-3">
            {course.lecturers.map((lec) => (
              <li
                key={lec._id}
                className="p-4 bg-background border border-border rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center hover:shadow-md transition"
              >
                <div>
                  <p className="font-medium text-text">{lec.name}</p>
                  <p className="text-sm text-muted">{lec.email}</p>
                </div>
                <Button
                  variant="ghost"
                  onClick={() => router.push(`/dashboard/lecturers/${lec._id}`)}
                  className="mt-2 sm:mt-0"
                >
                  View Profile
                </Button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted">No lecturers assigned yet.</p>
        )}
      </section>

      {/* Outline */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-primary mb-4 flex items-center gap-2">
          <FaClipboardList className="text-accent" /> Course Outline
        </h2>

        {course.outline?.length ? (
          <ol className="list-decimal pl-6 space-y-2 text-text">
            {course.outline.map((topic, index) => (
              <li
                key={index}
                className="bg-background p-2 rounded border border-border hover:bg-muted/10 transition"
              >
                {topic}
              </li>
            ))}
          </ol>
        ) : (
          <p className="text-muted">Outline not available.</p>
        )}
      </section>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row justify-end gap-4 mt-6">
        <Button
          variant="primary"
          onClick={() =>
            router.push(`${course._id}/assign`)
          }
        >
          Assign Lecturers
        </Button>

        <Button
          variant="secondary"
          onClick={() =>
            router.push(`${course._id}/edit`)
          }
        >
          Edit Course
        </Button>
      </div>
    </div>
  );
};

export default CourseDetailsPage;
