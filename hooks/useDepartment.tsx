"use client";
import { useState, useEffect } from "react";
import { useDataFetcher } from "@/lib/dataFetcher";
import { useDialog } from "@/context/DialogContext";
import { useNotifications } from "@/hooks/useNotification";
import { Trash2 } from "lucide-react";

export type Department = {
  _id: string;
  name: string;
  code: string;
  faculty: {
    _id: string;
    name: string;
  };
  description?: string;
};

export const useDepartment = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { fetchData } = useDataFetcher();
  const { openDialog, closeDialog, setError: setDialogError } = useDialog();
  const { addNotification } = useNotifications();

  const fetchFacultySuggestions = async (field: string, input: string) => {
  const { data } = await fetchData("faculty", "POST", {
    fields: ["name", "code"], // 🔥 search both
    search_term: input,
  });

  return Array.isArray(data) ? data : [];
};
  const fetchDepartmentSuggestions = async (field: string, input: string) => {
  const { data } = await fetchData("department", "POST", {
    fields: ["name", "code"], // 🔥 search both
    search_term: input,
  });

  return Array.isArray(data) ? data : [];
};

  // ✅ Fetch all departments
  const fetchDepartments = async () => {
    setIsLoading(true);
    try {
      const { data } = await fetchData("department", "GET", null, { params: "?limit" });
      console.log(data)
      setDepartments(data || []);
    } catch {
      setError("Failed to fetch departments");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  // 🗑️ Delete a department
  const Delete = async (id: string) => {
    try {
      await fetchData("department", "DELETE", null, { params: `${id}` });
      setDepartments((prev) => prev.filter((d) => d._id !== id));
      closeDialog();
      addNotification({ message: "Department deleted successfully", variant: "success" });
    } catch (error: any) {
      setDialogError(error?.message || "Failed to delete department");
    }
  };

  // ✏️ Edit a department
  const handleEdit = (row_data: Department) => {
    openDialog("form", {
      title: "Edit Department",
      confirmText: "Save Changes",
      loaderOnSubmit: true,
      fields: [
        {
          name: "name",
          label: "Department Name",
          defaultValue: row_data.name,
          placeholder: "Enter department name",
          required: true,
        },
        {
          name: "code",
          label: "Department Code",
          defaultValue: row_data.code,
          placeholder: "Enter department code",
          required: true,
        },
        {
          name: "faculty",
          label: "Faculty",
          type: "search-select", // can later connect to your dynamic Faculty search input
          defaultValue: row_data.faculty?._id,
          placeholder: "Select Faculty",
          required: true,
        },
      ],
      onSubmit: async (data: any) => {
        try {
          await fetchData("department", "PATCH", data, { params: row_data._id });
          addNotification({ message: "Department updated successfully", variant: "success" });
          closeDialog();
          fetchDepartments(); // refresh list
        } catch (error: any) {
          setDialogError(error?.message || "Failed to update department");
        }
      },
    });
  };

    const handleDelete = (id: string, name: string) => {
    openDialog("confirm", {
      loaderOnConfirm: true,
      title: "Delete Department",
      message: "Are you sure you want to delete this Department?",
      confirmText: "Yes, Delete",
      cancelText: "Cancel",
      dangerZone: true,
      dangerKeyword : name,
      icon: <Trash2 className="text-red-500" />,
      onConfirm: () => Delete(id),
    });
  };

// ➕ Add a department
const handleAdd = () => {
  openDialog("form", {
    title: "Add Department",
    confirmText: "Create",
    loaderOnSubmit: true,
    fields: [
      {
        name: "name",
        label: "Department Name",
        placeholder: "Enter department name",
        required: true,
      },
      {
        name: "code",
        label: "Department Code",
        placeholder: "Enter department code",
        required: true,
      },
      {
  name: "faculty",
  type: "smart",
  placeholder: "Search by faculty name or code...",
  fetchData: fetchFacultySuggestions,
  fetchableFields: ["faculty"],
  displayFormat: (record: any) => `${record.name} (${record.code})`,
  required: true,
  onSelect: (record: any, setFormData: Function) => {
    // Save the ID for backend, name for display
    console.log(record)
    setFormData((prev: any) => ({
      ...prev,
      faculty_id: record._id,  // 🔥 send this to backend
    }));
  }
}

    ],

    onSubmit: async (data: any) => {
      try {
        // 🧠 data.faculty now holds the selected faculty's _id
        const payload = {
          ...data,
          faculty: data.faculty.value || data.faculty, // ensure _id is sent
        };

        const { data: newDept } = await fetchData("department", "POST", payload);
        addNotification({
          message: "Department created successfully",
          variant: "success",
        });
        closeDialog();
        setDepartments((prev) => [...prev, newDept]);
      } catch (error: any) {
        setDialogError(error?.message || "Failed to create department");
      }
    },
  });
};

const assignHod = (name: string, id: string, hodId: string) => {
  openDialog("form", {
    title: `Assign HOD to Department ${name}`,
    confirmText: "Assign",
    loaderOnSubmit: true,
    fields: [
      {
  name: "department",
  type: "smart",
  placeholder: "Search by department name or code...",
  fetchData: fetchDepartmentSuggestions,
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

    onSubmit: async (data: any) => {
      try {
        // 🧠 data.faculty now holds the selected faculty's _id
        const payload = {
          ...data,
          faculty: data.faculty.value || data.faculty, // ensure _id is sent
        };

        const { data: newDept } = await fetchData("department", "PATCH", {
          userId: hodId
        }, {
          params: `${hodId}/assign-hod`
        });
        addNotification({
          message: "Department created successfully",
          variant: "success",
        });
        closeDialog();
        setDepartments((prev) => [...prev, newDept]);
      } catch (error: any) {
        setDialogError(error?.message || "Failed to create department");
      }
    },
  });
};

  // 📤 Export departments
  const handleExport = () => {
    openDialog("export", {
      fields: {
        name: "Department Name",
        code: "Department Code",
        faculty: "Faculty Name",
      },
      fetchableFields: ["name", "code", "faculty"],
      onConfirm: async ({ format, filters }) => {
        try {
          const response = await fetchData(
            "department",
            "POST",
            {
              fields: ["name", "code", "faculty"],
              search_term: filters?.search_term || "",
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
          link.setAttribute(
            "download",
            `departments_export_${new Date().toISOString().slice(0, 10)}.csv`
          );
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
        } catch (error: any) {
          setDialogError(error?.message || "Failed to export departments");
        }
      },
    });
  };

  return {
    departments,
    isLoading,
    error,
    handleAdd,
    handleEdit,
    handleDelete,
    handleExport,
    assignHod
  };
};
