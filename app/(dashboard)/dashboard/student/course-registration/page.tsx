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
  Plus
} from "lucide-react";

interface Course {
  id: string; // Added unique identifier
  course_code: string;
  course_title: string;
  credit_unit: number;
  semester: string;
  level: number;
  department: string;
  status: "Core" | "Elective";
  prerequisites?: string[]; // Added for safety
  capacity?: number;
  enrolled?: number;
  carryover?: boolean;
  conflict_with?: string[]; // Added for timetable conflicts
}

interface RegistrationRules {
  minUnits: number;
  maxUnits: number;
  minCoreCourses: number;
  maxElectives: number;
  registrationDeadline: Date;
}

export default function CourseRegistrationPage() {
  const { setPage } = usePage();
  const [availableCourses, setAvailableCourses] = useState<Course[]>([]);
  const [registeredCourses, setRegisteredCourses] = useState<Course[]>([]);
  const [totalUnits, setTotalUnits] = useState<number>(0);
  const [finalized, setFinalized] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<"All" | "Core" | "Elective">("All");
  const { addNotification } = useNotifications();

  // Registration rules - should come from backend
  const registrationRules: RegistrationRules = {
    minUnits: 15,
    maxUnits: 24,
    minCoreCourses: 4,
    maxElectives: 3,
    registrationDeadline: new Date('2024-12-31')
  };

  // Memoized validation functions
  const validateRegistration = useCallback((course: Course, currentRegistered: Course[]): string[] => {
    const errors: string[] = [];

    // Check if already registered
    if (currentRegistered.find(c => c.course_code === course.course_code)) {
      errors.push("Course already registered");
    }

    // Check unit limit
    const currentUnits = currentRegistered.reduce((acc, c) => acc + c.credit_unit, 0);
    if (currentUnits + course.credit_unit > registrationRules.maxUnits) {
      errors.push(`Maximum ${registrationRules.maxUnits} units exceeded`);
    }

    // Check prerequisites
    if (course.prerequisites && course.prerequisites.length > 0) {
      const missingPrereqs = course.prerequisites.filter(prereq => 
        !currentRegistered.some(c => c.course_code === prereq)
      );
      if (missingPrereqs.length > 0) {
        errors.push(`Missing prerequisites: ${missingPrereqs.join(', ')}`);
      }
    }

    // Check course capacity
    if (course.capacity && course.enrolled && course.enrolled >= course.capacity) {
      errors.push("Course is full");
    }

    // Check timetable conflicts
    if (course.conflict_with) {
      const conflicts = course.conflict_with.filter(conflict =>
        currentRegistered.some(c => c.course_code === conflict)
      );
      if (conflicts.length > 0) {
        errors.push(`Time conflict with: ${conflicts.join(', ')}`);
      }
    }

    return errors;
  }, [registrationRules.maxUnits]);

  const canRegisterCourse = useCallback((course: Course): { canRegister: boolean; errors: string[] } => {
    if (finalized) return { canRegister: false, errors: ["Registration is finalized"] };
    
    const errors = validateRegistration(course, registeredCourses);
    return { canRegister: errors.length === 0, errors };
  }, [finalized, registeredCourses, validateRegistration]);

  useEffect(() => {
    setPage("Course Registration");
    loadCourses();
  }, [setPage]);

  const loadCourses = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockCourses: Course[] = [
        {
          id: "1",
          course_code: "CSC201",
          course_title: "Data Structures",
          credit_unit: 3,
          semester: "First",
          level: 200,
          department: "Computer Science",
          status: "Core",
          prerequisites: ["CSC102"],
          capacity: 50,
          enrolled: 45,
        },
        {
          id: "2",
          course_code: "CSC204",
          course_title: "Database Systems",
          credit_unit: 3,
          semester: "First",
          level: 200,
          department: "Computer Science",
          status: "Core",
          prerequisites: ["CSC101"],
          capacity: 40,
          enrolled: 35,
          maxElectives: 2
        },
                {
          id: "5",
          course_code: "CSC101",
          course_title: "Database Systema",
          credit_unit: 3,
          semester: "First",
          level: 200,
          department: "Computer Science",
          status: "Core",
          // prerequisites: ["CSC101"],
          capacity: 40,
          enrolled: 35,
          maxElectives: 2
        },
        {
          id: "3",
          course_code: "MAT202",
          course_title: "Mathematical Methods II",
          credit_unit: 2,
          semester: "First",
          level: 200,
          department: "Computer Science",
          status: "Core",
          // prerequisites: ["MAT101"],
        },
        {
          id: "4",
          course_code: "CSC102",
          course_title: "Introduction to Programming (Carry Over)",
          credit_unit: 10,
          semester: "Second",
          level: 100,
          department: "Computer Science",
          status: "Core",
          carryover: true,
          conflict_with: ["CSC201"]
        },
      ];
      
      setAvailableCourses(mockCourses);
    } catch (error) {
      addNotification({
        variant: "error",
        message: "Failed to load courses",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const total = registeredCourses.reduce((acc, c) => acc + c.credit_unit, 0);
    setTotalUnits(total);
  }, [registeredCourses]);

  const handleRegister = (course: Course) => {
    const { canRegister, errors } = canRegisterCourse(course);
    
    if (!canRegister) {
      addNotification({
        variant: "error",
        message: `Cannot register: ${errors[0]}`,
      });
      return;
    }

    setRegisteredCourses(prev => [...prev, course]);
    addNotification({
      variant: "success",
      message: `${course.course_code} added successfully`,
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

    // Check if dropping this course affects prerequisites of other courses
    const dependentCourses = registeredCourses.filter(regCourse => 
      regCourse.prerequisites?.includes(course.course_code)
    );

    if (dependentCourses.length > 0) {
      addNotification({
        variant: "warning",
        message: `Dropping this course will affect: ${dependentCourses.map(c => c.course_code).join(', ')}`,
      });
      return;
    }

    setRegisteredCourses(prev => prev.filter(c => c.course_code !== course.course_code));
    addNotification({
      variant: "info",
      message: `${course.course_code} dropped successfully`,
    });
  };

  const handleSubmit = async () => {
    // Comprehensive validation before submission
    const coreCount = registeredCourses.filter(c => c.status === "Core").length;
    const electiveCount = registeredCourses.filter(c => c.status === "Elective").length;

    if (totalUnits < registrationRules.minUnits) {
      addNotification({
        variant: "error",
        message: `Minimum ${registrationRules.minUnits} units required`,
      });
      return;
    }

    if (coreCount < registrationRules.minCoreCourses) {
      addNotification({
        variant: "error",
        message: `Minimum ${registrationRules.minCoreCourses} core courses required`,
      });
      return;
    }

    if (electiveCount > registrationRules.maxElectives) {
      addNotification({
        variant: "error",
        message: `Maximum ${registrationRules.maxElectives} electives allowed`,
      });
      return;
    }

    if (new Date() > registrationRules.registrationDeadline) {
      addNotification({
        variant: "error",
        message: "Registration deadline has passed",
      });
      return;
    }

    setLoading(true);
    try {
      // Simulate API call to submit registration
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setFinalized(true);
      addNotification({
        variant: "success",
        message: "Registration submitted successfully!",
      });
    } catch (error) {
      addNotification({
        variant: "error",
        message: "Failed to submit registration",
      });
    } finally {
      setLoading(false);
    }
  };

  // Filter courses based on search and filter
  const filteredCourses = availableCourses.filter(course => {
    const matchesSearch = course.course_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.course_title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "All" || course.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  // Count summaries
  const coreCount = registeredCourses.filter(c => c.status === "Core").length;
  const electiveCount = registeredCourses.filter(c => c.status === "Elective").length;
  const carryoverCount = registeredCourses.filter(c => c.carryover).length;

  const isSubmitDisabled = 
    totalUnits < registrationRules.minUnits || 
    coreCount < registrationRules.minCoreCourses ||
    electiveCount > registrationRules.maxElectives ||
    finalized;

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
              Register for your courses for the upcoming semester
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-text2">
          <Shield className="w-4 h-4" />
          Deadline: {registrationRules.registrationDeadline.toLocaleDateString()}
        </div>
      </div>

      {/* Registration Rules Summary */}
      <Card className="bg-surface-elevated border-border">
        <CardContent className="p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-text2">Units: </span>
              <span className="font-semibold">{registrationRules.minUnits}-{registrationRules.maxUnits}</span>
            </div>
            <div>
              <span className="text-text2">Core Courses: </span>
              <span className="font-semibold">Min {registrationRules.minCoreCourses}</span>
            </div>
            <div>
              <span className="text-text2">Electives: </span>
              <span className="font-semibold">Max {registrationRules.maxElectives}</span>
            </div>
            <div>
              <span className="text-text2">Status: </span>
              <span className={`font-semibold ${finalized ? 'text-success' : 'text-warning'}`}>
                {finalized ? 'Finalized' : 'Pending'}
              </span>
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
                    placeholder="Search courses..."
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
                </div>
              ) : filteredCourses.length === 0 ? (
                <div className="flex justify-center items-center h-32 text-text2 italic">
                  No courses found
                </div>
              ) : (
                <div className="divide-y divide-border">
                  <AnimatePresence>
                    {filteredCourses.map((course) => {
                      const { canRegister, errors } = canRegisterCourse(course);
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
                                {course.carryover && (
                                  <AlertTriangle className="text-error w-4 h-4" />
                                )}
                                <Badge
                                  variant={
                                    course.carryover
                                      ? "error"
                                      : course.status === "Core"
                                      ? "info"
                                      : "neutral"
                                  }
                                  size="sm"
                                >
                                  {course.carryover ? "Carry Over" : course.status}
                                </Badge>
                                {course.capacity && (
                                  <span className="text-xs text-text2">
                                    ({course.enrolled}/{course.capacity})
                                  </span>
                                )}
                              </div>
                              <p className="text-text-primary text-sm mb-2">
                                {course.course_title}
                              </p>
                              <div className="flex items-center gap-4 text-xs text-text2">
                                <span>{course.credit_unit} Units</span>
                                <span>{course.department}</span>
                                {course.prerequisites && course.prerequisites.length > 0 && (
                                  <span>Prereqs: {course.prerequisites.join(', ')}</span>
                                )}
                              </div>
                              {errors.length > 0 && (
                                <div className="mt-2 text-xs text-error">
                                  {errors[0]}
                                </div>
                              )}
                            </div>
                            <Button
                              disabled={!canRegister}
                              onClick={() => handleRegister(course)}
                              size="sm"
                              className="ml-4"
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
                <Badge variant={totalUnits > registrationRules.maxUnits ? "error" : "success"}>
                  {totalUnits} Units
                </Badge>
              </div>

              {/* Progress Indicators */}
              <div className="grid grid-cols-3 gap-4 text-xs mb-4">
                <div className={`text-center p-2 rounded ${
                  coreCount >= registrationRules.minCoreCourses ? 'bg-success bg-opacity-10 text-text' : 'bg-warning bg-opacity-10 text-text'
                }`}>
                  <div className="font-semibold">Core</div>
                  <div>{coreCount}/{registrationRules.minCoreCourses}+</div>
                </div>
                <div className={`text-center p-2 rounded ${
                  electiveCount <= registrationRules.maxElectives ? 'bg-success bg-opacity-10 text-text' : 'bg-error bg-opacity-10 text-text'
                }`}>
                  <div className="font-semibold">Elective</div>
                  <div>{electiveCount}/{registrationRules.maxElectives} max</div>
                </div>
                <div className={`text-center p-2 rounded ${
                  totalUnits >= registrationRules.minUnits && totalUnits <= registrationRules.maxUnits 
                    ? 'bg-success bg-opacity-10 text-text' 
                    : 'bg-error bg-opacity-10 text-text'
                }`}>
                  <div className="font-semibold">Units</div>
                  <div>{totalUnits}/{registrationRules.minUnits}-{registrationRules.maxUnits}</div>
                </div>
              </div>
            </div>

            <div className="max-h-96 overflow-y-auto">
              {registeredCourses.length === 0 ? (
                <div className="flex justify-center items-center h-32 text-text2 italic">
                  No courses registered yet
                </div>
              ) : (
                <div className="divide-y divide-border">
                  <AnimatePresence>
                    {registeredCourses.map((course) => (
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
                              {course.carryover && (
                                <AlertTriangle className="text-error w-4 h-4" />
                              )}
                              <Badge
                                variant={
                                  course.carryover
                                    ? "error"
                                    : course.status === "Core"
                                    ? "info"
                                    : "neutral"
                                }
                                size="sm"
                              >
                                {course.carryover ? "Carry Over" : course.status}
                              </Badge>
                            </div>
                            <p className="text-text-primary text-sm mb-2">
                              {course.course_title}
                            </p>
                            <div className="flex items-center gap-4 text-xs text-text2">
                              <span>{course.credit_unit} Units</span>
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
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            ) : (
                              <CheckCircle className="w-5 h-5 text-success" />
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
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
                      Registration Finalized
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <div>Review your selection before submitting</div>
                      <div className="text-xs">
                        {carryoverCount > 0 && (
                          <span className="text-error">
                            Carryover Courses: {carryoverCount}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                
                {!finalized && (
                  <Button
                    onClick={handleSubmit}
                    disabled={isSubmitDisabled || loading}
                    className="bg-success text-white hover:bg-success/90"
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : null}
                    Submit Registration
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}