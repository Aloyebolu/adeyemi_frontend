// suggestionConfig.ts
export const suggestionConfig = {
  department: {
    endpoint: "department",
    fields: ["name", "code"],
  },
  lecturers: {
    endpoint: "lecturers",
    fields: ["name", "staffId"],
  },
  faculty: {
    endpoint: "faculty",
    fields: ["name", "short_name"],
  },
  lecturer: {
    endpoint: "lecturer",
    fields: ["staffId", "specialization", "rank"],
  },
  student: {
    endpoint: "student",
    fields: ["matric_no", "name"],
  },
  rank: {
    predefined: [
      "assistant_lecturer",
      "lecturer_ii",
      "lecturer_i",
      "senior_lecturer",
      "associate_professor",
      "professor",
    ],
  },
};
