"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LogOut,
  LayoutDashboard,
  BookOpen,
  ClipboardList,
  FileText,
  Users,
  Menu,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  ShieldCheck,
  Activity,
  Settings,
  Calendar,
  PersonStanding,
  Bell,
  Book,
  User,
  Plus,
  PlusCircle,
  CreditCard,
  BarChart3,
  Megaphone,
  UserCircle,
  MessageCircle,
  Home,
  CheckSquare,
  BarChart2,
  CheckCircle,
  ClipboardPlus,
  GraduationCap,
  Building,
  School,
  Library,
  FileCheck,
  FileBarChart,
  NotebookPen,
  Clock,
  Building2,
  BadgeCheck,
  FolderTree,
  MessageSquareText,
  UserPlus,
  Briefcase,
  ChartBar,
  PieChart,
  BellDot,
  FileSpreadsheet,
  Calculator,
} from "lucide-react";
import { useSidebar } from "@/hooks/useSidebar";
import Image from "next/image";
import { usePage } from "@/hooks/usePage";

interface SidebarProps {
  role: "student" | "lecturer" | "admin" | "parent" | "hod" | "dean";
}

// Update interface to allow icons in children
interface MenuItem {
  name: string;
  href?: string;
  icon?: any; // Make icon optional for parent items that only have children
  children?: MenuItem[]; // Allow children to have icons too
}

// Helper function to ensure all items have icons
const ensureIcons = (items: MenuItem[]): MenuItem[] => {
  return items.map(item => {
    // If item has children but no icon, give it a default icon
    if (item.children && !item.icon) {
      item.icon = FolderTree; // Default icon for parent items
    }

    // Ensure all children have icons
    if (item.children) {
      item.children = item.children.map(child => {
        if (!child.icon) {
          // Assign appropriate icons based on child name
          if (child.name.toLowerCase().includes('result')) {
            child.icon = ClipboardList;
          } else if (child.name.toLowerCase().includes('profile') || child.name.toLowerCase().includes('user')) {
            child.icon = User;
          } else if (child.name.toLowerCase().includes('notification')) {
            child.icon = Bell;
          } else if (child.name.toLowerCase().includes('setting')) {
            child.icon = Settings;
          } else if (child.name.toLowerCase().includes('course')) {
            child.icon = BookOpen;
          } else if (child.name.toLowerCase().includes('payment')) {
            child.icon = CreditCard;
          } else if (child.name.toLowerCase().includes('timetable') || child.name.toLowerCase().includes('calendar')) {
            child.icon = Calendar;
          } else if (child.name.toLowerCase().includes('message')) {
            child.icon = MessageCircle;
          } else if (child.name.toLowerCase().includes('analytics') || child.name.toLowerCase().includes('report')) {
            child.icon = BarChart3;
          } else if (child.name.toLowerCase().includes('attendance')) {
            child.icon = CheckSquare;
          } else if (child.name.toLowerCase().includes('approve') || child.name.toLowerCase().includes('check')) {
            child.icon = CheckCircle;
          } else if (child.name.toLowerCase().includes('dashboard') || child.name.toLowerCase().includes('overview')) {
            child.icon = LayoutDashboard;
          } else if (child.name.toLowerCase().includes('department') || child.name.toLowerCase().includes('faculty')) {
            child.icon = Building2;
          } else if (child.name.toLowerCase().includes('material')) {
            child.icon = FileText;
          } else if (child.name.toLowerCase().includes('hostel') || child.name.toLowerCase().includes('home')) {
            child.icon = Home;
          } else if (child.name.toLowerCase().includes('transcript')) {
            child.icon = FileText;
          } else if (child.name.toLowerCase().includes('registration')) {
            child.icon = NotebookPen;
          } else if (child.name.toLowerCase().includes('support')) {
            child.icon = MessageCircle;
          } else if (child.name.toLowerCase().includes('ward')) {
            child.icon = UserCircle;
          } else if (child.name.toLowerCase().includes('borrowed')) {
            child.icon = FileBarChart;
          } else if (child.name.toLowerCase().includes('create')) {
            child.icon = PlusCircle;
          } else if (child.name.toLowerCase().includes('log') || child.name.toLowerCase().includes('activity')) {
            child.icon = Activity;
          } else if (child.name.toLowerCase().includes('template')) {
            child.icon = MessageSquareText;
          } else if (child.name.toLowerCase().includes('announcement')) {
            child.icon = Megaphone;
          } else if (child.name.toLowerCase().includes('result processor') || child.name.toLowerCase().includes('computation')) {
            child.icon = Calculator;
          } else {
            child.icon = FileText; // Default icon for children
          }
        }
        return child;
      });
    }

    return item;
  });
};

