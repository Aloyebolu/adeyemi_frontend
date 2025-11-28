"use client";
import { useState, useEffect } from "react";
import { useDataFetcher } from "@/lib/dataFetcher";
import { useDialog } from "@/context/DialogContext";
import { useNotifications } from "@/hooks/useNotification";
import { Trash2 } from "lucide-react";
import { useSuggestionFetcher } from "./useSuggestionFetcher";
import { levels, options } from "@/constants/options";

export type Student = {
  _id?: string;
  id?: string;
  name: string;
  matric_no?: string;
  department?: string;
  level?: number;
  status?: string;
  cgpa?: string | number;
};

export const useStudent = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [pagination, setPagination] = useState([])
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { fetchData } = useDataFetcher();
  const { openDialog, closeDialog, setError: setDialogError } = useDialog();
  const { addNotification } = useNotifications();
    const { fetchSuggestions } = useSuggestionFetcher();
  

  const fetchStudents = async () => {
    setIsLoading(true);
    try {
      const { data, pagination } = await fetchData("students");
      setStudents(data);
      console.log(pagination)
      setPagination(pagination)
    } catch (err: any) {
      setError(err?.message || "Failed to fetch students");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const DeleteStudent = async (id: string) => {
    try {
      await fetchData("students", "DELETE", null, { params: `${id}` });
      setStudents((prev) => prev.filter((s) => s._id !== id && s.id !== id));
      closeDialog();
      addNotification({ message: "Delete Success", variant: "success" });
    } catch (err: any) {
      setDialogError(err?.message || "Delete failed");
    }
  };

  const handleEdit = (row_data: any) => {
    openDialog("form", {
      title: "Edit Student",
      confirmText: "Submit",
      loaderOnSubmit: true,
      fields: [
        {
          name: "name",
          label: "Full Name",
          defaultValue: row_data.name,
          placeholder: "Enter student name",
          required: true,
        },
        {
          name: "matric_no",
          label: "Matric No",
          type: "text",
          defaultValue: row_data.matric_no || row_data.id,
          placeholder: "Enter matric number",
        },
        {
          name: "department",
          label: "Department",
          defaultValue: row_data.department,
          placeholder: "Enter department",
        },
        {
          type: "dropdown",
          name: "level",
          label: "Level",
          defaultValue: row_data.level,
          placeholder: "Enter level",
          options: [{ label: "200 Level" }, { label: "200 Level" }, { label: "200 Level" }, { label: "200 Level" }]
        },
      ],
      onSubmit: async (data: any) => {
        try {
          await fetchData("students", "PATCH", { ...data }, { params: row_data._id || row_data.id });
          closeDialog();
          addNotification({ message: "Edit Success", variant: "success" });
          // Update local state optimistically
          setStudents((prev) =>
            prev.map((s) => (s._id === (row_data._id || row_data.id) || s.id === (row_data._id || row_data.id)) ? { ...s, ...data } : s)
          );
        } catch (err: any) {
          setDialogError(err?.message || "Edit failed");
        }
      },
    });
  };

  const handleDelete = (id: string, name?: string) => {
    openDialog("confirm", {
      loaderOnConfirm: true,
      title: "Delete Student",
      message: "Are you sure you want to delete this student?",
      confirmText: "Yes, Delete",
      cancelText: "Cancel",
      dangerZone: true,
      dangerKeyword: name,
      icon: <Trash2 className="text-red-500" />,
      onConfirm: () => DeleteStudent(id),
    });
  };

  const handleAdd = () => {
    openDialog("form", {
      title: "Add Student",
      confirmText: "Create",
      loaderOnSubmit: true,
      fields: [
        {
          name: "name",
          label: "Full Name",
          placeholder: "Enter student name",
          required: true,
        },
        {
          name: "matric_no",
          label: "Matric No",
          placeholder: "Enter matric number",
          required: true,
        },
                {
          name: "email",
          type: 'email',
          label: "Email",
          placeholder: "Enter Email",
          required: true,
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
            console.log(record)
            setFormData((prev: any) => ({
              ...prev,
              department_id: record._id,
            }));
          }
        },
        {
          type: "dropdown",
          name: "level",
          label: "Level",
          defaultValue: "",
          placeholder: "Enter level",
          options: options.levels
        },
      ],
      onSubmit: async (dat: any) => {
        try {
          const { data } = await fetchData("students", "POST", { ...dat });
          addNotification({ message: "Student Created Successfully", variant: "success" });
          closeDialog();
          setStudents((prev) => [
            ...prev,
            ...(Array.isArray(data) ? data : [data])
          ]);

        } catch (err: any) {
          setDialogError(err?.message || "Creation failed");
        }
      },
    });
  };

  const handleExport = () => {
    openDialog("export", {
      fields: {
        name: "Full Name",
        matric_no: "Matric No",
        department: "Department",
      },
      fetchableFields: ["matric_no", "name", "department"],
      onConfirm: async ({ format, filters }: { format?: string; filters?: any }) => {
        try {
          const response = await fetchData(
            "students",
            "POST",
            {
              fields: ["name", "matric_no", "department"],
              search_term: filters?.search || "",
              extraParams: {
                asFile: true,
                fileType: format || "csv",
              },
            },
            { returnFullResponse: true }
          );

          const csvText = await response.text();
          const blob = new Blob([csvText], { type: "text/csv;charset=utf-8;" });
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", `students_export_${new Date().toISOString().slice(0, 10)}.${format || "csv"}`);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
        } catch (err: any) {
          console.error("Export error:", err);
          setDialogError("Failed to export file");
        }
      },
    });
  };

  const handleServerQuery = async (query: any) => {
    try {
      setIsLoading(true);
      const { data, pagination } = await fetchData("students", "POST", {
        fields: [query.filterId || "name"],
        search_term: query.search || "",
        page: query.page,
        pageSize: query.pageSize,
        sortField: query.sortField,
        sortOrder: query.sortOrder,
      });
      setStudents(data);
      setPagination(pagination)
    } catch (err: any) {
      setError(err?.message || "Failed to fetch students");
      console.error("Error fetching table data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    students,
    isLoading,
    error,
    handleEdit,
    handleDelete,
    handleAdd,
    handleExport,
    handleServerQuery,
    pagination
  };
};
