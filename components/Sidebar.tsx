"use client";

import { useEffect, useState, useMemo, useCallback, memo } from "react";
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

interface SidebarProps {
  role: "student" | "lecturer" | "admin" | "parent" | "hod" | "dean";
}

interface MenuItem {
  name: string;
  href?: string;
  icon?: any;
  children?: MenuItem[];
}

// Icon mapping for performance - predefine all possible icons
const ICON_MAP: Record<string, any> = {
  // Default icons
  default: FileText,

  // Role-specific icons
  LayoutDashboard,
  BookOpen,
  ClipboardList,
  FileText,
  Users,
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
};

// Memoized icon getter function
const getIconForName = (name: string): any => {
  const nameLower = name.toLowerCase();

  // Performance: Use if-else instead of switch for faster lookups
  if (nameLower.includes('result')) return ICON_MAP.ClipboardList;
  if (nameLower.includes('profile') || nameLower.includes('user')) return ICON_MAP.User;
  if (nameLower.includes('notification')) return ICON_MAP.Bell;
  if (nameLower.includes('setting')) return ICON_MAP.Settings;
  if (nameLower.includes('course')) return ICON_MAP.BookOpen;
  if (nameLower.includes('payment')) return ICON_MAP.CreditCard;
  if (nameLower.includes('timetable') || nameLower.includes('calendar')) return ICON_MAP.Calendar;
  if (nameLower.includes('message')) return ICON_MAP.MessageCircle;
  if (nameLower.includes('analytics') || nameLower.includes('report')) return ICON_MAP.BarChart3;
  if (nameLower.includes('attendance')) return ICON_MAP.CheckSquare;
  if (nameLower.includes('approve') || nameLower.includes('check')) return ICON_MAP.CheckCircle;
  if (nameLower.includes('dashboard') || nameLower.includes('overview')) return ICON_MAP.LayoutDashboard;
  if (nameLower.includes('department') || nameLower.includes('faculty')) return ICON_MAP.Building2;
  if (nameLower.includes('material')) return ICON_MAP.FileText;
  if (nameLower.includes('hostel') || nameLower.includes('home')) return ICON_MAP.Home;
  if (nameLower.includes('transcript')) return ICON_MAP.FileText;
  if (nameLower.includes('registration')) return ICON_MAP.NotebookPen;
  if (nameLower.includes('support')) return ICON_MAP.MessageCircle;
  if (nameLower.includes('ward')) return ICON_MAP.UserCircle;
  if (nameLower.includes('borrowed')) return ICON_MAP.FileBarChart;
  if (nameLower.includes('create')) return ICON_MAP.PlusCircle;
  if (nameLower.includes('log') || nameLower.includes('activity')) return ICON_MAP.Activity;
  if (nameLower.includes('template')) return ICON_MAP.MessageSquareText;
  if (nameLower.includes('announcement')) return ICON_MAP.Megaphone;
  if (nameLower.includes('result processor') || nameLower.includes('computation')) return ICON_MAP.Calculator;

  return ICON_MAP.default;
};

// Pre-process menu data to avoid runtime calculations
const processMenuItems = (items: MenuItem[]): MenuItem[] => {
  return items.map(item => {
    const processedItem = { ...item };

    // Assign icon to parent if missing
    if (item.children && !item.icon) {
      processedItem.icon = ICON_MAP.FolderTree;
    }

    // Process children
    if (item.children) {
      processedItem.children = item.children.map(child => ({
        ...child,
        icon: child.icon || getIconForName(child.name)
      }));
    }

    return processedItem;
  });
};

