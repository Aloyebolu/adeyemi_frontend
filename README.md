# 🧭 AFUED Admin Dashboard Wireframe Guide

This document outlines the **visual wireframe structure** of the AFUED Admin Panel, summarizing the layout and user flow for all 8 key admin pages.

---

## 🎨 Design System Overview

* **Framework:** Next.js + TailwindCSS + Shadcn/UI
* **Color Tokens:** from `styles/theme.ts`

  * `--color-primary`, `--color-accent`, `--color-surfaceElevated`, `--color-textOnPrimary`
* **Components:** Card, Button, Input, Label, Table
* **Typography:** Consistent use of `text-primary`, `font-semibold`, `text-gray-500`
* **Accessibility:** All buttons ≥ 2.5rem height, focus outline with `accent` color

---

## 🏠 1️⃣ Overview Dashboard (`/dashboard/admin`)

### Purpose

Displays summary statistics, charts, and quick actions.

### Layout

```
+-----------------------------------------------+
| Admin Overview                                |
|-----------------------------------------------|
| [Active Semester]  [Students]  [Lecturers]    |
| [Courses]                                       |
|-----------------------------------------------|
| Quick Actions: [Start Semester] [Approve] ... |
|-----------------------------------------------|
| Course Registration Activity Chart (Recharts) |
+-----------------------------------------------+
```

---

## 🕓 2️⃣ Semester Management (`/dashboard/admin/semester`)

### Purpose

Start or close a semester, toggle registration, result publication.

### Layout

```
+--------------------------------------------+
| Semester Management                        |
|--------------------------------------------|
| Current Session: 2025/2026                 |
| [Start New Semester] [Toggle Registration] |
| [Toggle Result Publication]                |
+--------------------------------------------+
```

---

## 📚 3️⃣ Course Management (`/dashboard/admin/courses`)

### Purpose

CRUD interface for course data.

### Layout

```
+--------------------------------------------+
| Manage Courses                             |
|--------------------------------------------|
| [Search Bar] [Add New Course]              |
|--------------------------------------------|
| Course Table: Code | Title | Lecturer | ...|
+--------------------------------------------+
```

---

## 🧾 4️⃣ Result Approvals (`/dashboard/admin/approvals`)

### Purpose

Approve or reject uploaded results.

### Layout

```
+--------------------------------------------+
| Approve Results                            |
|--------------------------------------------|
| [Search Bar] [Filter by Department]        |
|--------------------------------------------|
| Results Table: Course | Lecturer | Status  |
| [Approve] [Reject]                        |
+--------------------------------------------+
```

---

## 🧠 5️⃣ Transcript Requests (`/dashboard/admin/transcripts`)

### Purpose

View, approve, or reject transcript requests.

### Layout

```
+--------------------------------------------+
| Transcript Requests                         |
|--------------------------------------------|
| [Search by Name or Matric No]              |
|--------------------------------------------|
| Table: Student | Matric No | Dept | Status |
| [Approve] [Reject] [Download PDF]          |
+--------------------------------------------+
```

---

## ⚙️ 6️⃣ System Settings (`/dashboard/admin/settings`)

### Purpose

Manage school info, grading scale, and toggles.

### Layout

```
+--------------------------------------------+
| System Settings                            |
|--------------------------------------------|
| School Name | Current Session              |
| Grading Scale (A–F thresholds)             |
| [Maintenance Mode] [Email Notifications]   |
| [Save Settings]                            |
+--------------------------------------------+
```

---

## 🧩 7️⃣ Activity Logs (`/dashboard/admin/logs`)

### Purpose

View chronological system activity.

### Layout

```
+--------------------------------------------+
| Activity Logs                              |
|--------------------------------------------|
| [Search Bar] [Filter Dropdown]             |
|--------------------------------------------|
| Table: Action | User | Target | Date       |
+--------------------------------------------+
```

---

## 🔐 8️⃣ Roles & Permissions (`/dashboard/admin/roles`)

### Purpose

Assign and manage role-based access.

### Layout

```
+--------------------------------------------+
| Roles & Permissions                        |
|--------------------------------------------|
| [Add New Role]                             |
|--------------------------------------------|
| Role Cards: [Role Name] [Permissions List] |
| [Save Changes]                             |
+--------------------------------------------+
```

---

## 🌈 Global Design Tokens Used

| Token                          | Description                           |
| ------------------------------ | ------------------------------------- |
| `theme.colors.primary`         | Brand color (used for buttons, icons) |
| `theme.colors.accent`          | Secondary call-to-action color        |
| `theme.colors.surfaceElevated` | Card background color                 |
| `theme.colors.textOnPrimary`   | Text color for primary surfaces       |

---

## ✅ Final Admin Navigation Structure

```
/dashboard/admin
 ├── page.tsx                # Overview
 ├── semester/page.tsx       # Semester Management
 ├── courses/page.tsx        # Course Management
 ├── approvals/page.tsx      # Result Approvals
 ├── transcripts/page.tsx    # Transcript Requests
 ├── settings/page.tsx       # System Settings
 ├── logs/page.tsx           # Activity Logs
 └── roles/page.tsx          # Roles & Permissions
```

---

**Status:** ✅ Fully structured and compliant with AFUED Frontend Standards.

**Next Step:** Integrate APIs and connect with the backend routes (`/api/...`).
