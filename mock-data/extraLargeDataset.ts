// mock-data/extraLargeDataset.ts
export const extraLargeComputationData = {
  status: "success",
  message: "Detailed computation summary retrieved with comprehensive dataset",
  data: {
    summary: {
      _id: "693adee538c99c7dc0f7d3ae",
      department: "692857cfc3c2904e51b75554",
      semester: {
        _id: "693a35ec41d3b37602b85457",
        name: "first",
        isActive: true,
        academicYear: "2024/2025",
        startDate: "2024-09-15T00:00:00.000Z",
        endDate: "2024-12-20T00:00:00.000Z",
        registrationDeadline: "2024-10-15T00:00:00.000Z",
        examStartDate: "2024-12-01T00:00:00.000Z",
        examEndDate: "2024-12-20T00:00:00.000Z"
      },
      masterComputationId: "693adee3fc294bba9766b41d",
      totalStudents: 1250,
      studentsWithResults: 1245,
      studentsProcessed: 1245,
      averageGPA: 3.42,
      highestGPA: 4.98,
      lowestGPA: 0.85,
      gradeDistribution: {
        firstClass: 85,
        secondClassUpper: 320,
        secondClassLower: 450,
        thirdClass: 280,
        fail: 110
      },
      carryoverStats: {
        totalCarryovers: 845,
        affectedStudentsCount: 310,
        affectedStudents: Array.from({length: 75}, (_, i) => ({
          studentId: `stud_${(1000 + i).toString().padStart(6, '0')}`,
          matricNumber: `CSC/2024/${(i + 1).toString().padStart(4, '0')}D`,
          name: `Student ${i + 1}`,
          courses: Array.from({length: Math.floor(Math.random() * 5) + 1}, (_, j) => 
            `course_${(j + 100).toString().padStart(3, '0')}`
          ),
          notes: `Failed ${Math.floor(Math.random() * 5) + 1} course(s)`,
          _id: `carry_${i}`,
          level: Math.floor(Math.random() * 4) + 100,
          cgpa: parseFloat((Math.random() * 5).toFixed(2)),
          previousCarryovers: Math.floor(Math.random() * 3),
          recommendation: Math.random() > 0.5 ? "Remedial classes" : "Academic counseling"
        }))
      },
      status: "completed",
      startedAt: "2024-12-11T08:00:00.000Z",
      retryCount: 2,
      computedBy: {
        _id: "690c70aa423136f152398166",
        name: "Prof. Michael Adebayo",
        email: "michael.adebayo@afued.edu.ng",
        role: "admin",
        department: "Academic Affairs",
        title: "Deputy Registrar (Academics)",
        signature: "/signatures/michael_adebayo.png",
        lastLogin: "2024-12-11T14:30:00.000Z"
      },
      failedStudents: Array.from({length: 110}, (_, i) => ({
        studentId: `stud_fail_${i}`,
        matricNumber: `FAIL/2024/${(i + 1).toString().padStart(4, '0')}`,
        name: `Failed Student ${i + 1}`,
        gpa: parseFloat((Math.random() * 1.5).toFixed(2)),
        coursesFailed: Math.floor(Math.random() * 5) + 1,
        previousAttempts: Math.floor(Math.random() * 3),
        interventionRequired: true,
        _id: `fail_${i}`
      })),
      passList: Array.from({length: 200}, (_, i) => ({
        studentId: `stud_pass_${i}`,
        matricNumber: `PASS/2024/${(i + 1).toString().padStart(4, '0')}`,
        name: `Passing Student ${i + 1}`,
        gpa: parseFloat((Math.random() * 3 + 1.5).toFixed(2)),
        academicClass: ["Third Class", "Second Lower", "Second Upper", "First Class"][Math.floor(Math.random() * 4)],
        performanceTrend: ["Improving", "Stable", "Declining"][Math.floor(Math.random() * 3)],
        _id: `pass_${i}`
      })),
      probationList: Array.from({length: 45}, (_, i) => ({
        studentId: `stud_prob_${i}`,
        matricNumber: `PROB/2024/${(i + 1).toString().padStart(4, '0')}`,
        name: `Probation Student ${i + 1}`,
        reason: ["CGPA below 1.50", "Multiple carryovers", "Attendance below 70%", "Disciplinary issues"][Math.floor(Math.random() * 4)],
        semesterOnProbation: Math.floor(Math.random() * 3) + 1,
        probationEndDate: "2025-06-30T00:00:00.000Z",
        conditions: ["Must pass all courses", "Attend counseling", "Maintain 75% attendance", "No further misconduct"],
        _id: `prob_${i}`
      })),
      withdrawalList: Array.from({length: 22}, (_, i) => ({
        studentId: `stud_withdraw_${i}`,
        matricNumber: `WITH/2024/${(i + 1).toString().padStart(4, '0')}`,
        name: `Withdrawn Student ${i + 1}`,
        reason: ["Voluntary withdrawal", "Medical reasons", "Financial constraints", "Personal reasons"][Math.floor(Math.random() * 4)],
        withdrawalDate: "2024-11-15T00:00:00.000Z",
        effectiveSemester: "First Semester 2024/2025",
        reentryPossible: Math.random() > 0.7,
        _id: `withdraw_${i}`
      })),
      terminationList: Array.from({length: 18}, (_, i) => ({
        studentId: `stud_term_${i}`,
        matricNumber: `TERM/2024/${(i + 1).toString().padStart(4, '0')}`,
        name: `Terminated Student ${i + 1}`,
        reason: "Excessive carryovers or poor performance",
        remarks: "terminated_carryover_limit",
        terminationDate: "2024-12-15T00:00:00.000Z",
        appealDeadline: "2025-01-15T00:00:00.000Z",
        appealProcess: "Submit appeal to Senate through HOD",
        _id: `term_${i}`,
        level: Math.floor(Math.random() * 4) + 100,
        cumulativeCarryovers: Math.floor(Math.random() * 10) + 5,
        finalCGPA: parseFloat((Math.random() * 1.5).toFixed(2)),
        department: ["Computer Science", "Mathematics", "Physics", "Chemistry", "Biology"][Math.floor(Math.random() * 5)],
        lastSemesterGPA: parseFloat((Math.random() * 1.5).toFixed(2))
      })),
      notifications: [
        {
          _id: "notif_001",
          type: "system_alert",
          message: "High failure rate detected in CSC 301: Data Structures (42% failure rate)",
          priority: "high",
          timestamp: "2024-12-11T15:15:00.000Z",
          actionRequired: true,
          assignedTo: "Departmental Board",
          deadline: "2024-12-20T00:00:00.000Z"
        },
        {
          _id: "notif_002",
          type: "academic_achievement",
          message: "15 students achieved perfect 5.00 GPA this semester",
          priority: "medium",
          timestamp: "2024-12-11T15:20:00.000Z",
          actionRequired: false,
          category: "recognition"
        },
        {
          _id: "notif_003",
          type: "compliance_warning",
          message: "7 termination cases require Senate approval before January 15, 2025",
          priority: "critical",
          timestamp: "2024-12-11T15:25:00.000Z",
          actionRequired: true,
          assignedTo: "Academic Affairs Division",
          deadline: "2025-01-15T00:00:00.000Z"
        },
        {
          _id: "notif_004",
          type: "resource_allocation",
          message: "Additional counseling sessions required for 45 probation students",
          priority: "medium",
          timestamp: "2024-12-11T15:30:00.000Z",
          actionRequired: true,
          assignedTo: "Student Affairs Department"
        },
        {
          _id: "notif_005",
          type: "system_performance",
          message: "Computation completed 25% faster than previous semester",
          priority: "low",
          timestamp: "2024-12-11T15:35:00.000Z",
          actionRequired: false
        }
      ],
      recommendations: [
        "Implement mandatory counseling for all students with GPA below 1.50",
        "Award Vice-Chancellor's Scholarship to top 15 performers",
        "Review and revise curriculum for courses with failure rates above 30%",
        "Organize intensive remedial classes during semester break",
        "Consider probation extension for 12 borderline cases",
        "Schedule emergency Departmental Board meeting for termination approvals",
        "Prepare letters of commendation for all first class students",
        "Allocate additional teaching assistants for large classes",
        "Implement early warning system for at-risk students",
        "Review and update grading rubrics for consistency across departments",
        "Organize workshop on study skills and time management",
        "Consider introducing peer tutoring program",
        "Review admission criteria for underperforming departments",
        "Implement digital learning resources for carryover courses",
        "Schedule regular academic performance reviews"
      ],
      createdAt: "2024-12-11T15:10:29.937Z",
      updatedAt: "2024-12-11T17:30:45.002Z",
      __v: 2,
      completedAt: "2024-12-11T17:30:45.002Z",
      duration: 9045000,
      qualityMetrics: {
        dataAccuracy: 99.8,
        processingSpeed: "2.5 hours",
        systemUptime: "99.9%",
        errorRate: 0.2,
        validationPassed: true,
        auditTrail: "Complete and verified"
      },
      backupInfo: {
        backupId: "backup_20241211_1730",
        location: "Secure Cloud Server A",
        size: "2.4 GB",
        encrypted: true,
        retentionPeriod: "7 years"
      }
    },
    analytics: {
      topPerformers: Array.from({length: 50}, (_, i) => ({
        rank: i + 1,
        studentId: `stud_top_${i}`,
        matricNumber: `TOP/2024/${(i + 1).toString().padStart(4, '0')}`,
        name: `Top Performer ${i + 1}`,
        gpa: parseFloat((4.5 + (Math.random() * 0.5)).toFixed(2)),
        cgpa: parseFloat((4.2 + (Math.random() * 0.8)).toFixed(2)),
        level: Math.floor(Math.random() * 4) + 100,
        department: ["Computer Science", "Mathematics", "Physics", "Chemistry", "Biology"][Math.floor(Math.random() * 5)],
        faculty: ["Science", "Arts", "Education"][Math.floor(Math.random() * 3)],
        achievements: ["Dean's List", "Departmental Award", "Research Grant", "Conference Presentation"][Math.floor(Math.random() * 4)],
        _id: `top_${i}`,
        performanceHistory: Array.from({length: 4}, (_, j) => ({
          semester: `${j + 1}00 Level`,
          gpa: parseFloat((4.0 + (Math.random() * 1.0)).toFixed(2)),
          rank: Math.floor(Math.random() * 10) + 1
        })),
        recommendation: i < 10 ? "Vice-Chancellor's Scholarship" : "Dean's Commendation"
      })),
      carryoverBreakdown: Array.from({length: 25}, (_, i) => ({
        _id: `break_${i}`,
        courseCode: `CSC ${300 + i}`,
        courseTitle: `Advanced ${["Algorithms", "Programming", "Database", "Networking", "Security"][Math.floor(Math.random() * 5)]} ${["I", "II", "III", "IV"][Math.floor(Math.random() * 4)]}`,
        failureCount: Math.floor(Math.random() * 100) + 20,
        percentage: parseFloat((Math.random() * 30 + 15).toFixed(1)),
        department: "Computer Science",
        level: 300 + Math.floor(i / 5),
        instructor: `Prof. ${["Ade", "Bello", "Chukwu", "Danjuma", "Eze"][Math.floor(Math.random() * 5)]}`,
        previousSemesterFailureRate: parseFloat((Math.random() * 40 + 10).toFixed(1)),
        trend: Math.random() > 0.5 ? "Increasing" : "Decreasing",
        actionPlan: ["Curriculum Review", "Additional Tutorials", "Exam Pattern Change", "Textbook Update"][Math.floor(Math.random() * 4)]
      })),
      gradeDistribution: {
        firstClass: 85,
        secondClassUpper: 320,
        secondClassLower: 450,
        thirdClass: 280,
        fail: 110
      },
      levelStats: {
        "100": {
          total: 350,
          passed: 280,
          failed: 70,
          averageGPA: 3.15,
          carryovers: 120,
          topPerformer: "Ada Johnson",
          topGPA: 4.95,
          departmentBreakdown: {
            "Computer Science": { total: 80, averageGPA: 3.45 },
            "Mathematics": { total: 70, averageGPA: 3.25 },
            "Physics": { total: 65, averageGPA: 3.10 },
            "Chemistry": { total: 70, averageGPA: 3.05 },
            "Biology": { total: 65, averageGPA: 3.00 }
          }
        },
        "200": {
          total: 320,
          passed: 260,
          failed: 60,
          averageGPA: 3.35,
          carryovers: 95,
          topPerformer: "Bola Ahmed",
          topGPA: 4.98,
          departmentBreakdown: {
            "Computer Science": { total: 75, averageGPA: 3.65 },
            "Mathematics": { total: 65, averageGPA: 3.40 },
            "Physics": { total: 60, averageGPA: 3.25 },
            "Chemistry": { total: 65, averageGPA: 3.20 },
            "Biology": { total: 55, averageGPA: 3.15 }
          }
        },
        "300": {
          total: 300,
          passed: 240,
          failed: 60,
          averageGPA: 3.55,
          carryovers: 80,
          topPerformer: "Chika Okoro",
          topGPA: 4.96,
          departmentBreakdown: {
            "Computer Science": { total: 70, averageGPA: 3.85 },
            "Mathematics": { total: 60, averageGPA: 3.60 },
            "Physics": { total: 55, averageGPA: 3.45 },
            "Chemistry": { total: 60, averageGPA: 3.40 },
            "Biology": { total: 55, averageGPA: 3.35 }
          }
        },
        "400": {
          total: 280,
          passed: 230,
          failed: 50,
          averageGPA: 3.65,
          carryovers: 65,
          topPerformer: "David Musa",
          topGPA: 4.97,
          departmentBreakdown: {
            "Computer Science": { total: 65, averageGPA: 3.95 },
            "Mathematics": { total: 55, averageGPA: 3.70 },
            "Physics": { total: 50, averageGPA: 3.55 },
            "Chemistry": { total: 55, averageGPA: 3.50 },
            "Biology": { total: 55, averageGPA: 3.45 }
          }
        }
      },
      departmentPerformance: {
        "Computer Science": {
          totalStudents: 290,
          averageGPA: 3.75,
          firstClass: 35,
          passRate: 92.5,
          rank: 1,
          trend: "Improving"
        },
        "Mathematics": {
          totalStudents: 250,
          averageGPA: 3.48,
          firstClass: 25,
          passRate: 89.2,
          rank: 2,
          trend: "Stable"
        },
        "Physics": {
          totalStudents: 230,
          averageGPA: 3.35,
          firstClass: 15,
          passRate: 86.7,
          rank: 3,
          trend: "Improving"
        },
        "Chemistry": {
          totalStudents: 250,
          averageGPA: 3.28,
          firstClass: 5,
          passRate: 84.3,
          rank: 4,
          trend: "Declining"
        },
        "Biology": {
          totalStudents: 230,
          averageGPA: 3.22,
          firstClass: 5,
          passRate: 82.9,
          rank: 5,
          trend: "Stable"
        }
      },
      timeSeriesAnalysis: {
        previousSemester: {
          totalStudents: 1200,
          averageGPA: 3.38,
          firstClass: 78,
          passRate: 87.2
        },
        sameSemesterLastYear: {
          totalStudents: 1150,
          averageGPA: 3.25,
          firstClass: 65,
          passRate: 85.1
        },
        fiveYearAverage: {
          averageGPA: 3.31,
          firstClass: 72,
          passRate: 86.4
        }
      },
      predictiveAnalytics: {
        nextSemesterProjection: {
          expectedStudents: 1280,
          projectedAverageGPA: 3.45,
          projectedFirstClass: 90,
          improvementFactors: ["New curriculum", "Enhanced counseling", "Digital resources"]
        },
        graduationProjection: {
          expectedGraduates: 1050,
          firstClassGraduates: 95,
          graduationRate: 84.0,
          employabilityScore: 88.5
        }
      }
    },
    metadata: {
      reportVersion: "2.1.0",
      generationMethod: "automated_batch",
      dataSource: "Student Information System v3.2",
      validationStatus: "verified",
      approvedBy: "Academic Affairs Committee",
      approvalDate: "2024-12-12T10:00:00.000Z",
      nextReviewDate: "2025-06-12T00:00:00.000Z",
      retentionPolicy: "Permanent - Academic Archive",
      accessLevel: "Restricted - Departmental Heads & Above",
      encryption: "AES-256",
      hashVerification: "a1b2c3d4e5f678901234567890abcdef"
    }
  },
  timestamp: "2024-12-11T17:45:48.659Z",
  requestId: "req_1234567890abcdef",
  responseTime: "245ms",
  apiVersion: "v2.0",
  pagination: {
    totalPages: 1,
    currentPage: 1,
    pageSize: "unlimited",
    totalRecords: 1245
  }
};