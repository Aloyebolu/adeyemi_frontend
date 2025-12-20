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
  Bookmark,
  Zap,
  GraduationCap,
  Calendar,
  ChevronDown,
  ChevronUp,
  Timer,
  AlertOctagon,
  CalendarDays,
  Hourglass
} from "lucide-react";
import { useDataFetcher } from "@/lib/dataFetcher";

interface Course {
  _id: string;
  code: string;
  title: string;
  unit: number;
  semester: string;
  level: number;
  department: string;
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
  reason?: string;
}

interface RegistrationRules {
  minUnits: number;
  maxUnits: number;
  minCourses: number;
  maxCourses: number;
  minCoreCourses?: number;
  maxElectives?: number;
  registrationDeadline: Date;
  lateRegistrationDate?: Date;
  isRegistrationOpen: boolean;
}

interface StudentInfo {
  _id: string;
  level: number;
  department: string;
  semester: string;
}

interface BufferCourse extends Course {
  category: "carryover" | "prerequisite" | "failed" | "deferred" | "dropped" | "seasonal" | "borrowed" | "practical-only" | "graduation-pending";
  required: boolean;
  notes?: string;
}

// Add this interface for semester settings
interface LevelSetting {
  level: number;
  minUnits: number;
  maxUnits: number;
  minCourses: number;
  maxCourses: number;
  _id: string;
}

interface SemesterData {
  _id: string;
  name: string;
  session: string;
  levelSettings: LevelSetting[];
  isRegistrationOpen: boolean;
  registrationDeadline: string;
  lateRegistrationDate?: string;
}

