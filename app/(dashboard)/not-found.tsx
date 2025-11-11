"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  ClipboardList,
  FileText,
  User,
  LayoutDashboard,
  Calendar,
  Users,
  PlusCircle,
  Settings,
  Activity,
  ShieldCheck,
  Bell,
} from "lucide-react";
import { usePage } from "@/hooks/usePage";

const roleLinks: Record<string, any[]> = {
  student: [
    {
      name: "Results",
      icon: ClipboardList,
      children: [
        { name: "Semester Results", href: "/dashboard/student/results/semester" },
        { name: "Cumulative Results", href: "/dashboard/student/results/cumulative" },
      ],
    },
    { name: "Transcript Request", href: "/dashboard/student/transcript", icon: FileText },
    { name: "Course Registration", href: "/dashboard/student/course-registration", icon: BookOpen },
    { name: "Profile", href: "/dashboard/profile", icon: User },
  ],
  lecturer: [
    { name: "Upload Results", href: "/dashboard/lecturer/upload", icon: ClipboardList },
    { name: "Manage Courses", href: "/dashboard/lecturer/courses", icon: BookOpen },
    { name: "Profile", href: "/dashboard/profile", icon: User },
    { name: "Notifications", href: "/dashboard/notifications", icon: Bell },
  ],
  admin: [
    { name: "Overview", href: "/dashboard/admin", icon: LayoutDashboard },
    { name: "Semester Management", href: "/dashboard/admin/semester", icon: Calendar },
    { name: "Manage Courses", href: "/dashboard/admin/courses", icon: BookOpen },
    {
      name: "Manage Users",
      icon: Users,
      children: [
        { name: "Students", href: "/dashboard/admin/users/students" },
        { name: "Lecturers", href: "/dashboard/admin/users/lecturers" },
        { name: "HOD", href: "/dashboard/admin/users/hod" },
      ],
    },
    {
      name: "Create",
      icon: PlusCircle,
      children: [
        { name: "Department", href: "/dashboard/admin/create/department" },
        { name: "Faculty", href: "/dashboard/admin/create/faculty" },
      ],
    },
    { name: "Approve Results", href: "/dashboard/admin/approvals", icon: ClipboardList },
    { name: "Transcripts", href: "/dashboard/admin/transcripts", icon: FileText },
    { name: "System Settings", href: "/dashboard/admin/settings", icon: Settings },
    { name: "Activity Logs", href: "/dashboard/admin/logs", icon: Activity },
    { name: "Roles & Permissions", href: "/dashboard/admin/roles", icon: ShieldCheck },
    { name: "Profile", href: "/dashboard/profile", icon: User },
  ],
  parent: [{ name: "View Ward Results", href: "/dashboard/parent/results", icon: ClipboardList }],
};

function flattenLinks(links: any[]): any[] {
  return links.flatMap((item) =>
    item.children ? [item, ...item.children] : [item]
  );
}

export default function DashboardNotFound() {
  const pathname = usePathname();

  const {setPage} = usePage()
  const role = useMemo(() => {
    const segments = pathname?.split("/") ?? [];
    return segments.find((seg) =>
      ["student", "lecturer", "admin", "parent"].includes(seg)
    );
  }, [pathname]);

  const suggestions = useMemo(() => {
    const allLinks = flattenLinks(roleLinks[role ?? "student"] ?? []);
    const currentSegment = pathname?.split("/").pop() ?? "";
    return allLinks
      .filter(
        (link) =>
          link?.name?.toLowerCase()?.includes(currentSegment?.toLowerCase()) ||
          link?.href?.includes(role ?? "")
      )
      .slice(0, 6);
  }, [pathname, role]);

  useEffect(()=>{
    setPage("Page Not Found (404)")
  },[])
  return (
    <div className="  flex flex-col items-center justify-center h-screen overflow-hidden  text-[#0f172a] text-center ">
      {/* ✨ Floating Background Icons */}
      {[BookOpen, ClipboardList, Users, FileText].map((Icon, i) => (
        <motion.div
          key={i}
          className="absolute opacity-10 text-blue-400"
          initial={{ y: Math.random() * 400, x: Math.random() * 400 }}
          animate={{
            y: [0, -30, 0],
            rotate: [0, 10, -10, 0],
          }}
          transition={{
            duration: 6 + i * 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            top: `${10 + i * 20}%`,
            left: `${10 + i * 25}%`,
          }}
        >
          <Icon size={80} />
        </motion.div>
      ))}

      {/* 🎓 AFUED Branding */}
      <motion.h1
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-6xl sm:text-7xl font-extrabold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent mb-4"
      >
        AFUED says...
      </motion.h1>

      {/* 💥 “Oops” text */}
      <motion.h2
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="text-5xl sm:text-6xl font-bold text-blue-300 drop-shadow-lg"
      >
        Oops! You took a wrong turn 🎓
      </motion.h2>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-gray-300 mt-4 mb-10 max-w-lg"
      >
        The page you’re looking for doesn’t exist in your dashboard.
        Don’t worry — we’ve found a few useful places to get you back on track 👇
      </motion.p>

      {/* 🔗 Suggested Links */}
      <AnimatePresence>
        {suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-2xl mb-12"
          >
            {suggestions.map((link, i) => {
              const Icon = link.icon;
              return (
                <motion.div
                  key={link.href || i}
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Link
                    href={link.href}
                    className="flex items-center justify-center gap-2 border border-blue-400/30 rounded-lg p-3 bg-blue-950/30 hover:bg-blue-800/40 transition backdrop-blur-md"
                  >
                    {Icon ? <Icon className="w-5 h-5 text-blue-300" /> : null}
                    <span className="text-blue-100">{link.name}</span>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🎯 Back Button */}
      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
        <Link
          href="/dashboard"
          className="px-6 py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-blue-500 to-cyan-400 shadow-lg hover:shadow-cyan-300/40 transition"
        >
          Back to Dashboard
        </Link>
      </motion.div>

      {/* 🌌 Floating glow */}
      <motion.div
        className="absolute w-96 h-96 bg-blue-500/30 rounded-full blur-3xl"
        animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.6, 0.4] }}
        transition={{ repeat: Infinity, duration: 6 }}
        style={{ top: "20%", left: "50%", transform: "translateX(-50%)" }}
      />
    </div>
  );
}
