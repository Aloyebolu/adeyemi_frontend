// page.tsx (Lecturer Dashboard)
// Tokens used: bg-surface, bg-bg, border-border, text-text, text-text-muted, bg-brand, text-on-brand
// Component: Lecturer Main Dashboard page (AFUED standard)

"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Eye,
  FileUp,
  Users,
  Upload,
  BarChart3,
  Calendar,
  Bell,
  Search,
  Filter,
  ChevronRight,
  BookOpen,
  Clock,
  TrendingUp,
  Download,
  Edit3,
  MessageSquare,
  AlertTriangle,
  Info
} from "lucide-react";
import { useRouter } from "next/navigation";

// Components
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Table } from "@/components/ui/table/Table2";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/Tooltip";

// Hooks
import useUser from "@/hooks/useUser";
import { usePage } from "@/hooks/usePage";
import { useMyCourses } from "@/hooks/useMyCourses";
import { useNotifications } from "@/hooks/useNotification";
import { useCourse } from "@/hooks/useCourse"; // Changed from useMyCourses
import { StudentAnnouncements } from "@/components/students";
import { useStudentDashboard } from "@/hooks/students/useStudentDashboard";
import { useAnnouncement } from "@/hooks/useAnnouncements";

interface Course {
  course_id: string; // Changed from 'code'
  code: string; // Added back for display
  name: string; // Changed from 'title'
  level: string;
  semester: string;
  students: number;
  unit: number;
  status: string;
  department: string;
  pending_result_uploads?: number;
}



