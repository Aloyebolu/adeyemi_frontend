import { BookOpen, Eye, Calendar, CreditCard, Settings} from "lucide-react";
import Link from "next/link";

const StudentQuickActions = () => {
  const actions = [
    { icon: <BookOpen size={24} />, label: "Course Registration", color: "bg-blue-500" ,url: "course-registration" },
    { icon: <Eye size={24} />, label: "View Results", color: "bg-green-500", url: "results/semester" },
    // { icon: <Calendar size={24} />, label: "Exam Timetable", color: "bg-orange-500" },
    { icon: <CreditCard size={24} />, label: "Pay Fees", color: "bg-purple-500", url: "payments" },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <Settings size={20} />
        Quick Actions
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {actions.map((action, index) => (
          <Link href={`./student/${action.url || '#'}/`} key={index}>
          <button
            className="flex flex-col items-center justify-center p-4 rounded-xl bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors group"
            >
            <div className={`p-3 rounded-lg ${action.color} text-white mb-2 group-hover:scale-110 transition-transform`}>
              {action.icon}
            </div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 text-center">
              {action.label}
            </span>
          </button>
            </Link>
        ))}
      </div>
    </div>
  );
};

export default StudentQuickActions;