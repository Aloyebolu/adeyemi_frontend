"use client";

import { useState } from "react";
import { 
  Calendar, 
  Plus, 
  Edit3, 
  Trash2, 
  Users, 
  Download, 
  Upload,
  Settings,
  Eye,
  BookOpen,
  MapPin,
  Clock
} from "lucide-react";

const HODTimetablePage = () => {
  const [activeTab, setActiveTab] = useState("manage");
  const [editingClass, setEditingClass] = useState(null);
  const [isCreating, setIsCreating] = useState(false);

  // Mock data - HOD can see all classes
  const timetableData = [
    {
      id: 1,
      courseCode: "CSC401",
      courseName: "Machine Learning",
      lecturer: "Dr. Adebayo",
      type: "lecture",
      day: "Monday",
      time: "08:00 - 10:00",
      venue: "LT 4",
      students: 45,
      status: "scheduled"
    },
    {
      id: 2,
      courseCode: "MTH301", 
      courseName: "Advanced Calculus",
      lecturer: "Prof. Bello",
      type: "lecture",
      day: "Monday",
      time: "10:00 - 12:00", 
      venue: "LT 2",
      students: 52,
      status: "scheduled"
    }
  ];

  const lecturers = [
    { id: 1, name: "Dr. Adebayo", email: "adebayo@uni.edu.ng" },
    { id: 2, name: "Prof. Bello", email: "bello@uni.edu.ng" },
    { id: 3, name: "Dr. Chukwu", email: "chukwu@uni.edu.ng" }
  ];

  const venues = ["LT 1", "LT 2", "LT 3", "LT 4", "LT 5", "Lab A", "Lab B", "Lab C"];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                <Calendar className="text-purple-600" size={28} />
                Timetable Management
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Computer Science Department • Manage Academic Schedule
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center gap-2">
                <Download size={18} />
                Export
              </button>
              <button className="bg-purple-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-purple-700 transition-colors flex items-center gap-2">
                <Plus size={18} />
                New Class
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
          <div className="flex space-x-1 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg w-fit">
            {["manage", "analytics", "settings"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 rounded-md font-semibold transition-colors capitalize ${
                  activeTab === tab
                    ? "bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                {tab === "manage" ? "Manage Timetable" : tab}
              </button>
            ))}
          </div>
        </div>

        {activeTab === "manage" && (
          <div className="space-y-6">
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Classes</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">24</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                    <BookOpen className="text-blue-600 dark:text-blue-400" size={24} />
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Active Lecturers</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">8</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                    <Users className="text-green-600 dark:text-green-400" size={24} />
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Venues Used</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">6</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                    <MapPin className="text-purple-600 dark:text-purple-400" size={24} />
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">This Week</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">18</p>
                  </div>
                  <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
                    <Clock className="text-orange-600 dark:text-orange-400" size={24} />
                  </div>
                </div>
              </div>
            </div>

            {/* Timetable Management Table */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <h3 className="font-semibold text-gray-900 dark:text-white">Class Schedule</h3>
                <div className="flex gap-2">
                  <button className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-2 rounded-lg text-sm font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center gap-2">
                    <Upload size={16} />
                    Import
                  </button>
                  <button className="bg-green-600 text-white px-3 py-2 rounded-lg text-sm font-semibold hover:bg-green-700 transition-colors flex items-center gap-2">
                    <Plus size={16} />
                    Add Class
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Course
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Lecturer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Schedule
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Venue
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Students
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {timetableData.map((classItem) => (
                      <tr key={classItem.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">
                              {classItem.courseCode}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {classItem.courseName}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 dark:text-white">{classItem.lecturer}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 dark:text-white">{classItem.day}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{classItem.time}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
                            {classItem.venue}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {classItem.students}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            classItem.status === 'scheduled' 
                              ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                              : 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
                          }`}>
                            {classItem.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex gap-2">
                            <button className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300">
                              <Edit3 size={16} />
                            </button>
                            <button className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300">
                              <Trash2 size={16} />
                            </button>
                            <button className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300">
                              <Eye size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === "analytics" && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Timetable Analytics</h3>
            {/* Analytics content would go here */}
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              Analytics dashboard coming soon...
            </div>
          </div>
        )}

        {activeTab === "settings" && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Timetable Settings</h3>
            {/* Settings content would go here */}
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              Settings panel coming soon...
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HODTimetablePage;