// Pre-computed role links (static data)
const LECTURER_LINKS = [
  { name: "Manage Courses", href: "/dashboard/lecturer/courses", icon: ICON_MAP.BookOpen },
  { name: "Notifications", href: "/dashboard/notifications", icon: ICON_MAP.Bell },
  { name: "Profile", href: "/dashboard/profile", icon: ICON_MAP.User },
  { name: "--Course Materials", href: "/dashboard/lecturer/materials", icon: ICON_MAP.FileText },
  { name: "--Attendance", href: "/dashboard/lecturer/attendance", icon: ICON_MAP.CheckSquare },
  { name: "--Performance Analytics", href: "/dashboard/lecturer/analytics", icon: ICON_MAP.BarChart2 },
];
const GENERAL_LINKS = [
  { name: "Announcements", href: "/dashboard/announcements", icon: ICON_MAP.CheckSquare },

]
export const ROLE_LINKS: Record<string, MenuItem[]> = {
  student: [
    {
      name: "Results",
      icon: ICON_MAP.ClipboardList,
      children: [
        { name: "Semester Results", href: "/dashboard/student/results/semester", icon: ICON_MAP.FileBarChart },
        { name: "--Cumulative Results", href: "/dashboard/student/results/cumulative", icon: ICON_MAP.ChartBar },
      ],
    },
    { name: "--Transcript Request", href: "/dashboard/student/transcript", icon: ICON_MAP.FileText },
    { name: "Course Registration", href: "/dashboard/student/course-registration", icon: ICON_MAP.BookOpen },
    { name: "--Payments", href: "/dashboard/student/payments", icon: ICON_MAP.CreditCard },
    // { name: "--Hostel & Accommodation", href: "/dashboard/student/hostel", icon: ICON_MAP.Home },
    { name: "--Timetable", href: "/dashboard/student/timetable", icon: ICON_MAP.Calendar },
    { name: "Notifications", href: "/dashboard/notifications", icon: ICON_MAP.Bell },
    { name: "--Support", href: "/dashboard/support", icon: ICON_MAP.MessageCircle },
    { name: "Profile", href: "/dashboard/profile", icon: ICON_MAP.User },
    ...GENERAL_LINKS
  ],

  lecturer: [...LECTURER_LINKS, ...GENERAL_LINKS],

  hod: [
    {
      name: "Lecturer",
      icon: ICON_MAP.GraduationCap,
      children: [
        { name: "My Courses", href: "/dashboard/lecturer/courses", icon: ICON_MAP.BookOpen },
        { name: "--Course Materials", href: "/dashboard/lecturer/materials", icon: ICON_MAP.FileText },
        { name: "--Attendance", href: "/dashboard/lecturer/attendance", icon: ICON_MAP.CheckSquare },
        { name: "--Performance Analytics", href: "/dashboard/lecturer/analytics", icon: ICON_MAP.BarChart2 },
      ]
    },
    {
      name: "Manage Users",
      icon: ICON_MAP.Users,
      children: [
        { name: "Students", href: "/dashboard/users/students", icon: ICON_MAP.GraduationCap },
        { name: "Lecturers", href: "/dashboard/users/lecturers", icon: ICON_MAP.User },
        { name: "--Parents", href: "/dashboard/admin/users/parents", icon: ICON_MAP.UserCircle },
      ],
    },
    {
      name: "Results",
      icon: ICON_MAP.ClipboardList,
      children: [
        { name: "--Reports", href: "/dashboard/hod/results/reports", icon: ICON_MAP.FileBarChart },
        { name: "Computations", href: "/dashboard/hod/results/computations", icon: ICON_MAP.Calculator },
      ],
    },
    {
      name: "Course Management",
      icon: ICON_MAP.ClipboardList,
      children: [
        { name: "Manage Courses", href: "/dashboard/hod/assign-courses", icon: ICON_MAP.ClipboardPlus },
        { name: "Borrowed Courses", href: "/dashboard/hod/assign-courses/borrowed", icon: ICON_MAP.FileBarChart },
        { name: "Course Registration Approvals", href: "/dashboard/hod/course-registration", icon: ICON_MAP.PersonStanding },
      ]
    },
    {
      name: "Personal",
      icon: ICON_MAP.User,
      children: [
        { name: "Notifications", href: "/dashboard/notifications", icon: ICON_MAP.Bell },
        { name: "Profile", href: "/dashboard/profile", icon: ICON_MAP.User },
      ]
    },
    {
      name: "Settings",
      icon: ICON_MAP.Settings,
      children: [
        { name: "Semester Settings", href: "/dashboard/hod/settings/semester", icon: ICON_MAP.Calendar },
      ]
    },
    ...GENERAL_LINKS

    // {
    //   name: "Department Control",
    //   icon: ICON_MAP.Building2,
    //   children: [
    //     // { name: "Timetable", href: "/dashboard/hod/timetable", icon: ICON_MAP.Calendar },
    //     // { name: "Approve Results", href: "/dashboard/hod/approve-results", icon: ICON_MAP.CheckCircle },
    //     // { name: "Department Overview", href: "/dashboard/hod/department", icon: ICON_MAP.LayoutDashboard },
    //     // { name: "Reports & Performance", href: "/dashboard/hod/reports", icon: ICON_MAP.BarChart3 },
    //   ]
    // },
  ],

  dean: [
    // Dean-specific links
    { name: "Faculty Overview", href: "/dashboard/dean/faculty-overview", icon: ICON_MAP.LayoutDashboard },
    { name: "Manage Departments", href: "/dashboard/dean/department", icon: ICON_MAP.Building },

    {
      name: "Manage Users",
      icon: ICON_MAP.Users,
      children: [
        { name: "Students", href: "/dashboard/users/students", icon: ICON_MAP.GraduationCap },
        { name: "Lecturers", href: "/dashboard/users/lecturers", icon: ICON_MAP.User },
        { name: "HOD", href: "/dashboard/users/hod", icon: ICON_MAP.Briefcase },
      ],
    },

    // Include all lecturer links
    ...LECTURER_LINKS,
    ...GENERAL_LINKS

  ],

  admin: [
    { name: "Overview", href: "/dashboard/admin", icon: ICON_MAP.LayoutDashboard },
    {
      name: "Course Management",
      icon: ICON_MAP.ClipboardList,
      children: [
        { name: "Manage Courses", href: "/dashboard/admin/courses", icon: ICON_MAP.ClipboardPlus },
        { name: "Course Reg. Stats", href: "/dashboard/admin/courses/registration/stats", icon: ICON_MAP.FileBarChart },
      ]
    },
    {
      name: "Messaging",
      icon: ICON_MAP.MessageCircle,
      children: [
        { name: "Send Message", href: "/dashboard/admin/messaging", icon: ICON_MAP.MessageCircle },
        { name: "Templates", href: "/dashboard/admin/messaging/templates", icon: ICON_MAP.MessageSquareText },
      ]
    },
    {
      name: "Manage Users",
      icon: ICON_MAP.Users,
      children: [
        { name: "Students", href: "/dashboard/admin/users/students", icon: ICON_MAP.GraduationCap },
        { name: "Lecturers", href: "/dashboard/admin/users/lecturers", icon: ICON_MAP.User },
        { name: "HOD", href: "/dashboard/admin/users/hod", icon: ICON_MAP.Briefcase },
        { name: "Deans", href: "/dashboard/admin/users/deans", icon: ICON_MAP.School },
        { name: "--Parents", href: "/dashboard/admin/users/parents", icon: ICON_MAP.UserCircle },
      ],
    },
    {
      name: "Faculty",
      icon: ICON_MAP.PlusCircle,
      children: [
        { name: "Department", href: "/dashboard/admin/create/department", icon: ICON_MAP.Building },
        { name: "Faculty", href: "/dashboard/admin/create/faculty", icon: ICON_MAP.Building2 },
      ],
    },
    { name: "--Reports & Analytics", href: "/dashboard/admin/reports", icon: ICON_MAP.BarChart3 },
    { name: "Announcements", href: "/dashboard/admin/announcements", icon: ICON_MAP.Megaphone },
    { name: "Result Processor", href: "/dashboard/admin/result_computation", icon: ICON_MAP.Calculator },
    {
      name: "Settings",
      icon: ICON_MAP.Settings,
      children: [
        { name: "Semester Settings", href: "/dashboard/admin/settings/semester", icon: ICON_MAP.Calendar },
        { name: "System Settings", href: "/dashboard/admin/settings", icon: ICON_MAP.Settings },
      ]
    },
    { name: "--Activity Logs", href: "/dashboard/admin/logs", icon: ICON_MAP.Activity },
    { name: "Profile", href: "/dashboard/profile", icon: ICON_MAP.User },
    { name: "Notifications", href: "/dashboard/notifications", icon: ICON_MAP.Bell },
    ...GENERAL_LINKS

  ],

  parent: [
    { name: "View Ward Results", href: "/dashboard/parent/results", icon: ICON_MAP.ClipboardList },
    { name: "Ward Profile", href: "/dashboard/parent/ward", icon: ICON_MAP.UserCircle },
    { name: "Payment History", href: "/dashboard/parent/payments", icon: ICON_MAP.CreditCard },
    { name: "Notifications", href: "/dashboard/parent/notifications", icon: ICON_MAP.Bell },
    ...GENERAL_LINKS

  ],
};

