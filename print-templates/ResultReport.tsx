// print-templates/ResultComputationSummaryPrint.tsx
import { format } from "date-fns";

interface CarryoverStudent {
  studentId: string | null;
  matricNumber: string;
  name: string;
  courses: string[];
  notes: string;
  _id: string;
}

interface TerminationStudent {
  studentId: string | null;
  matricNumber: string;
  name: string;
  reason: string;
  remarks: string;
  _id: string;
}

interface GradeDistribution {
  firstClass: number;
  secondClassUpper: number;
  secondClassLower: number;
  thirdClass: number;
  fail: number;
}

interface ComputationSummary {
  _id: string;
  department: string;
  semester: {
    _id: string;
    name: string;
    isActive: boolean;
  };
  masterComputationId: string;
  totalStudents: number;
  studentsWithResults: number;
  studentsProcessed: number;
  averageGPA: number;
  highestGPA: number;
  lowestGPA: number;
  gradeDistribution: GradeDistribution;
  carryoverStats: {
    totalCarryovers: number;
    affectedStudentsCount: number;
    affectedStudents: CarryoverStudent[];
  };
  status: string;
  startedAt: string;
  retryCount: number;
  computedBy: {
    _id: string;
    name: string;
    email: string;
    role: string;
  };
  failedStudents: any[];
  passList: any[];
  probationList: any[];
  withdrawalList: any[];
  terminationList: TerminationStudent[];
  notifications: any[];
  recommendations: any[];
  createdAt: string;
  updatedAt: string;
  __v: number;
  completedAt: string;
  duration: number;
}

interface Analytics {
  topPerformers: any[];
  carryoverBreakdown: any[];
  gradeDistribution: GradeDistribution;
  levelStats: any;
}

interface ComputationSummaryPrintProps {
  summary: ComputationSummary;
  analytics: Analytics;
  printDate?: string;
  departmentInfo?: {
    name: string;
    code: string;
    faculty: {
      name: string;
      dean: string;
    };
  };
}

// Mock data for demonstration
const mockDepartmentInfo = {
  name: "Computer Science",
  code: "CSC",
  faculty: {
    name: "Faculty of Science",
    dean: "Prof. Adebayo Johnson"
  }
};

const mockCourseDetails = {
  "692fb82c1cddeff2e93a32c9": {
    code: "CSC 301",
    title: "Data Structures and Algorithms",
    unit: 3,
    level: 300
  },
  "692fb82c1cddeff2e93a32ca": {
    code: "CSC 302",
    title: "Database Management Systems",
    unit: 3,
    level: 300
  },
  "692fb82c1cddeff2e93a32cb": {
    code: "CSC 303",
    title: "Operating Systems",
    unit: 2,
    level: 300
  }
};