export default function CourseRegistrationPage() {
  const { setPage } = usePage();
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [registeredCourses, setRegisteredCourses] = useState<Course[]>([]);
  const [bufferCourses, setBufferCourses] = useState<BufferCourse[]>([]);
  const [totalUnits, setTotalUnits] = useState<number>(0);
  const [finalized, setFinalized] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<"All" | "core" | "elective">("All");
  const [bufferExpanded, setBufferExpanded] = useState<boolean>(true);
  const [availableCoursesExpanded, setAvailableCoursesExpanded] = useState<boolean>(true); // NEW: Control available courses expansion
  const { addNotification } = useNotifications();
  const { fetchData } = useDataFetcher();
  const [studentInfo, setStudentInfo] = useState<StudentInfo>();
  const [semesterData, setSemesterData] = useState<SemesterData | null>(null); // NEW: Store semester data


  // Initialize registrationRules with defaults, will be updated after fetching semester data
  const [registrationRules, setRegistrationRules] = useState<RegistrationRules>({
    minUnits: 0,
    maxUnits: 0,
    minCourses: 0,
    maxCourses: 0,
    minCoreCourses: 0,
    maxElectives: 0,
    registrationDeadline: null,
    isRegistrationOpen: false
  });
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  const [countdownComplete, setCountdownComplete] = useState<boolean>(false);
  const [timePercentage, setTimePercentage] = useState<number>(100);

  // NEW: Calculate countdown and progress
  const calculateTimeLeft = useCallback(() => {
    if (!registrationRules.registrationDeadline) return;

    const now = new Date().getTime();
    const deadline = new Date(registrationRules.registrationDeadline).getTime();
    const registrationStartDate = new Date();
    registrationStartDate.setDate(registrationStartDate.getDate() - 7); // Assuming 7 days window
    const totalDuration = deadline - registrationStartDate.getTime();
    const timeRemaining = deadline - now;

    if (timeRemaining <= 0) {
      setCountdownComplete(true);
      setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      setTimePercentage(0);
      return;
    }

    const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

    setTimeLeft({ days, hours, minutes, seconds });

    // Calculate percentage (assuming registration opened 7 days ago)
    const elapsed = totalDuration - timeRemaining;
    const percentage = Math.max(0, Math.min(100, (elapsed / totalDuration) * 100));
    setTimePercentage(100 - percentage); // Invert so it goes from 100% to 0%
  }, [registrationRules.registrationDeadline]);

  // NEW: Countdown timer effect
  useEffect(() => {
    if (!registrationRules.registrationDeadline) return;

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [registrationRules.registrationDeadline, calculateTimeLeft]);

  // NEW: Determine deadline status and color
  const getDeadlineStatus = () => {
    if (!registrationRules.isRegistrationOpen) {
      return { status: 'closed', color: 'text-error', bgColor: 'bg-red-500', borderColor: 'border-red-500' };
    }

    if (countdownComplete) {
      return { status: 'overdue', color: 'text-error', bgColor: 'bg-red-600', borderColor: 'border-red-600' };
    }

    const hoursLeft = timeLeft.days * 24 + timeLeft.hours;

    if (hoursLeft <= 24) {
      return { status: 'urgent', color: 'text-warning', bgColor: 'bg-orange-500', borderColor: 'border-orange-500' };
    } else if (hoursLeft <= 72) {
      return { status: 'warning', color: 'text-yellow-500', bgColor: 'bg-yellow-500', borderColor: 'border-yellow-500' };
    } else {
      return { status: 'normal', color: 'text-primary', bgColor: 'bg-primary', borderColor: 'border-primary' };
    }
  };

  // NEW: Format countdown display
  const formatCountdown = () => {
    const status = getDeadlineStatus();

    if (status.status === 'closed') return "Registration Closed";
    if (countdownComplete) return "Deadline Passed";

    if (timeLeft.days > 0) {
      return `${timeLeft.days}d ${timeLeft.hours}h ${timeLeft.minutes}m`;
    } else if (timeLeft.hours > 0) {
      return `${timeLeft.hours}h ${timeLeft.minutes}m ${timeLeft.seconds}s`;
    } else {
      return `${timeLeft.minutes}m ${timeLeft.seconds}s`;
    }
  };

  const validateRegistration = useCallback((course: Course, currentRegistered: Course[]): string[] => {
    const errors: string[] = [];

    if (currentRegistered.find(c => c.code === course.code)) {
      errors.push("Course already registered");
    }

    const currentUnits = currentRegistered.reduce((acc, c) => acc + (c.unit || c.unit), 0);
    const courseUnits = course.unit || course.unit;
    if (currentUnits + courseUnits > registrationRules.maxUnits) {
      errors.push(`Maximum ${registrationRules.maxUnits} units exceeded`);
    }

    if (currentRegistered.length >= registrationRules.maxCourses) {
      errors.push(`Maximum ${registrationRules.maxCourses} courses exceeded`);
    }

    if (course.prerequisites && course.prerequisites.length > 0) {
      const missingPrereqs = course.prerequisites.filter(prereq =>
        !currentRegistered.some(c => c.code === prereq)
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
        currentRegistered.some(c => c.code === conflict)
      );
      if (conflicts.length > 0) {
        errors.push(`Time conflict with: ${conflicts.join(', ')}`);
      }
    }

    if (course.semester !== studentInfo?.semester) {
      errors.push(`You cant register for ${course.semester} semester courses during ${studentInfo?.semester} semester`);
    }

    return errors;
  }, [registrationRules.maxUnits, registrationRules.maxCourses, studentInfo?.semester]);

  const canRegisterCourse = useCallback((course: Course): { canRegister: boolean; errors: string[] } => {
    if (finalized) return { canRegister: false, errors: ["Registration is finalized"] };
    if (!registrationRules.isRegistrationOpen) return { canRegister: false, errors: ["Registration is not open"] };

    let errors;
    if (course) {
      errors = validateRegistration(course, registeredCourses);
    } else {
      errors = ["Invalid course data"];
    }
    return { canRegister: errors.length === 0, errors };
  }, [finalized, registeredCourses, validateRegistration, registrationRules.isRegistrationOpen]);

  // NEW: Load semester data
  const loadSemesterData = async () => {
    if (!studentInfo) return;
    try {
      const response = await fetchData('semester/active', "GET");
      if (response.data) {
        const semester: SemesterData = response.data;
        setSemesterData(semester);
        console.log(semester)
        // Find level-specific rules for the student
        const studentLevel = studentInfo?.level;
        let levelSettings: LevelSetting | null = null;

        if (studentLevel && semester.levelSettings) {
          levelSettings = semester.levelSettings.find(
            setting => String(setting.level) === String(studentLevel)
          ) || null;
        } else {
          alert(studentInfo);
        }
        console.log(levelSettings)
        // Update registration rules based on semester data and level settings
        setRegistrationRules(prev => ({
          ...prev,
          minUnits: levelSettings?.minUnits,
          maxUnits: levelSettings?.maxUnits,
          minCourses: levelSettings?.minCourses,
          maxCourses: levelSettings?.maxCourses || 7,
          registrationDeadline: new Date(semester.registrationDeadline),
          lateRegistrationDate: semester.lateRegistrationDate ? new Date(semester.lateRegistrationDate) : undefined,
          isRegistrationOpen: semester.isRegistrationOpen
        }));
      }
    } catch (error) {
      console.error('Error loading semester data:', error);
    }
  };

  useEffect(() => {
    setPage("Course Registration");
    loadCourses();
    checkExistingRegistration();
  }, [setPage]);

  const checkExistingRegistration = async () => {
    try {
      const response = await fetchData('course/check-registration', "GET");
      const data = response.data;
      if (data && data.length > 0) {
        console.log("data", data);
        setRegisteredCourses(data[0].courses);
        setFinalized(true);
        // NEW: Collapse available courses section when registration is finalized
        setAvailableCoursesExpanded(false);
      }
    } catch (error) {
      console.error('Error checking registration:', error);
    }
  };

  const autoRegisterCoreCourses = useCallback((courses: Course[]) => {
    // Filter current semester core courses
    const currentSemesterCoreCourses = courses.filter(course =>
      course.type === "core" &&
      course.is_current_semester === true &&
      course.level === studentInfo?.level
    );

    const autoRegistered: Course[] = [];

    currentSemesterCoreCourses.forEach(course => {
      const { canRegister, errors } = canRegisterCourse(course);
      if (canRegister) {
        autoRegistered.push(course);
      } else {
        console.warn(`Cannot auto-register ${course.code}:`, errors[0]);
      }
    });

    // Add auto-registered courses to registered courses
    setRegisteredCourses(prev => {
      const existingCodes = new Set(prev.map(c => c.code));
      const newAutoRegistered = autoRegistered.filter(c => !existingCodes.has(c.code));
      return [...prev, ...newAutoRegistered];
    });

    if (autoRegistered.length > 0) {
      addNotification({
        variant: "success",
        message: `Auto-registered ${autoRegistered.length} core courses for current semester`,
      });
    }
  }, [canRegisterCourse, studentInfo?.level, addNotification]);

  const loadCourses = async () => {
    setLoading(true);
    try {
      const courses = await fetchData('course/available');
      const student = await fetchData('students/profile');

      // Load semester data after we have student info
      const allCoursesData = courses.data || [];
      console.log(allCoursesData);
      setAllCourses(allCoursesData);

      if (courses.data.bufferCourses) {
        setBufferCourses(courses.data.bufferCourses);
      }

      setStudentInfo(student.data[0] || student.data);
      console.log(student.data[0])
      console.log(studentInfo)



    } catch (error) {
      console.error('Error loading courses:', error);
      addNotification({
        variant: "error",
        message: "Failed to load courses",
      });
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (studentInfo) {
      loadSemesterData();
    }
  }, [studentInfo]);


  useEffect(() => {
    if (allCourses.length > 0 && studentInfo && !finalized && registrationRules.isRegistrationOpen) {
      autoRegisterCoreCourses(allCourses);
    }
  }, [allCourses, studentInfo, finalized, autoRegisterCoreCourses, registrationRules.isRegistrationOpen]);

  useEffect(() => {
    const total = registeredCourses?.reduce((acc, c) => acc + (c.unit || c.unit), 0);
    setTotalUnits(total);
  }, [registeredCourses]);

  const handleRegister = (course: Course) => {
    const { canRegister, errors } = canRegisterCourse(course);

    if (!canRegister) {
      addNotification({
        variant: "error",
        message: `Cannot register ${course.code}: ${errors[0]}`,
      });
      return;
    }

    setRegisteredCourses(prev => [...prev, course]);
    addNotification({
      variant: "success",
      message: `${course.code} - ${course.title} added successfully`,
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

    const isAutoRegisteredCore = course.type === "core" &&
      course.is_current_semester === true &&
      course.level === studentInfo?.level;

    if (isAutoRegisteredCore) {
      addNotification({
        variant: "warning",
        message: `${course.code} is a required core course and cannot be dropped`,
      });
      return;
    }

    const dependentCourses = registeredCourses.filter(regCourse =>
      regCourse.prerequisites?.includes(course.code)
    );

    if (dependentCourses.length > 0) {
      addNotification({
        variant: "warning",
        message: `Dropping ${course.code} will affect: ${dependentCourses.map(c => c.code).join(', ')}`,
      });
      return;
    }

    setRegisteredCourses(prev => prev.filter(c => c.code !== course.code));
    addNotification({
      variant: "info",
      message: `${course.code} dropped successfully`,
    });
  };

  const handleAddFromBuffer = (course: BufferCourse) => {
    const { canRegister, errors } = canRegisterCourse(course);

    if (!canRegister) {
      addNotification({
        variant: "error",
        message: `Cannot register ${course.code}: ${errors[0]}`,
      });
      return;
    }

    setRegisteredCourses(prev => [...prev, course]);
    addNotification({
      variant: "success",
      message: `${course.code} - ${course.title} added from buffer`,
    });
  };

  const handleSubmit = async () => {
    if (!registrationRules.isRegistrationOpen) {
      addNotification({
        variant: "error",
        message: "Registration is not open",
      });
      return;
    }

    const coreCount = registeredCourses.filter(c => c.type === "core").length;
    const electiveCount = registeredCourses.filter(c => c.type === "elective").length;
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

    const requiredBufferCourses = bufferCourses.filter(course =>
      course.required && !registeredCourses.some(reg => reg.code === course.code)
    );

    if (requiredBufferCourses.length > 0) {
      errors.push(`Required courses not registered: ${requiredBufferCourses.map(c => c.code).join(', ')}`);
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
      const response = await fetchData('course/register', "POST", {
        student: studentInfo?._id,
        courses: registeredCourses.map(c => c._id || c._id),
        level: studentInfo?.level,
        department: studentInfo?.department
      });

      const result = await response.data;
      setFinalized(true);
      // NEW: Collapse available courses section after successful submission
      setAvailableCoursesExpanded(false);

      addNotification({
        variant: "success",
        message: result.message || "Registration submitted successfully!",
      });
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

  const availableCourses = allCourses.filter(course => {
    const isBufferCourse = bufferCourses.some(bc => bc.code === course.code);
    const isAlreadyRegistered = registeredCourses.some(rc => rc.code === course.code);

    return !isBufferCourse && !isAlreadyRegistered;
  });

  const filteredAvailableCourses = availableCourses.filter(course => {
    const matchesSearch = course.code?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
      course.title?.toLowerCase().includes(searchTerm?.toLowerCase());
    const matchesFilter = filterStatus === "All" ||
      course.type === filterStatus ||
      (filterStatus === "core" && course.type === "core") ||
      (filterStatus === "elective" && course.type === "elective");
    return matchesSearch && matchesFilter;
  });

  const filteredBufferCourses = bufferCourses.filter(course =>
    course.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const coreCount = registeredCourses?.filter(c => c.type === "core").length;
  const electiveCount = registeredCourses?.filter(c => c.type === "elective").length;
  const carryoverCount = registeredCourses?.filter(c => c.carryover || c.is_carryover).length;
  const courseCount = registeredCourses?.length;

  const autoRegisteredCoreCount = registeredCourses?.filter(course =>
    course.type === "core" &&
    course.is_current_semester === true &&
    course.level === studentInfo?.level
  ).length;

  const bufferCounts = {
    carryover: bufferCourses.filter(c => c.category === 'carryover').length,
    prerequisite: bufferCourses.filter(c => c.category === 'prerequisite').length,
    failed: bufferCourses.filter(c => c.category === 'failed').length,
    deferred: bufferCourses.filter(c => c.category === 'deferred').length,
    dropped: bufferCourses.filter(c => c.category === 'dropped').length,
    seasonal: bufferCourses.filter(c => c.category === 'seasonal').length,
    borrowed: bufferCourses.filter(c => c.category === 'borrowed').length,
    practical: bufferCourses.filter(c => c.category === 'practical-only').length,
    graduation: bufferCourses.filter(c => c.category === 'graduation-pending').length
  };

  const isSubmitDisabled =
    totalUnits < registrationRules.minUnits ||
    totalUnits > registrationRules.maxUnits ||
    courseCount < registrationRules.minCourses ||
    courseCount > registrationRules.maxCourses ||
    (registrationRules.minCoreCourses && coreCount < registrationRules.minCoreCourses) ||
    (registrationRules.maxElectives && electiveCount > registrationRules.maxElectives) ||
    finalized ||
    submitting ||
    !registrationRules.isRegistrationOpen;

  const getCategoryBadge = (category: string) => {
    const variants = {
      carryover: "error",
      prerequisite: "warning",
      failed: "error",
      deferred: "warning",
      dropped: "neutral",
      seasonal: "info",
      borrowed: "info",
      "practical-only": "info",
      "graduation-pending": "warning"
    } as const;

    const icons = {
      carryover: AlertTriangle,
      prerequisite: Bookmark,
      failed: XCircle,
      deferred: Calendar,
      dropped: Trash2,
      seasonal: RefreshCw,
      borrowed: BookOpen,
      "practical-only": Zap,
      "graduation-pending": GraduationCap
    };

    const Icon = icons[category as keyof typeof icons];
    const variant = variants[category as keyof typeof variants];

    return (
      <Badge variant={variant} size="sm">
        <Icon className="w-3 h-3 mr-1" />
        {category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
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
              Level {studentInfo?.level} • {studentInfo?.department}
            </p>
          </div>
        </div>

        {/* Enhanced Deadline Display with Countdown and Progress Bar */}
        <div className="flex flex-col items-end gap-3 min-w-[300px]">
          {/* Status Badge */}
          <div className="flex items-center gap-2">
            <div className={`flex items-center gap-1 px-3 py-1 rounded-full border ${getDeadlineStatus().borderColor} ${getDeadlineStatus().bgColor} bg-opacity-10`}>
              <Timer className={`w-3 h-3 ${getDeadlineStatus().color}`} />
              <span className={`text font-medium ${getDeadlineStatus().color}`}>
                {getDeadlineStatus().status === 'closed' ? 'Registration Closed' :
                  getDeadlineStatus().status === 'overdue' ? 'Deadline Passed' :
                    getDeadlineStatus().status === 'urgent' ? 'Urgent Deadline' :
                      getDeadlineStatus().status === 'warning' ? 'Approaching Deadline' : 'Registration Open'}
              </span>
            </div>

            {/* Late Registration Indicator */}
            {registrationRules.lateRegistrationDate && new Date() > registrationRules.registrationDeadline &&
              new Date() <= new Date(registrationRules.lateRegistrationDate) && (
                <div className="flex items-center gap-1 px-3 py-1 rounded-full border border-warning border-opacity-50 bg-warning bg-opacity-10">
                  <AlertOctagon className="w-3 h-3 text-warning" />
                  <span className="text font-medium text-warning">Late Registration</span>
                </div>
              )}
          </div>

          {/* Enhanced Progress Bar */}
          <div className="w-full">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <CalendarDays className={`w-4 h-4 ${getDeadlineStatus().color}`} />
                <span className={`text-sm font-large ${getDeadlineStatus().color}`}>
                  {countdownComplete ? 'Deadline Passed' : 'Time Remaining'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-text2" />
                <span className="text-sm font-semibold text-text-primary">
                  {formatCountdown()}
                </span>
              </div>
            </div>

            {/* Progress Bar Container */}
            <div className="relative mb-1">
              {/* Background Track */}
              <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-3 overflow-hidden">
                {/* Animated Progress Fill */}
                <div
                  className={`h-3 rounded-full relative overflow-hidden transition-all duration-700 ease-out ${getDeadlineStatus().status === 'overdue' || getDeadlineStatus().status === 'closed'
                      ? 'bg-gradient-to-r from-red-500 to-red-600' :
                      getDeadlineStatus().status === 'urgent'
                        ? 'bg-gradient-to-r from-orange-500 to-orange-600' :
                        getDeadlineStatus().status === 'warning'
                          ? 'bg-gradient-to-r from-yellow-500 to-yellow-600' :
                          'bg-gradient-to-r from-primary to-primary-dark'
                    }`}
                  style={{
                    width: `${timePercentage}%`,
                    transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                >
                  {/* Shimmer Animation */}
                  <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

                  {/* Progress Pulse Effect */}
                  {timePercentage > 0 && timePercentage < 100 && (
                    <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-white rounded-full shadow-lg animate-pulse"></div>
                  )}
                </div>
              </div>

              {/* Progress Markers */}
              <div className="flex justify-between mt-2 px-1">
                {[0, 25, 50, 75, 100].map((marker) => (
                  <div key={marker} className="flex flex-col items-center">
                    <div
                      className={`w-1 h-1 rounded-full transition-colors duration-300 ${timePercentage <= marker
                          ? 'bg-current text-primary'
                          : 'bg-gray-300 dark:bg-gray-600'
                        }`}
                    ></div>
                    <span className="text text-gray-500 dark:text-gray-400 mt-1">
                      {marker}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Deadline Dates */}
            <div className="flex items-center justify-between text text-text2">
              <div className="flex items-center gap-1">
                <span>Deadline:</span>
                <span className="font-medium">
                  {registrationRules.registrationDeadline?.toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>

              {registrationRules.lateRegistrationDate && (
                <div className="flex items-center gap-1">
                  <Hourglass className="w-3 h-3" />
                  <span>Late until:</span>
                  <span className="font-medium">
                    {new Date(registrationRules.lateRegistrationDate).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric'
                    })}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

{/* Registration Rules Summary - Single Color with Icons */}
<Card className="bg-surface-elevated border-border">
  <CardContent className="p-4">
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 text-sm">
      
      {/* Registration Status */}
      <div className="p-3 rounded-lg bg-primary/5 border border-primary/20 hover:bg-primary/10 transition-colors">
        <div className="flex items-center gap-2 mb-1">
          {registrationRules.isRegistrationOpen ? (
            <div className="p-1 rounded-full bg-green-100 dark:bg-green-900/30">
              <CheckCircle className="w-3 h-3 text-green-600 dark:text-green-400" />
            </div>
          ) : (
            <div className="p-1 rounded-full bg-red-100 dark:bg-red-900/30">
              <XCircle className="w-3 h-3 text-red-600 dark:text-red-400" />
            </div>
          )}
          <span className="text-text2 text">Status</span>
        </div>
        <div className="font-semibold text-text">
          {registrationRules.isRegistrationOpen ? 'Open' : 'Closed'}
        </div>
      </div>

      {/* Units */}
      <div className="p-3 rounded-lg bg-primary/5 border border-primary/20 hover:bg-primary/10 transition-colors">
        <div className="flex items-center gap-2 mb-1">
          <div className="p-1 rounded-full bg-blue-100 dark:bg-blue-900/30">
            <BookOpen className="w-3 h-3 text-blue-600 dark:text-blue-400" />
          </div>
          <span className="text-text2 text">Units</span>
        </div>
        <div className={`font-semibold ${totalUnits >= registrationRules.minUnits && totalUnits <= registrationRules.maxUnits ? 'text-green-600 dark:text-green-400' : 'text-text'}`}>
          {totalUnits}/{registrationRules.minUnits}-{registrationRules.maxUnits}
        </div>
        <div className=" text-text2 mt-1">
          {totalUnits < registrationRules.minUnits ? `Need ${registrationRules.minUnits - totalUnits} more` :
           totalUnits > registrationRules.maxUnits ? `${totalUnits - registrationRules.maxUnits} over` : 'Within range'}
        </div>
      </div>

      {/* Courses */}
      <div className="p-3 rounded-lg bg-primary/5 border border-primary/20 hover:bg-primary/10 transition-colors">
        <div className="flex items-center gap-2 mb-1">
          <div className="p-1 rounded-full bg-purple-100 dark:bg-purple-900/30">
            <ClipboardList className="w-3 h-3 text-purple-600 dark:text-purple-400" />
          </div>
          <span className="text-text2 text">Courses</span>
        </div>
        <div className={`font-semibold ${courseCount >= registrationRules.minCourses && courseCount <= registrationRules.maxCourses ? 'text-green-600 dark:text-green-400' : 'text-text'}`}>
          {courseCount}/{registrationRules.minCourses}-{registrationRules.maxCourses}
        </div>
        <div className="text text-text2 mt-1">
          {courseCount < registrationRules.minCourses ? `Need ${registrationRules.minCourses - courseCount} more` :
           courseCount > registrationRules.maxCourses ? `${courseCount - registrationRules.maxCourses} over` : 'Within range'}
        </div>
      </div>

      {/* Core Courses */}
      <div className="p-3 rounded-lg bg-primary/5 border border-primary/20 hover:bg-primary/10 transition-colors">
        <div className="flex items-center gap-2 mb-1">
          <div className="p-1 rounded-full bg-indigo-100 dark:bg-indigo-900/30">
            <Shield className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
          </div>
          <span className="text-text2 text">Core</span>
        </div>
        <div className="font-semibold text-text">
          {coreCount || 0}
        </div>
        <div className="text text-text2 mt-1">
          {registrationRules.minCoreCourses ? `Min ${registrationRules.minCoreCourses}` : 'Core courses'}
        </div>
      </div>

      {/* Elective Courses */}
      <div className="p-3 rounded-lg bg-primary/5 border border-primary/20 hover:bg-primary/10 transition-colors">
        <div className="flex items-center gap-2 mb-1">
          <div className="p-1 rounded-full bg-amber-100 dark:bg-amber-900/30">
            <Bookmark className="w-3 h-3 text-amber-600 dark:text-amber-400" />
          </div>
          <span className="text-text2 text">Electives</span>
        </div>
        <div className={`font-semibold ${electiveCount <= (registrationRules.maxElectives || 999) ? 'text-text' : 'text-red-600 dark:text-red-400'}`}>
          {electiveCount || 0}
        </div>
        <div className="text text-text2 mt-1">
          {registrationRules.maxElectives ? `Max ${registrationRules.maxElectives}` : 'Elective courses'}
        </div>
      </div>

      {/* Auto-registered */}
      <div className="p-3 rounded-lg bg-primary/5 border border-primary/20 hover:bg-primary/10 transition-colors">
        <div className="flex items-center gap-2 mb-1">
          <div className="p-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30">
            <Zap className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
          </div>
          <span className="text-text2 text">Auto-registered</span>
        </div>
        <div className="font-semibold text-text">
          {autoRegisteredCoreCount || 0}
        </div>
        <div className="text text-text2 mt-1">
          {autoRegisteredCoreCount > 0 ? 'Core courses' : 'None'}
        </div>
      </div>

      {/* Time Remaining */}
      <div className="p-3 rounded-lg bg-primary/5 border border-primary/20 hover:bg-primary/10 transition-colors">
        <div className="flex items-center gap-2 mb-1">
          <div className={`p-1 rounded-full ${countdownComplete || getDeadlineStatus().status === 'urgent' ? 'bg-red-100 dark:bg-red-900/30' : 'bg-primary/10'}`}>
            <Clock className={`w-3 h-3 ${countdownComplete || getDeadlineStatus().status === 'urgent' ? 'text-red-600 dark:text-red-400' : 'text-primary'}`} />
          </div>
          <span className="text-text2 text">Time Left</span>
        </div>
        <div className={`font-semibold ${countdownComplete || getDeadlineStatus().status === 'urgent' ? 'text-red-600 dark:text-red-400' : 'text-text'}`}>
          {formatCountdown()}
        </div>
        <div className="text text-text2 mt-1">
          {countdownComplete ? 'Deadline passed' : 
           getDeadlineStatus().status === 'urgent' ? 'Urgent' : 'Registration open'}
        </div>
      </div>

    </div>



    {/* Registration Status Summary */}
    <div className="mt-4 pt-4 border-t border-border">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className={`p-1 rounded ${finalized ? 'bg-green-100 dark:bg-green-900/30' : 'bg-warning/10'}`}>
            {finalized ? (
              <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-warning" />
            )}
          </div>
          <div>
            <div className="text-sm font-medium text-text">
              {finalized ? 'Registration Finalized' : 'Registration Pending'}
            </div>
            <div className="text text-text2">
              {finalized ? 'Submitted successfully' : 'Review and submit your courses'}
            </div>
          </div>
        </div>
        
        {/* Buffer Courses Summary */}
        {bufferCourses.length > 0 && (
          <div className="flex items-center gap-2">
            <div className="p-1 rounded bg-warning/10">
              <Archive className="w-4 h-4 text-warning" />
            </div>
            <div>
              <div className="text-sm font-medium text-text">
                {bufferCourses.length} Buffer Courses
              </div>
              <div className="text text-text2">
                {bufferCourses.filter(c => c.required).length} required
              </div>
            </div>
          </div>
        )}
        
        {/* Carryover Summary */}
        {carryoverCount > 0 && (
          <div className="flex items-center gap-2">
            <div className="p-1 rounded bg-red-100 dark:bg-red-900/30">
              <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <div className="text-sm font-medium text-text">
                {carryoverCount} Carryover{coursesCount !== 1 ? 's' : ''}
              </div>
              <div className="text text-text2">
                Must be registered
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  </CardContent>
</Card>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* AVAILABLE COURSES - Updated with collapse control */}
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
                <div className="flex items-center gap-2">
                  <Badge variant="info">
                    {filteredAvailableCourses.length} courses
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setAvailableCoursesExpanded(!availableCoursesExpanded)}
                    className="text-text2"
                  >
                    {availableCoursesExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    {availableCoursesExpanded ? 'Collapse' : 'Expand'}
                  </Button>
                </div>
              </div>
              <p className="text-text2 text-sm mb-4">
                Current semester courses (core courses are auto-registered)
              </p>

              {/* Search and Filter - Only show when expanded */}
              {availableCoursesExpanded && (
                <>
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
                      <option value="core">Core</option>
                      <option value="elective">Elective</option>
                    </select>
                  </div>
                </>
              )}
            </div>

            {/* Available Courses List - Only show when expanded */}
            <AnimatePresence>
              {availableCoursesExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="max-h-96 overflow-y-auto"
                >
                  {loading ? (
                    <div className="flex justify-center items-center h-32">
                      <Loader2 className="w-6 h-6 animate-spin text-primary" />
                      <span className="ml-2 text-text2">Loading courses...</span>
                    </div>
                  ) : filteredAvailableCourses.length === 0 ? (
                    <div className="flex flex-col justify-center items-center h-32 text-text2">
                      <AlertCircle className="w-8 h-8 mb-2" />
                      <span>No additional courses found</span>
                    </div>
                  ) : (
                    <div className="divide-y divide-border">
                      <AnimatePresence>
                        {filteredAvailableCourses.map((course) => {
                          const { canRegister, errors } = canRegisterCourse(course);
                          const courseUnits = course.unit || course.unit;
                          const isRegistered = registeredCourses.some(reg => reg.code === course.code);

                          return (
                            <motion.div
                              key={course._id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="p-4 hover:bg-background2 transition-colors"
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="font-semibold text-text-primary">
                                      {course.code}
                                    </span>
                                    <Badge
                                      variant={
                                        course.type === "core"
                                          ? "info"
                                          : "neutral"
                                      }
                                      size="sm"
                                    >
                                      {course.type || "core"}
                                    </Badge>
                                    {course.capacity && (
                                      <span className="text text-text2">
                                        ({course.enrolled}/{course.capacity})
                                      </span>
                                    )}
                                    <span className="text font-semibold text-primary">
                                      {courseUnits} Unit{courseUnits !== 1 ? 's' : ''}
                                    </span>
                                  </div>
                                  <p className="text-text-primary text-sm mb-2">
                                    {course.title}
                                  </p>
                                  <div className="flex flex-wrap items-center gap-2 text text-text2">
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
                                  {errors.length > 0 && !isRegistered && (
                                    <div className="mt-2 flex items-center gap-1 text text-error">
                                      <AlertCircle className="w-3 h-3" />
                                      {errors[0]}
                                    </div>
                                  )}
                                </div>
                                <div className="flex items-center gap-2 ml-4">
                                  {/* NEW: Show registered badge when course is already registered */}
                                  {isRegistered ? (
                                    <Badge variant="success" className="whitespace-nowrap">
                                      <CheckCircle className="w-3 h-3 mr-1" />
                                      Registered
                                    </Badge>
                                  ) : (
                                    <Button
                                      disabled={!canRegister}
                                      onClick={() => handleRegister(course)}
                                      size="sm"
                                      className="ml-4 whitespace-nowrap"
                                    >
                                      <Plus className="w-4 h-4 mr-1" />
                                      Add
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </motion.div>
                          );
                        })}
                      </AnimatePresence>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
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

              {/* Auto-registration Notice */}
              <div className="bg-primary bg-opacity-10 p-3 rounded-lg mb-4">
                <div className="flex items-center gap-2 text-sm text-primary">
                  <Zap className="w-4 h-4" />
                  <span>
                    {autoRegisteredCoreCount} core courses auto-registered for current semester
                  </span>
                </div>
              </div>

              {/* Progress Indicators */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text">
                <div className={`text-center p-2 rounded ${coreCount >= (registrationRules.minCoreCourses || 0) ? 'bg-success bg-opacity-10 text-text' : 'bg-warning bg-opacity-10 text-text'
                  }`}>
                  <div className="font-semibold">Core</div>
                  <div>{coreCount}/{registrationRules.minCoreCourses || 'N/A'}+</div>
                </div>
                <div className={`text-center p-2 rounded ${electiveCount <= (registrationRules.maxElectives || 999) ? 'bg-success bg-opacity-10 text-text' : 'bg-error bg-opacity-10 text-text'
                  }`}>
                  <div className="font-semibold">Elective</div>
                  <div>{electiveCount}/{registrationRules.maxElectives || 'N/A'} max</div>
                </div>
                <div className={`text-center p-2 rounded ${totalUnits >= registrationRules.minUnits && totalUnits <= registrationRules.maxUnits
                    ? 'bg-success bg-opacity-10 text-text'
                    : 'bg-error bg-opacity-10 text-text'
                  }`}>
                  <div className="font-semibold">Units</div>
                  <div>{totalUnits}/{registrationRules.minUnits}-{registrationRules.maxUnits}</div>
                </div>
                <div className={`text-center p-2 rounded ${courseCount >= registrationRules.minCourses && courseCount <= registrationRules.maxCourses
                    ? 'bg-success bg-opacity-10 text-text'
                    : 'bg-error bg-opacity-10 text-text'
                  }`}>
                  <div className="font-semibold">Courses</div>
                  <div>{courseCount}/{registrationRules.minCourses}-{registrationRules.maxCourses}</div>
                </div>
              </div>
            </div>

            <div className="max-h-96 overflow-y-auto">
              {registeredCourses?.length === 0 ? (
                <div className="flex flex-col justify-center items-center h-32 text-text2">
                  <ClipboardList className="w-8 h-8 mb-2" />
                  <span>No courses registered yet</span>
                  <span className="text mt-1">Core courses will be auto-registered</span>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  <AnimatePresence>
                    {registeredCourses?.map((course) => {
                      const courseUnits = course.unit || course.unit;
                      const isAutoRegistered = course.type === "core" &&
                        course.is_current_semester === true &&
                        course.level === studentInfo?.level;
                      const isFromBuffer = bufferCourses.some(bc => bc.code === course.code);

                      return (
                        <motion.div
                          key={course._id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 10 }}
                          className="p-4 hover:bg-background2 transition-colors"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-semibold text-text-primary">
                                  {course.code}
                                </span>
                                {isAutoRegistered && (
                                  <Badge variant="success" size="sm">
                                    <Zap className="w-3 h-3 mr-1" />
                                    Auto
                                  </Badge>
                                )}
                                {(course.carryover || course.is_carryover) && (
                                  <Badge variant="error" size="sm">
                                    <AlertTriangle className="w-3 h-3 mr-1" />
                                    Carry Over
                                  </Badge>
                                )}
                                {isFromBuffer && !isAutoRegistered && (
                                  <Badge variant="warning" size="sm">
                                    <Archive className="w-3 h-3 mr-1" />
                                    Manual
                                  </Badge>
                                )}
                                <Badge
                                  variant={
                                    course.type === "core"
                                      ? "info"
                                      : "neutral"
                                  }
                                  size="sm"
                                >
                                  {course.type || "core"}
                                </Badge>
                                <span className="text font-semibold text-primary">
                                  {courseUnits} Unit{courseUnits !== 1 ? 's' : ''}
                                </span>
                              </div>
                              <p className="text-text-primary text-sm mb-2">
                                {course.title}
                              </p>
                              <div className="flex items-center gap-4 text text-text2">
                                <span>Level {course.level}</span>
                                <span>{course.department}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 ml-4">
                              {!finalized && !isAutoRegistered ? (
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
                        <div className="text">Your course registration has been submitted successfully</div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <div className="font-semibold">Review your selection before submitting</div>
                      <div className="text space-y-1">
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

      {/* BUFFER SECTION - All Other Courses */}
      <Card className="shadow-xl rounded-2xl border border-border">
        <CardContent className="p-0">
          <div className="p-6 border-b border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Archive className="text-warning w-5 h-5" />
                <h2 className="text-xl font-semibold text-primary">
                  Courses Buffer
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
              Carryover, prerequisite, failed, deferred, and other courses that require manual registration
            </p>

            {/* Buffer Course Categories Summary */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mt-4 text">
              {Object.entries(bufferCounts).map(([category, count]) => (
                count > 0 && (
                  <div key={category} className="text-center p-2 rounded bg-warning bg-opacity-10">
                    <div className="font-semibold capitalize">{category.replace('-', ' ')}</div>
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
                      const courseUnits = course.unit || course.unit;
                      const isRegistered = registeredCourses?.some(reg => reg.code === course.code);
                      const { canRegister, errors } = canRegisterCourse(course);

                      return (
                        <motion.div
                          key={course._id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="p-4 hover:bg-background2 transition-colors"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-semibold text-text-primary">
                                  {course.code}
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
                                <span className="text font-semibold text-primary">
                                  {courseUnits} Unit{courseUnits !== 1 ? 's' : ''}
                                </span>
                              </div>
                              <p className="text-text-primary text-sm mb-2">
                                {course.title}
                              </p>
                              <div className="flex flex-wrap items-center gap-2 text text-text2">
                                <span>Level {course.level}</span>
                                <span>•</span>
                                <span>{course.department}</span>
                                <span>•</span>
                                <span>{course.semester} Semester</span>
                              </div>
                              {course.notes && (
                                <div className="mt-2 text text-warning flex items-start gap-1">
                                  <Info className="w-3 h-3 mt-0.5 flex-shrink-0" />
                                  <span>{course.notes}</span>
                                </div>
                              )}
                              {errors.length > 0 && !isRegistered && (
                                <div className="mt-2 flex items-center gap-1 text text-error">
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
                                  className={course.required ? "bg-error text-white hover:bg-error/90 whitespace-nowrap" : "whitespace-nowrap"}
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