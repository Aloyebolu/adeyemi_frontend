import { usePage } from "@/hooks/usePage";
import { Student } from "@/types/student.types";
import { Search, Bell } from "lucide-react";

interface StudentDashboardHeaderProps {
  student: Student;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const StudentDashboardHeader = ({ 
  student, 
  searchQuery, 
  onSearchChange 
}: StudentDashboardHeaderProps) => {

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Student Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400">Welcome back, {student.name}</p>
      </div>

    </div>
  );
};

export default StudentDashboardHeader;