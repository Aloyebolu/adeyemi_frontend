"use client";

import { useEffect, useState, useCallback } from "react";
import { usePage } from "@/hooks/usePage";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useNotifications } from "@/hooks/useNotification";
import { Badge } from "@/components/ui/Badge";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ClipboardList,
  Loader2,
  Shield,
  Info,
  Filter,
  Search,
  Trash2,
  Plus,
  Clock,
  AlertCircle,
  Archive,
  RefreshCw,
  Bookmark
} from "lucide-react";

interface Course {
  id: string;
  _id?: string;
  course_code: string;
  course_title: string;
  credit_unit: number;
  unit?: number;
  semester: string;
  level: number;
  department: string;
  status: "Core" | "Elective";
  type?: "core" | "elective";
  prerequisites?: string[];
  capacity?: number;
  enrolled?: number;
  carryover?: boolean;
  is_carryover?: boolean;
  conflict_with?: string[];
  is_current_semester?: boolean;
  previous_attempts?: number;
  grade?: string;
  reason?: string; // Reason for being in buffer (carryover, prerequisite, etc.)
}

interface RegistrationRules {
  minUnits: number;
  maxUnits: number;
  minCourses: number;
  maxCourses: number;
  minCoreCourses?: number;
  maxElectives?: number;
  registrationDeadline: Date;
}

interface StudentInfo {
  id: string;
  level: number;
  department: string;
}

interface BufferCourse extends Course {
  category: "carryover" | "prerequisite" | "failed" | "incomplete" | "other";
  required: boolean;
  notes?: string;
}

