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
  User,
  Users,
  Key,
  Unlock,
  Lock,
  Eye,
  Edit,
  Save,
  X,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { useDataFetcher } from "@/lib/dataFetcher";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog/dialog";
import { useSuggestionFetcher } from "@/hooks/useSuggestionFetcher";
import { debounce } from "lodash";

interface Course {
  _id: string;
  code: string;
  title: string;
  credit_unit: number;
  unit?: number;
  semester: string;
  level: number;
  department: string;
  type?: "core" | "elective";
  prerequisites?: string[];
  capacity?: number;
  enrolled?: number;
  is_carryover?: boolean;
  conflict_with?: string[];
  is_current_semester?: boolean;
  previous_attempts?: number;
  grade?: string;
  reason?: string;
}

interface Student {
  _id: string;
  matricNo: string;
  name: string;
  level: number;
  department: string;
  semester: string;
  email: string;
  isActive: boolean;
}

interface RegistrationRules {
  minUnits: number;
  maxUnits: number;
  minCourses: number;
  maxCourses: number;
  minCoreCourses?: number;
  maxElectives?: number;
  registrationDeadline: Date;
  allowCrossLevel: boolean;
  allowCrossDepartment: boolean;
  allowOverCapacity: boolean;
  allowPrerequisiteOverride: boolean;
  allowConflictOverride: boolean;
  allowDeadlineOverride: boolean;
}

interface HODRegistrationData {
  studentId: string;
  courses: Course[];
  overrides: {
    skipPrerequisites: boolean;
    skipCapacityCheck: boolean;
    skipConflictCheck: boolean;
    skipLevelCheck: boolean;
    skipDepartmentCheck: boolean;
    ignoreDeadline: boolean;
    forceRegistration: boolean;
  };
  notes?: string;
}

