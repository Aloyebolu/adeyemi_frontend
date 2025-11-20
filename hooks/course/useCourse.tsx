// useCourse.ts
'use client'
import { useDialog } from "@/context/DialogContext";
import { Trash2 } from "lucide-react";
import { useCourseOperations } from "./useCourseOperations";
import { useCourseForms } from "./useCourseForms";
import { CourseDetails } from "./CourseDetails";
import { DIALOG_CONFIG, ERROR_MESSAGES } from "./types";
import { useSuggestionFetcher } from "./useSuggestionFetcher";

export const useCourse = () => {
  const { openDialog } = useDialog();
  const { fetchSuggestions } = useSuggestionFetcher();
  
  // Import operations and forms
  const {
    courses,
    isLoading,
    error,
    pagination,
    setCourses,
    fetchCourses,
    fetchLecturerCourses,
    getCourseById,
    deleteCourse,
    handleServerQuery,
    handleApiError,
    handleSuccess,
  } = useCourseOperations();

  const { getFormFields } = useCourseForms();

  const checkDetails = (courseData: any) => {
    openDialog("custom", {
      component: () => <CourseDetails selectedCourse={courseData} />,
      title: "Course Details",
    });
  };

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

  const handleEdit = (courseData: any) => {
    openDialog("form", {
      title: DIALOG_CONFIG.EDIT.title,
      confirmText: DIALOG_CONFIG.EDIT.confirmText,
      loaderOnSubmit: true,
      fields: [
        {
          name: "name",
          label: "Course Name",
          defaultValue: courseData.name,
          placeholder: "Enter course name",
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
          const { fetchData } = await import("@/lib/dataFetcher");
          await fetchData("course", "PATCH", formData, { params: courseData._id });
          const { closeDialog } = await import("@/context/DialogContext");
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

  const handleAssignLecturer = (courseData: any) => {
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
          displayFormat: (record: any) => `${record.name} (${record.staffId})`,
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
          const { fetchData } = await import("@/lib/dataFetcher");
          await fetchData(
            "course", 
            "POST", 
            { ...formData, course: courseData._id }, 
            { params: `${courseData._id}/assign` }
          );
          const { closeDialog } = await import("@/context/DialogContext");
          closeDialog();
          handleSuccess("Lecturer assigned successfully");
        } catch (err) {
          handleApiError(err, ERROR_MESSAGES.ASSIGN);
        }
      },
    });
  };

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
          const { fetchData } = await import("@/lib/dataFetcher");
          const { data } = await fetchData("course", "POST", formData);
          const { closeDialog } = await import("@/context/DialogContext");
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

  const handleAddBorrowed = (role: 'admin' | 'hod') => {
    const fields = [
      {
        name: "coursesOutOfDepartment",
        label: "Select Original Course",
        type: "smart",
        placeholder: "Search original course...",
        fetchData: fetchSuggestions,
        fetchableFields: ["coursesOutOfDepartment"],
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
      onSubmit: async (formData: any) => {
        try {
          const { fetchData } = await import("@/lib/dataFetcher");
          const payload = {
            borrowedId: formData.borrowedId,
            department: formData.department_id,
            type: "borrowed",
          };

          const { data } = await fetchData("course", "POST", payload);
          const { closeDialog } = await import("@/context/DialogContext");
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

  const handleExport = () => {
    openDialog("export", {
      fields: {
        name: "Course Name",
        code: "Course Code",
        unit: "Unit",
        department: "Department",
        description: "Description",
      },
      fetchableFields: ["code", "name", "unit", "department", "description"],
      onConfirm: async ({ format, filters }: { format: string; filters: { search: string } }) => {
        try {
          const { fetchData } = await import("@/lib/dataFetcher");
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

          const fileContent = await response.text();
          const blob = new Blob([fileContent], { type: "text/csv;charset=utf-8;" });
          const url = window.URL.createObjectURL(blob);
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
    checkDetails,
    
    // Data fetching
    getCourseById,
    fetchLecturerCourses,
    fetchCourses,
  };
};