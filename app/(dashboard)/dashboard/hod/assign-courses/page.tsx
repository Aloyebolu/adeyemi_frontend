import NotesCard from "@/components/ui/card/NotesCard";
import CourseDashboard from "../../admin/courses/page";

export default function AssignCoursesPage() {
  const hodNotes = [
    { 
      text: "As HOD, you can assign lecturers to courses in your department", 
      type: "info" 
    },
    { 
      text: "Assign lecturers based on their expertise and workload capacity", 
      type: "success" 
    },
    { 
      text: "Courses without assigned lecturers cannot be taught this semester and might affect students who took this course", 
      type: "warning" 
    },
    { 
      text: "Review lecturer assignments before the semester officially begins", 
      type: "default" 
    },
    { 
      text: "You can reassign courses if lecturers change or leave", 
      type: "info" 
    },
  ];

  return (
    <div className="space-y-6 p-4">
      {/* Course Dashboard */}
      <div className="mt-6">
        <CourseDashboard role="hod" />
      </div>
      {/* Notes Section */}
      <NotesCard
        title="HOD Course Assignment Guidelines"
        notes={hodNotes}
        iconColor="text-purple-600"
      />
    </div>
  );
}