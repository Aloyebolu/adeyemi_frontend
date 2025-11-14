"use client";
import { useState, useEffect } from "react";
import { useDataFetcher } from "@/lib/dataFetcher";
import { useDialog } from "@/context/DialogContext";
import { useNotifications } from "@/hooks/useNotification";
import { Trash2 } from "lucide-react";
// import { fetchSuggestions } from "@/lib/utils/suggestionFetcher";
import { lecturerRanks } from "@/constants/options";
import { useSuggestionFetcher } from "./useSuggestionFetcher";

export type Lecturer = {
  _id?: string;
  id?: string;
  name: string;
  staff_no?: string;
  department?: string;
  email?: string;
  phone?: string;
  rank?: string;
};

export const useLecturer = () => {
  const [lecturers, setLecturers] = useState<Lecturer[]>([]);
  const [pagination, setPagination] = useState([])
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { fetchData } = useDataFetcher();
  const { openDialog, closeDialog, setError: setDialogError } = useDialog();
  const { addNotification } = useNotifications();
  const { fetchSuggestions } = useSuggestionFetcher();

  const fetchLecturers = async () => {
    setIsLoading(true);
    try {
      const data = await fetchData("lecturers");
      setLecturers(data.data);
      setPagination(data.pagination)
      console.log(data)
    } catch (err: any) {
      setError(err?.message || "Failed to fetch lecturers");
    } finally {
      setIsLoading(false);
    }
  };
    const fetchHods = async () => {
    setIsLoading(true);
    try {
      const { data } = await fetchData("lecturers/hods");
      setLecturers(data);
    } catch (err: any) {
      setError(err?.message || "Failed to fetch HODs");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // fetchLecturers();
  }, []);

  const fetchDepartmentSuggestions = async (field: string, input: string) => {
    const { data } = await fetchData("department", "POST", {
      fields: ["name", "code"],
      search_term: input,
    });

    return Array.isArray(data) ? data : [];
  };

  const DeleteLecturer = async (id: string) => {
    try {
      await fetchData("lecturers", "DELETE", null, { params: `${id}` });
      setLecturers((prev) => prev.filter((l) => l._id !== id && l.id !== id));
      closeDialog();
      addNotification({ message: "Delete Success", variant: "success" });
    } catch (err: any) {
      setDialogError(err?.message || "Delete failed");
    }
  };

  const handleEdit = (row_data: any) => {
    openDialog("form", {
      title: "Edit Lecturer",
      confirmText: "Submit",
      loaderOnSubmit: true,
      fields: [
        {
          name: "name",
          label: "Full Name",
          defaultValue: row_data.name,
          placeholder: "Enter lecturer name",
          required: true,
        },
        {
          name: "staff_no",
          label: "Staff No",
          type: "text",
          defaultValue: row_data.staff_no || row_data.id,
          placeholder: "Enter staff number",
        },
        {
          type: "dropdown",
          name: "rank",
          label: "Rank",
          defaultValue: "",
          placeholder: "Enter rank",
          options: lecturerRanks
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
        }
      ],
      onSubmit: async (data: any) => {
        try {
          await fetchData("lecturers", "PATCH", { ...data }, { params: row_data._id || row_data.id });
          closeDialog();
          addNotification({ message: "Edit Success", variant: "success" });
          setLecturers((prev) =>
            prev.map((l) => (l._id === (row_data._id || row_data.id) || l.id === (row_data._id || row_data.id)) ? { ...l, ...data } : l)
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
      title: "Delete Lecturer",
      message: "Are you sure you want to delete this lecturer?",
      confirmText: "Yes, Delete",
      cancelText: "Cancel",
      dangerZone: true,
      dangerKeyword: name,
      icon: <Trash2 className="text-red-500" />,
      onConfirm: () => DeleteLecturer(id),
    });
  };

  const handleAdd = () => {
    openDialog("form", {
      title: "Add Lecturer",
      confirmText: "Create",
      loaderOnSubmit: true,
      fields: [
        {
          name: "name",
          label: "Full Name",
          defaultValue: "",
          placeholder: "Enter lecturer name",
          required: true,
        },
        {
          name: "staff_id",
          label: "Staff Id",
          type: "text",
          defaultValue: "",
          placeholder: "Enter staff number",
        },
        {
          name: "email",
          label: "Email",
          type: "email",
          defaultValue: "",
          required: true,
          placeholder: "Enter staff email",
        },
        {
          type: "dropdown",
          name: "rank",
          label: "Rank",
          defaultValue: "",
          placeholder: "Enter rank",
          options: lecturerRanks
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
              department_id: record._id,  // 🔥 send this to backend
            }));
          }
        }
      ],
      onSubmit: async (dat: any) => {
        try {
          const { data } = await fetchData("lecturers", "POST", { ...dat });
          addNotification({ message: "Lecturer Created Successfully", variant: "success" });
          closeDialog();
          console.log(data)
          setLecturers((prev) => [
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
        staff_no: "Staff No",
        department: "Department",
        email: "Email",
        phone: "Phone",
        rank: "Rank",
      },
      fetchableFields: ["staff_no", "name", "department", "email", "phone", "rank"],
      onConfirm: async ({ format, filters }: { format?: string; filters?: any }) => {
        try {
          const response = await fetchData(
            "lecturers",
            "POST",
            {
              fields: ["name", "staff_no", "department", "email", "phone", "rank"],
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
          link.setAttribute("download", `lecturers_export_${new Date().toISOString().slice(0, 10)}.${format || "csv"}`);
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
      const { data, pagination } = await fetchData("lecturers", "POST", {
        fields: [query.filterId || "name"],
        search_term: query.search || "",
        page: query.page,
        pageSize: query.pageSize,
        sortField: query.sortField,
        sortOrder: query.sortOrder,
      });
      setLecturers(data);
      setPagination(pagination)
    } catch (err: any) {
      setError(err?.message || "Failed to fetch lecturers");
      console.error("Error fetching table data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    pagination,
    lecturers,
    isLoading,
    error,
    handleEdit,
    handleDelete,
    handleAdd,
    handleExport,
    handleServerQuery,
    fetchLecturers,
    fetchHods
  };
};
