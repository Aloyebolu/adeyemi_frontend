'use client'
import { useState, useEffect } from "react";
import { useDataFetcher } from "@/lib/dataFetcher";
import { useDialog } from "@/context/DialogContext";
import { useNotifications } from "@/hooks/useNotification";
import { Trash2 } from "lucide-react";

export type Faculty = {
  _id: string;
  name: string;
  description: string;
};

export const useFaculty = () => {
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { fetchData } = useDataFetcher();
  const { openDialog, closeDialog, setError: setError2 } = useDialog();
  const { addNotification } = useNotifications();
  // cons

  const fetchFaculties = async () => {
    setIsLoading(true);
    try {
      const { data } = await fetchData("faculty");
      setFaculties(data);
    } catch {
      setError("Failed to fetch faculties");
    } finally {
      setIsLoading(false);
    }
  };
  const getDepById = async (department_id: string) => {
    // setIsLoading(true);
    try {
      const { data } = await fetchData("faculty", "GET", null, { params: department_id });
      // setFaculties(data);
      return data;
    } catch {
      setError("Failed to fetch faculties");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchFaculties(); }, []);

  const Delete = async (id: string) => {
    try {

      await fetchData('faculty', 'DELETE', null, { params: `${id}` });
      setFaculties(prev => prev.filter(f => f._id !== id));
      closeDialog();
      addNotification({ message: "Delete Success", variant: 'success' });
    } catch (error) {
      setError2((error as Error)?.message || "Delete failed");
    }
  };

  const handleEdit = (row_data: any) => {
    openDialog("form", {
      title: "Edit Faculty",
      confirmText: "Submit",
      loaderOnSubmit: true,
      fields: [
        {
          name: "name",
          label: "Name",
          defaultValue: row_data.name,
          placeholder: "Enter faculty name",
          required: true,
        },
        {
          name: "code",
          label: "Code",
          type: "text",
          defaultValue: row_data.code,
          placeholder: "Enter Code",
        },
      ],
      onSubmit: async (data: any) => {
        try {
          await fetchData("faculty", "PATCH", { ...data }, { params: row_data._id });
          // set
          closeDialog();
          addNotification({ message: "Edit Success", variant: 'success' });
        } catch (error : any) {
          setError2(error.message || "Edit failed");
        }
      },
    });
  };

  const handleDelete = (id: string, name: string) => {
    openDialog("confirm", {
      loaderOnConfirm: true,
      title: "Delete Faculty",
      message: "Are you sure you want to delete this faculty?",
      confirmText: "Yes, Delete",
      cancelText: "Cancel",
      dangerZone: true,
      dangerKeyword: name,
      icon: <Trash2 className="text-red-500" />,
      onConfirm: () => Delete(id),
    });
  };

  const handleAdd = () => {
    openDialog("form", {
      title: "Edit Faculty",
      confirmText: "Submit",
      loaderOnSubmit: true,
      fields: [
        {
          name: "name",
          label: "Faculty Name",
          placeholder: "Enter faculty name",
          required: true,
        },
        {
          name: "code",
          label: "Faculty Code",
          placeholder: "Enter Faculty Code",
          required: true,
        },
      ],
      onSubmit: async (dat: any) => {
        try {
          const { data } = await fetchData("faculty", "POST", { ...dat });
          addNotification({ message: "Faculty Created Successfully", variant: 'success' });
          closeDialog();
          setFaculties((prev) => [
            ...prev,
            ...(Array.isArray(data) ? data : [data])
          ]);

        } catch (error: any) {
          setError2(error?.message || "Creation failed");
          // addNotification({ message: "Creation Failed", variant: 'error' });
        }
      },
    });
  };

  const handleExport = () => {
    openDialog("export", {
      fields: {
        name: "Faculty Name",
        code: "Faculty Code",
      },
      fetchableFields: ["code", "name"],
      onConfirm: async ({  }) => {
        try {
          const response = await fetchData(
            'faculty',
            'POST',
            {
              fields: ["name", "code"],
              search_term: "Educ",
              extraParams: {
                asFile: true,
                fileType: "csv"
              }
            },
            { returnFullResponse: true }
          );
          const csvText = await response.text();
          const blob = new Blob([csvText], { type: "text/csv;charset=utf-8;" });
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", `faculties_export_${new Date().toISOString().slice(0, 10)}.csv`);
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
    // setLoading(true);
    try {
      const params = new URLSearchParams({
        page: query.page.toString(),
        pageSize: query.pageSize.toString(),
        search: query.search || "",
        sortField: query.sortField || "",
        sortOrder: query.sortOrder || "",
        filterId: query.filterId || "", // 🧩 from dropdown
      });
      console.log(query)

      setIsLoading(true);
      const { data } = await fetchData("faculty", "POST", {
        fields: [query.filterId],
        page: query.page,
        search_term: query.search
      });
      setFaculties(data);


      // setPagination({
      //   current_page: json.page,
      //   total_pages: json.totalPages,
      //   total_items: json.totalItems,
      //   limit: query.pageSize,
      // });
    } catch (err) {
      setError("Failed to fetch faculties");
      console.error("Error fetching table data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    faculties,
    isLoading,
    error,
    handleEdit,
    handleDelete,
    handleAdd,
    handleExport,
    handleServerQuery,
    getDepById
  };
};
