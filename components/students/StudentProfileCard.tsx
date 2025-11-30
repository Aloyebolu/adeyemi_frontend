import { QuickStat, Student } from "@/types/student.types";
import Image from "next/image";

interface StudentProfileCardProps {
  student: Student;
  quickStats: QuickStat[];
}

const StudentProfileCard = ({ student, quickStats }: StudentProfileCardProps) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="p-6 flex flex-col sm:flex-row items-start sm:items-center gap-6">
        <div className="w-20 h-20 rounded-full overflow-hidden relative border-4 border-white dark:border-gray-800 shadow-lg">
          <Image
            src={student.photo}
            alt="Profile"
            fill
            className="object-cover"
            sizes="80px"
            priority
          />
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            {student.name}
          </h2>
          <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
            <span>🎓 {student.department}</span>
            <span>📊 {student.level}</span>
            <span>📅 {student.semester.toLowerCase().includes("semester")? student.semester : student.semester +" Semester" }</span>
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            {student.email} • {student.matric_no}
          </p>
        </div>
      </div>
      
      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-6 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
        {quickStats.map((stat, index) => (
          <div key={index} className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-xs">
            <div className={`flex justify-center items-center w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 mx-auto mb-2 ${stat.color}`}>
              {stat.icon}
            </div>
            <div className="text-lg font-bold text-gray-900 dark:text-white">{stat.value}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">{stat.label}</div>
            {stat.change && (
              <div className={`text-xs ${
                stat.change.startsWith('+') ? 'text-green-600' : 
                stat.change.startsWith('-') ? 'text-red-600' : 'text-gray-500'
              }`}>
                {stat.change}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentProfileCard;