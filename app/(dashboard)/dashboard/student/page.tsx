// StudentMain.tsx
// Tokens used: theme.colors.primary, theme.colors.textPrimary, theme.colors.background
// Component: Dynamic Student Dashboard main area fetching from mock or API

"use client";

import { useEffect, useState } from "react";
import theme from "@/styles/theme";
import Image from "next/image";
import { BookOpen, Eye } from "lucide-react";
import { useDataFetcher } from "@/lib/dataFetcher";
// import { fetchData } from "@/lib/dataFetcher";

interface Student {
  id: string;
  name: string;
  department: string;
  photo: string;
}

interface Activity {
  action: string;
  time: string;
}

interface Announcement {
  title: string;
  description: string;
  image: string;
}

const StudentMain = () => {
  const [student, setStudent] = useState<Student | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const {fetchData} = useDataFetcher()

  useEffect(() => {
    async function loadData() {
      try {
        const [studentsData, activitiesData, announcementsData] = await Promise.all([
          fetchData<Student[]>("students"),
          fetchData<Activity[]>("activities"),
          fetchData<Announcement[]>("announcements"),
        ]);
        setStudent(studentsData[0]);
        setActivities(activitiesData);
        setAnnouncements(announcementsData);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      }
    }
    loadData();
  }, []);

  if (!student) {
    return (
      <div className="flex-1 p-6 flex justify-center items-center text-gray-500 dark:text-gray-400">
        Loading student dashboard...
      </div>
    );
  }

  return (
    <main className="flex-1 p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
      {/* Welcome Section */}
      <div className="lg:col-span-3">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md flex items-center gap-6">
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
              Welcome, {student.name}!
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              Matric Number: {student.id}
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              Department: {student.department}
            </p>
          </div>
          <div className="w-24 h-24 rounded-full overflow-hidden">
            <Image
              src={student.photo}
              alt="Profile"
              width={96}
              height={96}
              className="object-cover w-full h-full"
            />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="lg:col-span-2">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
            Quick Actions
          </h3>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              className="flex-1 bg-primary text-white py-3 px-6 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors"
              style={{ backgroundColor: theme.colors.primary }}
            >
              <BookOpen size={20} />
              <span>Register Courses</span>
            </button>
            <button className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white py-3 px-6 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
              <Eye size={20} />
              <span>View Results</span>
            </button>
          </div>
        </div>
      </div>

      {/* Announcements */}
      <div className="lg:col-span-1 row-span-2">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md h-full">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
            Announcements
          </h3>
          {announcements.map((a, i) => (
            <div
              key={i}
              className="bg-cover bg-center rounded-lg p-4 flex flex-col justify-end min-h-[300px] text-white mb-4"
              style={{
                backgroundImage: `linear-gradient(0deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 100%), url(${a.image})`,
              }}
            >
              <h4 className="font-bold text-lg">{a.title}</h4>
              <p className="text-sm mt-1">{a.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="lg:col-span-2">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
            Recent Activity
          </h3>
          <ul className="space-y-3" style={{maxHeight: 200, overflow: 'scroll'}}>
            {activities.map((activity, i) => (
              <li
                key={i}
                className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300"
              >
                <span>{activity.action}</span>
                <span>{activity.time}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
};

export default StudentMain;
