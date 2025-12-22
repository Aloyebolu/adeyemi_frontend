// mock-data/generateLargeComputationData.ts
import { faker } from '@faker-js/faker';

// Mock department and faculty data
const faculties = [
  {
    _id: "facu_001",
    name: "Faculty of Science",
    dean: "Prof. Ibrahim Adekunle",
    departments: ["Computer Science", "Mathematics", "Physics", "Chemistry", "Biology"]
  },
  {
    _id: "facu_002",
    name: "Faculty of Arts",
    dean: "Prof. Chinyere Okoro",
    departments: ["English", "History", "Philosophy", "Linguistics", "Theatre Arts"]
  },
  {
    _id: "facu_003",
    name: "Faculty of Education",
    dean: "Prof. Samuel Johnson",
    departments: ["Educational Foundation", "Curriculum Studies", "Educational Tech", "Adult Education", "Guidance & Counseling"]
  }
];

// Mock course data
const generateCourses = () => {
  const courses = [];
  const prefixes = ['CSC', 'MAT', 'PHY', 'CHM', 'BIO', 'ENG', 'HIS', 'PHI'];
  
  for (let i = 0; i < 50; i++) {
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    courses.push({
      _id: `course_${i.toString().padStart(3, '0')}`,
      code: `${prefix} ${(100 + i).toString()}`,
      title: `${faker.science.chemicalElement().name} ${faker.science.scienceUnit().name} ${faker.word.adjective()} Studies`,
      unit: Math.floor(Math.random() * 3) + 2,
      level: Math.floor(Math.random() * 4) + 100,
      isCoreCourse: Math.random() > 0.3
    });
  }
  return courses;
};

// Mock student data
const generateStudents = (count: number = 150) => {
  const students = [];
  
  for (let i = 1; i <= count; i++) {
    const faculty = faculties[Math.floor(Math.random() * faculties.length)];
    const deptName = faculty.departments[Math.floor(Math.random() * faculty.departments.length)];
    
    students.push({
      _id: `stud_${i.toString().padStart(6, '0')}`,
      name: faker.person.fullName(),
      matricNumber: `${deptName.substring(0, 3).toUpperCase()}/${(2020 + Math.floor(Math.random() * 4)).toString().slice(2)}/${i.toString().padStart(4, '0')}${Math.random() > 0.5 ? 'D' : 'F'}`,
      department: {
        _id: `dept_${deptName.substring(0, 3).toLowerCase()}`,
        name: deptName,
        code: deptName.substring(0, 3).toUpperCase(),
        faculty: {
          name: faculty.name,
          dean: faculty.dean
        }
      },
      level: Math.floor(Math.random() * 4) + 100,
      program: Math.random() > 0.5 ? "Full Time" : "Part Time",
      cgpa: parseFloat((Math.random() * 5).toFixed(2)),
      probationStatus: Math.random() > 0.8 ? "probation" : "none",
      terminationStatus: Math.random() > 0.95 ? "terminated" : "none"
    });
  }
  return students;
};

// Mock course results
const generateCourseResults = (studentId: string, courses: any[], isCarryover: boolean = false) => {
  const studentCourses = [];
  const courseCount = Math.floor(Math.random() * 8) + 4;
  
  for (let i = 0; i < courseCount; i++) {
    const course = courses[Math.floor(Math.random() * courses.length)];
    const score = Math.floor(Math.random() * 101);
    
    // Determine grade
    let grade = 'F';
    let gradePoint = 0;
    
    if (score >= 70) { grade = 'A'; gradePoint = 5; }
    else if (score >= 60) { grade = 'B'; gradePoint = 4; }
    else if (score >= 50) { grade = 'C'; gradePoint = 3; }
    else if (score >= 45) { grade = 'D'; gradePoint = 2; }
    else if (score >= 40) { grade = 'E'; gradePoint = 1; }
    
    studentCourses.push({
      courseId: course,
      courseCode: course.code,
      courseName: course.title,
      courseUnit: course.unit,
      score: score,
      grade: grade,
      gradePoint: gradePoint,
      isCoreCourse: course.isCoreCourse,
      isCarryover: isCarryover || (score < 40 && Math.random() > 0.7)
    });
  }
  return studentCourses;
};

