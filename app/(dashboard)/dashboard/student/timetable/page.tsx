"use client";

import { useState } from "react";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  BookOpen, 
  Filter,
  ChevronLeft,
  ChevronRight,
  Grid,
  List,
  Download,
  Bell
} from "lucide-react";

const TimetablePage = () => {
  const [activeView, setActiveView] = useState<"week" | "day">("week");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(new Date());
  const [filter, setFilter] = useState("all");

  // Mock timetable data
  const timetableData = {
    week: [
      {
        day: "Monday",
        date: "2024-03-18",
        courses: [
          { time: "08:00 - 10:00", code: "CSC401", name: "Machine Learning", venue: "LT 4", type: "lecture", lecturer: "Dr. Adebayo" },
          { time: "10:00 - 12:00", code: "MTH301", name: "Advanced Calculus", venue: "LT 2", type: "lecture", lecturer: "Prof. Bello" },
          { time: "14:00 - 16:00", code: "CSC401", name: "Machine Learning Lab", venue: "Lab A", type: "practical", lecturer: "Dr. Adebayo" }
        ]
      },
      {
        day: "Tuesday", 
        date: "2024-03-19",
        courses: [
          { time: "09:00 - 11:00", code: "EEE401", name: "Digital Signal Processing", venue: "LT 1", type: "lecture", lecturer: "Dr. Chukwu" },
          { time: "11:00 - 13:00", code: "GNS301", name: "Entrepreneurship", venue: "LT 3", type: "lecture", lecturer: "Dr. Okafor" }
        ]
      },
      {
        day: "Wednesday",
        date: "2024-03-20", 
        courses: [
          { time: "08:00 - 10:00", code: "CSC402", name: "Software Engineering", venue: "LT 4", type: "lecture", lecturer: "Prof. Davies" },
          { time: "10:00 - 12:00", code: "MTH301", name: "Advanced Calculus", venue: "LT 2", type: "tutorial", lecturer: "Prof. Bello" },
          { time: "15:00 - 17:00", code: "EEE401", name: "DSP Lab", venue: "Lab B", type: "practical", lecturer: "Dr. Chukwu" }
        ]
      },
      {
        day: "Thursday",
        date: "2024-03-21",
        courses: [
          { time: "10:00 - 12:00", code: "CSC403", name: "Computer Networks", venue: "LT 5", type: "lecture", lecturer: "Dr. Eze" },
          { time: "14:00 - 16:00", code: "CSC402", name: "Software Engineering", venue: "Lab A", type: "practical", lecturer: "Prof. Davies" }
        ]
      },
      {
        day: "Friday", 
        date: "2024-03-22",
        courses: [
          { time: "09:00 - 11:00", code: "GNS301", name: "Entrepreneurship", venue: "LT 3", type: "lecture", lecturer: "Dr. Okafor" },
          { time: "11:00 - 13:00", code: "CSC403", name: "Computer Networks", venue: "Lab B", type: "practical", lecturer: "Dr. Eze" }
        ]
      }
    ]
  };

  const timeSlots = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"];

  const getCourseTypeColor = (type: string) => {
    switch (type) {
      case "lecture": return "bg-blue-500";
      case "practical": return "bg-green-500"; 
      case "tutorial": return "bg-purple-500";
      default: return "bg-gray-500";
    }
  };

  const getCourseTypeText = (type: string) => {
    switch (type) {
      case "lecture": return "Lecture";
      case "practical": return "Practical";
      case "tutorial": return "Tutorial";
      default: return type;
    }
  };

  const navigateWeek = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + (direction === "next" ? 7 : -7));
    setCurrentDate(newDate);
  };

  const navigateDay = (direction: "prev" | "next") => {
    const newDate = new Date(selectedDay);
    newDate.setDate(selectedDay.getDate() + (direction === "next" ? 1 : -1));
    setSelectedDay(newDate);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-NG', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getWeekRange = (date: Date) => {
    const start = new Date(date);
    start.setDate(date.getDate() - date.getDay() + 1); // Start from Monday
    
    const end = new Date(start);
    end.setDate(start.getDate() + 4); // End on Friday (academic week)
    
    return {
      start: start.toLocaleDateString('en-NG', { day: 'numeric', month: 'short' }),
      end: end.toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })
    };
  };

  const weekRange = getWeekRange(currentDate);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className=" sticky top-0 ">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                <Calendar className="text-blue-600" size={28} />
                Academic Timetable
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                First Semester 2024/2025 • Computer Science
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <Bell size={20} className="text-gray-600 dark:text-gray-400" />
              </button>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2">
                <Download size={18} />
                Export
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Controls */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* View Toggle */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveView("week")}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2 ${
                  activeView === "week" 
                    ? "bg-blue-600 text-white" 
                    : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
              >
                <Grid size={18} />
                Week View
              </button>
              <button
                onClick={() => setActiveView("day")}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2 ${
                  activeView === "day" 
                    ? "bg-blue-600 text-white" 
                    : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
              >
                <List size={18} />
                Day View
              </button>
            </div>

            {/* Date Navigation */}
            <div className="flex items-center gap-4">
              <button 
                onClick={() => activeView === "week" ? navigateWeek("prev") : navigateDay("prev")}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
              
              <div className="text-center">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {activeView === "week" 
                    ? `Week of ${weekRange.start} - ${weekRange.end}`
                    : formatDate(selectedDay)
                  }
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {activeView === "week" ? "Academic Week" : selectedDay.toLocaleDateString('en-NG', { weekday: 'long' })}
                </p>
              </div>

              <button 
                onClick={() => activeView === "week" ? navigateWeek("next") : navigateDay("next")}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <ChevronRight size={20} />
              </button>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-2">
              <Filter size={18} className="text-gray-500" />
              <select 
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="bg-gray-100 dark:bg-gray-700 border-0 rounded-lg px-3 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Classes</option>
                <option value="lecture">Lectures Only</option>
                <option value="practical">Practicals Only</option>
                <option value="tutorial">Tutorials Only</option>
              </select>
            </div>
          </div>
        </div>

        {/* Timetable Content */}
        {activeView === "week" ? (
          /* Week View */
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            {/* Time Header */}
            <div className="grid grid-cols-6 border-b border-gray-200 dark:border-gray-700">
              <div className="p-4 border-r border-gray-200 dark:border-gray-700">
                <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">Time</span>
              </div>
              {timetableData.week.map((day) => (
                <div 
                  key={day.day}
                  className="p-4 border-r border-gray-200 dark:border-gray-700 last:border-r-0 text-center"
                >
                  <div className="font-semibold text-gray-900 dark:text-white">{day.day}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {new Date(day.date).getDate()} {new Date(day.date).toLocaleDateString('en-NG', { month: 'short' })}
                  </div>
                </div>
              ))}
            </div>

            {/* Time Slots */}
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {timeSlots.map((time) => (
                <div key={time} className="grid grid-cols-6">
                  {/* Time Label */}
                  <div className="p-4 border-r border-gray-200 dark:border-gray-700 flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{time}</span>
                  </div>
                  
                  {/* Day Columns */}
                  {timetableData.week.map((day) => {
                    const course = day.courses.find(c => {
                      const [start] = c.time.split(' - ');
                      return start === time;
                    });

                    return (
                      <div 
                        key={`${day.day}-${time}`}
                        className="p-2 border-r border-gray-200 dark:border-gray-700 last:border-r-0 min-h-20"
                      >
                        {course && (
                          <div 
                            className={`p-3 rounded-lg border-l-4 ${getCourseTypeColor(course.type)} border-l-current h-full text-white`}
                          >
                            <div className="flex items-start justify-between mb-2">
                              <span className="font-bold text-sm">{course.code}</span>
                              <span className="text-xs bg-white/20 px-2 py-1 rounded">
                                {getCourseTypeText(course.type)}
                              </span>
                            </div>
                            <h4 className="font-semibold text-sm mb-1">{course.name}</h4>
                            <div className="space-y-1 text-xs opacity-90">
                              <div className="flex items-center gap-1">
                                <MapPin size={12} />
                                {course.venue}
                              </div>
                              <div className="flex items-center gap-1">
                                <Users size={12} />
                                {course.lecturer}
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock size={12} />
                                {course.time}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Day View */
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Day Schedule */}
            <div className="lg:col-span-3">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    {formatDate(selectedDay)}
                  </h2>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <BookOpen size={16} />
                    <span>{timetableData.week.find(d => d.day === selectedDay.toLocaleDateString('en-NG', { weekday: 'long' }))?.courses.length || 0} classes today</span>
                  </div>
                </div>

                <div className="space-y-4">
                  {timetableData.week
                    .find(d => d.day === selectedDay.toLocaleDateString('en-NG', { weekday: 'long' }))
                    ?.courses.map((course, index) => (
                      <div 
                        key={index}
                        className="p-4 rounded-xl border-l-4 bg-gradient-to-r from-gray-50 to-white dark:from-gray-700 dark:to-gray-800 border-l-blue-500 hover:shadow-md transition-all duration-200"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getCourseTypeColor(course.type)} text-white`}>
                                {getCourseTypeText(course.type)}
                              </span>
                              <span className="font-mono text-sm text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                                {course.code}
                              </span>
                              <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                <Clock size={14} />
                                {course.time}
                              </span>
                            </div>
                            
                            <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-2">
                              {course.name}
                            </h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                <MapPin size={16} className="text-blue-500" />
                                <span>{course.venue}</span>
                              </div>
                              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                <Users size={16} className="text-green-500" />
                                <span>{course.lecturer}</span>
                              </div>
                              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                <BookOpen size={16} className="text-purple-500" />
                                <span>{course.type.charAt(0).toUpperCase() + course.type.slice(1)}</span>
                              </div>
                            </div>
                          </div>
                          
                          <button className="ml-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                            <Bell size={18} className="text-gray-500" />
                          </button>
                        </div>
                      </div>
                    ))}
                </div>

                {!timetableData.week.find(d => d.day === selectedDay.toLocaleDateString('en-NG', { weekday: 'long' }))?.courses.length && (
                  <div className="text-center py-12">
                    <Calendar size={48} className="text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-500 dark:text-gray-400 mb-2">No classes scheduled</h3>
                    <p className="text-gray-400 dark:text-gray-500">Enjoy your free day!</p>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Stats Sidebar */}
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Week Summary</h3>
                <div className="space-y-4">
                  {timetableData.week.map((day) => (
                    <div 
                      key={day.day}
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        selectedDay.toLocaleDateString('en-NG', { weekday: 'long' }) === day.day
                          ? "bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800"
                          : "bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600"
                      }`}
                      onClick={() => setSelectedDay(new Date(day.date))}
                    >
                      <div className="flex justify-between items-center">
                        <span className={`font-medium ${
                          selectedDay.toLocaleDateString('en-NG', { weekday: 'long' }) === day.day
                            ? "text-blue-700 dark:text-blue-300"
                            : "text-gray-700 dark:text-gray-300"
                        }`}>
                          {day.day}
                        </span>
                        <span className={`text-sm px-2 py-1 rounded-full ${
                          selectedDay.toLocaleDateString('en-NG', { weekday: 'long' }) === day.day
                            ? "bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-300"
                            : "bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-400"
                        }`}>
                          {day.courses.length} classes
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {new Date(day.date).toLocaleDateString('en-NG', { day: 'numeric', month: 'short' })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-200 dark:border-blue-800 p-6">
                <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Up Next</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-blue-700 dark:text-blue-300">Today's Classes</span>
                    <span className="font-semibold text-blue-900 dark:text-blue-100">
                      {timetableData.week.find(d => d.day === selectedDay.toLocaleDateString('en-NG', { weekday: 'long' }))?.courses.length || 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-blue-700 dark:text-blue-300">This Week</span>
                    <span className="font-semibold text-blue-900 dark:text-blue-100">
                      {timetableData.week.reduce((total, day) => total + day.courses.length, 0)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TimetablePage;