// Process all role links once at module level
Object.keys(ROLE_LINKS).forEach(role => {
  ROLE_LINKS[role] = processMenuItems(ROLE_LINKS[role]);
});

// Animation variants (static)
const SIDEBAR_VARIANTS = {
  expanded: { width: "16rem" },
  collapsed: { width: "5rem" },
} as const;

const DROPDOWN_VARIANTS = {
  open: { height: "auto", opacity: 1 },
  closed: { height: 0, opacity: 0 },
} as const;

// Memoized sidebar item components
const SidebarLink = memo(({
  item,
  isActive,
  open,
  onClick
}: {
  item: MenuItem;
  isActive: boolean;
  open: boolean;
  onClick?: () => void;
}) => {
  const Icon = item.icon;
  const isUnstable = item.name.startsWith('--');
  const displayName = isUnstable ? item.name.replace('--', '') : item.name;

  return (
    <Link
      href={item.href!}
      prefetch={false}
      className={`flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-all duration-200 ${isActive
        ? "bg-primary/20 text-primary font-semibold"
        : "text-text dark:text-neutral-300 hover:bg-primary/10 dark:hover:bg-primary/20 hover:text-primary"
        }`}
      onClick={onClick}
    >
      {Icon && <Icon size={20} className="flex-shrink-0" />}
      <span
        className={`overflow-hidden whitespace-nowrap transition-all duration-200 ${open ? "opacity-100 max-w-[200px]" : "opacity-0 max-w-0"
          }`}
      >
        {/* {item.name} */}
        <span className="truncate">{displayName}</span>
        {isUnstable && (
          <span className="text-xs bg-yellow-100 text-yellow-800 px-1.5 py-0.5 rounded-full">
            Dev
          </span>
        )}
      </span>
    </Link>
  );
});

