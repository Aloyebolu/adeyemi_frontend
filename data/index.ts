import { IconName } from './sidebar/icons';

export interface MenuItem {
  name: string;
  href?: string;
  icon?: IconName;
  children?: MenuItem[];
}

export const ROLE_LINKS: Record<string, MenuItem[]> = {
  student: [
    {
      name: "Results",
      icon: "list",
      children: [
        { name: "Semester Results", href: "/dashboard/student/results/semester", icon: "file" },
      ],
    },
    { name: "Course Registration", href: "/dashboard/student/course-registration", icon: "book" },
    { name: "Payments", href: "/dashboard/student/payments", icon: "creditCard" },
    { name: "Notifications", href: "/dashboard/notifications", icon: "bell" },
    { name: "Profile", href: "/dashboard/profile", icon: "user" },
  ],

  lecturer: [
    { name: "Manage Courses", href: "/dashboard/lecturer/courses", icon: "book" },
    { name: "Notifications", href: "/dashboard/notifications", icon: "bell" },
    { name: "Profile", href: "/dashboard/profile", icon: "user" },
  ],

  hod: [
    {
      name: "Lecturer",
      icon: "school",
      children: [
        { name: "My Courses", href: "/dashboard/lecturer/courses", icon: "book" },
      ]
    },
    {
      name: "Results",
      icon: "list",
      children: [
        { name: "Reports", href: "/dashboard/hod/results/reports", icon: "chart" },
        { name: "Computations", href: "/dashboard/hod/results/computations", icon: "calculator" },
      ],
    },
    {
      name: "Course Management",
      icon: "list",
      children: [
        { name: "Manage Courses", href: "/dashboard/hod/assign-courses", icon: "list" },
        { name: "Borrowed Courses", href: "/dashboard/hod/assign-courses/borrowed", icon: "chart" },
        { name: "Course Registration Approvals", href: "/dashboard/hod/course-registration", icon: "user" },
      ]
    },
    {
      name: "Personal",
      icon: "user",
      children: [
        { name: "Notifications", href: "/dashboard/notifications", icon: "bell" },
        { name: "Profile", href: "/dashboard/profile", icon: "user" },
      ]
    },
    {
      name: "Settings",
      icon: "settings",
      children: [
        { name: "Semester Settings", href: "/dashboard/hod/settings/semester", icon: "calendar" },
      ]
    },
  ],

  dean: [
    { name: "Faculty Overview", href: "/dashboard/dean/faculty", icon: "dashboard" },
    { name: "Manage HODs", href: "/dashboard/dean/manage-hods", icon: "users" },
    { name: "Profile", href: "/dashboard/profile", icon: "user" },
  ],

  admin: [
    { name: "Overview", href: "/dashboard/admin", icon: "dashboard" },
    {
      name: "Course Management",
      icon: "list",
      children: [
        { name: "Manage Courses", href: "/dashboard/admin/courses", icon: "list" },
        { name: "Course Reg. Stats", href: "/dashboard/admin/courses/registration/stats", icon: "chart" },
      ]
    },
    {
      name: "Messaging",
      icon: "message",
      children: [
        { name: "Send Message", href: "/dashboard/admin/messaging", icon: "message" },
        { name: "Templates", href: "/dashboard/admin/messaging/templates", icon: "message" },
      ]
    },
    {
      name: "Manage Users",
      icon: "users",
      children: [
        { name: "Students", href: "/dashboard/admin/users/students", icon: "school" },
        { name: "Lecturers", href: "/dashboard/admin/users/lecturers", icon: "user" },
        { name: "HOD", href: "/dashboard/admin/users/hod", icon: "briefcase" },
        { name: "Deans", href: "/dashboard/admin/users/deans", icon: "school" },
      ],
    },
    {
      name: "Create",
      icon: "plus",
      children: [
        { name: "Department", href: "/dashboard/admin/create/department", icon: "building" },
        { name: "Faculty", href: "/dashboard/admin/create/faculty", icon: "building" },
      ],
    },
    { name: "Reports & Analytics", href: "/dashboard/admin/reports", icon: "chart" },
    { name: "Announcements", href: "/dashboard/admin/announcements", icon: "megaphone" },
    { name: "Result Processor", href: "/dashboard/admin/result_computation", icon: "calculator" },
    {
      name: "Settings",
      icon: "settings",
      children: [
        { name: "Semester Settings", href: "/dashboard/admin/settings/semester", icon: "calendar" },
        { name: "System Settings", href: "/dashboard/admin/settings", icon: "settings" },
      ]
    },
    { name: "Profile", href: "/dashboard/profile", icon: "user" },
    { name: "Notifications", href: "/dashboard/notifications", icon: "bell" },
  ],

  parent: [
    { name: "View Ward Results", href: "/dashboard/parent/results", icon: "list" },
    { name: "Ward Profile", href: "/dashboard/parent/ward", icon: "user" },
    { name: "Payment History", href: "/dashboard/parent/payments", icon: "creditCard" },
    { name: "Notifications", href: "/dashboard/parent/notifications", icon: "bell" },
  ],
};

// Get menu for specific role
export const getMenuForRole = (role: string): MenuItem[] => {
  return ROLE_LINKS[role] || [];
};