export default function CourseRegistrationPage() {
  const { setPage } = usePage();
  const [availableCourses, setAvailableCourses] = useState<Course[]>([]);
  const [registeredCourses, setRegisteredCourses] = useState<Course[]>([]);
  const [bufferCourses, setBufferCourses] = useState<BufferCourse[]>([]);
  const [totalUnits, setTotalUnits] = useState<number>(0);
  const [finalized, setFinalized] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<"All" | "Core" | "Elective">("All");
  const [bufferExpanded, setBufferExpanded] = useState<boolean>(true);
  const { addNotification } = useNotifications();

  const studentInfo: StudentInfo = {
    id: "student123",
    level: 200,
    department: "Computer Science",
    semseter: "First"
  };

  const registrationRules: RegistrationRules = {
    minUnits: 15,
    maxUnits: 24,
    minCourses: 4,
    maxCourses: 8,
    minCoreCourses: 4,
    maxElectives: 3,
    registrationDeadline: new Date('2025-12-31')
  };

  const validateRegistration = useCallback((course: Course, currentRegistered: Course[]): string[] => {
    const errors: string[] = [];

    if (currentRegistered.find(c => c.course_code === course.course_code)) {
      errors.push("Course already registered");
    }

    const currentUnits = currentRegistered.reduce((acc, c) => acc + (c.unit || c.credit_unit), 0);
    const courseUnits = course.unit || course.credit_unit;
    if (currentUnits + courseUnits > registrationRules.maxUnits) {
      errors.push(`Maximum ${registrationRules.maxUnits} units exceeded`);
    }

    if (currentRegistered.length >= registrationRules.maxCourses) {
      errors.push(`Maximum ${registrationRules.maxCourses} courses exceeded`);
    }

    if (course.prerequisites && course.prerequisites.length > 0) {
      const missingPrereqs = course.prerequisites.filter(prereq => 
        !currentRegistered.some(c => c.course_code === prereq)
      );
      if (missingPrereqs.length > 0) {
        errors.push(`Missing prerequisites: ${missingPrereqs.join(', ')}`);
      }
    }

    if (course.capacity && course.enrolled && course.enrolled >= course.capacity) {
      errors.push("Course is full");
    }

    if (course.conflict_with) {
      const conflicts = course.conflict_with.filter(conflict =>
        currentRegistered.some(c => c.course_code === conflict)
      );
      if (conflicts.length > 0) {
        errors.push(`Time conflict with: ${conflicts.join(', ')}`);
      }
    }

    if (course.semester !== studentInfo.semseter) {
      errors.push(`${course.semester} Semester courses course cant't be taking during the ${studentInfo.semseter} semester`);

    }

    return errors;
  }, [registrationRules.maxUnits, registrationRules.maxCourses, studentInfo.level]);

  const canRegisterCourse = useCallback((course: Course): { canRegister: boolean; errors: string[] } => {
    if (finalized) return { canRegister: false, errors: ["Registration is finalized"] };
    
    const errors = validateRegistration(course, registeredCourses);
    return { canRegister: errors.length === 0, errors };
  }, [finalized, registeredCourses, validateRegistration]);

  useEffect(() => {
    setPage("Course Registration");
    loadCourses();
    checkExistingRegistration();
  }, [setPage]);

  const checkExistingRegistration = async () => {
    try {
      const response = await fetch('/api/courses/check-registration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ student: studentInfo.id })
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.registered) {
          setFinalized(true);
          setRegisteredCourses(data.courses || []);
        }
      }
    } catch (error) {
      console.error('Error checking registration:', error);
    }
  };

  const loadCourses = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/courses/available', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          level: studentInfo.level, 
          department: studentInfo.department 
        })
      });

      if (response.ok) {
        const data = await response.json();
        setAvailableCourses(data.currentCourses || []);
        setBufferCourses(data.bufferCourses || []);
      } else {
        throw new Error('Failed to load courses');
      }
    } catch (error) {
      console.error('Error loading courses:', error);
      addNotification({
        variant: "error",
        message: "Failed to load courses",
      });
      
      // Fallback to mock data
              // Enhanced mock data with more diverse courses
const mockCurrentCourses: Course[] = [
  // 200 Level Computer Science - Core Courses
  {
    id: "1",
    course_code: "CSC201",
    course_title: "Data Structures and Algorithms",
    credit_unit: 3,
    unit: 3,
    semester: "First",
    level: 200,
    department: "Computer Science",
    status: "Core",
    type: "core",
    prerequisites: ["CSC101", "CSC102"],
    capacity: 60,
    enrolled: 52,
    is_current_semester: true
  },
  {
    id: "2",
    course_code: "CSC202",
    course_title: "Object-Oriented Programming",
    credit_unit: 3,
    unit: 3,
    semester: "First",
    level: 200,
    department: "Computer Science",
    status: "Core",
    type: "core",
    prerequisites: ["CSC101"],
    capacity: 55,
    enrolled: 48,
    is_current_semester: true
  },
  {
    id: "3",
    course_code: "CSC203",
    course_title: "Computer Architecture",
    credit_unit: 2,
    unit: 2,
    semester: "First",
    level: 200,
    department: "Computer Science",
    status: "Core",
    type: "core",
    prerequisites: ["CSC103"],
    capacity: 50,
    enrolled: 45,
    is_current_semester: true
  },
  {
    id: "4",
    course_code: "CSC204",
    course_title: "Database Management Systems",
    credit_unit: 3,
    unit: 3,
    semester: "First",
    level: 200,
    department: "Computer Science",
    status: "Core",
    type: "core",
    prerequisites: ["CSC102"],
    capacity: 50,
    enrolled: 42,
    is_current_semester: true
  },
  {
    id: "5",
    course_code: "CSC205",
    course_title: "Discrete Mathematics",
    credit_unit: 2,
    unit: 2,
    semester: "First",
    level: 200,
    department: "Computer Science",
    status: "Core",
    type: "core",
    prerequisites: ["MAT101"],
    capacity: 70,
    enrolled: 65,
    is_current_semester: true
  },

  // 200 Level Mathematics - Core Courses
  {
    id: "6",
    course_code: "MAT201",
    course_title: "Calculus III",
    credit_unit: 3,
    unit: 3,
    semester: "First",
    level: 200,
    department: "Mathematics",
    status: "Core",
    type: "core",
    prerequisites: ["MAT102"],
    capacity: 40,
    enrolled: 35,
    is_current_semester: true
  },
  {
    id: "7",
    course_code: "MAT202",
    course_title: "Linear Algebra",
    credit_unit: 3,
    unit: 3,
    semester: "First",
    level: 200,
    department: "Mathematics",
    status: "Core",
    type: "core",
    prerequisites: ["MAT101"],
    capacity: 45,
    enrolled: 38,
    is_current_semester: true
  },

  // 200 Level Elective Courses
  {
    id: "8",
    course_code: "CSC211",
    course_title: "Web Technologies",
    credit_unit: 2,
    unit: 2,
    semester: "First",
    level: 200,
    department: "Computer Science",
    status: "Elective",
    type: "elective",
    prerequisites: ["CSC102"],
    capacity: 35,
    enrolled: 28,
    is_current_semester: true
  },
  {
    id: "9",
    course_code: "CSC212",
    course_title: "Introduction to Artificial Intelligence",
    credit_unit: 2,
    unit: 2,
    semester: "First",
    level: 200,
    department: "Computer Science",
    status: "Elective",
    type: "elective",
    prerequisites: ["CSC201"],
    capacity: 30,
    enrolled: 25,
    is_current_semester: true
  },
  {
    id: "10",
    course_code: "CSC213",
    course_title: "Mobile Application Development",
    credit_unit: 3,
    unit: 3,
    semester: "First",
    level: 200,
    department: "Computer Science",
    status: "Elective",
    type: "elective",
    prerequisites: ["CSC202"],
    capacity: 25,
    enrolled: 22,
    is_current_semester: true
  },
  {
    id: "11",
    course_code: "STA201",
    course_title: "Probability and Statistics",
    credit_unit: 2,
    unit: 2,
    semester: "First",
    level: 200,
    department: "Statistics",
    status: "Elective",
    type: "elective",
    prerequisites: ["MAT101"],
    capacity: 40,
    enrolled: 32,
    is_current_semester: true
  },
  {
    id: "12",
    course_code: "PHY201",
    course_title: "Modern Physics",
    credit_unit: 2,
    unit: 2,
    semester: "First",
    level: 200,
    department: "Physics",
    status: "Elective",
    type: "elective",
    prerequisites: ["PHY102"],
    capacity: 35,
    enrolled: 30,
    is_current_semester: true
  },

  // General Studies
  {
    id: "13",
    course_code: "GST201",
    course_title: "Entrepreneurship Studies",
    credit_unit: 2,
    unit: 2,
    semester: "First",
    level: 200,
    department: "General Studies",
    status: "Core",
    type: "core",
    capacity: 100,
    enrolled: 85,
    is_current_semester: true
  },
  {
    id: "14",
    course_code: "GST202",
    course_title: "Nigerian People and Culture",
    credit_unit: 1,
    unit: 1,
    semester: "First",
    level: 200,
    department: "General Studies",
    status: "Core",
    type: "core",
    capacity: 120,
    enrolled: 110,
    is_current_semester: true
  }
];

const mockBufferCourses: BufferCourse[] = [
  // Carryover Courses (Failed from previous semesters)
  {
    id: "15",
    course_code: "CSC101",
    course_title: "Introduction to Computer Science",
    credit_unit: 3,
    unit: 3,
    semester: "First",
    level: 100,
    department: "Computer Science",
    status: "Core",
    type: "core",
    carryover: true,
    is_carryover: true,
    conflict_with: ["CSC201"],
    category: "carryover",
    required: true,
    previous_attempts: 1,
    grade: "F",
    notes: "Failed in 100 Level - Must be retaken this semester"
  },
  {
    id: "16",
    course_code: "MAT102",
    course_title: "Calculus II",
    credit_unit: 3,
    unit: 3,
    semester: "Second",
    level: 100,
    department: "Mathematics",
    status: "Core",
    type: "core",
    carryover: true,
    is_carryover: true,
    category: "carryover",
    required: true,
    previous_attempts: 1,
    grade: "D",
    notes: "Poor grade - Required for MAT201"
  },
  {
    id: "17",
    course_code: "PHY102",
    course_title: "Electricity and Magnetism",
    credit_unit: 2,
    unit: 2,
    semester: "Second",
    level: 100,
    department: "Physics",
    status: "Core",
    type: "core",
    carryover: true,
    is_carryover: true,
    category: "carryover",
    required: false,
    previous_attempts: 1,
    grade: "E",
    notes: "Can retake to improve GPA"
  },

  // Prerequisite Courses (Required for current courses)
  {
    id: "18",
    course_code: "CSC102",
    course_title: "Programming Fundamentals",
    credit_unit: 3,
    unit: 3,
    semester: "Second",
    level: 100,
    department: "Computer Science",
    status: "Core",
    type: "core",
    category: "prerequisite",
    required: true,
    notes: "Prerequisite for CSC201, CSC204, CSC211"
  },
  {
    id: "19",
    course_code: "CSC103",
    course_title: "Digital Logic Design",
    credit_unit: 2,
    unit: 2,
    semester: "First",
    level: 100,
    department: "Computer Science",
    status: "Core",
    type: "core",
    category: "prerequisite",
    required: true,
    notes: "Required for CSC203 - Computer Architecture"
  },
  {
    id: "20",
    course_code: "MAT101",
    course_title: "Calculus I",
    credit_unit: 3,
    unit: 3,
    semester: "First",
    level: 100,
    department: "Mathematics",
    status: "Core",
    type: "core",
    category: "prerequisite",
    required: true,
    notes: "Prerequisite for MAT202, MAT201, STA201"
  },

  // Failed Courses (Can be retaken for grade improvement)
  {
    id: "21",
    course_code: "CHM101",
    course_title: "General Chemistry I",
    credit_unit: 2,
    unit: 2,
    semester: "First",
    level: 100,
    department: "Chemistry",
    status: "Core",
    type: "core",
    category: "failed",
    required: false,
    previous_attempts: 1,
    grade: "D",
    notes: "Consider retaking to improve cumulative GPA"
  },
  {
    id: "22",
    course_code: "BIO101",
    course_title: "General Biology I",
    credit_unit: 2,
    unit: 2,
    semester: "First",
    level: 100,
    department: "Biological Sciences",
    status: "Core",
    type: "core",
    category: "failed",
    required: false,
    previous_attempts: 1,
    grade: "E",
    notes: "Elective for science students - Can retake"
  },

  // Incomplete Courses
  {
    id: "23",
    course_code: "CSC104",
    course_title: "Computer Programming Practical",
    credit_unit: 1,
    unit: 1,
    semester: "Second",
    level: 100,
    department: "Computer Science",
    status: "Core",
    type: "core",
    category: "incomplete",
    required: true,
    notes: "Incomplete practical sessions from last semester"
  },
  {
    id: "24",
    course_code: "GST102",
    course_title: "Use of Library",
    credit_unit: 1,
    unit: 1,
    semester: "Second",
    level: 100,
    department: "General Studies",
    status: "Core",
    type: "core",
    category: "incomplete",
    required: true,
    notes: "Pending library clearance and certification"
  },

  // Other Non-Current Courses
  {
    id: "25",
    course_code: "FRE101",
    course_title: "Elementary French I",
    credit_unit: 2,
    unit: 2,
    semester: "First",
    level: 100,
    department: "French",
    status: "Elective",
    type: "elective",
    category: "other",
    required: false,
    notes: "Language elective - Can be taken for credit"
  },
  {
    id: "26",
    course_code: "MUS101",
    course_title: "Introduction to Music",
    credit_unit: 1,
    unit: 1,
    semester: "First",
    level: 100,
    department: "Music",
    status: "Elective",
    type: "elective",
    category: "other",
    required: false,
    notes: "Arts elective for balanced curriculum"
  },
  {
    id: "27",
    course_code: "PHY103",
    course_title: "Practical Physics I",
    credit_unit: 1,
    unit: 1,
    semester: "First",
    level: 100,
    department: "Physics",
    status: "Core",
    type: "core",
    category: "other",
    required: false,
    notes: "Laboratory course from previous session"
  },
  {
    id: "28",
    course_code: "STA101",
    course_title: "Introduction to Statistics",
    credit_unit: 2,
    unit: 2,
    semester: "First",
    level: 100,
    department: "Statistics",
    status: "Core",
    type: "core",
    category: "other",
    required: false,
    notes: "Basic statistics course for reference"
  }
];

// Additional specialized courses for different departments
const additionalSpecializedCourses: Course[] = [
  // 300 Level Preview Courses (for ambitious students)
  {
    id: "29",
    course_code: "CSC301",
    course_title: "Software Engineering",
    credit_unit: 3,
    unit: 3,
    semester: "First",
    level: 300,
    department: "Computer Science",
    status: "Core",
    type: "core",
    prerequisites: ["CSC201", "CSC202"],
    capacity: 40,
    enrolled: 15,
    is_current_semester: false,
    notes: "300 Level course - Requires special permission"
  },
  {
    id: "30",
    course_code: "CSC302",
    course_title: "Operating Systems",
    credit_unit: 3,
    unit: 3,
    semester: "First",
    level: 300,
    department: "Computer Science",
    status: "Core",
    type: "core",
    prerequisites: ["CSC203"],
    capacity: 35,
    enrolled: 12,
    is_current_semester: false,
    notes: "Advanced course - Consult academic advisor"
  },

  // Interdisciplinary Courses
  {
    id: "31",
    course_code: "CSC251",
    course_title: "Computational Biology",
    credit_unit: 2,
    unit: 2,
    semester: "First",
    level: 200,
    department: "Computer Science",
    status: "Elective",
    type: "elective",
    prerequisites: ["CSC102", "BIO101"],
    capacity: 25,
    enrolled: 18,
    is_current_semester: true
  },
  {
    id: "32",
    course_code: "MAT251",
    course_title: "Mathematical Physics",
    credit_unit: 2,
    unit: 2,
    semester: "First",
    level: 200,
    department: "Mathematics",
    status: "Elective",
    type: "elective",
    prerequisites: ["MAT201", "PHY102"],
    capacity: 30,
    enrolled: 22,
    is_current_semester: true
  },

  // Project-based Courses
  {
    id: "33",
    course_code: "CSC299",
    course_title: "Undergraduate Research Project",
    credit_unit: 3,
    unit: 3,
    semester: "First",
    level: 200,
    department: "Computer Science",
    status: "Elective",
    type: "elective",
    prerequisites: ["CSC201"],
    capacity: 15,
    enrolled: 8,
    is_current_semester: true,
    notes: "Research project - Requires faculty approval"
  }
];

// Combine all courses for comprehensive testing
const allMockCurrentCourses = [...mockCurrentCourses, ...additionalSpecializedCourses.filter(c => c.is_current_semester)];

// Enhanced buffer courses with more variety
const enhancedBufferCourses: BufferCourse[] = [
  ...mockBufferCourses,
  {
    id: "34",
    course_code: "ENG101",
    course_title: "Communication in English I",
    credit_unit: 2,
    unit: 2,
    semester: "First",
    level: 100,
    department: "English",
    status: "Core",
    type: "core",
    category: "carryover",
    required: true,
    previous_attempts: 2,
    grade: "F",
    notes: "Final attempt - Must pass this semester"
  },
  {
    id: "35",
    course_code: "ECN101",
    course_title: "Principles of Economics",
    credit_unit: 2,
    unit: 2,
    semester: "First",
    level: 100,
    department: "Economics",
    status: "Elective",
    type: "elective",
    category: "failed",
    required: false,
    previous_attempts: 1,
    grade: "D",
    notes: "Social science elective - Optional retake"
  },
  {
    id: "36",
    course_code: "PHL101",
    course_title: "Introduction to Philosophy",
    credit_unit: 2,
    unit: 2,
    semester: "First",
    level: 100,
    department: "Philosophy",
    status: "Elective",
    type: "elective",
    category: "incomplete",
    required: false,
    notes: "Pending essay submission"
  }
];

// Update the loadCourses function with the enhanced mock data
    
    // Use enhanced mock data
    setAvailableCourses(allMockCurrentCourses);
    setBufferCourses(enhancedBufferCourses);
  } finally {
    setLoading(false);
  }
};  
      setAvailableCourses(mockCurrentCourses);
      setBufferCourses(mockBufferCourses);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const total = registeredCourses.reduce((acc, c) => acc + (c.unit || c.credit_unit), 0);
    setTotalUnits(total);
  }, [registeredCourses]);

  const handleRegister = (course: Course) => {
    const { canRegister, errors } = canRegisterCourse(course);
    
    if (!canRegister) {
      addNotification({
        variant: "error",
        message: `Cannot register ${course.course_code}: ${errors[0]}`,
      });
      return;
    }

    setRegisteredCourses(prev => [...prev, course]);
    addNotification({
      variant: "success",
      message: `${course.course_code} - ${course.course_title} added successfully`,
    });
  };

  const handleDrop = (course: Course) => {
    if (finalized) {
      addNotification({
        variant: "error",
        message: "Cannot drop courses after finalization",
      });
      return;
    }

    const dependentCourses = registeredCourses.filter(regCourse => 
      regCourse.prerequisites?.includes(course.course_code)
    );

    if (dependentCourses.length > 0) {
      addNotification({
        variant: "warning",
        message: `Dropping ${course.course_code} will affect: ${dependentCourses.map(c => c.course_code).join(', ')}`,
      });
      return;
    }

    setRegisteredCourses(prev => prev.filter(c => c.course_code !== course.course_code));
    addNotification({
      variant: "info",
      message: `${course.course_code} dropped successfully`,
    });
  };

  const handleAddFromBuffer = (course: BufferCourse) => {
    const { canRegister, errors } = canRegisterCourse(course);
    
    if (!canRegister) {
      addNotification({
        variant: "error",
        message: `Cannot register ${course.course_code}: ${errors[0]}`,
      });
      return;
    }

    setRegisteredCourses(prev => [...prev, course]);
    addNotification({
      variant: "success",
      message: `${course.course_code} - ${course.course_title} added from buffer`,
    });
  };

  const handleSubmit = async () => {
    const coreCount = registeredCourses.filter(c => c.status === "Core" || c.type === "core").length;
    const electiveCount = registeredCourses.filter(c => c.status === "Elective" || c.type === "elective").length;
    const courseCount = registeredCourses.length;

    const errors = [];

    if (totalUnits < registrationRules.minUnits) {
      errors.push(`Minimum ${registrationRules.minUnits} units required`);
    }

    if (totalUnits > registrationRules.maxUnits) {
      errors.push(`Maximum ${registrationRules.maxUnits} units exceeded`);
    }

    if (courseCount < registrationRules.minCourses) {
      errors.push(`Minimum ${registrationRules.minCourses} courses required`);
    }

    if (courseCount > registrationRules.maxCourses) {
      errors.push(`Maximum ${registrationRules.maxCourses} courses allowed`);
    }

    if (registrationRules.minCoreCourses && coreCount < registrationRules.minCoreCourses) {
      errors.push(`Minimum ${registrationRules.minCoreCourses} core courses required`);
    }

    if (registrationRules.maxElectives && electiveCount > registrationRules.maxElectives) {
      errors.push(`Maximum ${registrationRules.maxElectives} electives allowed`);
    }

    if (new Date() > registrationRules.registrationDeadline) {
      errors.push("Registration deadline has passed");
    }

    // Check for required buffer courses (carryovers that must be registered)
    const requiredBufferCourses = bufferCourses.filter(course => 
      course.required && !registeredCourses.some(reg => reg.course_code === course.course_code)
    );

    if (requiredBufferCourses.length > 0) {
      errors.push(`Required courses not registered: ${requiredBufferCourses.map(c => c.course_code).join(', ')}`);
    }

    if (errors.length > 0) {
      errors.forEach(error => {
        addNotification({
          variant: "error",
          message: error,
        });
      });
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch('/api/courses/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student: studentInfo.id,
          courses: registeredCourses.map(c => c.id || c._id),
          level: studentInfo.level,
          department: studentInfo.department
        })
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setFinalized(true);
        addNotification({
          variant: "success",
          message: result.message || "Registration submitted successfully!",
        });
      } else {
        throw new Error(result.message || "Failed to submit registration");
      }
    } catch (error) {
      console.error('Registration error:', error);
      addNotification({
        variant: "error",
        message: error instanceof Error ? error.message : "Failed to submit registration",
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Filter courses based on search and filter
  const filteredCourses = availableCourses.filter(course => {
    const matchesSearch = course.course_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.course_title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "All" || 
                         course.status === filterStatus || 
                         (filterStatus === "Core" && course.type === "core") ||
                         (filterStatus === "Elective" && course.type === "elective");
    return matchesSearch && matchesFilter;
  });

  // Filter buffer courses
  const filteredBufferCourses = bufferCourses.filter(course =>
    course.course_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.course_title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Count summaries
  const coreCount = registeredCourses.filter(c => c.status === "Core" || c.type === "core").length;
  const electiveCount = registeredCourses.filter(c => c.status === "Elective" || c.type === "elective").length;
  const carryoverCount = registeredCourses.filter(c => c.carryover || c.is_carryover).length;
  const courseCount = registeredCourses.length;

  // Buffer course counts by category
  const bufferCounts = {
    carryover: bufferCourses.filter(c => c.category === 'carryover').length,
    prerequisite: bufferCourses.filter(c => c.category === 'prerequisite').length,
    failed: bufferCourses.filter(c => c.category === 'failed').length,
    incomplete: bufferCourses.filter(c => c.category === 'incomplete').length,
    other: bufferCourses.filter(c => c.category === 'other').length
  };

  const isSubmitDisabled = 
    totalUnits < registrationRules.minUnits || 
    totalUnits > registrationRules.maxUnits ||
    courseCount < registrationRules.minCourses ||
    courseCount > registrationRules.maxCourses ||
    (registrationRules.minCoreCourses && coreCount < registrationRules.minCoreCourses) ||
    (registrationRules.maxElectives && electiveCount > registrationRules.maxElectives) ||
    finalized ||
    submitting;

  const getCategoryBadge = (category: string) => {
    const variants = {
      carryover: "error",
      prerequisite: "warning",
      failed: "error",
      incomplete: "warning",
      other: "neutral"
    } as const;

    const icons = {
      carryover: AlertTriangle,
      prerequisite: Bookmark,
      failed: XCircle,
      incomplete: RefreshCw,
      other: Archive
    };

    const Icon = icons[category as keyof typeof icons];
    const variant = variants[category as keyof typeof variants];

    return (
      <Badge variant={variant} size="sm">
        <Icon className="w-3 h-3 mr-1" />
        {category.charAt(0).toUpperCase() + category.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="max-w-7xl mx-auto p-6 min-h-screen space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BookOpen className="text-primary w-6 h-6" />
          <div>
            <h1 className="text-2xl font-bold text-primary">
              Course Registration Portal
            </h1>
            <p className="text-text2 text-sm">
              Level {studentInfo.level} • {studentInfo.department}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-text2">
          <Clock className="w-4 h-4" />
          Deadline: {registrationRules.registrationDeadline.toLocaleDateString()}
        </div>
      </div>

      {/* Registration Rules Summary */}
      <Card className="bg-surface-elevated border-border">
        <CardContent className="p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 text-sm">
            <div>
              <span className="text-text2">Units: </span>
              <span className="font-semibold">{registrationRules.minUnits}-{registrationRules.maxUnits}</span>
            </div>
            <div>
              <span className="text-text2">Courses: </span>
              <span className="font-semibold">{registrationRules.minCourses}-{registrationRules.maxCourses}</span>
            </div>
            {registrationRules.minCoreCourses && (
              <div>
                <span className="text-text2">Core: </span>
                <span className="font-semibold">Min {registrationRules.minCoreCourses}</span>
              </div>
            )}
            {registrationRules.maxElectives && (
              <div>
                <span className="text-text2">Electives: </span>
                <span className="font-semibold">Max {registrationRules.maxElectives}</span>
              </div>
            )}
            <div>
              <span className="text-text2">Status: </span>
              <span className={`font-semibold ${finalized ? 'text-success' : 'text-warning'}`}>
                {finalized ? 'Finalized' : 'Pending'}
              </span>
            </div>
            <div>
              <span className="text-text2">Buffer: </span>
              <span className="font-semibold">{bufferCourses.length} courses</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* AVAILABLE COURSES */}
        <Card className="shadow-xl rounded-2xl border border-border">
          <CardContent className="p-0">
            <div className="p-6 border-b border-border">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <ClipboardList className="text-primary w-5 h-5" />
                  <h2 className="text-xl font-semibold text-primary">
                    Available Courses
                  </h2>
                </div>
                <Badge variant="info">
                  {filteredCourses.length} courses
                </Badge>
              </div>

              {/* Search and Filter */}
              <div className="flex gap-2 mb-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text2 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search courses by code or title..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as any)}
                  className="border border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="All">All Types</option>
                  <option value="Core">Core</option>
                  <option value="Elective">Elective</option>
                </select>
              </div>
            </div>

            <div className="max-h-96 overflow-y-auto">
              {loading ? (
                <div className="flex justify-center items-center h-32">
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                  <span className="ml-2 text-text2">Loading courses...</span>
                </div>
              ) : filteredCourses.length === 0 ? (
                <div className="flex flex-col justify-center items-center h-32 text-text2">
                  <AlertCircle className="w-8 h-8 mb-2" />
                  <span>No courses found</span>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  <AnimatePresence>
                    {filteredCourses.map((course) => {
                      const { canRegister, errors } = canRegisterCourse(course);
                      const courseUnits = course.unit || course.credit_unit;
                      
                      return (
                        <motion.div
                          key={course.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="p-4 hover:bg-background2 transition-colors"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-semibold text-text-primary">
                                  {course.course_code}
                                </span>
                                <Badge
                                  variant={
                                    course.status === "Core" || course.type === "core" 
                                      ? "info" 
                                      : "neutral"
                                  }
                                  size="sm"
                                >
                                  {course.status || course.type}
                                </Badge>
                                {course.capacity && (
                                  <span className="text-xs text-text2">
                                    ({course.enrolled}/{course.capacity})
                                  </span>
                                )}
                                <span className="text-xs font-semibold text-primary">
                                  {courseUnits} Unit{courseUnits !== 1 ? 's' : ''}
                                </span>
                              </div>
                              <p className="text-text-primary text-sm mb-2">
                                {course.course_title}
                              </p>
                              <div className="flex flex-wrap items-center gap-2 text-xs text-text2">
                                <span>Level {course.level}</span>
                                <span>•</span>
                                <span>{course.department}</span>
                                {course.prerequisites && course.prerequisites.length > 0 && (
                                  <>
                                    <span>•</span>
                                    <span className="text-warning">Prereqs: {course.prerequisites.join(', ')}</span>
                                  </>
                                )}
                              </div>
                              {errors.length > 0 && (
                                <div className="mt-2 flex items-center gap-1 text-xs text-error">
                                  <AlertCircle className="w-3 h-3" />
                                  {errors[0]}
                                </div>
                              )}
                            </div>
                            <Button
                              disabled={!canRegister}
                              onClick={() => handleRegister(course)}
                              size="sm"
                              className="ml-4 whitespace-nowrap"
                            >
                              <Plus className="w-4 h-4 mr-1" />
                              Add
                            </Button>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* REGISTERED COURSES */}
        <Card className="shadow-xl rounded-2xl border border-border">
          <CardContent className="p-0">
            <div className="p-6 border-b border-border">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="text-success w-5 h-5" />
                  <h2 className="text-xl font-semibold text-primary">
                    Registered Courses
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={totalUnits > registrationRules.maxUnits ? "error" : "success"}>
                    {totalUnits} Units
                  </Badge>
                  <Badge variant="neutral">
                    {courseCount} Courses
                  </Badge>
                </div>
              </div>

              {/* Progress Indicators */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs mb-4">
                <div className={`text-center p-2 rounded ${
                  coreCount >= (registrationRules.minCoreCourses || 0) ? 'bg-success bg-opacity-10 text-text' : 'bg-warning bg-opacity-10 text-text'
                }`}>
                  <div className="font-semibold">Core</div>
                  <div>{coreCount}/{registrationRules.minCoreCourses || 'N/A'}+</div>
                </div>
                <div className={`text-center p-2 rounded ${
                  electiveCount <= (registrationRules.maxElectives || 999) ? 'bg-success bg-opacity-10 text-text' : 'bg-error bg-opacity-10 text-text'
                }`}>
                  <div className="font-semibold">Elective</div>
                  <div>{electiveCount}/{registrationRules.maxElectives || 'N/A'} max</div>
                </div>
                <div className={`text-center p-2 rounded ${
                  totalUnits >= registrationRules.minUnits && totalUnits <= registrationRules.maxUnits 
                    ? 'bg-success bg-opacity-10 text-text' 
                    : 'bg-error bg-opacity-10 text-text'
                }`}>
                  <div className="font-semibold">Units</div>
                  <div>{totalUnits}/{registrationRules.minUnits}-{registrationRules.maxUnits}</div>
                </div>
                <div className={`text-center p-2 rounded ${
                  courseCount >= registrationRules.minCourses && courseCount <= registrationRules.maxCourses
                    ? 'bg-success bg-opacity-10 text-text'
                    : 'bg-error bg-opacity-10 text-text'
                }`}>
                  <div className="font-semibold">Courses</div>
                  <div>{courseCount}/{registrationRules.minCourses}-{registrationRules.maxCourses}</div>
                </div>
              </div>
            </div>

            <div className="max-h-96 overflow-y-auto">
              {registeredCourses.length === 0 ? (
                <div className="flex flex-col justify-center items-center h-32 text-text2">
                  <ClipboardList className="w-8 h-8 mb-2" />
                  <span>No courses registered yet</span>
                  <span className="text-xs mt-1">Add courses from the available list</span>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  <AnimatePresence>
                    {registeredCourses.map((course) => {
                      const courseUnits = course.unit || course.credit_unit;
                      const isFromBuffer = bufferCourses.some(bc => bc.course_code === course.course_code);
                      
                      return (
                        <motion.div
                          key={course.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 10 }}
                          className="p-4 hover:bg-background2 transition-colors"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-semibold text-text-primary">
                                  {course.course_code}
                                </span>
                                {(course.carryover || course.is_carryover) && (
                                  <Badge variant="error" size="sm">
                                    <AlertTriangle className="w-3 h-3 mr-1" />
                                    Carry Over
                                  </Badge>
                                )}
                                {isFromBuffer && (
                                  <Badge variant="warning" size="sm">
                                    <Archive className="w-3 h-3 mr-1" />
                                    From Buffer
                                  </Badge>
                                )}
                                <Badge
                                  variant={
                                    course.status === "Core" || course.type === "core" 
                                      ? "info" 
                                      : "neutral"
                                  }
                                  size="sm"
                                >
                                  {course.status || course.type}
                                </Badge>
                                <span className="text-xs font-semibold text-primary">
                                  {courseUnits} Unit{courseUnits !== 1 ? 's' : ''}
                                </span>
                              </div>
                              <p className="text-text-primary text-sm mb-2">
                                {course.course_title}
                              </p>
                              <div className="flex items-center gap-4 text-xs text-text2">
                                <span>Level {course.level}</span>
                                <span>{course.department}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 ml-4">
                              {!finalized ? (
                                <Button
                                  onClick={() => handleDrop(course)}
                                  variant="outline"
                                  size="sm"
                                  className="text-error border-error hover:bg-error hover:text-white"
                                  title="Drop course"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              ) : (
                                <CheckCircle className="w-5 h-5 text-success" title="Course registered" />
                              )}
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Submission Section */}
            <div className="p-6 border-t border-border">
              <div className="flex items-center justify-between">
                <div className="text-sm text-text2">
                  {finalized ? (
                    <div className="flex items-center gap-2 text-success">
                      <CheckCircle className="w-5 h-5" />
                      <div>
                        <div className="font-semibold">Registration Finalized</div>
                        <div className="text-xs">Your course registration has been submitted successfully</div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <div className="font-semibold">Review your selection before submitting</div>
                      <div className="text-xs space-y-1">
                        {carryoverCount > 0 && (
                          <div className="text-warning">
                            Carryover Courses: {carryoverCount}
                          </div>
                        )}
                        {totalUnits < registrationRules.minUnits && (
                          <div className="text-error">
                            Need {registrationRules.minUnits - totalUnits} more units
                          </div>
                        )}
                        {totalUnits > registrationRules.maxUnits && (
                          <div className="text-error">
                            {totalUnits - registrationRules.maxUnits} units over limit
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                
                {!finalized && (
                  <Button
                    onClick={handleSubmit}
                    disabled={isSubmitDisabled}
                    className="bg-success text-white hover:bg-success/90 min-w-32"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        Submitting...
                      </>
                    ) : (
                      'Submit Registration'
                    )}
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* BUFFER SECTION - Non-Current Semester Courses */}
      <Card className="shadow-xl rounded-2xl border border-border">
        <CardContent className="p-0">
          <div className="p-6 border-b border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Archive className="text-warning w-5 h-5" />
                <h2 className="text-xl font-semibold text-primary">
                  Additional Courses Buffer
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="warning">
                  {bufferCourses.length} courses
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setBufferExpanded(!bufferExpanded)}
                  className="text-text2"
                >
                  {bufferExpanded ? 'Collapse' : 'Expand'}
                </Button>
              </div>
            </div>
            <p className="text-text2 text-sm mt-2">
              Carryover courses, prerequisites, and other non-current semester courses that may affect your registration
            </p>

            {/* Buffer Course Categories Summary */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mt-4 text-xs">
              {Object.entries(bufferCounts).map(([category, count]) => (
                count > 0 && (
                  <div key={category} className="text-center p-2 rounded bg-warning bg-opacity-10">
                    <div className="font-semibold capitalize">{category}</div>
                    <div>{count}</div>
                  </div>
                )
              ))}
            </div>
          </div>

          <AnimatePresence>
            {bufferExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="max-h-96 overflow-y-auto"
              >
                {loading ? (
                  <div className="flex justify-center items-center h-32">
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                  </div>
                ) : filteredBufferCourses.length === 0 ? (
                  <div className="flex flex-col justify-center items-center h-32 text-text2">
                    <Archive className="w-8 h-8 mb-2" />
                    <span>No buffer courses found</span>
                  </div>
                ) : (
                  <div className="divide-y divide-border">
                    {filteredBufferCourses.map((course) => {
                      const courseUnits = course.unit || course.credit_unit;
                      const isRegistered = registeredCourses.some(reg => reg.course_code === course.course_code);
                      const { canRegister, errors } = canRegisterCourse(course);
                      
                      return (
                        <motion.div
                          key={course.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="p-4 hover:bg-background2 transition-colors"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-semibold text-text-primary">
                                  {course.course_code}
                                </span>
                                {getCategoryBadge(course.category)}
                                {course.required && (
                                  <Badge variant="error" size="sm">
                                    Required
                                  </Badge>
                                )}
                                {course.previous_attempts && (
                                  <Badge variant="neutral" size="sm">
                                    Attempts: {course.previous_attempts}
                                  </Badge>
                                )}
                                {course.grade && (
                                  <Badge variant="neutral" size="sm">
                                    Grade: {course.grade}
                                  </Badge>
                                )}
                                <span className="text-xs font-semibold text-primary">
                                  {courseUnits} Unit{courseUnits !== 1 ? 's' : ''}
                                </span>
                              </div>
                              <p className="text-text-primary text-sm mb-2">
                                {course.course_title}
                              </p>
                              <div className="flex flex-wrap items-center gap-2 text-xs text-text2">
                                <span>Level {course.level}</span>
                                <span>•</span>
                                <span>{course.department}</span>
                                <span>•</span>
                                <span>{course.semester} Semester</span>
                              </div>
                              {course.notes && (
                                <div className="mt-2 text-xs text-warning flex items-start gap-1">
                                  <Info className="w-3 h-3 mt-0.5 flex-shrink-0" />
                                  <span>{course.notes}</span>
                                </div>
                              )}
                              {errors.length > 0 && !isRegistered && (
                                <div className="mt-2 flex items-center gap-1 text-xs text-error">
                                  <AlertCircle className="w-3 h-3" />
                                  {errors[0]}
                                </div>
                              )}
                            </div>
                            <div className="flex items-center gap-2 ml-4">
                              {isRegistered ? (
                                <Badge variant="success" className="whitespace-nowrap">
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  Registered
                                </Badge>
                              ) : (
                                <Button
                                  disabled={!canRegister}
                                  onClick={() => handleAddFromBuffer(course)}
                                  size="sm"
                                  variant={course.required ? "default" : "outline"}
                                  className={course.required ? "bg-error text-white hover:bg-error/90" : ""}
                                >
                                  <Plus className="w-4 h-4 mr-1" />
                                  {course.required ? 'Required' : 'Add'}
                                </Button>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  );
}