// Generate complete computation summary with large dataset
export const generateLargeComputationData = () => {
  const courses = generateCourses();
  const allStudents = generateStudents(200);
  
  // Generate results for each student
  const studentResults = [];
  const carryoverStudents = [];
  const terminationStudents = [];
  const probationStudents = [];
  const topPerformers = [];
  
  for (const student of allStudents) {
    const isTerminated = student.terminationStatus === "terminated";
    const isProbation = student.probationStatus === "probation";
    const isTopPerformer = Math.random() > 0.9;
    
    const courseResults = generateCourseResults(student._id, courses);
    const carryoverCount = courseResults.filter(c => c.isCarryover).length;
    const totalUnits = courseResults.reduce((sum, course) => sum + course.courseUnit, 0);
    const totalPoints = courseResults.reduce((sum, course) => 
      sum + (course.gradePoint * course.courseUnit), 0
    );
    const gpa = totalUnits > 0 ? totalPoints / totalUnits : 0;
    
    const result = {
      _id: `result_${student._id}`,
      studentId: student,
      departmentId: student.department._id,
      semesterId: {
        _id: "sem_001",
        name: "First",
        semester: 1,
        academicYear: "2024/2025",
        startDate: "2024-09-15",
        endDate: "2024-12-20",
        isActive: true
      },
      courses: courseResults,
      gpa: parseFloat(gpa.toFixed(2)),
      cgpa: student.cgpa,
      totalUnits: totalUnits,
      totalPoints: totalPoints,
      carryoverCount: carryoverCount,
      remark: isTerminated ? "terminated" : 
              isProbation ? "probation" :
              gpa >= 4.5 ? "excellent" :
              gpa >= 3.5 ? "good" :
              gpa >= 2.4 ? "average" : "poor",
      status: "processed",
      computedBy: {
        name: "Dr. Michael Adebayo",
        email: "michael.adebayo@afued.edu.ng"
      },
      computationSummaryId: "comp_sum_001",
      createdAt: "2024-12-11T15:10:29.937Z",
      updatedAt: "2024-12-11T15:10:32.002Z"
    };
    
    studentResults.push(result);
    
    // Categorize students
    if (carryoverCount > 0 && !isTerminated) {
      carryoverStudents.push({
        studentId: student._id,
        matricNumber: student.matricNumber,
        name: student.name,
        courses: courseResults.filter(c => c.isCarryover).map(c => c.courseId._id),
        notes: `Failed ${carryoverCount} course(s)`,
        _id: `carry_${student._id}`
      });
    }
    
    if (isTerminated) {
      terminationStudents.push({
        studentId: student._id,
        matricNumber: student.matricNumber,
        name: student.name,
        reason: "Excessive carryovers or poor performance",
        remarks: "terminated_carryover_limit",
        _id: `term_${student._id}`
      });
    }
    
    if (isProbation && !isTerminated) {
      probationStudents.push({
        studentId: student._id,
        matricNumber: student.matricNumber,
        name: student.name,
        reason: "CGPA below 1.50 for two consecutive semesters",
        remarks: "academic_probation",
        _id: `prob_${student._id}`
      });
    }
    
    if (isTopPerformer && !isTerminated) {
      topPerformers.push({
        studentId: student._id,
        matricNumber: student.matricNumber,
        name: student.name,
        gpa: gpa,
        cgpa: student.cgpa,
        level: student.level,
        department: student.department.name,
        _id: `top_${student._id}`
      });
    }
  }
  
  // Calculate statistics
  const allGPAs = studentResults.map(r => r.gpa).filter(g => g > 0);
  const averageGPA = allGPAs.length > 0 ? 
    allGPAs.reduce((sum, g) => sum + g, 0) / allGPAs.length : 0;
  
  const gradeDistribution = {
    firstClass: studentResults.filter(r => r.gpa >= 4.5).length,
    secondClassUpper: studentResults.filter(r => r.gpa >= 3.5 && r.gpa < 4.5).length,
    secondClassLower: studentResults.filter(r => r.gpa >= 2.4 && r.gpa < 3.5).length,
    thirdClass: studentResults.filter(r => r.gpa >= 1.5 && r.gpa < 2.4).length,
    fail: studentResults.filter(r => r.gpa < 1.5).length
  };
  
  // Generate level-wise statistics
  const levelStats = {};
  allStudents.forEach(student => {
    const levelKey = `${student.level}00`;
    if (!levelStats[levelKey]) {
      levelStats[levelKey] = {
        total: 0,
        passed: 0,
        failed: 0,
        averageGPA: 0
      };
    }
    levelStats[levelKey].total++;
  });
  
  // Generate notifications
  const notifications = [
    {
      _id: "notif_001",
      type: "system_alert",
      message: "System detected 15 students with GPA below 1.00",
      priority: "high",
      timestamp: "2024-12-11T15:15:00.000Z"
    },
    {
      _id: "notif_002",
      type: "recommendation",
      message: "Consider scholarship for top 5 performers",
      priority: "medium",
      timestamp: "2024-12-11T15:20:00.000Z"
    },
    {
      _id: "notif_003",
      type: "warning",
      message: "7 termination cases require Senate approval",
      priority: "critical",
      timestamp: "2024-12-11T15:25:00.000Z"
    }
  ];
  
  // Generate recommendations
  const recommendations = [
    "Implement mandatory counseling for students with GPA below 1.50",
    "Award scholarships to top 10 performers",
    "Review curriculum for courses with high failure rates",
    "Organize remedial classes for carryover students",
    "Consider probation extension for 12 borderline cases",
    "Schedule Departmental Board meeting for termination approvals",
    "Prepare letters of commendation for excellent performers"
  ];
  
  // Generate carryover breakdown by course
  const carryoverBreakdown = [];
  const courseFailures = {};
  
  courses.forEach(course => {
    const failures = studentResults.filter(result => 
      result.courses.some(c => c.courseId._id === course._id && c.grade === 'F')
    ).length;
    
    if (failures > 0) {
      courseFailures[course._id] = failures;
    }
  });
  
  // Sort courses by failure count and take top 10
  Object.entries(courseFailures)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10)
    .forEach(([courseId, count], index) => {
      const course = courses.find(c => c._id === courseId);
      carryoverBreakdown.push({
        _id: `break_${index}`,
        courseCode: course.code,
        courseTitle: course.title,
        failureCount: count,
        percentage: parseFloat(((count / allStudents.length) * 100).toFixed(1))
      });
    });
  
  return {
    status: "success",
    message: "Detailed computation summary retrieved",
    data: {
      summary: {
        _id: "693adee538c99c7dc0f7d3ae",
        department: "692857cfc3c2904e51b75554",
        semester: {
          _id: "693a35ec41d3b37602b85457",
          name: "first",
          isActive: true
        },
        masterComputationId: "693adee3fc294bba9766b41d",
        totalStudents: allStudents.length,
        studentsWithResults: studentResults.length,
        studentsProcessed: studentResults.length,
        averageGPA: parseFloat(averageGPA.toFixed(2)),
        highestGPA: allGPAs.length > 0 ? Math.max(...allGPAs) : 0,
        lowestGPA: allGPAs.length > 0 ? Math.min(...allGPAs) : 5,
        gradeDistribution: gradeDistribution,
        carryoverStats: {
          totalCarryovers: carryoverStudents.reduce((sum, s) => 
            sum + s.courses.length, 0),
          affectedStudentsCount: carryoverStudents.length,
          affectedStudents: carryoverStudents.slice(0, 50) // Limit to 50 for readability
        },
        status: "completed",
        startedAt: "2024-12-11T08:00:00.000Z",
        retryCount: 0,
        computedBy: {
          _id: "690c70aa423136f152398166",
          name: "Prof. Mike Ross",
          email: "mike.ross@afued.edu.ng",
          role: "admin"
        },
        failedStudents: studentResults.filter(r => r.gpa < 1.5).slice(0, 30),
        passList: studentResults.filter(r => r.gpa >= 1.5).slice(0, 50),
        probationList: probationStudents.slice(0, 25),
        withdrawalList: Array.from({length: 8}, (_, i) => ({
          studentId: `stud_wd_${i}`,
          matricNumber: `WIT/${2024}/${(100 + i).toString().padStart(3, '0')}`,
          name: faker.person.fullName(),
          reason: "Voluntary withdrawal",
          remarks: "withdrawal_approved",
          _id: `withdraw_${i}`
        })),
        terminationList: terminationStudents.slice(0, 15),
        notifications: notifications,
        recommendations: recommendations,
        createdAt: "2024-12-11T15:10:29.937Z",
        updatedAt: "2024-12-11T17:30:45.002Z",
        __v: 1,
        completedAt: "2024-12-11T17:30:45.002Z",
        duration: 9045000 // 2.5 hours in milliseconds
      },
      analytics: {
        topPerformers: topPerformers.slice(0, 20),
        carryoverBreakdown: carryoverBreakdown,
        gradeDistribution: gradeDistribution,
        levelStats: levelStats
      }
    },
    timestamp: "2024-12-11T17:45:48.659Z"
  };
};

