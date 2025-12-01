"use client"
import { useState } from 'react';
import Link from 'next/link';

export default function SemesterResult() {
  const [selectedSemester, setSelectedSemester] = useState('Spring 2024');
  
  const studentData = {
    name: "Sarah Johnson",
    studentId: "STU2023001",
    program: "Computer Science B.Sc.",
    currentSemester: "Spring 2024"
  };

  const semesterResults = [
    {
      semester: "Spring 2024",
      semesterCode: "SP24",
      courses: [
        { code: "CS301", name: "Data Structures & Algorithms", grade: "A", credits: 4, points: 16 },
        { code: "MATH202", name: "Discrete Mathematics", grade: "A-", credits: 3, points: 11.1 },
        { code: "CS302", name: "Database Systems", grade: "B+", credits: 3, points: 9.9 },
        { code: "HUM101", name: "Critical Thinking", grade: "A", credits: 2, points: 8 },
      ],
      sgpa: "3.68",
      creditsCompleted: 12,
      totalPoints: 45
    },
    {
      semester: "Fall 2023",
      semesterCode: "FA23", 
      courses: [
        { code: "CS201", name: "Object-Oriented Programming", grade: "A", credits: 4, points: 16 },
        { code: "MATH101", name: "Calculus I", grade: "B+", credits: 4, points: 13.2 },
        { code: "PHY101", name: "Physics I", grade: "B", credits: 3, points: 9 },
      ],
      sgpa: "3.55",
      creditsCompleted: 11,
      totalPoints: 38.2
    }
  ];

  const currentSemesterData = semesterResults.find(sem => sem.semester === selectedSemester);

  const getGradeColor = (grade) => {
    switch(grade) {
      case 'A': return 'success';
      case 'A-': return 'success'; 
      case 'B+': return 'info';
      case 'B': return 'info';
      case 'B-': return 'warning';
      case 'C+': return 'warning';
      default: return 'error';
    }
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-text-primary">Academic Results</h1>
            <p className="text-text2">Semester-wise performance</p>
          </div>
          <Link 
            href="./cumulative"
            className="bg-primary hover:bg-primary-hover text-text-on-primary px-4 py-2 rounded-sm transition-colors"
          >
            View Cumulative Results
          </Link>
        </div>

        {/* Student Info */}
        <div className="bg-surface rounded-card shadow-medium border border-border p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-text2">Student Name</p>
              <p className="text-lg font-bold text-text-primary">{studentData.name}</p>
            </div>
            <div>
              <p className="text-sm text-text2">Student ID</p>
              <p className="text-lg font-bold text-text-primary">{studentData.studentId}</p>
            </div>
            <div>
              <p className="text-sm text-text2">Program</p>
              <p className="text-lg font-bold text-text-primary">{studentData.program}</p>
            </div>
          </div>
        </div>

        {/* Semester Selector */}
        <div className="bg-surface rounded-card shadow-medium border border-border p-4 mb-6">
          <h3 className="text-lg font-medium text-text-primary mb-3">Select Semester</h3>
          <div className="flex flex-wrap gap-2">
            {semesterResults.map((semester) => (
              <button
                key={semester.semester}
                onClick={() => setSelectedSemester(semester.semester)}
                className={`px-4 py-2 rounded-sm text-sm font-medium transition-colors ${
                  selectedSemester === semester.semester
                    ? 'bg-primary text-text-on-primary'
                    : 'bg-background2 text-text2 hover:bg-surface-elevated'
                }`}
              >
                {semester.semester}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Semester Results */}
        {currentSemesterData && (
          <div className="bg-surface rounded-card shadow-medium border border-border overflow-hidden">
            {/* Semester Header */}
            <div className="bg-surface-elevated px-6 py-4 border-b border-border">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold text-text-primary">{currentSemesterData.semester}</h2>
                  <p className="text-text2">Code: {currentSemesterData.semesterCode}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-text2">Semester GPA</p>
                  <p className="text-2xl font-bold text-text-primary">{currentSemesterData.sgpa}</p>
                </div>
              </div>
            </div>

            {/* Courses Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-background2 border-b border-border">
                    <th className="px-6 py-3 text-left text-xs font-medium text-text2 uppercase">Course</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text2 uppercase">Course Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text2 uppercase">Credits</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text2 uppercase">Grade</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text2 uppercase">Points</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {currentSemesterData.courses.map((course) => (
                    <tr key={course.code} className="hover:bg-background2 transition-colors">
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
                      <td className="px-6 py-4">
                        <div className="font-medium text-text-primary">{course.points}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-background2 border-t border-border">
                    <td colSpan="2" className="px-6 py-4 text-right font-medium text-text2">
                      Totals:
                    </td>
                    <td className="px-6 py-4 font-medium text-text-primary">
                      {currentSemesterData.creditsCompleted}
                    </td>
                    <td className="px-6 py-4"></td>
                    <td className="px-6 py-4 font-medium text-text-primary">
                      {currentSemesterData.totalPoints}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}