export default function ResultComputationSummaryPrint({ 
  summary, 
  analytics, 
  printDate = new Date().toLocaleDateString(),
  departmentInfo = mockDepartmentInfo
}: ComputationSummaryPrintProps) {
  
  const formatDate = (dateString: string) => {
    try {
      return dateString ? format(new Date(dateString), 'dd/MM/yyyy HH:mm') : 'N/A';
    } catch {
      return 'Invalid Date';
    }
  };

  const formatDuration = (milliseconds: number) => {
    const seconds = Math.floor(milliseconds / 1000);
    return `${seconds} seconds`;
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { color: string; label: string }> = {
      processing: { color: "bg-yellow-100 text-yellow-800", label: "PROCESSING" },
      completed: { color: "bg-green-100 text-green-800", label: "COMPLETED" },
      failed: { color: "bg-red-100 text-red-800", label: "FAILED" },
      pending: { color: "bg-gray-100 text-gray-800", label: "PENDING" }
    };
    
    const statusInfo = statusMap[status] || statusMap.pending;
    return (
      <span className={`px-2 py-1 rounded text-xs font-bold ${statusInfo.color}`}>
        {statusInfo.label}
      </span>
    );
  };

  const getAcademicClass = (gpa: number) => {
    if (gpa >= 4.50) return "FIRST CLASS";
    if (gpa >= 3.50) return "SECOND CLASS UPPER";
    if (gpa >= 2.40) return "SECOND CLASS LOWER";
    if (gpa >= 1.50) return "THIRD CLASS";
    return "FAIL";
  };

  // Calculate percentages for grade distribution
  const calculatePercentage = (count: number, total: number) => {
    if (total === 0) return "0.0%";
    return ((count / total) * 100).toFixed(1) + "%";
  };

  const totalGradedStudents = summary.studentsWithResults;

  return (
    <div className="p-0 print:p-0 bg-white text-black" style={{ fontFamily: "Arial, sans-serif" }}>
      {/* Page 1: Cover/Summary Page */}
      <div className="min-h-screen p-8 print:p-8 border-b-2 border-gray-300 mb-4">
        {/* University Header */}
        <div className="text-center mb-12 border-b-2 border-black pb-6">
          <div className="flex justify-between items-start mb-4">
            <div className="text-left text-xs w-1/3">
              <p className="font-bold">REFERENCE NO:</p>
              <p className="border border-black p-1 mt-1 font-mono">
                {summary._id?.slice(-12).toUpperCase()}
              </p>
              <p className="mt-2">Print Date: {printDate}</p>
            </div>
            <div className="w-1/3">
              <div className="h-24 w-24 mx-auto border-2 border-black flex items-center justify-center">
                <div className="text-center">
                  <div className="text-xs font-bold">AFUED</div>
                  <div className="text-[10px] mt-1">SEAL</div>
                </div>
              </div>
              <p className="text-[10px] mt-1 italic">Official University Seal</p>
            </div>
            <div className="text-right text-xs w-1/3">
              <p className="font-bold">COMPUTATION BATCH:</p>
              <p className="border border-black p-1 mt-1 font-mono">
                {summary.masterComputationId?.slice(-8).toUpperCase()}
              </p>
              <p className="mt-2">Status: {getStatusBadge(summary.status)}</p>
            </div>
          </div>
          
          <h1 className="text-3xl font-bold tracking-wide mb-2 uppercase">
            ADEYEMI FEDERAL UNIVERSITY OF EDUCATION
          </h1>
          <h2 className="text-xl font-bold mb-2">ONDO, NIGERIA</h2>
          <div className="h-1 bg-black w-3/4 mx-auto my-3"></div>
          <h3 className="text-lg font-bold uppercase border-t border-black pt-3 mt-3">
            SEMESTER RESULT COMPUTATION SUMMARY REPORT
          </h3>
          <p className="text-sm mt-2 italic">
            (Generated under the authority of the Academic Affairs Division)
          </p>
        </div>

        {/* Academic Session Banner */}
        <div className="mb-8 bg-gray-50 border-2 border-black p-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="font-bold text-lg uppercase">
                {summary.semester.name} SEMESTER
              </p>
              <p className="text-sm">2024/2025 ACADEMIC SESSION</p>
            </div>
            <div className="border-l-2 border-r-2 border-black">
              <p className="font-bold text-lg">DEPARTMENT</p>
              <p className="text-lg uppercase">{departmentInfo.name}</p>
              <p className="text-sm">Code: {departmentInfo.code}</p>
            </div>
            <div>
              <p className="font-bold text-lg">FACULTY</p>
              <p className="text-lg uppercase">{departmentInfo.faculty.name}</p>
              <p className="text-sm">Dean: {departmentInfo.faculty.dean}</p>
            </div>
          </div>
        </div>

        {/* Executive Summary */}
        <div className="mb-10">
          <h4 className="font-bold text-xl border-b-2 border-black pb-2 mb-6 uppercase">
            Executive Summary
          </h4>
          
          <div className="grid grid-cols-2 gap-8 mb-8">
            <div className="border border-black p-4">
              <h5 className="font-bold text-lg mb-4 text-center bg-gray-100 py-2">
                COMPUTATION METRICS
              </h5>
              <div className="space-y-4">
                <div className="flex justify-between border-b pb-2">
                  <span>Total Students:</span>
                  <span className="font-bold">{summary.totalStudents}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span>Students with Results:</span>
                  <span className="font-bold">{summary.studentsWithResults}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span>Students Processed:</span>
                  <span className="font-bold">{summary.studentsProcessed}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span>Processing Duration:</span>
                  <span className="font-bold">{formatDuration(summary.duration)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Computation Status:</span>
                  <span>{getStatusBadge(summary.status)}</span>
                </div>
              </div>
            </div>

            <div className="border border-black p-4">
              <h5 className="font-bold text-lg mb-4 text-center bg-gray-100 py-2">
                PERFORMANCE OVERVIEW
              </h5>
              <div className="space-y-4">
                <div className="flex justify-between border-b pb-2">
                  <span>Average GPA:</span>
                  <span className="font-bold">{summary.averageGPA.toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span>Highest GPA:</span>
                  <span className="font-bold">{summary.highestGPA.toFixed(2)}</span>
                  <span className="text-xs italic">
                    ({getAcademicClass(summary.highestGPA)})
                  </span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span>Lowest GPA:</span>
                  <span className="font-bold">{summary.lowestGPA.toFixed(2)}</span>
                  <span className="text-xs italic">
                    ({getAcademicClass(summary.lowestGPA)})
                  </span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span>Carryover Cases:</span>
                  <span className="font-bold">{summary.carryoverStats.totalCarryovers}</span>
                </div>
                <div className="flex justify-between">
                  <span>Affected Students:</span>
                  <span className="font-bold">{summary.carryoverStats.affectedStudentsCount}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Grade Distribution Chart */}
        <div className="mb-10">
          <h4 className="font-bold text-xl border-b-2 border-black pb-2 mb-4 uppercase">
            Grade Distribution Analysis
          </h4>
          
          <div className="border border-black p-6">
            <div className="grid grid-cols-5 gap-4 text-center mb-6">
              {Object.entries(summary.gradeDistribution).map(([key, value]) => (
                <div key={key} className="border border-gray-300 p-3">
                  <div className="text-2xl font-bold mb-1">{value}</div>
                  <div className="text-sm font-bold uppercase mb-1">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </div>
                  <div className="text-xs text-gray-600">
                    {calculatePercentage(value, totalGradedStudents)}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Visual Representation */}
            <div className="mt-6">
              <div className="flex items-center justify-between mb-2 text-xs">
                <span>0%</span>
                <span className="font-bold">DISTRIBUTION VISUALIZATION</span>
                <span>100%</span>
              </div>
              <div className="h-6 bg-gray-200 rounded overflow-hidden flex">
                {Object.entries(summary.gradeDistribution).map(([key, value], index) => {
                  const percentage = totalGradedStudents > 0 ? (value / totalGradedStudents) * 100 : 0;
                  const colors = [
                    "bg-green-600", // First Class
                    "bg-blue-600",  // Second Upper
                    "bg-purple-600", // Second Lower
                    "bg-yellow-600", // Third Class
                    "bg-red-600"    // Fail
                  ];
                  
                  return (
                    <div
                      key={key}
                      className="h-full"
                      style={{ width: `${percentage}%` }}
                      title={`${key}: ${value} students (${percentage.toFixed(1)}%)`}
                    >
                      <div className={`h-full ${colors[index]} ${percentage > 0 ? 'border-r border-white' : ''}`}></div>
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-between text-[10px] mt-1">
                <span>First Class</span>
                <span>2nd Upper</span>
                <span>2nd Lower</span>
                <span>Third Class</span>
                <span>Fail</span>
              </div>
            </div>
          </div>
        </div>

        {/* Computation Details */}
        <div className="mb-8">
          <h4 className="font-bold text-xl border-b-2 border-black pb-2 mb-4 uppercase">
            Computation Details
          </h4>
          
          <div className="grid grid-cols-2 gap-6 text-sm">
            <div className="border border-black p-4">
              <h5 className="font-bold mb-3 border-b pb-2">TIMELINE</h5>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Started:</span>
                  <span className="font-mono">{formatDate(summary.startedAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Completed:</span>
                  <span className="font-mono">{formatDate(summary.completedAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Retry Attempts:</span>
                  <span>{summary.retryCount}</span>
                </div>
              </div>
            </div>
            
            <div className="border border-black p-4">
              <h5 className="font-bold mb-3 border-b pb-2">PERSONNEL</h5>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Computed By:</span>
                  <span className="font-bold">{summary.computedBy.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Role:</span>
                  <span className="uppercase">{summary.computedBy.role}</span>
                </div>
                <div className="flex justify-between">
                  <span>Contact:</span>
                  <span>{summary.computedBy.email}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer for Page 1 */}
        <div className="mt-12 pt-6 border-t-2 border-black text-center text-xs">
          <p className="font-bold">Page 1 of 3 - EXECUTIVE SUMMARY</p>
          <p className="mt-1 italic">
            Continue to next page for detailed student listings...
          </p>
        </div>
      </div>

      {/* Page 2: Carryover and Termination Details */}
      <div className="min-h-screen p-8 print:p-8 border-b-2 border-gray-300 mb-4">
        {/* Page Header with University Info */}
        <div className="flex justify-between items-center mb-8 pb-4 border-b-2 border-black">
          <div className="text-left">
            <p className="text-xs font-bold">AFUED RESULT COMPUTATION</p>
            <p className="text-[10px]">Ref: {summary._id?.slice(-8).toUpperCase()}</p>
          </div>
          <div className="text-center">
            <p className="font-bold text-lg">CARRYOVER & TERMINATION ANALYSIS</p>
            <p className="text-sm">Department of {departmentInfo.name}</p>
          </div>
          <div className="text-right">
            <p className="text-xs">Page 2 of 3</p>
            <p className="text-[10px]">{printDate}</p>
          </div>
        </div>

        {/* Carryover Students Section */}
        <div className="mb-10">
          <h4 className="font-bold text-xl border-b-2 border-black pb-2 mb-6 uppercase">
            Carryover Students ({summary.carryoverStats.affectedStudentsCount})
          </h4>
          
          {summary.carryoverStats.affectedStudents.length > 0 ? (
            <div className="border border-black">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-black p-2 text-left w-12">S/N</th>
                    <th className="border border-black p-2 text-left">Matric Number</th>
                    <th className="border border-black p-2 text-left">Student Name</th>
                    <th className="border border-black p-2 text-left">Carryover Courses</th>
                    <th className="border border-black p-2 text-left">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {summary.carryoverStats.affectedStudents.map((student, index) => (
                    <tr key={student._id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="border border-black p-2 text-center">{index + 1}</td>
                      <td className="border border-black p-2 font-mono">{student.matricNumber}</td>
                      <td className="border border-black p-2">{student.name}</td>
                      <td className="border border-black p-2">
                        <div className="space-y-1">
                          {student.courses.map((courseId, idx) => {
                            const course = mockCourseDetails[courseId as keyof typeof mockCourseDetails];
                            return course ? (
                              <div key={idx} className="text-xs">
                                {course.code} - {course.title} ({course.unit} units)
                              </div>
                            ) : (
                              <div key={idx} className="text-xs">Unknown Course ({courseId.slice(-6)})</div>
                            );
                          })}
                        </div>
                      </td>
                      <td className="border border-black p-2">
                        <span className="text-red-600 font-bold">{student.notes}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-300 p-8 text-center">
              <p className="text-lg font-bold text-green-600">NO CARRYOVER CASES</p>
              <p className="text-sm mt-2">All students have cleared their courses for this semester</p>
            </div>
          )}
        </div>

        {/* Termination List */}
        <div className="mb-10">
          <h4 className="font-bold text-xl border-b-2 border-black pb-2 mb-6 uppercase">
            Termination Recommendations ({summary.terminationList.length})
          </h4>
          
          {summary.terminationList.length > 0 ? (
            <div className="border-2 border-red-600">
              <div className="bg-red-50 p-4 border-b-2 border-red-600">
                <h5 className="font-bold text-lg text-red-700">CRITICAL ACTION REQUIRED</h5>
                <p className="text-sm">The following students are recommended for termination due to academic performance</p>
              </div>
              
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-red-100">
                    <th className="border border-red-600 p-2 text-left w-12">S/N</th>
                    <th className="border border-red-600 p-2 text-left">Matric Number</th>
                    <th className="border border-red-600 p-2 text-left">Student Name</th>
                    <th className="border border-red-600 p-2 text-left">Reason for Termination</th>
                    <th className="border border-red-600 p-2 text-left">Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {summary.terminationList.map((student, index) => (
                    <tr key={student._id} className={index % 2 === 0 ? 'bg-white' : 'bg-red-50'}>
                      <td className="border border-red-600 p-2 text-center font-bold">{index + 1}</td>
                      <td className="border border-red-600 p-2 font-mono font-bold">{student.matricNumber}</td>
                      <td className="border border-red-600 p-2 font-bold">{student.name}</td>
                      <td className="border border-red-600 p-2">
                        <span className="text-red-700">{student.reason}</span>
                      </td>
                      <td className="border border-red-600 p-2 font-mono text-xs">
                        {student.remarks}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              <div className="bg-red-50 p-4 border-t-2 border-red-600">
                <p className="text-sm font-bold text-red-700">REQUIRED ACTIONS:</p>
                <ul className="list-disc pl-5 mt-2 text-sm">
                  <li>Submit to Senate for approval</li>
                  <li>Notify students and parents/guardians</li>
                  <li>Update student records accordingly</li>
                  <li>Process exit documentation</li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="border-2 border-dashed border-green-300 p-8 text-center bg-green-50">
              <p className="text-lg font-bold text-green-700">NO TERMINATION CASES</p>
              <p className="text-sm mt-2">All students meet minimum academic requirements</p>
            </div>
          )}
        </div>

        {/* Other Lists */}
        <div className="grid grid-cols-3 gap-6 text-sm">
          <div className="border border-black p-4">
            <h5 className="font-bold mb-3 border-b pb-2 text-center">PROBATION LIST</h5>
            <div className="text-center py-4">
              <div className="text-3xl font-bold text-yellow-600">{summary.probationList.length}</div>
              <p className="text-sm mt-2">Students</p>
            </div>
            {summary.probationList.length === 0 && (
              <p className="text-center text-xs text-green-600 mt-2">No probation cases</p>
            )}
          </div>
          
          <div className="border border-black p-4">
            <h5 className="font-bold mb-3 border-b pb-2 text-center">WITHDRAWAL LIST</h5>
            <div className="text-center py-4">
              <div className="text-3xl font-bold text-orange-600">{summary.withdrawalList.length}</div>
              <p className="text-sm mt-2">Students</p>
            </div>
            {summary.withdrawalList.length === 0 && (
              <p className="text-center text-xs text-green-600 mt-2">No withdrawal cases</p>
            )}
          </div>
          
          <div className="border border-black p-4">
            <h5 className="font-bold mb-3 border-b pb-2 text-center">FAILED STUDENTS</h5>
            <div className="text-center py-4">
              <div className="text-3xl font-bold text-red-600">{summary.failedStudents.length}</div>
              <p className="text-sm mt-2">Students</p>
            </div>
            {summary.failedStudents.length === 0 && (
              <p className="text-center text-xs text-green-600 mt-2">No failed students</p>
            )}
          </div>
        </div>

        {/* Page 2 Footer */}
        <div className="mt-12 pt-6 border-t-2 border-black text-center text-xs">
          <p className="font-bold">Page 2 of 3 - STUDENT ANALYSIS</p>
          <p className="mt-1 italic">
            Continue to next page for recommendations and approvals...
          </p>
        </div>
      </div>

      {/* Page 3: Recommendations and Approvals */}
      <div className="min-h-screen p-8 print:p-8">
        {/* Page Header with University Info */}
        <div className="flex justify-between items-center mb-8 pb-4 border-b-2 border-black">
          <div className="text-left">
            <p className="text-xs font-bold">AFUED RESULT COMPUTATION</p>
            <p className="text-[10px]">Ref: {summary._id?.slice(-8).toUpperCase()}</p>
          </div>
          <div className="text-center">
            <p className="font-bold text-lg">RECOMMENDATIONS & APPROVALS</p>
            <p className="text-sm">{summary.semester.name} Semester 2024/2025</p>
          </div>
          <div className="text-right">
            <p className="text-xs">Page 3 of 3</p>
            <p className="text-[10px]">{printDate}</p>
          </div>
        </div>

        {/* Recommendations Section */}
        <div className="mb-10">
          <h4 className="font-bold text-xl border-b-2 border-black pb-2 mb-6 uppercase">
            System Recommendations
          </h4>
          
          {summary.recommendations && summary.recommendations.length > 0 ? (
            <div className="border border-black p-6">
              <ul className="space-y-4">
                {summary.recommendations.map((rec: any, index: number) => (
                  <li key={index} className="flex items-start">
                    <span className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 flex-shrink-0">
                      {index + 1}
                    </span>
                    <span className="text-sm">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-300 p-8 text-center">
              <p className="text-lg font-bold">AUTOMATED RECOMMENDATIONS</p>
              <p className="text-sm mt-4 text-left">
                Based on the analysis, the system recommends the following actions:
              </p>
              <div className="mt-4 text-left space-y-3 text-sm">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-600 rounded-full mr-3"></div>
                  <span>Review all termination cases with Departmental Board</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                  <span>Schedule academic counseling for carryover students</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-yellow-600 rounded-full mr-3"></div>
                  <span>Submit grade distribution report to Quality Assurance Unit</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-purple-600 rounded-full mr-3"></div>
                  <span>Recommend excellent performers for awards and scholarships</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Approval Signatures */}
        <div className="mb-10">
          <h4 className="font-bold text-xl border-b-2 border-black pb-2 mb-6 uppercase">
            Approval Signatures
          </h4>
          
          <div className="grid grid-cols-3 gap-8 mt-8">
            {/* Level Advisor */}
            <div className="text-center">
              <div className="border-b-2 border-black pb-2 mb-4">
                <p className="font-bold">LEVEL ADVISOR</p>
                <p className="text-sm">300 Level</p>
              </div>
              <div className="border border-black h-32 flex items-center justify-center">
                <p className="text-xs italic text-gray-500">Signature & Stamp</p>
              </div>
              <div className="mt-4 space-y-1">
                <p>_______________________</p>
                <p className="text-sm">Name</p>
                <p className="text-xs">Date: ________________</p>
              </div>
            </div>
            
            {/* Head of Department */}
            <div className="text-center">
              <div className="border-b-2 border-black pb-2 mb-4">
                <p className="font-bold">HEAD OF DEPARTMENT</p>
                <p className="text-sm">{departmentInfo.name}</p>
              </div>
              <div className="border border-black h-32 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-xs font-bold">{departmentInfo.code}</div>
                  <div className="text-[10px] mt-1">DEPARTMENTAL STAMP</div>
                </div>
              </div>
              <div className="mt-4 space-y-1">
                <p>_______________________</p>
                <p className="text-sm">Prof. A. B. Smith</p>
                <p className="text-xs">Date: ________________</p>
              </div>
            </div>
            
            {/* Dean of Faculty */}
            <div className="text-center">
              <div className="border-b-2 border-black pb-2 mb-4">
                <p className="font-bold">DEAN OF FACULTY</p>
                <p className="text-sm">{departmentInfo.faculty.name}</p>
              </div>
              <div className="border border-black h-32 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-xs font-bold">{departmentInfo.faculty.name.toUpperCase().substring(0, 10)}</div>
                  <div className="text-[10px] mt-1">FACULTY STAMP</div>
                </div>
              </div>
              <div className="mt-4 space-y-1">
                <p>_______________________</p>
                <p className="text-sm">{departmentInfo.faculty.dean}</p>
                <p className="text-xs">Date: ________________</p>
              </div>
            </div>
          </div>
        </div>

        {/* Final Report Status */}
        <div className="border-2 border-black p-6 mt-12">
          <h4 className="font-bold text-xl text-center mb-6 uppercase">
            Final Report Status
          </h4>
          
          <div className="grid grid-cols-2 gap-6 text-sm">
            <div className="border border-black p-4">
              <h5 className="font-bold mb-3 border-b pb-2">REPORT VALIDATION</h5>
              <div className="space-y-3">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-600 rounded-full mr-3"></div>
                  <span>Report Generated Successfully</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-600 rounded-full mr-3"></div>
                  <span>Data Integrity Verified</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-600 rounded-full mr-3"></div>
                  <span>Statistical Analysis Complete</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-yellow-600 rounded-full mr-3"></div>
                  <span>Pending Departmental Approval</span>
                </div>
              </div>
            </div>
            
            <div className="border border-black p-4">
              <h5 className="font-bold mb-3 border-b pb-2">NEXT STEPS</h5>
              <ol className="list-decimal pl-5 space-y-2">
                <li>Submit to Departmental Board Meeting</li>
                <li>Present to Faculty Board</li>
                <li>Forward to Senate for ratification</li>
                <li>Release results to students portal</li>
                <li>Update academic records</li>
              </ol>
            </div>
          </div>
        </div>

        {/* Final Footer */}
        <div className="mt-12 pt-6 border-t-2 border-black">
          <div className="text-center text-xs">
            <p className="font-bold uppercase">END OF REPORT</p>
            <p className="mt-2">COMPUTATION SUMMARY REPORT | {summary.semester.name.toUpperCase()} SEMESTER 2024/2025</p>
            <div className="grid grid-cols-3 gap-4 mt-4 text-[10px]">
              <div className="text-left">
                <p className="font-bold">GENERATED BY:</p>
                <p>{summary.computedBy.name}</p>
                <p>{summary.computedBy.email}</p>
              </div>
              <div className="text-center">
                <p className="font-bold">UNIVERSITY SEAL</p>
                <p>AFUED Academic Affairs Division</p>
              </div>
              <div className="text-right">
                <p className="font-bold">CONFIDENTIAL</p>
                <p>For official use only</p>
                <p>Report ID: {summary._id}</p>
              </div>
            </div>
            
            <div className="mt-6 p-3 border border-black bg-gray-50">
              <p className="font-bold text-red-600">IMPORTANT DISCLAIMER:</p>
              <p className="text-[10px] mt-1">
                This document contains sensitive academic information. Unauthorized distribution, 
                reproduction, or alteration is strictly prohibited and may result in disciplinary 
                action. All data is subject to Senate ratification and final approval.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}