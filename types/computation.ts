export interface Department {
  _id: string
  name: string
  code: string
}

export interface ComputationSummary {
  _id: string
  department: {
    name: string
    code: string
  }
  semester: {
    name: string
    academicYear: string
    isActive: boolean
    isLocked: boolean
  }
  status: 'processing' | 'completed' | 'completed_with_errors' | 'failed' | 'cancelled'
  totalStudents: number
  studentsWithResults: number
  averageGPA: number
  highestGPA: number
  lowestGPA: number
  gradeDistribution: {
    firstClass: number
    secondClassUpper: number
    secondClassLower: number
    thirdClass: number
    fail: number
  }
  carryoverStats: {
    totalCarryovers: number
    affectedStudents: number
  }
  failedStudents: Array<{
    studentId: string
    matricNumber: string
    name: string
    error: string
  }>
  startedAt: string
  completedAt?: string
  duration: number
  computedBy: {
    name: string
    email: string
  }
}

export interface MasterComputation {
  _id: string
  totalDepartments: number
  departmentsProcessed: number
  status: 'processing' | 'completed' | 'completed_with_errors' | 'cancelled' | 'failed'
  overallAverageGPA?: number
  totalStudents?: number
  totalFailedStudents?: number
  totalCarryovers?: number
  departmentsLocked?: number
  computedBy: {
    name: string
    email: string
  }
  startedAt: string
  completedAt?: string
  duration?: number
  departmentSummaries: ComputationSummary[]
  metadata?: {
    departments: Array<{
      departmentId: string
      departmentName: string
      semesterId: string
      semesterName: string
    }>
    isPreview?: boolean
  }
  isFinal?: boolean
  purpose?: 'preview' | 'final' | 'simulation'
}

export interface CarryoverStats {
  department: Department
  semester: {
    _id: string
    name: string
    academicYear: string
  }
  totalCarryoverCourses: number
  totalStudentsWithCarryovers: number
  courseBreakdown: Array<{
    courseCode: string
    courseTitle: string
    courseUnit: number
    totalStudents: number
    students: string[]
  }>
}