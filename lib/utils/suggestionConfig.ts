// suggestionConfig.ts
export const suggestionConfig = {
  department: {
    endpoint: "department",
    fields: ["name", "code"],
    extras: {}
  },
  lecturers: {
    endpoint: "lecturers",
    fields: ["name", "staffId"],
    extras: {}

  },
  faculty: {
    endpoint: "faculty",
    fields: ["name", "short_name"],
    extras: {}

  },
  lecturer: {
    endpoint: "lecturer",
    fields: ["staffId", "specialization", "rank"],
    extras: {}

  },
  student: {
    endpoint: "student",
    fields: ["matricNumber", "name"],
    extras: {}

  },

  // Fetches courses linked to the Department excluding borrowend courses
  coursesOfDepartment: {
    endpoint: 'course',
    fields: ["title", 'courseCode'],
    extras: {
      withBorrowed:false
    }
  },

  // Fetches courses that are outside the department
  coursesOutOfDepartment: {
    endpoint: 'course',
    fields: ["title", 'courseCode'],
    extras: {
      outOfDepartment: true
    }
  },

  // Fetches courses linked to a Department including borrowed courses
  courseOfDepartmentWithBorrowed: {
        endpoiint: 'course',
    fields: ["name", 'cod'],
    extras: {
      withBorrowed: true
    }
  },
  // Course Suggestions with no limit

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
