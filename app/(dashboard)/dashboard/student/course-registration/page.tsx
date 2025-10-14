"use client";

import { useEffect, useState } from "react";
import { usePage } from "@/hooks/usePage";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useNotifications } from "@/hooks/useNotification";
import { Badge } from "@/components/ui/Badge";
import { motion } from "framer-motion";
import {
  BookOpen,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ClipboardList,
} from "lucide-react";

interface Course {
  course_code: string;
  course_title: string;
  credit_unit: number;
  semester: string;
  level: number;
  department: string;
  status: "Core" | "Elective";
  carryover?: boolean;
}

export default function CourseRegistrationPage() {
  const { setPage } = usePage();
  const [availableCourses, setAvailableCourses] = useState<Course[]>([]);
  const [registeredCourses, setRegisteredCourses] = useState<Course[]>([]);
  const [totalUnits, setTotalUnits] = useState<number>(0);
  const [finalized, setFinalized] = useState<boolean>(false);
  const { addNotification } = useNotifications();

  useEffect(() => {
    setPage("Course Registration");

    // Simulated mock data for 200L Computer Science student
    setAvailableCourses([
      {
        course_code: "CSC201",
        course_title: "Data Structures",
        credit_unit: 3,
        semester: "First",
        level: 200,
        department: "Computer Science",
        status: "Core",
      },
      {
        course_code: "CSC204",
        course_title: "Database Systems",
        credit_unit: 3,
        semester: "First",
        level: 200,
        department: "Computer Science",
        status: "Elective",
      },
      {
        course_code: "MAT202",
        course_title: "Mathematical Methods II",
        credit_unit: 2,
        semester: "First",
        level: 200,
        department: "Computer Science",
        status: "Core",
      },
      {
        course_code: "GST201",
        course_title: "Entrepreneurship Development",
        credit_unit: 2,
        semester: "First",
        level: 200,
        department: "General Studies",
        status: "Core",
      },
      {
        course_code: "CSC102",
        course_title: "Introduction to Programming (Carry Over)",
        credit_unit: 3,
        semester: "Second",
        level: 100,
        department: "Computer Science",
        status: "Core",
        carryover: true,
      },
      {
        course_code: "STA205",
        course_title: "Probability and Statistics",
        credit_unit: 3,
        semester: "First",
        level: 200,
        department: "Computer Science",
        status: "Elective",
      },
      {
        course_code: "PHY202",
        course_title: "Digital Electronics",
        credit_unit: 2,
        semester: "First",
        level: 200,
        department: "Computer Science",
        status: "Core",
      },
    ]);
  }, [setPage]);

  useEffect(() => {
    const total = registeredCourses.reduce((acc, c) => acc + c.credit_unit, 0);
    setTotalUnits(total);
  }, [registeredCourses]);

  const handleRegister = (course: Course) => {
    if (finalized) return;
    if (registeredCourses.find((c) => c.course_code === course.course_code)) {
      addNotification({ variant: "warning", message: "Course already registered" });
      return;
    }
    if (totalUnits + course.credit_unit > 24) {
      addNotification({
        variant: "error",
        message: "Maximum credit unit exceeded (24 units)",
      });
      return;
    }
    setRegisteredCourses([...registeredCourses, course]);
    addNotification({
      variant: "success",
      message: `${course.course_code} added successfully`,
    });
  };

  const handleDrop = (course: Course) => {
    if (finalized) return;
    setRegisteredCourses(
      registeredCourses.filter((c) => c.course_code !== course.course_code)
    );
    addNotification({
      variant: "info",
      message: `${course.course_code} dropped`,
    });
  };

  const handleSubmit = () => {
    if (totalUnits < 15) {
      addNotification({
        variant: "error",
        message: "Minimum 15 units required before submission",
      });
      return;
    }
    setFinalized(true);
    addNotification({
      variant: "success",
      message: "Registration submitted successfully!",
    });
  };

  // Count summaries
  const coreCount = registeredCourses.filter((c) => c.status === "Core").length;
  const electiveCount = registeredCourses.filter(
    (c) => c.status === "Elective"
  ).length;
  const carryoverCount = registeredCourses.filter((c) => c.carryover).length;

  return (
    <div className="max-w-7xl mx-auto p-6 min-h-screen space-y-8">
      <div className="flex items-center gap-3">
        <BookOpen className="text-primary w-6 h-6" />
        <h1 className="text-2xl font-bold text-primary">
          Course Registration Portal
        </h1>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* AVAILABLE COURSES */}
        <Card className="shadow-xl rounded-2xl border border-border/30">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <ClipboardList className="text-primary w-5 h-5" />
              <h2 className="text-xl font-semibold text-primary">
                Available Courses
              </h2>
            </div>

            {availableCourses.length === 0 ? (
              <div className="flex justify-center items-center h-32 text-gray-400 italic">
                No available courses.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border border-gray-200 text-sm">
                  <thead className="bg-secondary text-textOnPrimary">
                    <tr>
                      <th className="p-2 text-left">Code</th>
                      <th className="p-2 text-left">Title</th>
                      <th className="p-2 text-center">Unit</th>
                      <th className="p-2 text-center">Type</th>
                      <th className="p-2 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {availableCourses.map((course) => (
                      <motion.tr
                        key={course.course_code}
                        className={`border-b hover:bg-surfaceElevated transition ${
                          course.carryover ? "bg-red-50" : ""
                        }`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <td className="p-2 font-medium flex items-center gap-2">
                          {course.carryover && (
                            <AlertTriangle className="text-red-500 w-4 h-4" />
                          )}
                          {course.course_code}
                        </td>
                        <td className="p-2">{course.course_title}</td>
                        <td className="p-2 text-center">{course.credit_unit}</td>
                        <td className="p-2 text-center">
                          <Badge
                            variant={
                              course.carryover
                                ? "error"
                                : course.status === "Core"
                                ? "info"
                                : "neutral"
                            }
                          >
                            {course.carryover
                              ? "Carry Over"
                              : course.status}
                          </Badge>
                        </td>
                        <td className="p-2 text-center">
                          <Button
                            disabled={finalized}
                            onClick={() => handleRegister(course)}
                            className="bg-primary text-textOnPrimary"
                          >
                            Register
                          </Button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* REGISTERED COURSES */}
        <Card className="shadow-xl rounded-2xl border border-border/30">
          <CardContent className="p-5">
            <h2 className="text-xl font-semibold mb-4 text-primary flex items-center gap-2">
              Registered Courses <CheckCircle className="text-accent w-5 h-5" />
            </h2>

            {registeredCourses.length === 0 ? (
              <div className="flex justify-center items-center h-32 text-gray-500 italic">
                No courses registered yet.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border border-gray-200 text-sm">
                  <thead className="bg-secondary text-textOnPrimary">
                    <tr>
                      <th className="p-2 text-left">Code</th>
                      <th className="p-2 text-left">Title</th>
                      <th className="p-2 text-center">Unit</th>
                      <th className="p-2 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {registeredCourses.map((course) => (
                      <motion.tr
                        key={course.course_code}
                        className={`border-b hover:bg-surfaceElevated transition ${
                          course.carryover ? "bg-red-50" : ""
                        }`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <td className="p-2 font-medium">{course.course_code}</td>
                        <td className="p-2">{course.course_title}</td>
                        <td className="p-2 text-center">{course.credit_unit}</td>
                        <td className="p-2 text-center">
                          {!finalized ? (
                            <Button
                              onClick={() => handleDrop(course)}
                              className="bg-destructive text-textOnPrimary"
                            >
                              Drop
                            </Button>
                          ) : (
                            <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                          )}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Summary */}
            <div className="mt-6 border-t pt-3 space-y-2 text-sm text-gray-700">
              <p>
                <span className="font-semibold text-accent">Total Units:</span>{" "}
                {totalUnits}
              </p>
              <p>Core Courses: {coreCount}</p>
              <p>Electives: {electiveCount}</p>
              {carryoverCount > 0 && (
                <p className="text-red-600">
                  Carryover Courses: {carryoverCount}
                </p>
              )}
            </div>

            {/* Submission Section */}
            <div className="flex justify-between items-center mt-6 border-t pt-3">
              {!finalized ? (
                <Button
                  onClick={handleSubmit}
                  className="bg-accent text-textOnPrimary"
                >
                  Submit Registration
                </Button>
              ) : (
                <div className="flex items-center gap-2 text-green-600 font-medium">
                  <CheckCircle className="w-5 h-5" /> Registration Finalized
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
