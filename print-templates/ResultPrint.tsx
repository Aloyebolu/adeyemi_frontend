// print-templates/ResultPrint.tsx
import PrintContainer from "@/components/print/PrintContainer";
import { format } from "date-fns";
interface CourseResult {
  courseId: {
    _id: string;
    code: string;
    title: string;
  };
  courseCode: string;
  courseName: string;
  courseUnit: number;
  score: number;
  grade: string;
  gradePoint: number;
  isCoreCourse: boolean;
  isCarryover: boolean;
}

interface StudentData {
  _id: string;
  name: string;
  matric_no: string;
  level: number;
  department?: {
    name: string;
    code: string;
    faculty?: {
      name: string;
    };
  };
  program?: string;
  cgpa: number;
  probationStatus: "none" | "probation" | "probation_lifted";
  terminationStatus: "none" | "withdrawn" | "terminated" | "expelled";
}

interface SemesterData {
  _id: string;
  name: string;
  semester: number; // 1 or 2
  academicYear: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

interface ResultData {
  studentId: string | StudentData;
  departmentId: string;
  semesterId: string | SemesterData;
  courses: CourseResult[];
  gpa: number;
  cgpa: number;
  totalUnits: number;
  totalPoints: number;
  carryoverCount: number;
  remark: "good" | "probation" | "withdrawn" | "terminated" | "excellent";
  status: "pending" | "processed" | "failed";
  computedBy?: {
    name: string;
  };
  computationSummaryId?: string;
  createdAt: string;
  updatedAt: string;
}

interface ResultPrintProps {
  student: StudentData;
  results: ResultData;
  semester: SemesterData;
  printDate?: string;
}

export default function ResultPrint({ 
  student, 
  results, 
  semester,
  printDate = new Date().toLocaleDateString()
}: ResultPrintProps) {
  const getAcademicStanding = () => {
    if (student.terminationStatus !== "none") {
      return student.terminationStatus.toUpperCase();
    }
    if (student.probationStatus === "probation") {
      return "ON PROBATION";
    }
    if (results.remark === "excellent") {
      return "EXCELLENT";
    }
    return "GOOD STANDING";
  };

  const getGradePointAverage = (gpa: number) => {
    if (gpa >= 4.50) return "FIRST CLASS";
    if (gpa >= 3.50) return "SECOND CLASS UPPER";
    if (gpa >= 2.40) return "SECOND CLASS LOWER";
    if (gpa >= 1.50) return "THIRD CLASS";
    return "FAIL";
  };

  const getSemesterName = (semesterNumber: number) => {
    return semesterNumber === 1 ? "FIRST" : semesterNumber === 2 ? "SECOND" : "RAIN";
  };

  const formatDate = (dateString: string) => {
    const data = dateString? format(new Date(dateString), 'dd/MM/yyyy') : 'No Date'
    return 
  };

  const calculateTotalCredits = () => {
    return results.courses.reduce((sum, course) => sum + course.courseUnit, 0);
  };

  const calculateTotalPoints = () => {
    return results.courses.reduce((sum, course) => 
      sum + (course.gradePoint * course.courseUnit), 0
    );
  };

  const getSession = (academicYear: string) => {
    // const [startYear] = academicYear?.split('/');
    let startYear = 23
    return `${startYear}/${parseInt(startYear) + 1}`;
  };

  return (
    <PrintContainer>
      {/* University Header */}
      <div className="text-center mb-8 border-b-2 border-black pb-4">
        <div className="flex justify-between items-start mb-2">
          <div className="text-left text-xs w-1/3">
            <p>Serial No: {results._id?.slice(-8).toUpperCase()}</p>
            <p>Print Date: {printDate}</p>
          </div>
          <div className="w-1/3">
            <img 
              src="/afued_logo.png" 
              alt="University Logo" 
              className="h-16 w-auto mx-auto"
            />
          </div>
          <div className="text-right text-xs w-1/3">
            <p>Result Status: {results.status.toUpperCase()}</p>
            <p>Batch: {results.computationSummaryId?.slice(-6).toUpperCase() || 'N/A'}</p>
          </div>
        </div>
        
        <h1 className="text-2xl font-bold tracking-wide mb-1">
          ADEYEMI FEDERAL UNIVERSITY OF EDUCATION
        </h1>
        <h2 className="text-lg font-bold mb-1">ONDO, NIGERIA</h2>
        <h3 className="text-md font-bold uppercase border-t border-black pt-1 mt-2">
          OFFICIAL SEMESTER ACADEMIC TRANSCRIPT
        </h3>
        <p className="text-xs mt-1">
          (Issued under the authority of the University Senate)
        </p>
      </div>

      {/* Academic Session Information */}
      <div className="mb-6 border border-black p-3">
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div className="text-center">
            <p className="font-bold">ACADEMIC SESSION</p>
            <p className="border border-black py-1">{getSession(semester.academicYear)}</p>
          </div>
          <div className="text-center">
            <p className="font-bold">SEMESTER</p>
            <p className="border border-black py-1">
              {getSemesterName(semester.semester)} SEMESTER
            </p>
          </div>
          <div className="text-center">
            <p className="font-bold">SEMESTER PERIOD</p>
            <p className="border border-black py-1">
              {formatDate(semester.startDate)} - {formatDate(semester.endDate)}
            </p>
          </div>
        </div>
      </div>

      {/* Student Information */}
      <div className="mb-6">
        <h4 className="font-bold text-md border-b border-black mb-3">STUDENT INFORMATION</h4>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <p><span className="font-bold">FULL NAME:</span> {student.name.toUpperCase()}</p>
            <p><span className="font-bold">MATRIC NO:</span> {student.matric_no}</p>
            <p><span className="font-bold">LEVEL:</span> {student.level}00 LEVEL</p>
          </div>
          <div>
            <p><span className="font-bold">DEPARTMENT:</span> {student.department?.name?.toUpperCase()}</p>
            <p><span className="font-bold">DEPARTMENT CODE:</span> {student.department?.code}</p>
            <p><span className="font-bold">FACULTY:</span> {student.department?.faculty?.name?.toUpperCase()}</p>
          </div>
          <div>
            <p><span className="font-bold">PROGRAMME:</span> {student.program?.toUpperCase()}</p>
            <p><span className="font-bold">ACADEMIC STANDING:</span> {getAcademicStanding()}</p>
            <p><span className="font-bold">DATE OF ISSUE:</span> {formatDate(results.createdAt)}</p>
          </div>
        </div>
      </div>

      {/* Results Table */}
      <div className="mb-6">
        <h4 className="font-bold text-md border-b border-black mb-3">COURSE PERFORMANCE</h4>
        <table className="w-full border-collapse border border-black text-xs">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-black p-2 text-left w-8">S/N</th>
              <th className="border border-black p-2 text-left">COURSE CODE</th>
              <th className="border border-black p-2 text-left">COURSE TITLE</th>
              <th className="border border-black p-2 text-center">UNIT</th>
              <th className="border border-black p-2 text-center">TYPE</th>
              <th className="border border-black p-2 text-center">STATUS</th>
              <th className="border border-black p-2 text-center">SCORE</th>
              <th className="border border-black p-2 text-center">GRADE</th>
              <th className="border border-black p-2 text-center">GRADE POINT</th>
              <th className="border border-black p-2 text-center">WEIGHTED SCORE</th>
            </tr>
          </thead>
          <tbody>
            {results.courses.map((course, index) => (
              <tr key={course.courseId?._id || index}>
                <td className="border border-black p-1 text-center">{index + 1}</td>
                <td className="border border-black p-1 font-mono">
                  {course.courseId?.code || course.courseCode}
                </td>
                <td className="border border-black p-1">
                  {course.courseId?.title || course.courseName}
                </td>
                <td className="border border-black p-1 text-center">{course.courseUnit}</td>
                <td className="border border-black p-1 text-center">
                  {course.isCoreCourse ? "CORE" : "ELECTIVE"}
                </td>
                <td className="border border-black p-1 text-center">
                  {course.isCarryover ? (
                    <span className="font-bold">CARRYOVER</span>
                  ) : (
                    "REGULAR"
                  )}
                </td>
                <td className="border border-black p-1 text-center">{course.score}%</td>
                <td className="border border-black p-1 text-center font-bold">{course.grade}</td>
                <td className="border border-black p-1 text-center">{course.gradePoint}</td>
                <td className="border border-black p-1 text-center">
                  {(course.gradePoint * course.courseUnit).toFixed(1)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-gray-100 font-bold">
            <tr>
              <td colSpan={3} className="border border-black p-2 text-right">TOTALS:</td>
              <td className="border border-black p-2 text-center">{calculateTotalCredits()}</td>
              <td className="border border-black p-2 text-center">-</td>
              <td className="border border-black p-2 text-center">-</td>
              <td className="border border-black p-2 text-center">-</td>
              <td className="border border-black p-2 text-center">-</td>
              <td className="border border-black p-2 text-center">-</td>
              <td className="border border-black p-2 text-center">{calculateTotalPoints().toFixed(1)}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Academic Summary */}
      <div className="mb-8 border border-black p-4">
        <h4 className="font-bold text-md border-b border-black mb-3">ACADEMIC SUMMARY</h4>
        <div className="grid grid-cols-4 gap-4 text-sm">
          <div className="text-center border border-black p-2">
            <p className="font-bold">SEMESTER GPA</p>
            <p className="text-lg font-bold">{results.gpa.toFixed(2)}</p>
            <p className="text-xs">{getGradePointAverage(results.gpa)}</p>
          </div>
          <div className="text-center border border-black p-2">
            <p className="font-bold">CUMULATIVE GPA</p>
            <p className="text-lg font-bold">{results.cgpa.toFixed(2)}</p>
            <p className="text-xs">{getGradePointAverage(results.cgpa)}</p>
          </div>
          <div className="text-center border border-black p-2">
            <p className="font-bold">TOTAL CREDIT UNITS</p>
            <p className="text-lg font-bold">{results.totalUnits}</p>
            <p className="text-xs">Units Attempted</p>
          </div>
          <div className="text-center border border-black p-2">
            <p className="font-bold">CARRYOVER COURSES</p>
            <p className="text-lg font-bold">{results.carryoverCount}</p>
            <p className="text-xs">Course(s)</p>
          </div>
        </div>
        
        <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
          <div className="border border-black p-2">
            <p className="font-bold">ACADEMIC REMARKS:</p>
            <p className="uppercase mt-1">{results.remark}</p>
            {results.carryoverCount > 0 && (
              <p className="text-xs mt-1">
                Student has {results.carryoverCount} carryover course(s) to be repeated
              </p>
            )}
          </div>
          <div className="border border-black p-2">
            <p className="font-bold">GRADE INTERPRETATION:</p>
            <div className="grid grid-cols-3 gap-2 text-xs mt-1">
              <div>A (70-100%) = 5 Points</div>
              <div>B (60-69%) = 4 Points</div>
              <div>C (50-59%) = 3 Points</div>
              <div>D (45-49%) = 2 Points</div>
              <div>E (40-44%) = 1 Point</div>
              <div>F (0-39%) = 0 Points</div>
            </div>
          </div>
        </div>
      </div>

      {/* Administrative Section */}
      <div className="border-t-2 border-black pt-4">
        <div className="grid grid-cols-3 gap-8 text-center text-sm">
          <div>
            <p className="font-bold mb-6">STUDENT'S REMARKS:</p>
            <div className="border border-black h-16 flex items-center justify-center">
              <p className="text-xs italic">I hereby confirm receipt of this result</p>
            </div>
            <p className="mt-2">_______________________</p>
            <p>Student's Signature</p>
            <p className="text-xs mt-1">Date: ________________</p>
          </div>
          
          <div>
            <p className="font-bold mb-6">LEVEL ADVISOR:</p>
            <div className="border border-black h-16"></div>
            <p className="mt-2">_______________________</p>
            <p>Signature & Stamp</p>
            <p className="text-xs mt-1">Name: ________________</p>
          </div>
          
          <div>
            <p className="font-bold mb-6">HEAD OF DEPARTMENT:</p>
            <div className="border border-black h-16"></div>
            <p className="mt-2">_______________________</p>
            <p>Signature & Stamp</p>
            <p className="text-xs mt-1">Date: ________________</p>
          </div>
        </div>
      </div>

      {/* Footer Notes */}
      <div className="mt-8 pt-4 border-t border-black text-xs">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="font-bold">IMPORTANT NOTICES:</p>
            <ul className="list-disc pl-5 mt-1 space-y-1">
              <li>This document remains property of the University</li>
              <li>Alteration or forgery is a criminal offense</li>
              <li>Results are subject to Senate ratification</li>
              <li>Carryover courses must be registered in the following session</li>
            </ul>
          </div>
          <div>
            <p className="font-bold">KEY TO ABBREVIATIONS:</p>
            <ul className="list-disc pl-5 mt-1 space-y-1">
              <li>GPA = Grade Point Average</li>
              <li>CGPA = Cumulative Grade Point Average</li>
              <li>HOD = Head of Department</li>
              <li>SN = Serial Number</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-4 text-center italic">
          <p>
            Generated by: {results.computedBy?.name || "System Administrator"} | 
            Computation ID: {results.computationSummaryId?.slice(-12).toUpperCase() || 'N/A'} | 
            Print Version: 1.0
          </p>
          <p className="mt-1">
            <strong>OFFICIAL USE:</strong> For verification, contact the Academic Affairs Division
          </p>
        </div>
      </div>

      {/* Security Features (for print) */}
      <div className="mt-4 opacity-50 text-xs text-center">
        <p className="border-t border-dashed border-black pt-2">
          SECURITY FEATURE: This document bears the University's official watermark and serial number
        </p>
      </div>
    </PrintContainer>
  );
}