export const roleLinks: Record<string, MenuItem[]> = {
  // 🎓 STUDENT
  student: ensureIcons([
    {
      name: "Results",
      icon: ClipboardList,
      children: [
        { name: "Semester Results", href: "/dashboard/student/results/semester", icon: FileBarChart },
        { name: "Cumulative Results", href: "/dashboard/student/results/cumulative", icon: ChartBar },
      ],
    },
    { name: "Transcript Request", href: "/dashboard/student/transcript", icon: FileText },
    { name: "Course Registration", href: "/dashboard/student/course-registration", icon: BookOpen },
    { name: "Payments", href: "/dashboard/student/payments", icon: CreditCard },
    { name: "Hostel & Accommodation", href: "/dashboard/student/hostel", icon: Home },
    { name: "Timetable", href: "/dashboard/student/timetable", icon: Calendar },
    { name: "Notifications", href: "/dashboard/notifications", icon: Bell },
    { name: "Support", href: "/dashboard/support", icon: MessageCircle },
    { name: "Profile", href: "/dashboard/profile", icon: User },
  ]),

  // 👨🏽‍🏫 LECTURER
  lecturer: ensureIcons([
    { name: "Manage Courses", href: "/dashboard/lecturer/courses", icon: BookOpen },
    { name: "Notifications", href: "/dashboard/notifications", icon: Bell },
    { name: "Course Materials", href: "/dashboard/lecturer/materials", icon: FileText },
    { name: "Attendance", href: "/dashboard/lecturer/attendance", icon: CheckSquare },
    { name: "Performance Analytics", href: "/dashboard/lecturer/analytics", icon: BarChart2 },
    { name: "Profile", href: "/dashboard/profile", icon: User },
  ]),

  // 🧑🏽‍💼 HOD
  hod: ensureIcons([
    {
      name: "Lecturer",
      icon: GraduationCap,
      children: [
        { name: "My Courses", href: "/dashboard/lecturer/courses", icon: BookOpen },
        { name: "Course Materials", href: "/dashboard/lecturer/materials", icon: FileText },
        { name: "Attendance", href: "/dashboard/lecturer/attendance", icon: CheckSquare },
        { name: "Performance Analytics", href: "/dashboard/lecturer/analytics", icon: BarChart2 },
      ]
    },
    {
      name: "Results",
      icon: ClipboardList,
      children: [
        { name: "Reports", href: "/dashboard/hod/results/reports", icon: FileBarChart },
        // { name: "Cumulative Results", href: "/dashboard/student/results/cumulative", icon: ChartBar },
      ],
    },
    {
      name: "Course Management",
      icon: ClipboardList,
      children: [
        { name: "Manage Courses", href: "/dashboard/hod/assign-courses", icon: ClipboardPlus },
        { name: "Borrowed Courses", href: "/dashboard/hod/assign-courses/borrowed", icon: FileBarChart },
        { name: "Course Registration Approvals", href: "/dashboard/hod/course-registration", icon: PersonStanding },
      ]
    },
    {
      name: "Personal",
      icon: User,
      children: [
        { name: "Notifications", href: "/dashboard/notifications", icon: Bell },
        { name: "Profile", href: "/dashboard/profile", icon: User },
      ]
    },
    {
      name: "Settings",
      icon: Settings,
      children: [
        { name: "Semester Settings", href: "/dashboard/hod/settings/semester", icon: Calendar },
      ]
    },

    {
      name: "Department Control",
      icon: Building2,
      children: [
        { name: "Timetable", href: "/dashboard/hod/timetable", icon: Calendar },
        { name: "Approve Results", href: "/dashboard/hod/approve-results", icon: CheckCircle },
        { name: "Department Overview", href: "/dashboard/hod/department", icon: LayoutDashboard },
        { name: "Reports & Performance", href: "/dashboard/hod/reports", icon: BarChart3 },
      ]
    },
  ]),

  // 🎓 DEAN
  dean: ensureIcons([
    { name: "Faculty Overview", href: "/dashboard/dean/faculty", icon: LayoutDashboard },
    { name: "Approve Department Reports", href: "/dashboard/dean/approve-reports", icon: CheckCircle },
    { name: "Manage HODs", href: "/dashboard/dean/manage-hods", icon: Users },
    { name: "Faculty Analytics", href: "/dashboard/dean/analytics", icon: BarChart3 },
    { name: "Profile", href: "/dashboard/profile", icon: User },
  ]),

  // 🏛️ ADMIN
  admin: ensureIcons([
    { name: "Overview", href: "/dashboard/admin", icon: LayoutDashboard },
    // { name: "Manage Courses", href: "/dashboard/admin/courses", icon: BookOpen },
        {
      name: "Course Management",
      icon: ClipboardList,
      children: [
        { name: "Manage Courses", href: "/dashboard/admin/courses", icon: ClipboardPlus },
        { name: "Course Reg. Stats", href: "/dashboard/admin/courses/registration/stats", icon: FileBarChart },
        // { name: "Course Registration Approvals", href: "/dashboard/hod/course-registration", icon: PersonStanding },
      ]
    },
    {
      name: "Messaging",
      icon: MessageCircle,
      children: [
        { name: "Send Message", href: "/dashboard/admin/messaging", icon: MessageCircle },
        { name: "Templates", href: "/dashboard/admin/messaging/templates", icon: MessageSquareText },
      ]
    },
    {
      name: "Manage Users",
      icon: Users,
      children: [
        { name: "Students", href: "/dashboard/admin/users/students", icon: GraduationCap },
        { name: "Lecturers", href: "/dashboard/admin/users/lecturers", icon: User },
        { name: "HOD", href: "/dashboard/admin/users/hod", icon: Briefcase },
        { name: "Deans", href: "/dashboard/admin/users/deans", icon: School },
        { name: "Parents", href: "/dashboard/admin/users/parents", icon: UserCircle },
      ],
    },
    {
      name: "Create",
      icon: PlusCircle,
      children: [
        { name: "Department", href: "/dashboard/admin/create/department", icon: Building },
        { name: "Faculty", href: "/dashboard/admin/create/faculty", icon: Building2 },
      ],
    },
    { name: "Reports & Analytics", href: "/dashboard/admin/reports", icon: BarChart3 },
    { name: "Announcements", href: "/dashboard/admin/announcements", icon: Megaphone },
    { name: "Result Processor", href: "/dashboard/admin/result_computation", icon: Calculator },
    {
      name: "Settings",
      icon: Settings,
      children: [
        { name: "Semester Settings", href: "/dashboard/admin/settings/semester", icon: Calendar },
        { name: "System Settings", href: "/dashboard/admin/settings", icon: Settings },
      ]
    },
    { name: "Activity Logs", href: "/dashboard/admin/logs", icon: Activity },
    { name: "Profile", href: "/dashboard/profile", icon: User },
    { name: "Notifications", href: "/dashboard/notifications", icon: Bell },

  ]),

  // 👨🏽‍👩🏽‍👦🏽 PARENT
  parent: ensureIcons([
    { name: "View Ward Results", href: "/dashboard/parent/results", icon: ClipboardList },
    { name: "Ward Profile", href: "/dashboard/parent/ward", icon: UserCircle },
    { name: "Payment History", href: "/dashboard/parent/payments", icon: CreditCard },
    { name: "Notifications", href: "/dashboard/parent/notifications", icon: Bell },
  ]),
};

