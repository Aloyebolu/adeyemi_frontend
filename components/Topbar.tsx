// TopBar.tsx
// Tokens used: theme.colors.primary, theme.colors.backgroundLight, theme.colors.backgroundDark, theme.colors.textPrimary
// Component: AFUED TopBar with animated dropdown, avatar display, and solid background

"use client";

import { useEffect, useState, useRef } from "react";
import { Menu, User, LogOut, Settings, BookOpen, ClipboardList } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import theme from "@/styles/theme";
import { fetchData } from "@/lib/dataFetcher";
import { useSidebar } from "@/hooks/useSidebar";
import useUser from "@/hooks/useUser";
import RouteLoader from "./RouteLoader";

interface TopBarProps {
  role: "student" | "lecturer" | "admin" | "parent";
  page: string;
}

interface Student {
  id?: string;
  name: string;
  matric_no: string;
  department?: string;
  photo?: string;
}

const roleTitles: Record<string, string> = {
  student: "Student",
  lecturer: "Lecturer",
  admin: "Administrator",
  parent: "Parent",
  hod: "Head of Department",
};

const TopBar: React.FC<TopBarProps> = ({ role, page }) => {
  // const [user, setUser] = useState<Student | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const { open, toggleSidebar } = useSidebar();
  const { user} = useUser()
  const [isDark, setIsDark] = useState(false);

useEffect(() => {
  // Initialize theme from localStorage
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.documentElement.classList.add("dark");
    setIsDark(true);
  }
}, []);

const toggleDarkMode = () => {
  const html = document.documentElement;
  if (html.classList.contains("dark")) {
    html.classList.remove("dark");
    localStorage.setItem("theme", "light");
    setIsDark(false);
  } else {
    html.classList.add("dark");
    localStorage.setItem("theme", "dark");
    setIsDark(true);
  }
};


  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Role-based menu links
  const roleMenuItems: Record<string, { icon: any; label: string; href?: string }[]> = {
    student: [
      { icon: BookOpen, label: "My Courses", href: "/dashboard/student/register" },
      { icon: ClipboardList, label: "My Results", href: "/dashboard/student/results" },
    ],
    lecturer: [{ icon: ClipboardList, label: "Upload Scores", href: "/dashboard/lecturer/upload" }],
    admin: [{ icon: Settings, label: "Manage Portal", href: "/dashboard/admin" }],
    parent: [{ icon: ClipboardList, label: "View Ward Result", href: "/dashboard/parent/results" }],
    hod: [{ icon: ClipboardList, label: "Upload Scores", href: "/dashboard/lecturer/upload" }],
  };

  const avatar = user?.photo ? (
    <Image
      src={user.photo}
      alt="Profile"
      width={40}
      height={40}
      className="object-cover rounded-full w-10 h-10 border border-[var(--color-border)]"
    />
  ) : (
    <div
      className="rounded-full h-10 w-10 flex items-center bg-primary justify-center font-bold text-white shadow-md"
      // style={{ backgroundColor: theme.colors.primary }}
    >
      {user?.name?.charAt(0).toUpperCase() || "A"}
    </div>
  );

  return (
<header
  className="flex items-center justify-between p-4 
             border-b border-[var(--color-border)] dark:border-[var(--color-border-dark)]
             bg-[var(--color-background)] dark:bg-[var(--color-background-dark)]
             sticky top-0 z-20 transition-colors duration-300"
>
      {/* Left Section */}
      <div className="flex items-center gap-3">
        <button
        onClick={toggleSidebar}
          className="lg:hidden flex items-center justify-center p-2 rounded-md hover:bg-[var(--color-background-light)]/80 
                     dark:hover:bg-[var(--color-background-dark)]/80"
          aria-label="Toggle sidebar"
        >
          <Menu size={22} className="text-[var(--color-text-primary)] dark:text-white" />
        </button>
        <h2 className="text-2xl font-bold text-[var(--color-text-primary)] dark:text-white tracking-tight">
          {page}
        </h2>
      </div>

      {/* Right Section */}
      <div className="relative flex items-center gap-4" ref={menuRef}>
        <div className="text-right hidden sm:block">
          <p className="font-bold text-[var(--color-text-primary)] dark:text-white">
            {user?.name || "Loading..."}
          </p>
          <p className="text-sm text-[var(--color-text-secondary)] dark:text-gray-400">
            {roleTitles[role]}
          </p>
        </div>

{/* Dark/Light Toggle Button */}
<button
  onClick={toggleDarkMode}
  aria-label="Toggle dark/light mode"
  className="px-3 py-1 rounded-md bg-[var(--color-background-light)] text-[var(--color-text-primary)] 
             dark:bg-[var(--color-background-dark)] dark:text-white border border-[var(--color-border)] 
             hover:bg-[var(--color-primary)] hover:text-white transition-colors duration-300"
>
  {isDark ? "🌙 Dark" : "☀️ Light"}
</button>

        {/* Avatar Button */}
        <button onClick={() => setMenuOpen(!menuOpen)} aria-label="Open profile menu">
          {avatar}
        </button>

        {/* Animated Dropdown Menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-12 bg-background dark:bg-[var(--color-background-dark)] 
                         shadow-lg rounded-xl w-60 border border-border overflow-hidden z-50"
            >
              {/* Solid Background Header */}
              <div
                className="p-4 border-b border-[var(--color-border)] flex items-center gap-3"
                style={{ backgroundColor: "var(--color-background-light)" }}
              >
                {/* Small Avatar in Menu */}
                {avatar}
                <div>
                  <p className="font-bold text-[var(--color-text-primary)] dark:text-white">
                    {user?.name}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{roleTitles[role]}</p>
                </div>
              </div>

              {/* Role-specific Links */}
              <div className="py-2">
                {roleMenuItems[role].map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <a
                      key={i}
                      href={item.href}
                      className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-[var(--color-primary)] hover:text-white transition-all duration-150"
                      >
                      <Icon size={18} />
                      {item.label}
                    </a>
                  );
                })}
              </div>

              {/* Common Actions */}
              <div className="border-t border-[var(--color-border)] py-2">
                <a
                  href="#"
                  className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-[var(--color-primary)] hover:text-white transition-all duration-150"
                >
                  <User size={18} /> Profile
                </a>
                <button
                  onClick={() => {
                    localStorage.clear();
                    window.location.href = "/";
                  }}
                  className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm hover:bg-[var(--color-primary)] hover:text-white transition-all duration-150"
                >
                  <LogOut size={18} /> Logout
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
<RouteLoader /> 
    </header>
  );
};

export default TopBar;
