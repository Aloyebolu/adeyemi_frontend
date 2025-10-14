"use client";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Calendar,
  ClipboardList,
  PlayCircle,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import theme from "@/styles/theme";

export default function AdminOverviewPage() {
  const router = useRouter();
  const [stats, setStats] = useState({
    activeSemester: "Loading...",
    totalStudents: 0,
    totalLecturers: 0,
    totalCourses: 0,
  });
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // 🔹 Safe API Fetch
  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/overview", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (!res.ok) throw new Error("Failed to fetch dashboard data");

      const data = await res.json();

      setStats({
        activeSemester: data?.stats?.activeSemester || "N/A",
        totalStudents: data?.stats?.totalStudents || 0,
        totalLecturers: data?.stats?.totalLecturers || 0,
        totalCourses: data?.stats?.totalCourses || 0,
      });

      // ✅ Ensure chartData is valid and sanitized
      const sanitized = Array.isArray(data?.chartData)
        ? data.chartData
            .filter(
              (d) =>
                d &&
                typeof d.month === "string" &&
                typeof d.registrations === "number" &&
                typeof d.resultsPublished === "number"
            )
        : [];

      setChartData(sanitized);
      setError(null);
    } catch (err: any) {
      console.error("Dashboard Fetch Error:", err);
      setError("Unable to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <main className="max-w-7xl mx-auto p-6 min-h-screen">
      <h1 className="text-2xl font-bold text-primary mb-6 flex items-center gap-2">
        <LayoutDashboard size={22} /> Admin Overview
      </h1>

      {error && (
        <div className="p-4 mb-4 bg-red-100 text-red-700 rounded-lg">
          ⚠️ {error}
        </div>
      )}

      {/* 🔹 Top Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {[
          {
            label: "Active Semester",
            value: stats.activeSemester,
            icon: <Calendar className="text-primary" size={24} />,
          },
          {
            label: "Students",
            value: stats.totalStudents,
            icon: <Users className="text-primary" size={24} />,
          },
          {
            label: "Lecturers",
            value: stats.totalLecturers,
            icon: <ClipboardList className="text-primary" size={24} />,
          },
          {
            label: "Courses",
            value: stats.totalCourses,
            icon: <BookOpen className="text-primary" size={24} />,
          },
        ].map((item, i) => (
          <Card key={i} className="rounded-xl shadow-md">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">{item.label}</p>
                <h2 className="text-lg font-semibold text-primary">
                  {loading ? "Loading..." : item.value}
                </h2>
              </div>
              {item.icon}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 🔹 Quick Actions */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-primary mb-3">
          Quick Actions
        </h2>
        <div className="flex flex-wrap gap-3">
          <Button
            onClick={() => router.push("/dashboard/admin/semester")}
            className="bg-primary text-on-primary min-h-[2.5rem]"
          >
            <PlayCircle size={16} className="mr-2" />
            Start New Semester
          </Button>
          <Button
            onClick={() => router.push("/dashboard/admin/approvals")}
            className="bg-accent text-on-primary min-h-[2.5rem]"
          >
            <ClipboardList size={16} className="mr-2" />
            Approve Results
          </Button>
          <Button
            onClick={() => router.push("/dashboard/admin/settings")}
            variant="outline"
            className="min-h-[2.5rem]"
          >
            System Settings
          </Button>
        </div>
      </div>

      {/* 🔹 Registration Stats Chart */}
      <Card className="rounded-xl shadow-md">
        <CardContent className="p-4">
          <h2 className="text-lg font-semibold text-primary mb-4">
            Course Registration Activity
          </h2>

          {loading ? (
            <p className="text-gray-500 text-sm">Loading chart data...</p>
          ) : chartData.length === 0 ? (
            <p className="text-gray-500 text-sm">No chart data available.</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar
                  dataKey="registrations"
                  fill={theme.colors.primary}
                  name="Registrations"
                />
                <Bar
                  dataKey="resultsPublished"
                  fill={theme.colors.accent}
                  name="Results Published"
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
