"use client";

import { useSticky } from "@/hooks/students/useSticky";
import { useStudentDashboard } from "@/hooks/students/useStudentDashboard";
import { useState } from "react";
import StudentDashboardHeader from "./StudentDashboardHeader";
import StudentProfileCard from "./StudentProfileCard";
import StudentSchoolFeesCard from "./StudentSchoolFeesCard";
import StudentQuickActions from "./StudentQuickActions";
import StudentRecentActivity from "./StudentRecentActivity";
import StudentAnnouncements from "./StudentAnnouncements";
import StudentUpcomingDeadlines from "./StudentUpcomingDeadlines";
import { usePage } from "@/hooks/usePage";
import { Search } from "lucide-react";

const StudentMain = () => {
  const { 
    student, 
    activities, 
    announcements, 
    quickStats, 
    schoolFees, 
    loading,
    // onSearchChange
  } = useStudentDashboard();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [stickyRef] = useSticky();
    const {setPage, setComponent} = usePage()

  // setComponent(      <div className="flex items-center gap-3 w-full sm:w-auto">
  //       <div className="relative flex-1 sm:flex-initial">
  //         <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
  //         <input
  //           type="text"
  //           placeholder="Search announcements..."
  //           className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
  //           value={searchQuery}
  //           // onChange={(e) => onSearchChange(e.target.value)}
  //         />
  //       </div>
  //     </div>)

  if (loading || !student || !schoolFees) {
    return (
      <div className="flex-1 p-6 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-500 dark:text-gray-400">Loading student dashboard...</p>
        </div>
      </div>
    );
  }

  const filteredAnnouncements = announcements.filter(announcement => 
    activeCategory === "all" || announcement.category === activeCategory
  );

  return (
    <main className="flex-1 p-6 space-y-6 max-w-7xl mx-auto">
      <StudentDashboardHeader
        student={student}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          <StudentProfileCard student={student} quickStats={quickStats} />
          <StudentSchoolFeesCard schoolFees={schoolFees} />
          <StudentQuickActions />
          <StudentRecentActivity activities={activities} />
        </div>

        {/* Right Column - Sticky */}
        <div className="space-y-6">
          <div ref={stickyRef} className="sticky top-6 space-y-6 transition-all duration-200">
            <StudentAnnouncements 
              announcements={filteredAnnouncements}
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
            />
            <StudentUpcomingDeadlines schoolFees={schoolFees} />
          </div>
        </div>
      </div>
    </main>
  );
};

export default StudentMain;