// Generate individual student transcript data
export const generateLargeStudentTranscriptData = (studentId?: string) => {
  const courses = generateCourses();
  const students = generateStudents(1);
  const student = studentId ? students.find(s => s._id === studentId) : students[0];
  
  // Generate multiple semesters of data
  const semesters = [
    {
      _id: "sem_100_1",
      name: "First",
      semester: 1,
      academicYear: "2020/2021",
      startDate: "2020-09-15",
      endDate: "2020-12-20",
      isActive: false
    },
    {
      _id: "sem_100_2",
      name: "Second",
      semester: 2,
      academicYear: "2020/2021",
      startDate: "2021-01-15",
      endDate: "2021-04-20",
      isActive: false
    },
    {
      _id: "sem_200_1",
      name: "First",
      semester: 1,
      academicYear: "2021/2022",
      startDate: "2021-09-15",
      endDate: "2021-12-20",
      isActive: false
    },
    {
      _id: "sem_200_2",
      name: "Second",
      semester: 2,
      academicYear: "2021/2022",
      startDate: "2022-01-15",
      endDate: "2022-04-20",
      isActive: false
    },
    {
      _id: "sem_300_1",
      name: "First",
      semester: 1,
      academicYear: "2022/2023",
      startDate: "2022-09-15",
      endDate: "2022-12-20",
      isActive: false
    },
    {
      _id: "sem_300_2",
      name: "Second",
      semester: 2,
      academicYear: "2022/2023",
      startDate: "2023-01-15",
      endDate: "2023-04-20",
      isActive: false
    },
    {
      _id: "sem_400_1",
      name: "First",
      semester: 1,
      academicYear: "2023/2024",
      startDate: "2023-09-15",
      endDate: "2023-12-20",
      isActive: true
    }
  ];
  
  const allSemesterResults = [];
  
  // Generate results for each semester
  for (const semester of semesters) {
    const isCurrent = semester._id === "sem_400_1";
    const courseResults = generateCourseResults(student._id, courses, !isCurrent && Math.random() > 0.7);
    
    // Add some carryovers from previous semesters
    if (!isCurrent && allSemesterResults.length > 0) {
      const previousResults = allSemesterResults[allSemesterResults.length - 1];
      const carryovers = previousResults.courses.filter(c => c.grade === 'F');
      if (carryovers.length > 0) {
        const randomCarryover = carryovers[Math.floor(Math.random() * carryovers.length)];
        courseResults.push({
          ...randomCarryover,
          isCarryover: true,
          score: Math.floor(Math.random() * 101) // Retake score
        });
      }
    }
    
    const totalUnits = courseResults.reduce((sum, course) => sum + course.courseUnit, 0);
    const totalPoints = courseResults.reduce((sum, course) => 
      sum + (course.gradePoint * course.courseUnit), 0
    );
    const gpa = totalUnits > 0 ? totalPoints / totalUnits : 0;
    
    allSemesterResults.push({
      _id: `result_${student._id}_${semester._id}`,
      studentId: student,
      departmentId: student.department._id,
      semesterId: semester,
      courses: courseResults,
      gpa: parseFloat(gpa.toFixed(2)),
      cgpa: parseFloat(((Math.random() * 1.5) + gpa).toFixed(2)), // Simulate cumulative
      totalUnits: totalUnits,
      totalPoints: totalPoints,
      carryoverCount: courseResults.filter(c => c.grade === 'F').length,
      remark: gpa >= 4.5 ? "excellent" :
              gpa >= 3.5 ? "good" :
              gpa >= 2.4 ? "average" :
              gpa >= 1.5 ? "poor" : "probation",
      status: "processed",
      computedBy: {
        name: "Dr. Michael Adebayo",
        email: "michael.adebayo@afued.edu.ng"
      },
      computationSummaryId: `comp_${semester._id}`,
      createdAt: semester.startDate.replace("15", "20") + "T15:10:29.937Z",
      updatedAt: semester.endDate.replace("20", "25") + "T15:10:32.002Z"
    });
  }
  
  // Calculate overall CGPA
  const totalAllUnits = allSemesterResults.reduce((sum, result) => sum + result.totalUnits, 0);
  const totalAllPoints = allSemesterResults.reduce((sum, result) => sum + result.totalPoints, 0);
  const overallCGPA = totalAllUnits > 0 ? totalAllPoints / totalAllUnits : 0;
  
  student.cgpa = parseFloat(overallCGPA.toFixed(2));
  
  return {
    student: student,
    results: allSemesterResults[allSemesterResults.length - 1], // Current semester
    semester: semesters.find(s => s.isActive) || semesters[semesters.length - 1],
    allResults: allSemesterResults,
    printDate: new Date().toLocaleDateString('en-GB')
  };
};