export default function HODCourseRegistrationPage() {
  const { setPage } = usePage();
  const [courses, setCourses] = useState<Course[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [registeredCourses, setRegisteredCourses] = useState<Course[]>([]);
  const [totalUnits, setTotalUnits] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [courseSearchTerm, setCourseSearchTerm] = useState<string>("");
  const [filterLevel, setFilterLevel] = useState<string>("all");
  const [filterDepartment, setFilterDepartment] = useState<string>("all");
  const [filterSemester, setFilterSemester] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"browse" | "edit" | "override">("browse");
  const [overrides, setOverrides] = useState({
    skipPrerequisites: false,
    skipCapacityCheck: false,
    skipConflictCheck: false,
    skipLevelCheck: false,
    skipDepartmentCheck: false,
    ignoreDeadline: false,
    forceRegistration: false
  });
  const [studentSearchTerm, setStudentSearchTerm] = useState<string>("");
  const [registrationNotes, setRegistrationNotes] = useState<string>("");
  const [showOverrideDialog, setShowOverrideDialog] = useState<boolean>(false);
  const [courseToOverride, setCourseToOverride] = useState<Course | null>(null);
  const [loadingStudents, setLoadingStudents] = useState<boolean>(false);
  const [loadingCourses, setLoadingCourses] = useState<boolean>(false);
  const [courseSearchQuery, setCourseSearchQuery] = useState<string>("");
  const { addNotification } = useNotifications();
  const { fetchData } = useDataFetcher();
  const { fetchSuggestions } = useSuggestionFetcher();

  const defaultRules: RegistrationRules = {
    minUnits: 15,
    maxUnits: 24,
    minCourses: 4,
    maxCourses: 8,
    minCoreCourses: 4,
    maxElectives: 3,
    registrationDeadline: new Date('2024-12-31'),
    allowCrossLevel: false,
    allowCrossDepartment: false,
    allowOverCapacity: false,
    allowPrerequisiteOverride: false,
    allowConflictOverride: false,
    allowDeadlineOverride: false
  };

  const [rules, setRules] = useState<RegistrationRules>(defaultRules);

  // Debounced course search function
  const debouncedSearchCourses = useCallback(
    debounce(async (search: string) => {
      setCourseSearchQuery(search);
      await searchCourses(search, filterLevel, filterDepartment, filterSemester);
    }, 500),
    [filterLevel, filterDepartment, filterSemester]
  );

  useEffect(() => {
    setPage("HOD Course Registration");
    loadInitialData();
  }, [setPage]);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      // Load HOD settings
      const settingsResponse = await fetchData('hod/settings');
      if (settingsResponse.data) {
        setRules(settingsResponse.data);
      }
    } catch (error) {
      console.error('Error loading initial data:', error);
      addNotification({
        variant: "error",
        message: "Failed to load data",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadDepartmentStudents = async (search = "") => {
    setLoadingStudents(true);
    try {
      const data = await fetchSuggestions('student', search);
      console.log("Loaded students:", data);
      setStudents(data || []);
    } catch (error) {
      console.error('Error loading students:', error);
      addNotification({
        variant: "error",
        message: "Failed to load students",
      });
    } finally {
      setLoadingStudents(false);
    }
  };

const searchCourses = async (
  search: string,
  level: string,
  department: string,
  semester: string
) => {
  try {
    setLoading(true);

    // Build query params correctly
    const params: any = {};

    if (search) params.search = search;
    if (level !== "all") params.level = level;
    if (department !== "all") params.department = department;
    if (semester !== "all") params.semester = semester;

    // Correct fetch call (not fetchSuggestions)
    const data = await fetchData("course", "POST",{
        fields: ["title", "courseCode"],
        page: 0,
        search_term: search,
        pageSize:"30",
        filter: {
            level: level !== "all" ? level : undefined,
            semester: semester !== "all" ? semester : undefined,
        }

    });

    setCourses(data?.data || []);
  } catch (err) {
    console.error("Course search error:", err);
  } finally {
    setLoading(false);
  }
};


  // Handle filter changes - trigger new search
  useEffect(() => {
    if (courseSearchQuery || filterLevel !== "all" || filterDepartment !== "all" || filterSemester !== "all") {
      searchCourses(courseSearchQuery, filterLevel, filterDepartment, filterSemester);
    }
  }, [filterLevel, filterDepartment, filterSemester]);

  const handleStudentSelect = async (student: Student) => {
    setSelectedStudent(student);
    setViewMode("browse");
    setRegisteredCourses([]);
    
    try {
      // Load student's current registration
      const response = await fetchData(`course/check-registration/${student._id}`);
      console.log("respone", response)
      if (response.data) {
        setRegisteredCourses(response.data[0].courses || []);
      }
    } catch (error) {
      console.error('Error loading student registration:', error);
      addNotification({
        variant: "error",
        message: "Failed to load student registration",
      });
    }
  };

  const validateCourseForStudent = useCallback((course: Course, student: Student | null): { 
    canRegister: boolean; 
    warnings: string[];
    errors: string[];
  } => {
    const warnings: string[] = [];
    const errors: string[] = [];

    if (!student) {
      errors.push("No student selected");
      return { canRegister: false, warnings, errors };
    }

    // Check if already registered
    if (registeredCourses.find(c => c.code === course.code)) {
      errors.push("Course already registered");
    }

    // Level check (with override option)
    if (!overrides.skipLevelCheck && course.level !== student.level) {
      warnings.push(`Course level (${String(course.level)}) differs from student level (${String(student.level)})`);
    }

    // Department check (with override option)
    if (!overrides.skipDepartmentCheck && course.department !== student.department) {
      warnings.push(`Course department (${course.department}) differs from student department (${student.department})`);
    }

    // Semester check
    if (course.semester !== student.semester) {
      warnings.push(`Course semester (${course.semester}) differs from current semester (${student.semester})`);
    }

    // Prerequisites check (with override option)
    if (!overrides.skipPrerequisites && course.prerequisites && course.prerequisites.length > 0) {
      const missingPrereqs = course.prerequisites.filter(prereq => 
        !registeredCourses.some(c => c.code === prereq)
      );
      if (missingPrereqs.length > 0) {
        warnings.push(`Missing prerequisites: ${missingPrereqs.join(', ')}`);
      }
    }

    // Capacity check (with override option)
    if (!overrides.skipCapacityCheck && course.capacity && course.enrolled && course.enrolled >= course.capacity) {
      warnings.push(`Course is at capacity (${course.enrolled}/${course.capacity})`);
    }

    // Conflict check (with override option)
    if (!overrides.skipConflictCheck && course.conflict_with) {
      const conflicts = course.conflict_with.filter(conflict =>
        registeredCourses.some(c => c.code === conflict)
      );
      if (conflicts.length > 0) {
        warnings.push(`Time conflict with: ${conflicts.join(', ')}`);
      }
    }

    // Unit limits
    const currentUnits = registeredCourses.reduce((acc, c) => acc + (c.unit || c.credit_unit), 0);
    const courseUnits = course.unit || course.credit_unit;
    
    if (currentUnits + courseUnits > rules.maxUnits && !overrides.forceRegistration) {
      warnings.push(`Would exceed maximum ${rules.maxUnits} units`);
    }

    if (currentUnits + courseUnits < rules.minUnits && registeredCourses.length === 0) {
      warnings.push(`Minimum ${rules.minUnits} units required`);
    }

    return { 
      canRegister: overrides.forceRegistration || (errors.length === 0 && warnings.length === 0), 
      warnings, 
      errors 
    };
  }, [registeredCourses, rules, overrides]);

  const handleRegisterCourse = (course: Course) => {
    if (!selectedStudent) {
      addNotification({
        variant: "error",
        message: "Please select a student first",
      });
      return;
    }

    const validation = validateCourseForStudent(course, selectedStudent);
    
    if (validation.errors.length > 0) {
      addNotification({
        variant: "error",
        message: validation.errors[0],
      });
      return;
    }

    if (validation.warnings.length > 0 && !overrides.forceRegistration) {
      setCourseToOverride(course);
      setShowOverrideDialog(true);
      return;
    }

    setRegisteredCourses(prev => [...prev, course]);
    addNotification({
      variant: "success",
      message: `${course.code} added for ${selectedStudent.name}`,
    });
  };

  const handleOverrideAndRegister = () => {
    if (courseToOverride && selectedStudent) {
      setRegisteredCourses(prev => [...prev, courseToOverride]);
      addNotification({
        variant: "warning",
        message: `${courseToOverride.code} registered with overrides`,
      });
      setShowOverrideDialog(false);
      setCourseToOverride(null);
    }
  };

  const handleDropCourse = (course: Course) => {
    if (!selectedStudent) return;

    // Check if course is critical (core course in student's level and department)
    const isCritical = course.type === "core" && 
                      course.level === selectedStudent.level && 
                      course.department === selectedStudent.department;

    if (isCritical) {
      addNotification({
        variant: "warning",
        message: `${course.code} is a core course. Are you sure you want to drop it?`,
        action: {
          label: "Drop Anyway",
          onClick: () => {
            setRegisteredCourses(prev => prev.filter(c => c.code !== course.code));
            addNotification({
              variant: "info",
              message: `${course.code} dropped`,
            });
          }
        }
      });
    } else {
      setRegisteredCourses(prev => prev.filter(c => c.code !== course.code));
      addNotification({
        variant: "info",
        message: `${course.code} dropped`,
      });
    }
  };

  const handleSubmitRegistration = async () => {
    if (!selectedStudent) {
      addNotification({
        variant: "error",
        message: "Please select a student",
      });
      return;
    }

    const coreCount = registeredCourses.filter(c => c.type === "core").length;
    const electiveCount = registeredCourses.filter(c => c.type === "elective").length;
    const courseCount = registeredCourses.length;

    const warnings = [];

    if (totalUnits < rules.minUnits && !overrides.forceRegistration) {
      warnings.push(`Below minimum units (${totalUnits}/${rules.minUnits})`);
    }

    if (totalUnits > rules.maxUnits && !overrides.forceRegistration) {
      warnings.push(`Above maximum units (${totalUnits}/${rules.maxUnits})`);
    }

    if (courseCount < rules.minCourses && !overrides.forceRegistration) {
      warnings.push(`Below minimum courses (${courseCount}/${rules.minCourses})`);
    }

    if (courseCount > rules.maxCourses && !overrides.forceRegistration) {
      warnings.push(`Above maximum courses (${courseCount}/${rules.maxCourses})`);
    }

    if (rules.minCoreCourses && coreCount < rules.minCoreCourses && !overrides.forceRegistration) {
      warnings.push(`Below minimum core courses (${coreCount}/${rules.minCoreCourses})`);
    }

    if (rules.maxElectives && electiveCount > rules.maxElectives && !overrides.forceRegistration) {
      warnings.push(`Above maximum electives (${electiveCount}/${rules.maxElectives})`);
    }

    if (warnings.length > 0 && !overrides.forceRegistration) {
      warnings.forEach(warning => {
        addNotification({
          variant: "warning",
          message: warning,
        });
      });
      return;
    }

    setSubmitting(true);
    try {
      const registrationData: HODRegistrationData = {
        studentId: selectedStudent._id,
        courses: registeredCourses,
        overrides: {
          ...overrides,
          forceRegistration: warnings.length > 0
        },
        notes: registrationNotes
      };

      const response = await fetch('/api/hod/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registrationData)
      });

      const result = await response.json();

      if (response.ok && result.success) {
        addNotification({
          variant: "success",
          message: `Registration submitted for ${selectedStudent?.name}`,
        });
        
        // Reset for next student
        setRegisteredCourses([]);
        setRegistrationNotes("");
        setOverrides({
          skipPrerequisites: false,
          skipCapacityCheck: false,
          skipConflictCheck: false,
          skipLevelCheck: false,
          skipDepartmentCheck: false,
          ignoreDeadline: false,
          forceRegistration: false
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

  const handleBatchRegister = async (studentIds: string[], courses: Course[]) => {
    setSubmitting(true);
    try {
      const response = await fetch('/api/hod/batch-register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentIds,
          courses: courses.map(c => c._id),
          overrides,
          notes: "Batch registration by HOD"
        })
      });

      const result = await response.json();

      if (response.ok && result.success) {
        addNotification({
          variant: "success",
          message: `Batch registration completed for ${studentIds.length} students`,
        });
      } else {
        throw new Error(result.message || "Batch registration failed");
      }
    } catch (error) {
      console.error('Batch registration error:', error);
      addNotification({
        variant: "error",
        message: error instanceof Error ? error.message : "Batch registration failed",
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Calculate totals
  useEffect(() => {
    const total = registeredCourses.reduce((acc, c) => acc + (c.unit || c.credit_unit), 0);
    setTotalUnits(total);
  }, [registeredCourses]);

  const coreCount = registeredCourses.filter(c => c.type === "core").length;
  const electiveCount = registeredCourses.filter(c => c.type === "elective").length;
  const courseCount = registeredCourses.length;

  return (
    <div className="max-w-7xl mx-auto p-6 min-h-screen space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Shield className="text-primary w-7 h-7" />
          <div>
            <h1 className="text-2xl font-bold text-primary">
              HOD Course Registration Portal
            </h1>
            <p className="text-text2 text-sm">
              Administrative Access • Override Permissions Enabled
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Key className="w-5 h-5 text-warning" />
          <Badge variant="warning">
            HOD Override Mode
          </Badge>
        </div>
      </div>

      {/* Student Selection Section */}
      <Card className="bg-surface-elevated border-border">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Users className="text-primary w-5 h-5" />
              <h2 className="text-xl font-semibold">Student Selection</h2>
            </div>
            <Badge variant={selectedStudent ? "success" : "neutral"}>
              {selectedStudent ? `Selected: ${selectedStudent.name}` : "No student selected"}
            </Badge>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Search Students</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text2 w-4 h-4" />
                <Input
                  placeholder="Search by name or ID..."
                  value={studentSearchTerm}
                  onChange={(e) => {
                    setStudentSearchTerm(e.target.value);
                    loadDepartmentStudents(e.target.value);
                  }}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Quick Actions</Label>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setViewMode("edit")}
                  disabled={!selectedStudent}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Registration
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setViewMode("override")}
                >
                  <Unlock className="w-4 h-4 mr-2" />
                  Override Mode
                </Button>
              </div>
            </div>
          </div>

          {/* Student List */}
          <div className="mt-4 max-h-60 overflow-y-auto border rounded-lg">
            {loadingStudents ? (
              <div className="flex justify-center items-center h-20">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : students.length === 0 ? (
              <div className="flex flex-col justify-center items-center h-20 text-text2">
                <User className="w-8 h-8 mb-2" />
                <span>No students found</span>
              </div>
            ) : (
              <div className="divide-y">
                {students.map(student => (
                  <div
                    key={student._id}
                    className={`p-4 hover:bg-background2 cursor-pointer transition-colors ${
                      selectedStudent?._id === student._id ? 'bg-primary bg-opacity-10' : ''
                    }`}
                    onClick={() => handleStudentSelect(student)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold">{student.name}</div>
                        <div className="text-sm text-text2">
                          {student.matricNo} • Level {student.level} • {student.department}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="neutral">
                          {student.semester}
                        </Badge>
                        {selectedStudent?._id === student._id && (
                          <CheckCircle className="w-5 h-5 text-success" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Override Controls */}
      {viewMode === "override" && (
        <Card className="bg-warning bg-opacity-10 border-warning">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Unlock className="text-warning w-5 h-5" />
                <h3 className="font-semibold">Override Controls</h3>
              </div>
              <Switch
                checked={overrides.forceRegistration}
                onCheckedChange={(checked) => 
                  setOverrides(prev => ({ ...prev, forceRegistration: checked }))
                }
              />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="skip-prereq"
                  checked={overrides.skipPrerequisites}
                  onCheckedChange={(checked) => 
                    setOverrides(prev => ({ ...prev, skipPrerequisites: checked }))
                  }
                />
                <Label htmlFor="skip-prereq" className="text-sm">
                  Skip Prerequisites
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="skip-capacity"
                  checked={overrides.skipCapacityCheck}
                  onCheckedChange={(checked) => 
                    setOverrides(prev => ({ ...prev, skipCapacityCheck: checked }))
                  }
                />
                <Label htmlFor="skip-capacity" className="text-sm">
                  Ignore Capacity
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="skip-conflict"
                  checked={overrides.skipConflictCheck}
                  onCheckedChange={(checked) => 
                    setOverrides(prev => ({ ...prev, skipConflictCheck: checked }))
                  }
                />
                <Label htmlFor="skip-conflict" className="text-sm">
                  Allow Conflicts
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="skip-level"
                  checked={overrides.skipLevelCheck}
                  onCheckedChange={(checked) => 
                    setOverrides(prev => ({ ...prev, skipLevelCheck: checked }))
                  }
                />
                <Label htmlFor="skip-level" className="text-sm">
                  Cross-Level
                </Label>
              </div>
            </div>

            <div className="mt-4 text-sm text-text2">
              <Info className="w-4 h-4 inline mr-1" />
              Force Registration mode will ignore all validation warnings
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Available Courses */}
        <div className="lg:col-span-2">
          <Card className="shadow-xl rounded-2xl border border-border">
            <CardContent className="p-0">
              <div className="p-6 border-b border-border">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <BookOpen className="text-primary w-5 h-5" />
                    <h2 className="text-xl font-semibold">All Courses</h2>
                  </div>
                  <Badge variant="info">
                    {courses.length} courses
                  </Badge>
                </div>

                {/* Filters */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text2 w-4 h-4" />
                    <Input
                      placeholder="Search courses..."
                      value={courseSearchTerm}
                      onChange={(e) => {
                        const value = e.target.value;
                        setCourseSearchTerm(value);
                        debouncedSearchCourses(value);
                      }}
                      className="pl-10"
                    />
                  </div>
                  
                  <Select 
                    value={filterLevel} 
                    onValueChange={(value) => {
                      setFilterLevel(value);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Levels</SelectItem>
                      <SelectItem value="100">Level 100</SelectItem>
                      <SelectItem value="200">Level 200</SelectItem>
                      <SelectItem value="300">Level 300</SelectItem>
                      <SelectItem value="400">Level 400</SelectItem>
                      <SelectItem value="500">Level 500</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* <Select 
                    value={filterDepartment} 
                    onValueChange={(value) => {
                      setFilterDepartment(value);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Departments</SelectItem>
                      <SelectItem value="Computer Science">Computer Science</SelectItem>
                      <SelectItem value="Mathematics">Mathematics</SelectItem>
                      <SelectItem value="Physics">Physics</SelectItem>
                      <SelectItem value="Chemistry">Chemistry</SelectItem>
                      <SelectItem value="Biology">Biology</SelectItem>
                    </SelectContent>
                  </Select> */}

                  <Select 
                    value={filterSemester} 
                    onValueChange={(value) => {
                      setFilterSemester(value);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Semester" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Semesters</SelectItem>
                      <SelectItem value="first">First Semester</SelectItem>
                      <SelectItem value="second">Second Semester</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="max-h-[500px] overflow-y-auto">
                {loadingCourses ? (
                  <div className="flex justify-center items-center h-32">
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                    <span className="ml-2">Searching courses...</span>
                  </div>
                ) : courses.length === 0 ? (
                  <div className="flex flex-col justify-center items-center h-32 text-text2">
                    <BookOpen className="w-8 h-8 mb-2" />
                    <span>No courses found</span>
                    {courseSearchQuery || filterLevel !== "all" || filterDepartment !== "all" || filterSemester !== "all" ? (
                      <p className="text-sm mt-1">Try different search criteria</p>
                    ) : (
                      <p className="text-sm mt-1">Start typing to search for courses</p>
                    )}
                  </div>
                ) : (
                  <div className="divide-y">
                    {courses.map((course) => {
                      const validation = selectedStudent ? 
                        validateCourseForStudent(course, selectedStudent) : 
                        { canRegister: false, warnings: [], errors: [] };
                      const courseUnits = course.unit || course.credit_unit;
                      
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
                                <span className="font-semibold">{course.code}</span>
                                <Badge variant={course.type === "core" ? "info" : "neutral"} size="sm">
                                  {course.type}
                                </Badge>
                                <Badge variant="neutral" size="sm">
                                  L{course.level}
                                </Badge>
                                <Badge variant="neutral" size="sm">
                                  {course.department}
                                </Badge>
                                <span className="text-xs font-semibold text-primary">
                                  {courseUnits} Units
                                </span>
                                {course.capacity && (
                                  <span className="text-xs text-text2">
                                    ({course.enrolled || 0}/{course.capacity})
                                  </span>
                                )}
                              </div>
                              <p className="text-sm mb-2">{course.title}</p>
                              <div className="flex flex-wrap gap-2 text-xs text-text2">
                                <span>Semester {course.semester}</span>
                                {course.prerequisites && course.prerequisites.length > 0 && (
                                  <span className="text-warning">
                                    Prereqs: {course.prerequisites.join(', ')}
                                  </span>
                                )}
                              </div>
                              {validation.warnings.length > 0 && selectedStudent && (
                                <div className="mt-2 flex items-center gap-1 text-xs text-warning">
                                  <AlertTriangle className="w-3 h-3" />
                                  {validation.warnings[0]}
                                </div>
                              )}
                            </div>
                            <div className="ml-4">
                              <Button
                                onClick={() => handleRegisterCourse(course)}
                                disabled={!selectedStudent}
                                size="sm"
                              >
                                <Plus className="w-4 h-4 mr-1" />
                                Register
                              </Button>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Registration Panel */}
        <div>
          <Card className="shadow-xl rounded-2xl border border-border sticky top-6">
            <CardContent className="p-0">
              <div className="p-6 border-b border-border">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <ClipboardList className="text-primary w-5 h-5" />
                    <h2 className="text-xl font-semibold">Registration</h2>
                  </div>
                  {selectedStudent && (
                    <Badge variant="success">
                      {selectedStudent.name}
                    </Badge>
                  )}
                </div>

                {!selectedStudent ? (
                  <div className="text-center py-8 text-text2">
                    <User className="w-12 h-12 mx-auto mb-4" />
                    <p>Select a student to begin registration</p>
                  </div>
                ) : (
                  <>
                    {/* Registration Summary */}
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="text-center p-2 bg-surface rounded">
                          <div className="font-semibold">Courses</div>
                          <div>{courseCount}/{rules.minCourses}-{rules.maxCourses}</div>
                        </div>
                        <div className="text-center p-2 bg-surface rounded">
                          <div className="font-semibold">Units</div>
                          <div>{totalUnits}/{rules.minUnits}-{rules.maxUnits}</div>
                        </div>
                        <div className="text-center p-2 bg-surface rounded">
                          <div className="font-semibold">Core</div>
                          <div>{coreCount}/{rules.minCoreCourses || 0}+</div>
                        </div>
                        <div className="text-center p-2 bg-surface rounded">
                          <div className="font-semibold">Electives</div>
                          <div>{electiveCount}/{rules.maxElectives || 0}</div>
                        </div>
                      </div>

                      {/* Registered Courses List */}
                      <div className="max-h-64 overflow-y-auto border rounded">
                        {registeredCourses.length === 0 ? (
                          <div className="text-center py-8 text-text2">
                            <ClipboardList className="w-8 h-8 mx-auto mb-2" />
                            <p>No courses registered yet</p>
                          </div>
                        ) : (
                          <div className="divide-y">
                            {registeredCourses.map(course => {
                              const courseUnits = course.unit || course.credit_unit;
                              return (
                                <div key={course._id} className="p-3">
                                  <div className="flex items-start justify-between">
                                    <div>
                                      <div className="font-semibold text-sm">
                                        {course.code}
                                      </div>
                                      <div className="text-xs text-text2 truncate">
                                        {course.title}
                                      </div>
                                      <div className="text-xs text-primary">
                                        {courseUnits} Units • {course.type}
                                      </div>
                                    </div>
                                    <Button
                                      onClick={() => handleDropCourse(course)}
                                      variant="ghost"
                                      size="sm"
                                      className="text-error hover:text-error"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>

                      {/* Notes */}
                      <div className="space-y-2">
                        <Label htmlFor="notes">Registration Notes</Label>
                        <textarea
                          id="notes"
                          value={registrationNotes}
                          onChange={(e) => setRegistrationNotes(e.target.value)}
                          placeholder="Add notes about this registration (optional)"
                          className="w-full p-2 border rounded text-sm min-h-[60px]"
                        />
                      </div>

                      {/* Submit Button */}
                      <Button
                        onClick={handleSubmitRegistration}
                        disabled={!selectedStudent || submitting}
                        className="w-full"
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
                    </div>
                    

                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Override Dialog */}
      <Dialog open={showOverrideDialog} onOpenChange={setShowOverrideDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="text-warning w-5 h-5" />
              Registration Override Required
            </DialogTitle>
          </DialogHeader>
          
          {courseToOverride && selectedStudent && (
            <div className="space-y-4">
              <div className="p-3 bg-warning bg-opacity-10 rounded">
                <div className="font-semibold">{courseToOverride.code} - {courseToOverride.title}</div>
                <div className="text-sm text-text2">
                  For: {selectedStudent.name} ({selectedStudent.matricNo})
                </div>
              </div>

              <div className="text-sm">
                <p className="font-semibold mb-2">Issues detected:</p>
                <ul className="space-y-1 text-warning">
                  {validateCourseForStudent(courseToOverride, selectedStudent).warnings.map((warning, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <AlertTriangle className="w-3 h-3" />
                      {warning}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="text-sm text-text2">
                <Info className="w-4 h-4 inline mr-1" />
                As HOD, you can override these restrictions.
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowOverrideDialog(false)}
            >
              Cancel
            </Button>
            <Button
              variant="warning"
              onClick={handleOverrideAndRegister}
            >
              <Unlock className="w-4 h-4 mr-2" />
              Override & Register
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}