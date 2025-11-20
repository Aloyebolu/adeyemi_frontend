"use client";

import { useState } from "react";
import { 
  Calendar, 
  Play, 
  Pause, 
  Edit3, 
  Clock, 
  MapPin, 
  Users,
  BookOpen,
  AlertTriangle,
  CheckCircle,
  X,
  Send
} from "lucide-react";

const LecturerTimetablePage = () => {
  const [activeClasses, setActiveClasses] = useState({});
  const [rescheduleRequest, setRescheduleRequest] = useState(null);
  const [cancellationRequest, setCancellationRequest] = useState(null);

  // Mock data - Lecturer only sees their classes
  const myTimetable = [
    {
      id: 1,
      courseCode: "CSC401",
      courseName: "Machine Learning",
      type: "lecture",
      day: "Monday",
      date: "2024-03-18",
      time: "08:00 - 10:00",
      venue: "LT 4",
      students: 45,
      status: "scheduled",
      attendance: 42
    },
    {
      id: 2,
      courseCode: "CSC401",
      courseName: "Machine Learning Lab",
      type: "practical",
      day: "Monday", 
      date: "2024-03-18",
      time: "14:00 - 16:00",
      venue: "Lab A",
      students: 45,
      status: "scheduled",
      attendance: 38
    },
    {
      id: 3,
      courseCode: "CSC402",
      courseName: "Software Engineering",
      type: "lecture",
      day: "Wednesday",
      date: "2024-03-20",
      time: "08:00 - 10:00",
      venue: "LT 4",
      students: 52,
      status: "scheduled", 
      attendance: 48
    }
  ];

  const startClass = (classId) => {
    setActiveClasses(prev => ({
      ...prev,
      [classId]: {
        startTime: new Date(),
        studentsPresent: 0,
        isActive: true
      }
    }));
  };

  const endClass = (classId) => {
    setActiveClasses(prev => ({
      ...prev,
      [classId]: {
        ...prev[classId],
        isActive: false,
        endTime: new Date()
      }
    }));
  };

  const requestReschedule = (classItem) => {
    setRescheduleRequest({
      ...classItem,
      newDate: classItem.date,
      newTime: classItem.time,
      reason: ""
    });
  };

  const requestCancellation = (classItem) => {
    setCancellationRequest({
      ...classItem,
      reason: ""
    });
  };

  const submitRescheduleRequest = () => {
    // API call to submit reschedule request to HOD
    console.log("Reschedule request:", rescheduleRequest);
    setRescheduleRequest(null);
    // Show success message
  };

  const submitCancellationRequest = () => {
    // API call to submit cancellation request to HOD
    console.log("Cancellation request:", cancellationRequest);
    setCancellationRequest(null);
    // Show success message
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                <Calendar className="text-green-600" size={28} />
                My Teaching Schedule
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Dr. Adebayo • Computer Science Department
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <span className="font-semibold text-green-600">3 classes</span> this week
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">This Week</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">3</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                <BookOpen className="text-blue-600 dark:text-blue-400" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Avg. Attendance</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">89%</p>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                <Users className="text-green-600 dark:text-green-400" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Active Now</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {Object.values(activeClasses).filter(cls => cls.isActive).length}
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
                <Play className="text-orange-600 dark:text-orange-400" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Requests</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">2</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                <AlertTriangle className="text-purple-600 dark:text-purple-400" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Classes List */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 dark:text-white">My Classes</h3>
          </div>

          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {myTimetable.map((classItem) => {
              const isActive = activeClasses[classItem.id]?.isActive;
              
              return (
                <div key={classItem.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          classItem.type === 'lecture' 
                            ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                            : 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                        }`}>
                          {classItem.type.toUpperCase()}
                        </span>
                        <span className="font-mono text-sm text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                          {classItem.courseCode}
                        </span>
                        {isActive && (
                          <span className="px-2 py-1 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 text-xs rounded-full animate-pulse">
                            LIVE
                          </span>
                        )}
                      </div>

                      <h4 className="font-bold text-gray-900 dark:text-white text-lg mb-2">
                        {classItem.courseName}
                      </h4>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center gap-2">
                          <Clock size={16} />
                          <span>{classItem.day}, {classItem.time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin size={16} />
                          <span>{classItem.venue}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users size={16} />
                          <span>{classItem.attendance}/{classItem.students} students</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar size={16} />
                          <span>{new Date(classItem.date).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 ml-4">
                      {!isActive ? (
                        <button
                          onClick={() => startClass(classItem.id)}
                          className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center gap-2"
                        >
                          <Play size={16} />
                          Start Class
                        </button>
                      ) : (
                        <button
                          onClick={() => endClass(classItem.id)}
                          className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors flex items-center gap-2"
                        >
                          <Pause size={16} />
                          End Class
                        </button>
                      )}
                      
                      <button
                        onClick={() => requestReschedule(classItem)}
                        className="bg-yellow-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-yellow-700 transition-colors flex items-center gap-2"
                      >
                        <Edit3 size={16} />
                        Reschedule
                      </button>

                      <button
                        onClick={() => requestCancellation(classItem)}
                        className="bg-gray-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-700 transition-colors flex items-center gap-2"
                      >
                        <X size={16} />
                        Cancel
                      </button>
                    </div>
                  </div>

                  {/* Active Class Session */}
                  {isActive && (
                    <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <Play size={16} className="text-green-600" />
                            <span className="font-semibold text-green-700 dark:text-green-300">Class in session</span>
                          </div>
                          <div className="text-sm text-green-600 dark:text-green-400">
                            Started: {activeClasses[classItem.id].startTime.toLocaleTimeString()}
                          </div>
                        </div>
                        <div className="text-sm text-green-700 dark:text-green-300 font-semibold">
                          {activeClasses[classItem.id].studentsPresent} students present
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Reschedule Request Modal */}
      {rescheduleRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Request Reschedule
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  New Date
                </label>
                <input
                  type="date"
                  value={rescheduleRequest.newDate}
                  onChange={(e) => setRescheduleRequest(prev => ({ ...prev, newDate: e.target.value }))}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  New Time
                </label>
                <input
                  type="time"
                  value={rescheduleRequest.newTime.split(' - ')[0]}
                  onChange={(e) => setRescheduleRequest(prev => ({ 
                    ...prev, 
                    newTime: `${e.target.value} - ${prev.newTime.split(' - ')[1]}` 
                  }))}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Reason
                </label>
                <textarea
                  value={rescheduleRequest.reason}
                  onChange={(e) => setRescheduleRequest(prev => ({ ...prev, reason: e.target.value }))}
                  rows={3}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Please provide a reason for rescheduling..."
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setRescheduleRequest(null)}
                className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-2 rounded-lg font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={submitRescheduleRequest}
                className="flex-1 bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
              >
                <Send size={16} />
                Submit Request
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancellation Request Modal */}
      {cancellationRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Request Cancellation
            </h3>
            
            <div className="space-y-4">
              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <div className="flex items-center gap-2 text-yellow-800 dark:text-yellow-300">
                  <AlertTriangle size={16} />
                  <span className="font-semibold">Warning</span>
                </div>
                <p className="text-yellow-700 dark:text-yellow-400 text-sm mt-1">
                  Cancelling this class will notify all enrolled students and require HOD approval.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Reason for Cancellation
                </label>
                <textarea
                  value={cancellationRequest.reason}
                  onChange={(e) => setCancellationRequest(prev => ({ ...prev, reason: e.target.value }))}
                  rows={4}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Please provide a detailed reason for cancellation..."
                  required
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setCancellationRequest(null)}
                className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-2 rounded-lg font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={submitCancellationRequest}
                disabled={!cancellationRequest.reason.trim()}
                className="flex-1 bg-red-600 text-white py-2 rounded-lg font-semibold hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                <Send size={16} />
                Submit Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LecturerTimetablePage;