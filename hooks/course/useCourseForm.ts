// useCourseForms.ts
// import { useSuggestionFetcher } from "./useSuggestionFetcher";
import { courseTypes, courseUnits, levels, semesters } from "@/constants/options";
import { useSuggestionFetcher } from "../useSuggestionFetcher";

export const useCourseForms = () => {
  const { fetchSuggestions } = useSuggestionFetcher();

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
          department_id: record._id,
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
      },
      {
        type: "dropdown" as const,
        name: "semester",
        label: "Semester",
        defaultValue: "",
        placeholder: "Enter Semester",
        options: semesters,
      },
      {
        type: "dropdown" as const,
        name: "type",
        label: "Course Type",
        defaultValue: "",
        placeholder: "Select Course Type",
        options: courseTypes,
      },
    ],
  };

  return { getFormFields };
};