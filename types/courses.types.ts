// types.ts
export type Course = {
  _id: string;
  name: string;
  code: string;
  description?: string;
  unit?: number;
  department?: string;
};

export type Pagination = {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

// Constants for error messages and configuration
export const ERROR_MESSAGES = {
  FETCH_COURSES: "Failed to fetch courses",
  FETCH_LECTURER_COURSES: "Failed to fetch lecturer courses",
  FETCH_COURSE: "Failed to fetch course",
  DELETE: "Delete failed",
  EDIT: "Edit failed",
  ASSIGN: "Assignment failed",
  CREATE: "Creation failed",
  EXPORT: "Failed to export file",
} as const;

export const DIALOG_CONFIG = {
  DELETE: {
    title: "Delete Course",
    message: "Are you sure you want to delete this course?",
    confirmText: "Yes, Delete",
    cancelText: "Cancel",
  },
  EDIT: {
    title: "Edit Course",
    confirmText: "Submit",
  },
  ASSIGN: {
    title: "Assign Lecturer",
    confirmText: "Submit",
  },
  ADD: {
    title: "Add Course",
    confirmText: "Create",
  },
  ADD_BORROWED: {
    title: "Add Borrowed Course",
    confirmText: "Create",
  },
} as const;