// Generate department statistics report
export const generateDepartmentStatisticsReport = () => {
  const courses = generateCourses();
  const students = generateStudents(300);
  const departments = {};
  
  // Group students by department
  students.forEach(student => {
    const deptCode = student.department.code;
    if (!departments[deptCode]) {
      departments[deptCode] = {
        name: student.department.name,
        code: deptCode,
        faculty: student.department.faculty.name,
        students: [],
        totalStudents: 0,
        averageCGPA: 0,
        graduationRate: 0
      };
    }
    departments[deptCode].students.push(student);
    departments[deptCode].totalStudents++;
  });
  
  // Calculate statistics for each department
  Object.values(departments).forEach((dept: any) => {
    const cgpas = dept.students.map(s => s.cgpa).filter(g => g > 0);
    dept.averageCGPA = cgpas.length > 0 ? 
      parseFloat((cgpas.reduce((a, b) => a + b, 0) / cgpas.length).toFixed(2)) : 0;
    
    const passingStudents = dept.students.filter(s => s.cgpa >= 1.5).length;
    dept.graduationRate = parseFloat(((passingStudents / dept.totalStudents) * 100).toFixed(1));
    
    // Add performance tiers
    dept.performanceTiers = {
      excellent: dept.students.filter(s => s.cgpa >= 4.5).length,
      good: dept.students.filter(s => s.cgpa >= 3.5 && s.cgpa < 4.5).length,
      average: dept.students.filter(s => s.cgpa >= 2.4 && s.cgpa < 3.5).length,
      poor: dept.students.filter(s => s.cgpa >= 1.5 && s.cgpa < 2.4).length,
      fail: dept.students.filter(s => s.cgpa < 1.5).length
    };
    
    // Add gender distribution (mock)
    dept.genderDistribution = {
      male: Math.floor(dept.totalStudents * 0.55),
      female: Math.floor(dept.totalStudents * 0.45)
    };
    
    // Add level distribution
    dept.levelDistribution = {
      '100': dept.students.filter(s => s.level === 100).length,
      '200': dept.students.filter(s => s.level === 200).length,
      '300': dept.students.filter(s => s.level === 300).length,
      '400': dept.students.filter(s => s.level === 400).length
    };
  });
  
  return {
    reportId: "dept_stats_001",
    generatedAt: new Date().toISOString(),
    academicYear: "2024/2025",
    semester: "First",
    summary: {
      totalDepartments: Object.keys(departments).length,
      totalStudents: students.length,
      universityAverageCGPA: parseFloat((Object.values(departments).reduce((sum: number, dept: any) => 
        sum + dept.averageCGPA, 0) / Object.keys(departments).length).toFixed(2)),
      overallGraduationRate: parseFloat(((students.filter(s => s.cgpa >= 1.5).length / students.length) * 100).toFixed(1))
    },
    departments: departments,
    facultyWiseAnalysis: faculties.map(faculty => {
      const facDepartments = Object.values(departments).filter((dept: any) => 
        faculty.departments.some(d => d.includes(dept.name.substring(0, 5)))
      );
      
      return {
        faculty: faculty.name,
        dean: faculty.dean,
        totalDepartments: facDepartments.length,
        totalStudents: facDepartments.reduce((sum: number, dept: any) => sum + dept.totalStudents, 0),
        averageCGPA: parseFloat((facDepartments.reduce((sum: number, dept: any) => 
          sum + dept.averageCGPA, 0) / facDepartments.length).toFixed(2)),
        graduationRate: parseFloat((facDepartments.reduce((sum: number, dept: any) => 
          sum + dept.graduationRate, 0) / facDepartments.length).toFixed(1))
      };
    }),
    topPerformingDepartments: Object.values(departments)
      .sort((a: any, b: any) => b.averageCGPA - a.averageCGPA)
      .slice(0, 5),
    recommendations: [
      "Department of Mathematics shows excellent performance (Avg CGPA: 4.15)",
      "Department of Chemistry requires academic intervention (Avg CGPA: 2.85)",
      "Consider resource allocation based on performance metrics",
      "Organize inter-departmental knowledge sharing sessions",
      "Review curriculum of underperforming departments"
    ]
  };
};