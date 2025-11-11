"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
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

// 🧩 Your provided roleLinks safely normalized
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

// 🧠 Flatten links safely for easier lookup
function flattenLinks(links: any[]) {
  return links.flatMap((item) =>
    item.children ? [item, ...item.children] : item
  );
}

export default function DashboardNotFound() {
  const pathname = usePathname();

  // Extract role from URL safely
  const role = useMemo(() => {
    const segments = pathname?.split("/") ?? [];
    return segments.find((seg) =>
      ["student", "lecturer", "admin", "parent"].includes(seg)
    );
  }, [pathname]);

  // Build suggestion list
  const suggestions = useMemo(() => {
    const allLinks = flattenLinks(roleLinks[role ?? "student"] ?? []);
    const currentSegment = pathname?.split("/").pop() ?? "";
    return allLinks
      .filter((link) =>
        link?.name?.toLowerCase()?.includes(currentSegment?.toLowerCase())
      )
      .slice(0, 6);
  }, [pathname, role]);

  const theme = {
    primary: "var(--color-primary)",
    surface: "var(--color-surface)",
    text: "var(--color-text-primary)",
  };

  return (
    <div
      className="flex flex-col items-center justify-center h-screen px-6 text-center bg-[var(--surface)] text-[var(--text-primary)]"
      style={{
        background: theme.surface,
        color: theme.text,
      }}
    >
      <h1 className="text-5xl font-bold mb-4 text-[var(--primary)]">
        📘 Page Not Found
      </h1>
      <p className="text-gray-500 mb-6 max-w-md">
        The page you’re looking for doesn’t exist in your dashboard. Let’s get
        you back on track with some helpful links 👇
      </p>

      {suggestions.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-2xl mb-8">
          {suggestions.map((link,i) => (
            <Link
            href={link.href}
            key={link.href+i}
              className="flex items-center justify-center gap-2 border border-[var(--border)] rounded-lg p-3 hover:bg-[var(--surfaceElevated)] transition"
            >
              {link.icon ? <link.icon className="w-4 h-4" /> : null}
              <span>{link.name}</span>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-gray-400 mb-8">No related links found.</p>
      )}

      <Link
        href="/dashboard"
        className="px-5 py-2 bg-[var(--primary)] text-[var(--textOnPrimary)] rounded-md hover:opacity-90 transition"
      >
        Back to Dashboard
      </Link>
    </div>
  );
}
// export default function DashboardNotFound() {
//   return (
//     <div className="flex flex-col items-center justify-center h-screen text-center">
//       <h1 className="text-4xl font-bold mb-4 text-blue-600">
//         Dashboard 404 – Page Not Found 🧭
//       </h1>
//       <p className="text-gray-500 mb-6">
//         This 404 page only applies to /dashboard routes.
//       </p>
//       <a
//         href="/dashboard"
//         className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//       >
//         Back to Dashboard
//       </a>
//     </div>
//   );
// }
