import { SchoolFees } from "@/types/student.types";

interface StudentUpcomingDeadlinesProps {
  schoolFees: SchoolFees;
}

const StudentUpcomingDeadlines = ({ schoolFees }: StudentUpcomingDeadlinesProps) => {
  const deadlines = [
    { task: "School Fees Payment", due: "Mar 30, 2024", urgent: schoolFees.balance > 0 },
    { task: "Course Registration", due: "Mar 20, 2024", urgent: true },
    { task: "Hostel Application", due: "Mar 30, 2024", urgent: false },
    { task: "Tech Fest Registration", due: "Mar 25, 2024", urgent: false },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
        Upcoming Deadlines
      </h3>
      <div className="space-y-3">
        {deadlines.map((deadline, index) => (
          <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {deadline.task}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Due: {deadline.due}
              </p>
            </div>
            {deadline.urgent && (
              <span className="px-2 py-1 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 text-xs rounded-full font-medium">
                Urgent
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentUpcomingDeadlines;