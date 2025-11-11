"use client";
import { useState, useEffect } from "react";
import { useDataFetcher } from "@/lib/dataFetcher";
import { useDialog } from "@/context/DialogContext";
import { useNotifications } from "@/hooks/useNotification";
import { Trash2 } from "lucide-react";
import { useSuggestionFetcher } from "./useSuggestionFetcher";
// import { fetchSuggestions } from "@/lib/utils/suggestionFetcher";

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
  const {fetchSuggestions} = useSuggestionFetcher();

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
    fetchDepartments()
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
      dangerKeyword: name,
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
          fetchData: fetchSuggestions,
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
          
          setDepartments((prev) => [...prev, ...(Array.isArray(newDept) ? newDept : [newDept])]);

        } catch (error: any) {
          setDialogError(error?.message || "Failed to create department");
        }
      },
    });
  };

  const assignHod = (name: string, id: string, hodId: string, departmentId: string) => {
    openDialog("form", {
      title: `Assign HOD to Department ${name}`,
      confirmText: "Assign",
      loaderOnSubmit: true,
      fields: [
        {
          name: "lecturers",
          type: "smart",
          placeholder: "Search by lecturer name or Staff Id...",
          fetchData: fetchSuggestions,
          fetchableFields: ["lecturers"],
          displayFormat: (record: any) => (
            <div className="flex flex-row justifiy-between gap-4">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-primary">Name:</span>
                <span className="text-gray-700">{record.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-primary">Staff ID:</span>
                <span className="text-gray-500">{record.staff_id || "N/A"}</span>
              </div>
              {record.department && (
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-primary">Department:</span>
                  <span className="text-gray-500">{record.department}</span>
                </div>
              )}
            </div>
          ),


          required: true,
          onSelect: (record: any, setFormData: Function) => {
            // Save the ID for backend, name for display
            console.log(record)
            setFormData((prev: any) => ({
              ...prev,
              lecturerId: record._id,  // 🔥 send this to backend
              hod_id: record._id,
              department_id: departmentId
            }));
          }
        }

      ],

      onSubmit: async (data: any) => {
        console.log(data)
        try {
          // 🧠 data.faculty now holds the selected faculty's _id
          const payload = {
            ...data,
          };

          const { data: newDept } = await fetchData("department", "PATCH", {
            ...data
          }, {
            params: `${data.department_id}/assign-hod`
          });
          addNotification({
            message: "HOD assigned successfully",
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
  const revokeHod = (name: string, hodName: string, departmentId: string) => {
  openDialog("confirm", {
    title: `Revoke HOD from ${name} Department`,
    description: (
      <div className="space-y-2">
        <p className="text-gray-700">
          You are about to revoke <span className="font-semibold text-indigo-600">{hodName}</span> as the Head of Department for <span className="font-semibold text-indigo-600">{name}</span>.
        </p>
        <p className="text-sm text-gray-500">
          This action cannot be undone. The department will have no active HOD until a new one is assigned.
        </p>
      </div>
    ),
    confirmText: "Revoke HOD",
    confirmVariant: "destructive",
    loaderOnConfirm: true,

    onConfirm: async () => {
      try {
        // 🧠 Send PATCH request to revoke HOD
        const { data: updatedDept } = await fetchData(
          "department",
          "PATCH",
          {},
          {
            params: `${departmentId}/remove-hod`,
          }
        );

        addNotification({
          message: `HOD successfully revoked from ${name}`,
          variant: "success",
        });
        closeDialog();

        // 🔄 Optional: update state if departments are stored in local state
        setDepartments((prev) =>
          prev.map((dept) =>
            dept._id === departmentId ? { ...dept, hod: null } : dept
          )
        );
      } catch (error: any) {
        setDialogError(error?.message || "Failed to revoke HOD");
        closeDialog();
        addNotification({
          message: error?.message || "Failed to revoke HOD",
          variant: "error",
        });
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
      onConfirm: async ({ format, filters }: { format: string; filters: { search_term?: string } }) => {
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
      const { data } = await fetchData("department", "POST", {
        fields: [query.filterId],
        page: query.page,
        search_term: query.search
      });
      setDepartments(data);
      
      
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
    departments,
    isLoading,
    error,
    handleAdd,
    handleEdit,
    handleDelete,
    handleExport,
    assignHod,
    handleServerQuery,
    revokeHod
  };
};
