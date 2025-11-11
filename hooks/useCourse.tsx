'use client'
import { useState, useEffect } from "react";
import { useDataFetcher } from "@/lib/dataFetcher";
import { useDialog } from "@/context/DialogContext";
import { useNotifications } from "@/hooks/useNotification";
import { Trash2 } from "lucide-react";
// import { fetchSuggestions } from "@/lib/utils/suggestionFetcher";
import { courseTypes, courseUnits, levels, semesters } from "@/constants/options";
import { useSuggestionFetcher } from "./useSuggestionFetcher";

export type Course = {
  _id: string;
  name: string;
  code: string;
  description?: string;
  unit?: number;
  department?: string;
};

export const useCourse = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { fetchData } = useDataFetcher();
  const { openDialog, closeDialog, setError: setError2 } = useDialog();
  const { addNotification } = useNotifications();
  const {fetchSuggestions} = useSuggestionFetcher();

  const fetchCourses = async () => {
    setIsLoading(true);
    try {
      const { data } = await fetchData("course");
      setCourses(data);
    } catch {
      setError("Failed to fetch coursesf");
    } finally {
      setIsLoading(false);
    }
  };
  const fetchLecturerCourses = async () => {
    setIsLoading(true);
    try {
      const { data } = await fetchData("course/lecturer");
      console.log(data, "s")
      setCourses(data);
    } catch(error) {
      setError(error?.message || "Failed to fetch courxses");
    } finally {
      setIsLoading(false);
    }
  };


  const getCourseById = async (course_id: string) => {
    try {
      const { data } = await fetchData("course", "GET", null, { params: course_id });
      return data;
    } catch {
      setError("Failed to fetch course");
    } finally {
      setIsLoading(false);
    }
  };

  // useEffect(() => { fetchCourses(); }, []);

  const Delete = async (id: string) => {
    try {
      await fetchData('course', 'DELETE', null, { params: `${id}` });
      setCourses(prev => prev.filter(c => c._id !== id));
      closeDialog();
      addNotification({ message: "Delete Success", variant: 'success' });
    } catch (error: any) {
      setError2(error?.message);
    }
  };

  const handleEdit = (row_data: any) => {
    openDialog("form", {
      title: "Edit Course",
      confirmText: "Submit",
      loaderOnSubmit: true,
      fields: [
        {
          name: "name",
          label: "Course Name",
          defaultValue: row_data.name,
          placeholder: "Enter course name",
          required: true,
        },
        {
          name: "code",
          label: "Course Code",
          type: "text",
          defaultValue: row_data.code,
          placeholder: "Enter course code",
          required: true,
        },
        {
          name: "unit",
          label: "Unit",
          type: "number",
          defaultValue: row_data.unit,
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
            // Save the ID for backend, name for display
            console.log(record)
            setFormData((prev: any) => ({
              ...prev,
              department: record._id,  // 🔥 send this to backend
            }));
          }
        },
        {
          name: "description",
          label: "Description",
          type: "text",
          defaultValue: row_data.description,
          placeholder: "Enter course description",
        },
      ],
      onSubmit: async (data: any) => {
        try {
          await fetchData("course", "PATCH", { ...data }, { params: row_data._id });
          closeDialog();
          addNotification({ message: "Edit Success", variant: 'success' });
          setCourses(prev => prev.map(c => c._id === row_data._id ? { ...c, ...data } : c));
        } catch (error: any) {
          setError2(error.message || "Edit failed");
        }
      },
    });
  };
  const handleAssignLecturer = (row_data: any) => {
    openDialog("form", {
      title: "Assign Lecturer",
      confirmText: "Submit",
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
            // Save the ID for backend, name for display
            console.log(record)
            setFormData((prev: any) => ({
              ...prev,
              staffId: record._id, 
            }));
          }
        },
      ],
      onSubmit: async (data: any) => {
        try {
          
          await fetchData("course", "POST", { ...data, course: row_data._id }, { params: `${row_data._id}/assign` });
          closeDialog();
          addNotification({ message: "Assignment Success", variant: 'success' });
          setCourses(prev => prev.map(c => c._id === row_data._id ? { ...c, ...data } : c));
        } catch (error: any) {
          setError2(error.message || "Assignment failed");
        }
      },
    });
  };

  const handleDelete = (id: string, name: string) => {
    openDialog("confirm", {
      loaderOnConfirm: true,
      title: "Delete Course",
      message: "Are you sure you want to delete this course?",
      confirmText: "Yes, Delete",
      cancelText: "Cancel",
      dangerZone: true,
      dangerKeyword: name,
      icon: <Trash2 className="text-red-500" />,
      onConfirm: () => Delete(id),
    });
  };

  const handleAdd = (role: 'admin' | "hod") => {
    openDialog("form", {
      title: "Add Course",
      confirmText: "Create",
      loaderOnSubmit: true,
      fields: [
        {
          name: "title",
          label: "Course Name",
          placeholder: "Enter course name",
          required: true,
        },
        {
          name: "courseCode",
          label: "Course Code",
          placeholder: "Enter course code",
          required: true,
        },
        {
          type: "dropdown",
          name: "unit",
          label: "Unit",
          placeholder: "Enter course unit",
          options: courseUnits

        },
        role === "admin"&&{
          label: "Department",
          name: "department",
          type: "smart",
          placeholder: "Search by department name or code...",
          fetchData: fetchSuggestions,
          fetchableFields: ["department"],
          displayFormat: (record: any) => `${record.name} (${record.code})`,
          required: true,
          onSelect: (record: any, setFormData: Function) => {
            // Save the ID for backend, name for display
            console.log(record)
            setFormData((prev: any) => ({
              ...prev,
              department_id: record._id,  // 🔥 send this to backend
            }));
          }
        },
        {
          name: "description",
          label: "Description",
          type: "text",
          placeholder: "Enter course description",
        },
        {
          type: "dropdown",
          name: "level",
          label: "level",
          defaultValue: "",
          placeholder: "Enter Level",
          options: levels
        },
        {
          type: "dropdown",
          name: "semester",
          label: "Semester",
          defaultValue: "",
          placeholder: "Enter Semester",
          options: semesters
        },
        {
          type: "dropdown",
          name: "type",
          label: "Course Type",
          defaultValue: "",
          placeholder: "Select Course Type",
          options: courseTypes
        }

      ].filter(Boolean),
      onSubmit: async (dat: any) => {
        try {
          const { data } = await fetchData("course", "POST", { ...dat });
          addNotification({ message: "Course Created Successfully", variant: 'success' });
          closeDialog();
          console.log(data)
setCourses(prev => [
  ...prev, 
  ...(Array.isArray(data) ? data : [data])
]);

        } catch (error: any) {
          setError2(error?.message || "Creation failed");
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
          const response = await fetchData(
            'course',
            'POST',
            {
              fields: ["name", "code", "unit", "department", "description"],
              search_term: filters?.search || "",
              extraParams: {
                asFile: true,
                fileType: format || "csv"
              }
            },
            { returnFullResponse: true }
          );
          const csvText = await response.text();
          const blob = new Blob([csvText], { type: "text/csv;charset=utf-8;" });
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", `courses_export_${new Date().toISOString().slice(0, 10)}.${format || "csv"}`);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
        } catch (error) {
          console.error("Export error:", error);
          setError2("Failed to export file");
        }
      },
    });
  };

  const handleServerQuery = async (query: any) => {
    try {
      setIsLoading(true);
      const { data } = await fetchData("course", "POST", {
        fields: [query.filterId],
        page: query.page,
        search_term: query.search,
        sortField: query.sortField,
        sortOrder: query.sortOrder,
        pageSize: query.pageSize,
      });
      setCourses(data);
    } catch (err) {
      setError("Failed to fetch courses");
      console.error("Error fetching table data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    courses,
    isLoading,
    error,
    handleEdit,
    handleDelete,
    handleAdd,
    handleExport,
    handleServerQuery,
    getCourseById,
    handleAssignLecturer,
    fetchLecturerCourses
  };
};
