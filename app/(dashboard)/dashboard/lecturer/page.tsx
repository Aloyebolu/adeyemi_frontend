// page.tsx (Lecturer Dashboard)
// Tokens used: bg-surface, bg-bg, border-border, text-text, text-text-muted, bg-brand, text-on-brand
// Component: Lecturer Main Dashboard page (AFUED standard)

"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import theme from "@/styles/theme";
import { motion } from "framer-motion";

interface Course {
  code: string;
  title: string;
  level: string;
  semester: string;
  students: number;
}

export default function LecturerDashboard() {
  const [lecturerName, setLecturerName] = useState("Dr. Adebayo");
  const [lecturerId, setLecturerId] = useState("123456");
  const [department, setDepartment] = useState("Computer Science");
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    // Fetch data (can switch to API later easily)
    const fetchData = async () => {
      try {
        const res = await fetch("/data/lecturer.json"); // mock data (replace with API)
        const data = await res.json();
        setCourses(data.courses);
        setLecturerName(data.name);
        setLecturerId(data.lecturerId);
        setDepartment(data.department);
      } catch (error) {
        console.error("Error loading lecturer data:", error);
        // fallback mock data
        setCourses([
          {
            code: "CSC101",
            title: "Introduction to Programming",
            level: "100",
            semester: "First",
            students: 50,
          },
          {
            code: "CSC201",
            title: "Data Structures and Algorithms",
            level: "200",
            semester: "Second",
            students: 45,
          },
          {
            code: "CSC301",
            title: "Database Management Systems",
            level: "300",
            semester: "First",
            students: 40,
          },
        ]);
      }
    };

    fetchData();
  }, []);

  return (
    <main className="flex-1 p-4 md:p-8 space-y-8 bg-bg text-text">
      {/* Welcome Section */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="grid grid-cols-1 xl:grid-cols-3 gap-8"
      >
        <div className="xl:col-span-2 bg-background rounded-lg shadow-md p-6 flex items-center justify-between border border-border">
          <div>
            <h3 className="text-2xl font-bold text-text">
              Welcome back, {lecturerName}!
            </h3>
            <p className="text-text-muted mt-1">
              Lecturer ID: {lecturerId} | Department: {department}
            </p>
            <div className="mt-6 flex gap-4">
              <button className="bg-primary px-4 py-2 rounded-lg font-bold bg-brand text-white hover:opacity-90 transition">
                Upload Results
              </button>
              <button className="px-4 py-2 rounded-lg font-bold bg-brand/10 text-brand hover:bg-brand/20 transition">
                Edit/Manage Results
              </button>
            </div>
          </div>
          <div className="hidden md:block">
            <Image
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAI27WGY0OUTV6AfZMP5xfOiqG4Xp0-WIS5ssci5xelyuaxzUx3emJOzfNMmV0OHanSoDu9MYG7bsLl1QJYxWg9fXCAu1wizpW4DhDMwjCjXzy4_P2W2K5iMM9JA8jnmXMFwCGuPL6N9CeubBNlpCDX0n9QDXNKaDE3WRAhCBjkTijg2Em3Qoc65yus8H8cx7q_6EdsIPbrDZAxN4aXL03ySrgZRHupkTB4i7x7IFRxMq1NHG7qCI8F_x2X-iGDdtfpLSibm8kow7k"
              alt="University illustration"
              width={160}
              height={120}
              className="h-32 w-auto object-contain"
            />
          </div>
        </div>

        <div className="bg-surface rounded-lg shadow-md p-6 border border-border">
          <h4 className="text-lg font-bold text-text">Quick Stats</h4>
          <div className="mt-4 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-text-muted">Assigned Courses</span>
              <span className="font-bold text-text">{courses.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-text-muted">Total Students</span>
              <span className="font-bold text-text">
                {courses.reduce((sum, c) => sum + c.students, 0)}
              </span>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Assigned Courses */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h3 className="text-xl font-bold text-text mb-4">Assigned Courses</h3>
        <div className="bg-surface rounded-lg shadow-md overflow-x-auto border border-border">
          <table className="w-full text-sm text-left text-text-muted">
            <thead className="text-xs uppercase bg-surface-elevated border-b border-border">
              <tr>
                <th className="px-6 py-3 text-text">Course Code</th>
                <th className="px-6 py-3 text-text">Course Title</th>
                <th className="px-6 py-3 text-text">Level</th>
                <th className="px-6 py-3 text-text">Semester</th>
                <th className="px-6 py-3 text-center text-text">Assigned Students</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course, i) => (
                <tr
                  key={i}
                  className="border-b border-border hover:bg-surface-elevated/60 transition"
                >
                  <td className="px-6 py-4 font-medium text-text whitespace-nowrap">
                    {course.code}
                  </td>
                  <td className="px-6 py-4">{course.title}</td>
                  <td className="px-6 py-4">{course.level}</td>
                  <td className="px-6 py-4">{course.semester}</td>
                  <td className="px-6 py-4 text-center">{course.students}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.section>
    </main>
  );
}
