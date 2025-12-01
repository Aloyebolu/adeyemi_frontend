'use client'
import { useState, useEffect } from "react";
import { useDataFetcher } from "@/lib/dataFetcher";
import { useDialog } from "@/context/DialogContext";
import { useNotifications } from "@/hooks/useNotification";
import { Badge, Trash2 } from "lucide-react";
import { useSuggestionFetcher } from "./useSuggestionFetcher";

export type Faculty = {
  _id: string;
  name: string;
  description: string;
};

export const useFaculty = () => {
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [pagination, setPagination] = useState([])

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { fetchData } = useDataFetcher();
  const { openDialog, closeDialog, setError: setError2, setError: setDialogError } = useDialog();
  const { addNotification } = useNotifications();
  const {fetchSuggestions} = useSuggestionFetcher()
  // cons

  const fetchFaculties = async () => {
    setIsLoading(true);
    try {
      const { data, pagination } = await fetchData("faculty");
      setFaculties(data);
      setPagination(pagination)
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

  const assignDean = (name: string, id: string, facultyId: string) => {
  openDialog("form", {
    title: `Assign Dean to Faculty ${name}`,
    confirmText: "Assign Dean",
    loaderOnSubmit: true,
    fields: [
      {
        name: "lecturers",
        type: "smart",
        placeholder: "Search by lecturer name or Staff ID...",
        fetchData: fetchSuggestions,
        fetchableFields: ["lecturers"],
        displayFormat: (record: any) => (
          <div className="flex flex-col gap-2 p-2">
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
            {record.currentRole && (
              <div className="flex items-center gap-2">
                <span className="font-semibold text-primary">Current Role:</span>
                <Badge variant="outline" className="text-xs">
                  {record.currentRole}
                </Badge>
              </div>
            )}
          </div>
        ),
        required: true,
        onSelect: (record: any, setFormData: Function) => {
          console.log("Selected lecturer for dean:", record);
          setFormData((prev: any) => ({
            ...prev,
            userId: record._id,  // Send this to backend
            facultyId: facultyId
          }));
        }
      }
    ],

    onSubmit: async (data: any) => {
      console.log("Assign dean payload:", data);
      try {
        const payload = {
          userId: data.userId,
        };

        const { data: updatedFaculty } = await fetchData("faculty", "PATCH", payload, {
          params: `${data.facultyId}/assign-dean`
        });

        addNotification({
          message: "Dean assigned successfully",
          variant: "success",
        });
        
        closeDialog();
        
        // Update the faculties list with the new dean assignment
        setFaculties((prev) => 
          prev.map(faculty => 
            faculty._id === data.facultyId 
              ? { ...faculty, dean: updatedFaculty.dean }
              : faculty
          )
        );
      } catch (error: any) {
        setDialogError(error?.message || "Failed to assign dean");
      }
    },
  });
};

// Optional: Function to remove dean
const revokeDean = (facultyName: string, deanName: string, facultyId: string) => {
  openDialog("confirm", {
    title: `Revoke Dean from ${facultyName} Faculty`,
    description: (
      <div className="space-y-2">
        <p className="text-gray-700">
          You are about to revoke <span className="font-semibold text-indigo-600">{deanName}</span> as the Dean of <span className="font-semibold text-indigo-600">{facultyName}</span> Faculty.
        </p>
        <p className="text-sm text-gray-500">
          This action cannot be undone. The faculty will have no active Dean until a new one is assigned.
        </p>
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-md">
          <p className="text-sm text-amber-800">
            <strong>Note:</strong> This will revert the user's role back to their previous position (Lecturer or HOD).
          </p>
        </div>
      </div>
    ),
    confirmText: "Revoke Dean",
    confirmVariant: "destructive",
    loaderOnConfirm: true,

    onConfirm: async () => {
      try {
        // Send DELETE request to revoke Dean
        const { data: updatedFaculty } = await fetchData(
          "faculty",
          "PATCH",
          {},
          {
            params: `${facultyId}/remove-dean`,
          }
        );

        addNotification({
          message: `Dean successfully revoked from ${facultyName} Faculty`,
          variant: "success",
        });
        closeDialog();

        // Update state if faculties are stored in local state
        setFaculties((prev) =>
          prev.map((faculty) =>
            faculty._id === facultyId ? { ...faculty, dean: null } : faculty
          )
        );
      } catch (error: any) {
        setDialogError(error?.message || "Failed to revoke Dean");
        closeDialog();
        addNotification({
          message: error?.message || "Failed to revoke Dean",
          variant: "error",
        });
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
      const { data, pagination } = await fetchData("faculty", "POST", {
        fields: [query.filterId],
        page: query.page,
        search_term: query.search
      });
      setFaculties(data);
      setPagination(pagination)


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
    getDepById,
    pagination,
    assignDean,
    revokeDean
  };
};
