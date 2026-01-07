'use client'
import { useState, useEffect } from "react";
import { useDataFetcher } from "@/lib/dataFetcher";
import { useDialog } from "@/context/DialogContext";
import { useNotifications } from "@/hooks/useNotification";
import { Trash2 } from "lucide-react";
import { courseTypes, courseUnits, levels, semesters } from "@/constants/options";
import { useSuggestionFetcher } from "./useSuggestionFetcher";
import { CourseDetails } from "./course/CourseDetails";

// Types
export type Course = {
  _id: string;
  name: string;
  code: string;
  description?: string;
  unit?: number;
  department?: string;
  semester?: "first" | "second";
  pending_result_uploads?: number;
  students?: number;
};

export type Pagination = {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

// Constants for error messages and configuration
const ERROR_MESSAGES = {
  FETCH_COURSES: "Failed to fetch courses",
  FETCH_LECTURER_COURSES: "Failed to fetch lecturer courses",
  FETCH_COURSE: "Failed to fetch course",
  DELETE: "Delete failed",
  EDIT: "Edit failed",
  ASSIGN: "Assignment failed",
  CREATE: "Creation failed",
  EXPORT: "Failed to export file",
} as const;

const DIALOG_CONFIG = {
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

/**
 * Custom hook for managing course operations
 * Provides CRUD operations, lecturer assignment, and export functionality
 */

export const useCourse = () => {
  // State management
  const [courses, setCourses] = useState<Course[]>([]);
  const [borrowedCoursesFromMyDepartment, setBorrowedCoursesFromMyDepartment] = useState<Course[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [pagination2, setPagination2] = useState<Pagination | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Custom hooks
  const { fetchData } = useDataFetcher();
  const { openDialog, closeDialog, setError: setDialogError } = useDialog();
  const { addNotification } = useNotifications();
  const { fetchSuggestions } = useSuggestionFetcher();

  /**
   * Generic API error handler
   */
  const handleApiError = (error: any, defaultMessage: string) => {
    const message = error?.message || defaultMessage;
    setError(message);
    setDialogError(message);
    return message;
  };

  /**
   * Generic success handler
   */
  const handleSuccess = (message: string) => {
    addNotification({ message, variant: 'success' });
  };

  /**
 * Safe data fetcher with validation
 */
  const safeFetchData = async (path: string, method = "GET", body?: any, options?: any) => {
    if (!fetchData || typeof fetchData !== 'function') {
      throw new Error('Data fetcher is not available');
    }

    const result = await fetchData(path, method, body, options);

    // Validate response structure
    if (!result) {
      throw new Error('No response received from server');
    }

    return result;
  };

  /**
   * Fetches all courses with pagination
   */
  const fetchCourses = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, pagination } = await fetchData("course", "GET");
      setCourses(data);
      setPagination(pagination);
    } catch (err) {
      handleApiError(err, ERROR_MESSAGES.FETCH_COURSES);
    } finally {
      setIsLoading(false);
    }
  };
  const fetchBorrowedCoursesFromMyDepartment = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, pagination } = await fetchData("course/borrowed", "GET");
      setBorrowedCoursesFromMyDepartment(data);
      setPagination2(pagination);
    } catch (err) {
      handleApiError(err, ERROR_MESSAGES.FETCH_COURSES);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch course by id
  const fetchCourseById = async (courseId: string): Promise<Course | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const { data } = await fetchData("course", "GET", null, { params: courseId });
      return data;
    } catch (err) {
      handleApiError(err, ERROR_MESSAGES.FETCH_COURSE);
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  /**
   * Fetches courses assigned to the current lecturer
   */
  const fetchLecturerCourses = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { data } = await fetchData("course/lecturer");
      setCourses(data);
    } catch (err) {
      handleApiError(err, ERROR_MESSAGES.FETCH_LECTURER_COURSES);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Fetches a single course by ID
   */
  const getCourseById = async (courseId: string): Promise<Course | undefined> => {
    setIsLoading(true);

    try {
      const { data } = await fetchData("course", "GET", null, { params: courseId });
      return data;
    } catch (err) {
      handleApiError(err, ERROR_MESSAGES.FETCH_COURSE);
      return undefined;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Opens dialog with course details
   */
  const checkDetails = (courseData: any) => {
    openDialog("custom", {
      component: () => <CourseDetails selectedCourse={courseData} />,
      title: "Course Details",
    });
  };

  /**
   * Deletes a course by ID
   */
  const deleteCourse = async (courseId: string) => {
    try {
      await fetchData('course', 'DELETE', null, { params: courseId });
      setCourses(prev => prev.filter(course => course._id !== courseId));
      closeDialog();
      handleSuccess("Course deleted successfully");
    } catch (err) {
      handleApiError(err, ERROR_MESSAGES.DELETE);
    }
  };

  /**
   * Opens confirmation dialog for course deletion
   */
  const handleDelete = (courseId: string, courseName: string) => {
    openDialog("confirm", {
      loaderOnConfirm: true,
      title: DIALOG_CONFIG.DELETE.title,
      message: DIALOG_CONFIG.DELETE.message,
      confirmText: DIALOG_CONFIG.DELETE.confirmText,
      cancelText: DIALOG_CONFIG.DELETE.cancelText,
      dangerZone: true,
      dangerKeyword: courseName,
      icon: <Trash2 className="text-red-500" />,
      onConfirm: () => deleteCourse(courseId),
    });
  };

  /**
   * Common field configurations for forms
   */
  const getFormFields = {
    // Department selection field
    department: (role: 'admin' | 'hod') => ({
      label: "Department",
      name: "department",
      type: "smart" as const,
      placeholder: "Search by department name or code...",
      fetchData: fetchSuggestions,
      fetchableFields: ["department"],
      displayFormat: (record: any) => `${record.name} (${record.code})`,
      required: true,
      onSelect: (record: any, setFormData: Function) => {
        setFormData((prev: any) => ({
          ...prev,
          department: record._id,
        }));
      },
    }),

    // Basic course fields
    basic: [
      {
        name: "title",
        label: "Course Title",
        placeholder: "Enter course title",
        required: true,
      },
      {
        name: "courseCode",
        label: "Course Code",
        placeholder: "Enter course code",
        required: true,
      },
      {
        type: "dropdown" as const,
        name: "unit",
        label: "Unit",
        placeholder: "Enter course unit",
        options: courseUnits,
        required: true,
        
      },
      {
        name: "description",
        label: "Description",
        type: "text" as const,
        placeholder: "Enter course description",
      },
      {
        type: "dropdown" as const,
        name: "level",
        label: "Level",
        defaultValue: "",
        placeholder: "Enter Level",
        options: levels,
        required: true,

      },
      {
        type: "dropdown" as const,
        name: "semester",
        label: "Semester",
        defaultValue: "",
        placeholder: "Enter Semester",
        options: semesters,
        required: true,

      },
      {
        type: "dropdown" as const,
        name: "type",
        label: "Course Type",
        defaultValue: "",
        placeholder: "Select Course Type",
        options: courseTypes,
        required: true,

      },
    ],
  };

  /**
   * Handles course editing
   */
  const handleEdit = (courseData: any) => {
    openDialog("form", {
      title: DIALOG_CONFIG.EDIT.title,
      confirmText: DIALOG_CONFIG.EDIT.confirmText,
      loaderOnSubmit: true,
      fields: [
        {
          name: "name",
          label: "Course Title",
          defaultValue: courseData.name,
          placeholder: "Enter course title",
          required: true,
        },
        {
          name: "code",
          label: "Course Code",
          type: "text",
          defaultValue: courseData.code,
          placeholder: "Enter course code",
          required: true,
        },
        {
          name: "unit",
          label: "Unit",
          type: "number",
          defaultValue: courseData.unit,
          placeholder: "Enter course unit",
        },
        {
          name: "department",
          type: "smart",
          placeholder: "Search by department name or code...",
          fetchData: fetchSuggestions,
          fetchableFields: ["department"],
          displayFormat: (record: any) => `${record.name} (${record.code})`,
          required: true,
          onSelect: (record: any, setFormData: Function) => {
            setFormData((prev: any) => ({
              ...prev,
              department: record._id,
            }));
          },
        },
        {
          name: "description",
          label: "Description",
          type: "text",
          defaultValue: courseData.description,
          placeholder: "Enter course description",
        },
      ],
      onSubmit: async (formData: any) => {
        try {
          await fetchData("course", "PATCH", formData, { params: courseData._id });
          closeDialog();
          handleSuccess("Course updated successfully");
          setCourses(prev =>
            prev.map(course =>
              course._id === courseData._id ? { ...course, ...formData } : course
            )
          );
        } catch (err) {
          handleApiError(err, ERROR_MESSAGES.EDIT);
        }
      },
    });
  };

  /**
   * Handles lecturer assignment to a course
   */
  const handleAssignLecturer = (courseData: any,) => {
    openDialog("form", {
      title: DIALOG_CONFIG.ASSIGN.title,
      confirmText: DIALOG_CONFIG.ASSIGN.confirmText,
      loaderOnSubmit: true,
      fields: [
        {
          name: "lecturers",
          type: "smart",
          placeholder: "Search by department lecturer name or staff ID...",
          fetchData: fetchSuggestions,
          fetchableFields: ["lecturers"],
          displayFormat: (record: any) => `${record.name} (${record.staff_id})`,
          required: true,
          onSelect: (record: any, setFormData: Function) => {
            setFormData((prev: any) => ({
              ...prev,
              staffId: record._id,
            }));
          },
        },
      ],
      onSubmit: async (formData: any) => {
        try {
          await fetchData(
            "course",
            "POST",
            { ...formData, course: courseData._id },
            { params: `${courseData._id}/assign` }
          );
          closeDialog();
          handleSuccess("Lecturer assigned successfully");
        } catch (err) {
          handleApiError(err, ERROR_MESSAGES.ASSIGN);
        }
      },
    });
  };

  /**
   * Handles Unassigning a lecturer from a course
   */
  const handleUnassignLecturer = (courseData: any, lecturerData: any) => {
    openDialog("confirm", {
      title: `Unassign ${courseData?.lecturer?.name || "Lecturer"} from ${courseData.code}`,
      description: (
        <div className="space-y-2">
          <p className="text-gray-700">
            You are about to unassign{" "}
            <span className="font-semibold text-indigo-600">
              {courseData.lecturer?.name} ({courseData.lecturer?.staff_id})
            </span>{" "}
            from{" "}
            <span className="font-semibold text-indigo-600">
              {courseData.courseCode} - {courseData.title}
            </span>
            .
          </p>

          {courseData.isOriginal && (
            <p className="text-sm text-yellow-600 bg-yellow-50 p-2 rounded">
              ⚠️ Note: This will also unassign the lecturer from all borrowed copies of this course.
            </p>
          )}

          <p className="text-sm text-gray-500">
            This action cannot be undone. The course will need to be reassigned later.
          </p>
        </div>
      ),
      confirmText: "Unassign Lecturer",
      confirmVariant: "destructive",
      type: "confirm",
      loaderOnConfirm: true,

      onConfirm: async () => {
        try {
          await fetchData(
            "course",
            "POST",
            {
              course: courseData._id,
              staffId: courseData.lecturer?._id // Optional parameter
            },
            { params: `${courseData._id}/unassign` }
          );

          closeDialog();
          addNotification({
            message: `Lecturer unassigned successfully from ${courseData.courseCode}`,
            variant: "success",
          });

          // refreshCourses();

        } catch (error: any) {
          closeDialog();
          addNotification({
            message: error?.message || "Failed to unassign lecturer",
            variant: "error",
          });
        }
      },
    });
  };
  /**
   * Handles adding a new course
   */
  const handleAdd = (role: 'admin' | 'hod') => {
    const fields = [
      ...getFormFields.basic,
      ...(role === "admin" ? [getFormFields.department(role)] : []),
    ];

    openDialog("form", {
      title: DIALOG_CONFIG.ADD.title,
      confirmText: DIALOG_CONFIG.ADD.confirmText,
      loaderOnSubmit: true,
      fields,
      onSubmit: async (formData: any) => {
        try {
          const { data } = await fetchData("course", "POST", formData);
          handleSuccess("Course created successfully");
          closeDialog();
          setCourses(prev => [
            ...prev,
            ...(Array.isArray(data) ? data : [data]),
          ]);
        } catch (err) {
          handleApiError(err, ERROR_MESSAGES.CREATE);
        }
      },
    });
  };

  /**
   * Handles adding a borrowed course
   */
  const handleAddBorrowed = (role: 'admin' | 'hod') => {
    const fields = [
      {
        name: "coursesWithoutBorrowed",
        label: "Select Original Course",
        type: "smart",
        placeholder: "Search original course...",
        fetchData: fetchSuggestions,
        fetchableFields: ["coursesWithoutBorrowed"],
        displayFormat: (record: any) => `${record.name} (${record.code})`,
        required: true,
        onSelect: (record: any, setFormData: Function) => {
          setFormData((prev: any) => ({ ...prev, borrowedId: record._id }));
        },
      },
      ...(role === "admin" ? [getFormFields.department(role)] : []),
    ];

    openDialog("form", {
      title: DIALOG_CONFIG.ADD_BORROWED.title,
      confirmText: DIALOG_CONFIG.ADD_BORROWED.confirmText,
      loaderOnSubmit: true,
      fields,
      notes: [
        { text: "Borrowed courses are copies of original courses from other departments." },
        { text: "You can assign lecturers to borrowed courses independently." },
        { text: "Changes to borrowed courses do not affect the original course." },
        { text: "Ensure you have the necessary permissions to borrow courses." },
      ],
      onSubmit: async (formData: any) => {
        try {
          const payload = {
            borrowedId: formData.borrowedId,
            department: formData.department,
          };

          const { data } = await fetchData("course", "POST", payload);
          handleSuccess("Borrowed course created successfully");
          closeDialog();
          setCourses(prev => [
            ...prev,
            ...(Array.isArray(data) ? data : [data]),
          ]);
        } catch (err) {
          handleApiError(err, ERROR_MESSAGES.CREATE);
        }
      },
    });
  };

  /**
   * Handles course data export
   */
  const handleExport = () => {
    openDialog("export", {
      fields: {
        name: "Course Title",
        code: "Course Code",
        unit: "Unit",
        department: "Department",
        description: "Description",
      },
      fetchableFields: ["code", "name", "unit", "department", "description"],
      onConfirm: async ({ format, filters }: { format: string; filters: { search: string } }) => {
        try {
          const response = await fetchData(
            'course',
            'POST',
            {
              fields: ["name", "code", "unit", "department", "description"],
              search_term: filters?.search || "",
              extraParams: {
                asFile: true,
                fileType: format || "csv",
              },
            },
            { returnFullResponse: true }
          );

          const fileContent =  response.text;
          const blob = fileContent && new Blob([fileContent], { type: "text/csv;charset=utf-8;" });
          const url =blob&& window.URL.createObjectURL(blob);
          const link = document.createElement("a");

          link.href = url;
          link.setAttribute(
            "download",
            `courses_export_${new Date().toISOString().slice(0, 10)}.${format || "csv"}`
          );

          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
        } catch (err) {
          handleApiError(err, ERROR_MESSAGES.EXPORT);
        }
      },
    });
  };

  /**
   * Handles server-side queries with filtering, sorting, and pagination
   */
  const handleServerQuery = async (query: any) => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, pagination } = await fetchData("course", "POST", {
        fields: [query.filterId || "courseTitle"],
        page: query.page,
        search_term: query.search,
        sortField: query.sortField,
        sortOrder: query.sortOrder,
        pageSize: query.pageSize,
      });

      setCourses(data);
      setPagination(pagination);
    } catch (err) {
      handleApiError(err, ERROR_MESSAGES.FETCH_COURSES);
    } finally {
      setIsLoading(false);
    }
  };




  return {
    // State
    courses,
    isLoading,
    error,
    pagination,

    // Actions
    handleEdit,
    handleDelete,
    handleAdd,
    handleAddBorrowed,
    handleExport,
    handleServerQuery,
    handleAssignLecturer,
    handleUnassignLecturer,

    checkDetails,

    // Data fetching
    getCourseById,
    fetchLecturerCourses,
    fetchCourses,
    fetchCourseById,
    borrowedCoursesFromMyDepartment,
    fetchBorrowedCoursesFromMyDepartment,
    pagination2
  };
};