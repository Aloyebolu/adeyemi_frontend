// TopBar.tsx
// Tokens used: theme.colors.primary, theme.colors.backgroundLight, theme.colors.backgroundDark, theme.colors.textPrimary
// Component: AFUED TopBar with animated dropdown, avatar display, and solid background

"use client";

import React, { useEffect, useState, useRef } from "react";
import { Menu, User, LogOut, Settings, BookOpen, ClipboardList, Bell } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import theme from "@/styles/theme";
// import { fetchData } from "@/lib/dataFetcher";
import { useSidebar } from "@/hooks/useSidebar";
import useUser from "@/hooks/useUser";
import RouteLoader from "./RouteLoader";
import useUnreadNotifications from "@/hooks/useUnreadNotifications";
import { useDataFetcher } from "@/lib/dataFetcher";
import { useRouter } from "next/navigation";


interface TopBarProps {
  role: "student" | "lecturer" | "admin" | "parent";
  page: string;
  component: React.ReactNode
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

const TopBar: React.FC<TopBarProps> = ({ role, page, component }) => {
  // const [user, setUser] = useState<Student | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const { open, toggleSidebar } = useSidebar();
  const { user } = useUser()
  const [isDark, setIsDark] = useState(false);
  const { count: unreadCount, getUnreadCount } = useUnreadNotifications();
  const {fetchData} = useDataFetcher()
  const router = useRouter()
const [notifOpen, setNotifOpen] = useState(false);
const [notifications, setNotifications] = useState<any[]>([]); // Array of unread notifications

useEffect(() => {
  const fetchTopNotifications = async () => {
    const {data} = await fetchData("notifications/top-unread", "GET");
    setNotifications(data);
  };
  fetchTopNotifications();
}, []);


  useEffect(() => {
    getUnreadCount(); // fetch when the top bar mounts
  }, []);


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
bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700
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

  <div>
    <h2 className="text-2xl font-bold text-[var(--color-text-primary)] dark:text-white tracking-tight">
      {page}
    </h2>

  </div>
</div>


      {/* Right Section */}
      <div className="relative flex items-center gap-4" ref={menuRef}>

    {component && (
      <div className="mt-1">
        {component}
      </div>
    )}
        <div className="text-right hidden sm:block">
          <p className="font-bold text-[var(--color-text-primary)] dark:text-white">
            {user?.name || "Loading..."}
          </p>
          <p className="text-sm text-[var(--color-text-secondary)] dark:text-gray-400">
            {roleTitles[role]}
          </p>
        </div>


{/* Notifications */}
<div className="relative">
  <button
    onClick={() => setNotifOpen(!notifOpen)}
    className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition flex items-center justify-center"
    aria-label="Notifications"
  >
    <Bell size={20} className="text-gray-700 dark:text-white" />

    {/* Unread Badge */}
    {unreadCount && unreadCount > 0 && (
      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
        {unreadCount > 99 ? "99+" : unreadCount}
      </span>
    )}
  </button>

  {/* Animated Dropdown */}
  <AnimatePresence>
    {notifOpen && (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
        className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 shadow-lg rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50"
      >
        <div className="p-3 border-b border-gray-200 dark:border-gray-700 font-semibold text-gray-800 dark:text-white">
          Notifications
        </div>

        <div className="flex flex-col max-h-64 overflow-y-auto">
          {notifications.length === 0 && (
            <div className="p-3 text-gray-500 dark:text-gray-400 text-sm text-center">
              No new notifications
            </div>
          )}

          {notifications?.slice(0, 3).map((notif, idx) => (
            <div
              key={idx}
              className="px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition rounded-md"
              onClick={() => handleNotificationClick(notif)}
            >
              <p className="text-sm text-gray-700 dark:text-gray-200 font-medium">
                {notif.title || "Notification"}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {notif.message || ""}
              </p>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 p-2 text-center">
          <button
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
            onClick={() => router.push("/notifications")}
          >
            See all
          </button>
        </div>
      </motion.div>
    )}
  </AnimatePresence>
</div>


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
              className="absolute right-0 top-12 bg-background  
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

                {/* Dark/Light Toggle Button */}
                <button
                  onClick={toggleDarkMode}
                  aria-label="Toggle dark/light mode"
                  className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm hover:bg-[var(--color-primary)] hover:text-white transition-all duration-150"
                >
                  {isDark ? "🌙" : "☀️"}  Theme({isDark ? "Dark" : "Light"})
                </button>
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