SidebarLink.displayName = 'SidebarLink';

const SidebarDropdown = memo(({
  item,
  isActive,
  isExpanded,
  open,
  onToggle,
  pathname
}: {
  item: MenuItem;
  isActive: boolean;
  isExpanded: boolean;
  open: boolean;
  onToggle: () => void;
  pathname: string;
}) => {
  const Icon = item.icon;

  return (
    <div>
      <button
        type="button"
        onClick={onToggle}
        className={`flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colors w-full ${isActive
          ? "bg-primary/20 text-primary font-semibold"
          : "text-text hover:bg-primary/10 dark:hover:bg-primary/20 hover:text-primary"
          }`}
      >
        {Icon && <Icon size={20} className="flex-shrink-0" />}
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
            className="flex-shrink-0"
          >
            <ChevronDown size={16} />
          </motion.span>
        )}
      </button>

      <AnimatePresence>
        {open && isExpanded && item.children && (
          <motion.ul
            initial="closed"
            animate="open"
            exit="closed"
            variants={DROPDOWN_VARIANTS}
            transition={{ duration: 0.2 }}
            className="ml-6 overflow-hidden"
          >
            {item.children.map((child) => {
              const isChildActive = pathname === child.href;
              const ChildIcon = child.icon;
               const isUnstable = child.name.startsWith('--');
                const displayName = isUnstable ? child.name.replace('--', '') : child.name;
              return (
                <li key={child.name}>
                  <Link
                    href={child.href!}
                    className={`flex items-center gap-3 px-3 py-2 text-sm rounded-lg font-medium transition-colors ${isChildActive
                      ? "bg-primary/10 text-primary"
                      : "text-textMuted hover:bg-primary/5 hover:text-primary"
                      }`}
                  >
                    {ChildIcon && <ChildIcon size={16} className="flex-shrink-0" />}
                    <span className="truncate">{displayName}</span>
                            {isUnstable && (
          <span className="text-xs bg-yellow-100 text-yellow-800 px-1.5 py-0.5 rounded-full">
            Dev
          </span>
        )}
                  </Link>
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
});

SidebarDropdown.displayName = 'SidebarDropdown';

// Main sidebar component
const Sidebar: React.FC<SidebarProps> = memo(({ role }) => {
  const pathname = usePathname();
  const { open, toggleSidebar } = useSidebar();
  const [hydrated, setHydrated] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  // Hydration effect
  useEffect(() => {
    setHydrated(true);
  }, []);

  // Memoize toggle functions
  const toggleItem = useCallback((name: string) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(name)) {
        newSet.delete(name);
      } else {
        newSet.add(name);
      }
      return newSet;
    });
  }, []);

  const toggleMobile = useCallback(() => {
    setMobileOpen(prev => !prev);
  }, []);

  const closeMobile = useCallback(() => {
    setMobileOpen(false);
  }, []);

  const handleLogout = useCallback(() => {
    localStorage.clear();
    window.location.href = "/";
  }, []);

  // Memoize sections computation
  const sections = useMemo(() => {
    const commonLinks: MenuItem[] = [
      { name: "Dashboard", href: `/dashboard/${role}`, icon: ICON_MAP.LayoutDashboard },
    ];

    return [
      {
        title: null,
        links: commonLinks,
      },
      {
        title: `${role.charAt(0).toUpperCase() + role.slice(1)} Tools`,
        links: ROLE_LINKS[role] || [],
      },
    ];
  }, [role]);

  // Memoize active path check
  const isItemActive = useCallback((item: MenuItem) => {
    if (item.href === pathname) return true;
    if (item.children?.some(child => child.href === pathname)) return true;
    return false;
  }, [pathname]);

  // Early return before hydration
  if (!hydrated) return null;

  return (
    <>
      {/* MOBILE TOGGLE BUTTON */}
      <button
        onClick={toggleMobile}
        className="lg:hidden fixed top-4 left-4 z-50 bg-primary text-white p-2 rounded-md shadow-md hover:bg-primary/90 transition-colors"
        aria-label="Toggle menu"
      >
        <Menu size={22} />
      </button>

      {/* DESKTOP SIDEBAR */}
      <motion.aside
        variants={SIDEBAR_VARIANTS}
        animate={open ? "expanded" : "collapsed"}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="h-screen sticky top-0 flex flex-col border-r border-border bg-background dark:border-border-dark dark:bg-background-dark z-40 hidden lg:flex flex-none overflow-hidden select-none"
      >
        {/* LOGO + TOGGLE */}
        <div className="flex items-center justify-between mb-8 p-4">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 rounded-full overflow-hidden bg-primary flex-shrink-0">
              <Image
                src="/logo.png"
                alt="Logo"
                width={32}
                height={32}
                className="object-cover"
                priority
              />
            </div>

            <motion.h1
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: open ? 1 : 0, x: open ? 0 : -10 }}
              transition={{ duration: 0.25, delay: open ? 0.1 : 0 }}
              className={`text-xl font-bold text-text overflow-hidden whitespace-nowrap truncate ${open ? "inline-block" : "hidden"
                }`}
            >
              AFUED Portal
            </motion.h1>
          </div>
          <button
            onClick={toggleSidebar}
            className="p-1 rounded-lg hover:bg-background/70 transition-colors flex-shrink-0"
            aria-label={open ? "Collapse sidebar" : "Expand sidebar"}
          >
            {open ? (
              <ChevronLeft className="text-text" size={20} />
            ) : (
              <ChevronRight className="text-text" size={20} />
            )}
          </button>
        </div>

        {/* NAV LINKS */}
        <nav className="flex flex-col gap-1 flex-grow px-2 whitespace-nowrap p-1 overflow-y-auto scrollbar-thin">
          {sections.map((section, idx) => (
            <div key={idx} className="flex flex-col gap-1">
              {section.title && open && (
                <div className="px-3 py-1 text-xs font-semibold text-textMuted uppercase tracking-wider truncate">
                  {section.title}
                </div>
              )}
              {section.links.map((item) => {
                const isUnstable = item.name.startsWith('--');
                const displayName = isUnstable ? item.name.replace('--', '') : item.name;
                const isActive = isItemActive(item);
                const isExpanded = expandedItems.has(item.name);

                return item.children ? (
                  <SidebarDropdown
                    key={item.name}
                    item={item}
                    isActive={isActive}
                    isExpanded={isExpanded}
                    open={open}
                    onToggle={() => open && toggleItem(item.name)}
                    pathname={pathname}
                  />
                ) : (
                  <SidebarLink
                    key={item.name}
                    item={item}
                    isActive={isActive}
                    open={open}
                  />
                );
              })}
            </div>
          ))}
        </nav>

        {/* LOGOUT BUTTON */}
        <div className="p-4 border-t border-border">
          <button
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-text hover:bg-primary/10 hover:text-primary w-full transition-colors"
            onClick={handleLogout}
            aria-label="Logout"
          >
            <LogOut size={20} className="flex-shrink-0" />
            {open && <span className="truncate">Logout</span>}
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
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed top-0 left-0 h-screen w-64 bg-background border-r border-border flex flex-col z-50 lg:hidden"
          >
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h1 className="text-lg font-bold text-text truncate">
                AFUED Portal
              </h1>
              <button
                onClick={closeMobile}
                className="p-2 hover:bg-background/70 rounded transition-colors"
                aria-label="Close menu"
              >
                <ChevronLeft className="text-text" size={20} />
              </button>
            </div>
            <nav className="flex flex-col gap-1 p-4 overflow-y-auto scrollbar-thin">
              {sections.map((section, idx) => (
                <div key={idx} className="flex flex-col gap-1">
                  {section.title && (
                    <div className="px-3 py-1 text-xs font-semibold text-textMuted uppercase tracking-wider">
                      {section.title}
                    </div>
                  )}
                  {section.links.map((item) => {
                    const isActive = isItemActive(item);
                    const isExpanded = expandedItems.has(item.name);
                    const Icon = item.icon;

                    return (
                      <div key={item.name}>
                        {item.children ? (
                          <>
                            <button
                              onClick={() => toggleItem(item.name)}
                              className={`flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colors w-full ${isActive
                                ? "bg-primary/20 text-primary font-semibold"
                                : "text-text dark:text-neutral-300 hover:bg-primary/10 hover:text-primary"
                                }`}
                            >
                              {Icon && <Icon size={20} className="flex-shrink-0" />}
                              <span className="flex-grow text-left truncate">{item.name}</span>
                              <motion.span
                                animate={{ rotate: isExpanded ? 180 : 0 }}
                                transition={{ duration: 0.2 }}
                                className="flex-shrink-0"
                              >
                                <ChevronDown size={16} />
                              </motion.span>
                            </button>
                            {isExpanded && item.children && (
                              <motion.ul
                                initial="closed"
                                animate="open"
                                exit="closed"
                                variants={DROPDOWN_VARIANTS}
                                transition={{ duration: 0.2 }}
                                className="ml-6 overflow-hidden"
                              >
                                {item.children.map((child) => {
                                  const isChildActive = pathname === child.href;
                                  const ChildIcon = child.icon;
                                   const isUnstable = child.name.startsWith('--');
                const displayName = isUnstable ? child.name.replace('--', '') : child.name;
                                  return (
                                    <li key={child.name}>
                                      <Link
                                        href={child.href!}
                                        className={`flex items-center gap-3 px-3 py-2 text-sm rounded-lg font-medium transition-colors ${isChildActive
                                          ? "bg-primary/10 text-primary"
                                          : "text-textMuted hover:bg-primary/5 hover:text-primary"
                                          }`}
                                        onClick={closeMobile}
                                      >
                                        {ChildIcon && <ChildIcon size={16} className="flex-shrink-0" />}
                                        <span className="truncate">{displayName}</span>
                                        {isUnstable && (
          <span className="text-xs bg-yellow-100 text-yellow-800 px-1.5 py-0.5 rounded-full">
            Dev
          </span>
        )}
                                      </Link>
                                    </li>
                                  );
                                })}
                              </motion.ul>
                            )}
                          </>
                        ) : (
                          <Link
                            href={item.href!}
                            className={`flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colors ${isActive
                              ? "bg-primary/20 text-primary font-semibold"
                              : "text-text dark:text-neutral-300 hover:bg-primary/10 hover:text-primary"
                              }`}
                            onClick={closeMobile}
                          >
                            {Icon && <Icon size={20} className="flex-shrink-0" />}
                            <span className="truncate">{item.name}</span>
                          </Link>
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
});

Sidebar.displayName = 'Sidebar';

export default Sidebar;