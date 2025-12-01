"use client";

import React, { useState } from "react";
import CourseDashboard from "../../admin/courses/page";

export default function AssignCoursesPage() {
  const [assignedCourses, setAssignedCourses] = useState<string[]>([]);

  const handleAssign = async (courseId: string) => {
    try {
      // 🧠 Simulate mock API call
      await new Promise((res) => setTimeout(res, 800));

      // ✅ Update the UI
      setAssignedCourses((prev) => [...prev, courseId]);
      console.log(`Course ${courseId} assigned successfully!`);
    } catch (err) {
      console.error("Failed to assign course", err);
    }
  };

  return (
    <div className="p-4">
      {/* 🎓 Course Dashboard from Admin reused */}
      <CourseDashboard
        // onAssign={handleAssign}
        // assignedCourses={assignedCourses}
        role="hod"
      />
    </div>
  );
}
