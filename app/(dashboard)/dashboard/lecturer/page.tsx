// page.tsx (Lecturer Dashboard)
// Tokens used: bg-surface, bg-bg, border-border, text-text, text-text-muted, bg-brand, text-on-brand
// Component: Lecturer Main Dashboard page (AFUED standard)

"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import theme from "@/styles/theme";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Eye, FileUp, Users } from "lucide-react";
// import { useRouter } from "next/router";
import { useMyCourses } from "@/hooks/useMyCourses";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/Tooltip";
import { useRouter } from "next/navigation";
import { Table } from "@/components/ui/Table";
import useUser from "@/hooks/useUser";
import { usePage } from "@/hooks/usePage";

interface Course {
  code: string;
  title: string;
  level: string;
  semester: string;
  students: number;
}

export default function LecturerDashboard() {
  const [lecturerName, setLecturerName] = useState("");
  const [lecturerId, setLecturerId] = useState("123456");
  const [department, setDepartment] = useState("Computer Science");
  const {setPage} = usePage();
  const {user} = useUser();
  useEffect(() => {
    if(user){
      setPage("Lecturer Dashboard")
      setLecturerName(user.name ?? "Unknown Lecturer")
      setLecturerId(user.staff_id ?? "N/A")
      setDepartment(user.department ?? "Unknown Department")
    }
  }, [user])
  const router = useRouter();
  const { courses, isLoading, error } = useMyCourses(true); // useMock = true

  const columns = [
    { accessorKey: "code", header: "Course Code" },
    { accessorKey: "title", header: "Course Title" },
    { accessorKey: "unit", header: "Unit" },
    {
      // editable: true,
      accessorKey: "semester",
      header: "Semester",
      cell: ({ row }: any) => {
        const sem = row.original.semester?.toLowerCase();
        const display = sem?.charAt(0).toUpperCase() + sem?.slice(1);
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Badge variant="neutral">{display}</Badge>
              </TooltipTrigger>
              <TooltipContent>
                {sem === "first"
                  ? "Courses for the First Semester."
                  : "Courses for the Second Semester."}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      },
    },
    { accessorKey: "students", header: "Students" },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }: any) => (
        <Badge
          variant={row.original.status === "Ongoing" ? "success" : "neutral"}
        >
          {row.original.status}
        </Badge>
      ),
    },
    {
      accessorKey: "actions",
      header: "Actions",
      cell: ({ row }: any) => {
        const { code } = row.original;
        return (
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={() => router.push(`./lecturer/courses/${code}/students`)}
              variant="ghost"
            >
              <Users size={14} />
            </Button>
            <Button
              size="sm"
              onClick={() => router.push(`./lecturer/courses/${code}/materials`)}
              variant="ghost"
            >
              <FileUp size={14} />
            </Button>
            <Button
              size="sm"
              onClick={() => router.push(`./lecturer/courses/${code}/results`)}
              variant="ghost"
            >
              <Eye size={14} />
            </Button>
          </div>
        );
      },
    },
  ];

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
              Lecturer ID: {lecturerId} 
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
        <h2 className="text-xl font-bold">My Courses</h2>
        {/* <Button variant="primary">
          <PlusCircle className="w-4 h-4 mr-2" /> Add Course
        </Button> */}
      {/* </div> */}

      <Table
        columns={columns}
        data={courses}
        isLoading={isLoading}
        error={error}
        enableSelection={false}
        enableExport={false}
        serverMode={false}
        variant="default"
        controls={false}
        tableEmptyMessage="You have no assigned courses."
        showNumbering={true}
        numberingText="(S/N)"
      />
      </motion.section>
    </main>
  );
}
