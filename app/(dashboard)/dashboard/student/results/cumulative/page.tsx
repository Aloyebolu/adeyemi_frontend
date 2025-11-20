'use client'
import Link from 'next/link';

export default function CumulativeResult() {
  const studentData = {
    name: "Sarah Johnson",
    studentId: "STU2023001", 
    program: "Computer Science B.Sc.",
    admissionYear: "2023",
    expectedGraduation: "2027"
  };

  const cumulativeData = {
    cgpa: "3.62",
    totalCredits: 45,
    creditsCompleted: 45,
    creditsRemaining: 75,
    totalPoints: 162.9,
    completionPercentage: "37.5%"
  };

  const allCourses = [
    { semester: "Spring 2024", code: "CS301", name: "Data Structures", grade: "A", credits: 4 },
    { semester: "Spring 2024", code: "MATH202", name: "Discrete Math", grade: "A-", credits: 3 },
    { semester: "Spring 2024", code: "CS302", name: "Database Systems", grade: "B+", credits: 3 },
    { semester: "Fall 2023", code: "CS201", name: "OOP", grade: "A", credits: 4 },
    { semester: "Fall 2023", code: "MATH101", name: "Calculus I", grade: "B+", credits: 4 },
    { semester: "Fall 2023", code: "PHY101", name: "Physics I", grade: "B", credits: 3 },
    { semester: "Spring 2023", code: "CS101", name: "Intro to Programming", grade: "A", credits: 3 },
    { semester: "Spring 2023", code: "MATH100", name: "Pre-Calculus", grade: "B", credits: 3 },
  ];

  const gradeDistribution = {
    'A': 4,
    'A-': 2, 
    'B+': 2,
    'B': 2,
    'C+': 0,
    'C': 0,
    'D': 0,
    'F': 0
  };

  const getGradeColor = (grade) => {
    switch(grade) {
      case 'A': return 'success';
      case 'A-': return 'success';
      case 'B+': return 'info';
      case 'B': return 'info';
      case 'B-': return 'warning';
      default: return 'error';
    }
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-text-primary">Cumulative Results</h1>
            <p className="text-text2">Overall academic performance</p>
          </div>
          <Link 
            href="./semester"
            className="bg-primary hover:bg-primary-hover text-text-on-primary px-4 py-2 rounded-sm transition-colors"
          >
            View Semester Results
          </Link>
        </div>

        {/* Student Info */}
        <div className="bg-surface rounded-card shadow-medium border border-border p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-text2">Student Name</p>
              <p className="text-lg font-bold text-text-primary">{studentData.name}</p>
            </div>
            <div>
              <p className="text-sm text-text2">Student ID</p>
              <p className="text-lg font-bold text-text-primary">{studentData.studentId}</p>
            </div>
            <div>
              <p className="text-sm text-text2">Admission Year</p>
              <p className="text-lg font-bold text-text-primary">{studentData.admissionYear}</p>
            </div>
            <div>
              <p className="text-sm text-text2">Expected Graduation</p>
              <p className="text-lg font-bold text-text-primary">{studentData.expectedGraduation}</p>
            </div>
          </div>
        </div>

        {/* Cumulative Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-primary text-text-on-primary p-6 rounded-card text-center">
            <p className="text-sm opacity-90">Cumulative GPA</p>
            <p className="text-3xl font-bold mt-2">{cumulativeData.cgpa}</p>
          </div>
          <div className="bg-surface-elevated p-6 rounded-card border border-border text-center">
            <p className="text-sm text-text2">Credits Completed</p>
            <p className="text-3xl font-bold text-text-primary mt-2">{cumulativeData.creditsCompleted}</p>
            <p className="text-xs text-text2 mt-1">of {cumulativeData.totalCredits} total</p>
          </div>
          <div className="bg-surface-elevated p-6 rounded-card border border-border text-center">
            <p className="text-sm text-text2">Credits Remaining</p>
            <p className="text-3xl font-bold text-text-primary mt-2">{cumulativeData.creditsRemaining}</p>
          </div>
          <div className="bg-surface-elevated p-6 rounded-card border border-border text-center">
            <p className="text-sm text-text2">Completion</p>
            <p className="text-3xl font-bold text-text-primary mt-2">{cumulativeData.completionPercentage}</p>
          </div>
        </div>

        {/* Grade Distribution */}
        <div className="bg-surface rounded-card shadow-medium border border-border p-6 mb-6">
          <h3 className="text-lg font-medium text-text-primary mb-4">Grade Distribution</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {Object.entries(gradeDistribution).map(([grade, count]) => (
              <div key={grade} className="text-center">
                <div className={`bg-${getGradeColor(grade)} bg-opacity-10 text-${getGradeColor(grade)} rounded-sm p-3`}>
                  <div className="text-2xl font-bold">{count}</div>
                  <div className="text-sm font-medium">{grade}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* All Courses Table */}
        <div className="bg-surface rounded-card shadow-medium border border-border overflow-hidden">
          <div className="px-6 py-4 border-b border-border">
            <h3 className="text-lg font-medium text-text-primary">All Completed Courses</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-background2 border-b border-border">
                  <th className="px-6 py-3 text-left text-xs font-medium text-text2 uppercase">Semester</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text2 uppercase">Course Code</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text2 uppercase">Course Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text2 uppercase">Credits</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text2 uppercase">Grade</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {allCourses.map((course, index) => (
                  <tr key={index} className="hover:bg-background2 transition-colors">
                    <td className="px-6 py-4">
                      <div className="text-sm text-text2">{course.semester}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-text-primary">{course.code}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-text-primary">{course.name}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-text2">{course.credits}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium bg-${getGradeColor(course.grade)} bg-opacity-10 text-${getGradeColor(course.grade)}`}>
                        {course.grade}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}