export default function LecturerDashboard() {
  const router = useRouter();
  const { setPage } = usePage();
  const { user } = useUser();
  const { courses, fetchLecturerCourses, isLoading, error } = useCourse(); // Changed from useMyCourses

  const [lecturerName, setLecturerName] = useState("");
  const [lecturerId, setLecturerId] = useState("");
  const [department, setDepartment] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSemester, setSelectedSemester] = useState<string>("all");
  const [activeTab, setActiveTab] = useState("courses");
  const [activeCategory, setActiveCategory] = useState('all');
  const { fetchAnnouncements, announcements } = useAnnouncement();


  const [upcomingTasks] = useState([
    { id: 1, title: "Grade CSC 101 Assignments", due: "Tomorrow" },
    { id: 2, title: "Submit Final Results", due: "Dec 15" },
    { id: 3, title: "Prepare Exam Questions", due: "Next Week" }
  ]);

  useEffect(() => {
    if (user) {
      setPage("Lecturer Dashboard");
      setLecturerName(user.name ?? "Unknown Lecturer");
      setLecturerId(user.staff_id ?? "N/A");
      setDepartment(user.department ?? "Unknown Department");
    }
  }, [user, setPage]);

  useEffect(() => {
    fetchAnnouncements();
    fetchLecturerCourses();
  }, []);

  // Filter courses based on search and semester
  const filteredCourses = (courses || []).filter(course => {
    const matchesSearch = searchQuery === "" ||
      course.code?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSemester = selectedSemester === "all" ||
      course.semester?.toLowerCase() === selectedSemester;
    return matchesSearch && matchesSemester;
  });

  const stats = {
    totalCourses: (courses || []).length,
    totalStudents: (courses || []).reduce((sum, c) => sum + (c.students || 0), 0),
    averageClassSize: (courses || []).length > 0
      ? Math.round((courses || []).reduce((sum, c) => sum + (c.students || 0), 0) / (courses || []).length)
      : 0,
    pendingGrading: (courses || []).reduce((sum, c) => sum + (c.pending_result_uploads || 0), 0),
  };

  const columns = [
    {
      accessorKey: "code",
      header: "Course Code",
      cell: ({ row }: any) => (
        <div className="font-mono font-medium">{row.original.code}</div>
      )
    },
    {
      accessorKey: "name",
      header: "Course Title",
      cell: ({ row }: any) => (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger className="text-left">
              <div className="font-medium">{row.original.name}</div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{row.original.name}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )
    },
    {
      accessorKey: "unit",
      header: "Units",
      cell: ({ row }: any) => (
        <div className="text-center font-medium">{row.original.unit}</div>
      )
    },
    {
      accessorKey: "semester",
      header: "Semester",
      cell: ({ row }: any) => {
        const sem = row.original.semester?.toLowerCase();
        const display = sem?.charAt(0).toUpperCase() + sem?.slice(1);
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Badge variant="neutral">
                  {display}
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                {sem === "first"
                  ? "Courses for the First Semester."
                  : sem === "second"
                    ? "Courses for the Second Semester."
                    : "Summer Semester Course."}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      },
    },
    {
      accessorKey: "department",
      header: "Department",
      cell: ({ row }: any) => (
        <div className="font-medium">{row.original.department}</div>
      )
    },
    {
      accessorKey: "students",
      header: "Students",
      cell: ({ row }: any) => (
        <div className="text-center">
          <span className="font-semibold">{row.original.students}</span>
          <span className="text-xs text-text-muted ml-1">students</span>
        </div>
      )
    },
    {
      accessorKey: "pending_result_uploads",
      header: "Pending Uploads",
      cell: ({ row }: any) => (
        <div className="text-center">
          <span className="font-semibold">{row.original.pending_result_uploads || 0}</span>
        </div>
      )
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }: any) => (
        <Badge
          variant={row.original.status === "Ongoing" ? "success" : "neutral"}
          className="capitalize"
        >
          {row.original.status}
        </Badge>
      ),
    },
    {
      accessorKey: "actions",
      header: "Actions",
      cell: ({ row }: any) => {
        const { course_id } = row.original;
        return (
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={() => router.push(`./lecturer/courses/${course_id}/students`)}
              variant="primary"
              title="View Students"
            >
              View Students
            </Button>
          </div>
        );
      },
    },
  ];

  const filteredAnnouncements = announcements.filter(announcement =>
    activeCategory === "all" || announcement.category === activeCategory
  );

  return (
    <main className="flex-1 p-4 md:p-6 space-y-6 bg-bg text-text">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
      >
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-text">Lecturer Dashboard</h1>
          <p className="text-text-muted mt-1">
            Welcome back, <span className="font-semibold text-brand">{lecturerName}</span>
          </p>
          <div className="flex items-center gap-4 mt-2 text-sm">
            <span className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-text-muted" />
              {department}
            </span>
            <span className="flex items-center gap-2">
              <Users className="h-4 w-4 text-text-muted" />
              ID: {lecturerId}
            </span>
          </div>
        </div>


      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <Card className="bg-surface border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-text-muted">Assigned Courses</p>
                <h3 className="text-2xl font-bold mt-2">{stats.totalCourses}</h3>
              </div>
              <div className="h-12 w-12 rounded-lg bg-brand/10 flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-brand" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-surface border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-text-muted">Total Students</p>
                <h3 className="text-2xl font-bold mt-2">{stats.totalStudents}</h3>
              </div>
              <div className="h-12 w-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-surface border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-text-muted">Avg. Class Size</p>
                <h3 className="text-2xl font-bold mt-2">{stats.averageClassSize}</h3>
              </div>
              <div className="h-12 w-12 rounded-lg bg-green-500/10 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-surface border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-text-muted">Pending Grading</p>
                <h3 className="text-2xl font-bold mt-2">{stats.pendingGrading}</h3>
              </div>
              <div className="h-12 w-12 rounded-lg bg-amber-500/10 flex items-center justify-center">
                <Clock className="h-6 w-6 text-amber-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Courses & Actions */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="lg:col-span-2 space-y-6"
        >

          {/* Courses Table */}
          <Card className="bg-surface border-border">
            <CardHeader>
              <CardTitle>My Courses</CardTitle>
            </CardHeader>
            <CardContent>
              <Table
                columns={columns}
                data={filteredCourses}
                isLoading={isLoading}
                error={error}
                enableSelection={false}
                enableExport={true}
                serverMode={false}
                variant="default"
                controls={false}
                tableEmptyMessage="You have no assigned courses."
                showNumbering={true}
                numberingText="S/N"
                className="border-none"
              />
            </CardContent>
          </Card>
        </motion.div>

        {/* Right Column - Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="space-y-6"
        >

          {/* Announcements */}
          <StudentAnnouncements
            announcements={filteredAnnouncements}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />
        </motion.div>
      </div>
    </main>
  );
}