const Sidebar: React.FC<SidebarProps> = ({ role }) => {
  const pathname = usePathname();
  const { open, toggleSidebar } = useSidebar();
  const { setPage } = usePage();
  const [hydrated, setHydrated] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    setHydrated(true);
  }, []);

  const toggleItem = (name: string) => {
    setExpandedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(name)) {
        newSet.delete(name);
      } else {
        newSet.add(name);
      }
      return newSet;
    });
  };

  const commonLinks: MenuItem[] = [
    { name: "Dashboard", href: "/dashboard/" + role, icon: LayoutDashboard },
  ];

  const sections = [
    {
      title: null,
      links: commonLinks,
    },
    {
      title: `${role.charAt(0).toUpperCase() + role.slice(1)} Tools`,
      links: roleLinks[role] || [],
    },
  ];

  const sidebarVariants = {
    expanded: { width: "16rem" },
    collapsed: { width: "5rem" },
  };

  const dropdownVariants = {
    open: { height: "auto", opacity: 1 },
    closed: { height: 0, opacity: 0 },
  };

  if (!hydrated) return null;

  return (
    <>
      {/* MOBILE TOGGLE BUTTON */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 bg-primary text-white p-2 rounded-md shadow-md"
      >
        <Menu size={22} />
      </button>

      {/* DESKTOP SIDEBAR */}
      <motion.aside
        variants={sidebarVariants}
        animate={open ? "expanded" : "collapsed"}
        transition={{ duration: 0.3 }}
        className={`h-screen sticky top-0 flex flex-col border-r border-[var(--border)] bg-[var(--background)] dark:border-[var(--border-dark)] dark:bg-[var(--background-dark)] z-40 hidden lg:flex flex-none overflow-hidden`}
      >
        {/* LOGO + TOGGLE */}
        <div className="flex items-center justify-between mb-8 p-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full overflow-hidden bg-primary">
              <Image
                src="/logo.png"
                alt="Logo"
                width={32}
                height={32}
                className="object-cover"
              />
            </div>

            <motion.h1
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: open ? 1 : 0, x: open ? 0 : -10 }}
              transition={{ duration: 0.25, delay: open ? 0.1 : 0 }}
              className={`text-xl font-bold text-text overflow-hidden whitespace-nowrap ${open ? "inline-block" : "hidden"
                }`}
            >
              AFUED Portal
            </motion.h1>
          </div>
          <button
            onClick={toggleSidebar}
            className="p-1 rounded-lg hover:bg-background/70"
          >
            {open ? (
              <ChevronLeft className="text-text" />
            ) : (
              <ChevronRight className="text-text" />
            )}
          </button>
        </div>

        {/* NAV LINKS */}
        <nav className="flex flex-col gap-4 flex-grow px-2 whitespace-nowrap p-1">
          {sections.map((section, idx) => (
            <div key={idx} className="flex flex-col gap-1">
              {section.links.map((item) => {
                const isActive = pathname === item.href || (item.children?.some((child) => pathname === child.href));
                const Icon = item.icon;
                const isExpanded = expandedItems.has(item.name);
                return (
                  <div key={item.name}>
                    {item.children ? (
                      <button
                        type="button"
                        onClick={() => open && toggleItem(item.name)}
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colors w-full ${isActive
                          ? "bg-primary/20 text-primary font-bold"
                          : "text-text hover:bg-primary/10 dark:hover:bg-primary/20 hover:text-primary"
                          }`}
                      >
                        {Icon && <Icon size={20} />}
                        <motion.span
                          initial={false}
                          animate={{ opacity: open ? 1 : 0, x: open ? 0 : -10 }}
                          transition={{ duration: 0.2 }}
                          className={`flex-grow text-left overflow-hidden whitespace-nowrap ${open ? "inline-block" : "hidden"
                            }`}
                        >
                          {item.name}
                        </motion.span>
                        {open && (
                          <motion.span
                            animate={{ rotate: isExpanded ? 180 : 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <ChevronDown size={16} />
                          </motion.span>
                        )}
                      </button>
                    ) : (
                      <Link
                        href={item.href!}
                        prefetch={false}
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-all duration-300 ${isActive
                          ? "bg-primary/20 text-primary font-bold"
                          : "text-text dark:text-neutral-300 hover:bg-primary/10 dark:hover:bg-primary/20 hover:text-primary"
                          }`}
                      >
                        {Icon && <Icon size={20} />}
                        <span
                          className={`overflow-hidden whitespace-nowrap transition-all duration-200 ${open ? "opacity-100 max-w-[200px]" : "opacity-0 max-w-0"
                            }`}
                        >
                          {item.name}
                        </span>
                      </Link>
                    )}

                    {item.children && (
                      <AnimatePresence>
                        {open && isExpanded && (
                          <motion.ul
                            initial="closed"
                            animate="open"
                            exit="closed"
                            variants={dropdownVariants}
                            transition={{ duration: 0.2 }}
                            className="ml-6 overflow-hidden"
                          >
                            {item.children.map((child) => {
                              const isChildActive = pathname === child.href;
                              const ChildIcon = child.icon;
                              return (
                                <li key={child.name}>
                                  <Link
                                    href={child.href!}
                                    className={`flex items-center gap-3 px-3 py-2 text-sm rounded-lg font-medium transition-colors ${isChildActive
                                      ? "bg-primary/10 text-primary"
                                      : "text-textMuted hover:bg-primary/5 hover:text-primary"
                                      }`}
                                  >
                                    {ChildIcon && <ChildIcon size={16} />}
                                    <span>{child.name}</span>
                                  </Link>
                                </li>
                              );
                            })}
                          </motion.ul>
                        )}
                      </AnimatePresence>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </nav>

        {/* LOGOUT BUTTON */}
        <div className="p-4">
          <button
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-tex hover:bg-primary/10 hover:text-primary w-full transition-all"
            onClick={() => {
              localStorage.clear();
              window.location.href = "/";
            }}
          >
            <LogOut size={20} />
            {open && <span>Logout</span>}
          </button>
        </div>
      </motion.aside>

      {/* MOBILE SIDEBAR */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.3 }}
            className="fixed top-0 left-0 h-screen w-64 bg-background border-r border-border flex flex-col z-50 lg:hidden"
          >
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h1 className="text-lg font-bold text-text">
                AFUED Portal
              </h1>
              <button onClick={() => setMobileOpen(false)} className="p-2">
                <ChevronLeft className="text-text" />
              </button>
            </div>
            <nav className="flex flex-col gap-4 p-4">
              {sections.map((section, idx) => (
                <div key={idx} className="flex flex-col gap-1">
                  {section.title && (
                    <div className="px-3 py-1 text-sm font-semibold text-textMuted uppercase tracking-wide">
                      {section.title}
                    </div>
                  )}
                  {section.links.map((item) => {
                    const isActive = pathname === item.href || (item.children?.some((child) => pathname === child.href));
                    const Icon = item.icon;
                    const isExpanded = expandedItems.has(item.name);
                    return (
                      <div key={item.name}>
                        {item.children ? (
                          <button
                            onClick={() => toggleItem(item.name)}
                            className={`flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colors w-full ${isActive
                              ? "bg-primary/20 text-primary font-bold"
                              : "text-text dark:text-neutral-300 hover:bg-primary/10 hover:text-primary"
                              }`}
                          >
                            {Icon && <Icon size={20} />}
                            <span className="flex-grow text-left">{item.name}</span>
                            <motion.span
                              animate={{ rotate: isExpanded ? 180 : 0 }}
                              transition={{ duration: 0.2 }}
                            >
                              <ChevronDown size={16} />
                            </motion.span>
                          </button>
                        ) : (
                          <Link
                            href={item.href!}
                            className={`flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colors ${isActive
                              ? "bg-primary/20 text-primary font-bold"
                              : "text-text dark:text-neutral-300 hover:bg-primary/10 hover:text-primary"
                              }`}
                            onClick={() => setMobileOpen(false)}
                          >
                            {Icon && <Icon size={20} />}
                            <span>{item.name}</span>
                          </Link>
                        )}
                        {item.children && (
                          <AnimatePresence>
                            {isExpanded && (
                              <motion.ul
                                initial="closed"
                                animate="open"
                                exit="closed"
                                variants={dropdownVariants}
                                transition={{ duration: 0.2 }}
                                className="ml-6 overflow-hidden"
                              >
                                {item.children.map((child) => {
                                  const isChildActive = pathname === child.href;
                                  const ChildIcon = child.icon;
                                  return (
                                    <li key={child.name}>
                                      <Link
                                        href={child.href!}
                                        className={`flex items-center gap-3 px-3 py-2 text-sm rounded-lg font-medium transition-colors ${isChildActive
                                          ? "bg-primary/10 text-primary"
                                          : "text-textMuted hover:bg-primary/5 hover:text-primary"
                                          }`}
                                        onClick={() => setMobileOpen(false)}
                                      >
                                        {ChildIcon && <ChildIcon size={16} />}
                                        <span>{child.name}</span>
                                      </Link>
                                    </li>
                                  );
                                })}
                              </motion.ul>
                            )}
                          </AnimatePresence>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;