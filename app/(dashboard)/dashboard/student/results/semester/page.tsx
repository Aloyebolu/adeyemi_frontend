"use client"
import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import {
  Loader2,
  ChevronDown,
  ChevronUp,
  Calendar,
  Award,
  AlertTriangle,
  CheckCircle,
  FileText,
  Download,
  Printer,
  GraduationCap,
  User,
  BookOpen,
  BarChart3
} from 'lucide-react';
import { useDataFetcher } from '@/lib/dataFetcher';
import { useReactToPrint } from 'react-to-print';
import ResultPrint from '@/print-templates/ResultPrint';
import PrintPreviewPage from '@/components/print/PrintPreviewPage';
import { Button } from '@/components/placeholder/button';

export default function SemesterResult() {
  const [selectedSemester, setSelectedSemester] = useState(null);
  const [studentData, setStudentData] = useState(null);
  const [semesterResults, setSemesterResults] = useState([]);
  const [currentSemesterData, setCurrentSemesterData] = useState(null);
  const [selectedSemesterInfo, setSelectedSemesterInfo] = useState(null);
  const [loadingStudent, setLoadingStudent] = useState(true);
  const [loadingResults, setLoadingResults] = useState(false);
  const [error, setError] = useState(null);
  const [showSemesterDropdown, setShowSemesterDropdown] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [isSemesterInfoOpen, setIsSemesterInfoOpen] = useState(false);

  const printRef = useRef();
  const { fetchData } = useDataFetcher();

  // Configure React-To-Print
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: studentData && selectedSemesterInfo
      ? `Result-${studentData.matricNumber}-${selectedSemesterInfo.semester}-${selectedSemesterInfo.academicYear}`
      : 'Semester-Result',
    pageStyle: `
      @page {
        size: A4 portrait;
        margin: 20mm;
      }
      @media print {
        body {
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
      }
    `,
    onBeforePrint: () => {
      console.log('Printing started...');
      setIsPrinting(true);
    },
    onAfterPrint: () => {
      console.log('Printing completed!');
      setIsPrinting(false);
    }
  });

  // Fetch student data on component mount
  useEffect(() => {
    fetchStudentData();
  }, []);

  // Fetch results when semester is selected
  useEffect(() => {
    if (selectedSemester) {
      fetchSemesterResults(selectedSemester);
    }
  }, [selectedSemester]);

  const fetchStudentData = async () => {
    try {
      setLoadingStudent(true);
      setError(null);

      const { data } = await fetchData('/student/profile');

      setStudentData(data[0]);
      setSemesterResults(data[0].semesters || []);

      // Auto-select current/active semester
      const currentSem = data[0].semesters[0];
      if (currentSem) {
        setSelectedSemester(currentSem._id);
        setSelectedSemesterInfo(currentSem);
      }

    } catch (err) {
      setError(err.message);
      console.error('Error fetching student data:', err);
    } finally {
      setLoadingStudent(false);
    }
  };

  const fetchSemesterResults = async (semesterId) => {
    try {
      setLoadingResults(true);
      setError(null);

      const { data } = await fetchData(`/student/result/:semesterId=${semesterId}`);

      // Also get the semester info for printing
      const semesterInfo = semesterResults.find(s => s._id === semesterId);
      setSelectedSemesterInfo(semesterInfo);

      setCurrentSemesterData(data);

    } catch (err) {
      setError(err.message);
      console.error('Error fetching semester results:', err);
    } finally {
      setLoadingResults(false);
    }
  };

  const handleSemesterSelect = (semesterId) => {
    setSelectedSemester(semesterId);
    const semesterInfo = semesterResults.find(s => s._id === semesterId);
    setSelectedSemesterInfo(semesterInfo);
    setShowSemesterDropdown(false);
  };

  const handleDownloadPDF = async () => {
    try {
      const response = await fetch(`/api/student/semester-result/pdf?semesterId=${selectedSemester}`);
      if (!response.ok) throw new Error('Failed to generate PDF');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `result-${selectedSemester}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError('Failed to download PDF');
      console.error('Error downloading PDF:', err);
    }
  };

  const handlePrintClick = async () => {
    try {
      setIsPrinting(true);
      await handlePrint();
    } catch (err) {
      console.error('Printing failed:', err);
      setError('Failed to print. Please try again.');
    } finally {
      setIsPrinting(false);
    }
  };

  const getGradeColor = (grade) => {
    switch (grade) {
      case 'A': return 'bg-green-100 text-green-800 border border-green-200';
      case 'B': return 'bg-blue-100 text-blue-800 border border-blue-200';
      case 'C': return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
      case 'D': return 'bg-orange-100 text-orange-800 border border-orange-200';
      case 'F': return 'bg-red-100 text-red-800 border border-red-200';
      default: return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  const getAcademicStatus = (probationStatus, terminationStatus, remark) => {
    if (terminationStatus !== 'none') {
      return {
        label: terminationStatus === 'withdrawn' ? 'Withdrawn' : 'Terminated',
        color: 'bg-red-50 text-red-700 border border-red-200',
        icon: <AlertTriangle className="w-4 h-4" />
      };
    }

    if (probationStatus === 'probation') {
      return {
        label: 'On Probation',
        color: 'bg-orange-50 text-orange-700 border border-orange-200',
        icon: <AlertTriangle className="w-4 h-4" />
      };
    }

    if (remark === 'excellent') {
      return {
        label: 'Excellent',
        color: 'bg-green-50 text-green-700 border border-green-200',
        icon: <Award className="w-4 h-4" />
      };
    }

    return {
      label: 'Good Standing',
      color: 'bg-blue-50 text-blue-700 border border-blue-200',
      icon: <CheckCircle className="w-4 h-4" />
    };
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loadingStudent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="w-16 h-16 animate-spin text-primary mx-auto mb-6" />
          <p className="text-gray-600 text-lg">Loading your academic profile...</p>
        </div>
      </div>
    );
  }

  if (error && !studentData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-6" />
          <h3 className="text-xl font-semibold text-gray-900 mb-3 text-center">Unable to load results</h3>
          <p className="text-gray-600 mb-6 text-center">{error}</p>
          <div className="flex justify-center">
            <button
              onClick={fetchStudentData}
              className="bg-gradient-to-r from-primary to-primary-dark text-white px-6 py-3 rounded-xl hover:opacity-90 transition-all font-medium"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {isPrinting ? (
        <PrintPreviewPage>
          <ResultPrint
            student={studentData}
            results={currentSemesterData}
            semester={selectedSemesterInfo}
            printDate={new Date().toLocaleDateString()}
          />
        </PrintPreviewPage>
      ) : (
        <div className="min-h-screen ">
          {/* Header */}
          <div className="b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold">Academic Results</h1>
                  <p className="80 mt-1">Track your semester-wise performance</p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <Link
                    href="/results/cumulative"
                    className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm px-5 py-2.5 rounded-xl font-medium transition-all hover:scale-105"
                  >
                    <BarChart3 className="w-4 h-4" />
                    Cumulative View
                  </Link>

                  {selectedSemester && studentData && currentSemesterData && selectedSemesterInfo && (
                    <>
                      <Button
                        onClick={handleDownloadPDF}
                        className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm px-5 py-2.5 rounded-xl font-medium transition-all hover:scale-105"
                      >
                        <Download className="w-4 h-4" />
                        Download PDF
                      </Button>

                      <button
                        onClick={() => setIsPrinting(true)}
                        disabled={!currentSemesterData || isPrinting}
                        className="inline-flex items-center gap-2 bg-white text-primary hover:bg-gray-50 px-5 py-2.5 rounded-xl font-medium transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isPrinting ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Printer className="w-4 h-4" />
                        )}
                        {isPrinting ? 'Printing...' : 'Print Result'}
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Student Profile Card */}
            {studentData && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden mb-8">
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="bg-gradient-to-br from-primary/10 to-primary/5 p-3 rounded-xl">
                          <GraduationCap className="w-8 h-8 text-primary" />
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold text-gray-900">{studentData.name}</h2>
                          <p className="text-gray-600">Student Profile</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-gray-500">
                            <User className="w-4 h-4" />
                            <span className="text-sm font-medium">Matric Number</span>
                          </div>
                          <p className="font-semibold text-gray-900 text-lg">{studentData.matric_no}</p>
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-gray-500">
                            <BookOpen className="w-4 h-4" />
                            <span className="text-sm font-medium">Program</span>
                          </div>
                          <p className="font-semibold text-gray-900 text-lg">{studentData.program || studentData.department?.name}</p>
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-gray-500">
                            <span className="text-sm font-medium">Level</span>
                          </div>
                          <p className="font-semibold text-gray-900 text-lg">Level {studentData.level}</p>
                        </div>
                      </div>
                    </div>

                    {studentData && (
                      <div className="flex flex-col sm:flex-row lg:flex-col gap-4">
                        <div className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl p-4 min-w-[140px]">
                          <p className="text-sm text-gray-500 mb-2">Current CGPA</p>
                          <p className="text-3xl font-bold text-gray-900">
                            {studentData.cgpa?.toFixed(2) || 'N/A'}
                          </p>
                        </div>

                        <div className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl p-4 min-w-[140px]">
                          <p className="text-sm text-gray-500 mb-2">Academic Status</p>
                          <div className="mt-1">
                            {(() => {
                              const status = getAcademicStatus(
                                studentData.probationStatus,
                                studentData.terminationStatus,
                                currentSemesterData?.remark
                              );
                              return (
                                <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium ${status.color}`}>
                                  {status.icon}
                                  {status.label}
                                </span>
                              );
                            })()}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Semester Selector Dropdown */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 mb-8">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-br from-primary/10 to-primary/5 p-2 rounded-lg">
                      <Calendar className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Select Semester</h3>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <span className="text-sm bg-gray-100 px-3 py-1 rounded-full">
                      {semesterResults.length} semesters
                    </span>
                  </div>
                </div>

                {semesterResults.length > 0 ? (
                  <div className="relative">
                    <button
                      onClick={() => setShowSemesterDropdown(!showSemesterDropdown)}
                      className="w-full flex items-center justify-between bg-gray-50 hover:bg-gray-100 border-2 border-gray-200 rounded-xl px-5 py-4 text-left transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="bg-primary/10 p-2 rounded-lg">
                          <Calendar className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <span className="font-semibold text-gray-900 text-lg">
                            {selectedSemesterInfo ?
                              selectedSemesterInfo.name || selectedSemesterInfo.semester :
                              'Select a semester'
                            }
                          </span>
                          {selectedSemesterInfo && (
                            <p className="text-sm text-gray-600 mt-1">
                              {formatDate(selectedSemesterInfo.startDate)} - {formatDate(selectedSemesterInfo.endDate)}
                              {selectedSemesterInfo.gpa && ` • GPA: ${selectedSemesterInfo.gpa.toFixed(2)}`}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {selectedSemesterInfo?.isCurrent && (
                          <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                            Current
                          </span>
                        )}
                        <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${showSemesterDropdown ? 'rotate-180' : ''}`} />
                      </div>
                    </button>

                    {showSemesterDropdown && (
                      <div className="absolute z-20 w-full mt-2 bg-white border border-gray-300 rounded-xl shadow-xl max-h-80 overflow-auto">
                        {semesterResults.map((semester) => (
                          <button
                            key={semester._id}
                            onClick={() => handleSemesterSelect(semester._id)}
                            className={`w-full text-left p-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 ${selectedSemester === semester._id ? 'bg-primary/5' : ''
                              }`}
                          >
                            <div className="flex justify-between items-center">
                              <div>
                                <div className="font-semibold text-gray-900">{semester.name || semester.semester}</div>
                                <div className="text-sm text-gray-600 mt-1">
                                  {formatDate(semester.startDate)} - {formatDate(semester.endDate)}
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                {semester.gpa && (
                                  <span className={`px-2.5 py-1 rounded-lg text-sm font-medium ${selectedSemester === semester._id ? 'bg-primary text-white' : 'bg-gray-100 text-gray-800'
                                    }`}>
                                    GPA: {semester.gpa.toFixed(2)}
                                  </span>
                                )}
                                {semester.isCurrent && (
                                  <span className="px-2.5 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-lg">
                                    Current
                                  </span>
                                )}
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <p>No semester results available</p>
                  </div>
                )}
              </div>
            </div>

            {/* Selected Semester Results */}
            {loadingResults ? (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-12 text-center">
                <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
                <p className="text-gray-600">Loading semester results...</p>
              </div>
            ) : error && selectedSemester ? (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="text-center py-12">
                  <AlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-6" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Unable to load results</h3>
                  <p className="text-gray-600 mb-6">{error}</p>
                  <button
                    onClick={() => fetchSemesterResults(selectedSemester)}
                    className="bg-gradient-to-r from-primary to-primary-dark text-white px-6 py-3 rounded-xl hover:opacity-90 transition-all font-medium"
                  >
                    Retry
                  </button>
                </div>
              </div>
            ) : currentSemesterData ? (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                {/* Semester Header */}
                <div className="">
                  <div className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div>
                        <h2 className="text-2xl font-bold">{selectedSemesterInfo?.name + ' Semester Results'}</h2>
                        <p className="text-white/90 mt-1">
                          {selectedSemesterInfo?.academicYear || ''}
                          {currentSemesterData.computedAt && ` • Computed on ${formatDate(currentSemesterData.computedAt)}`}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-4">
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 min-w-[120px] text-center">
                          <p className="text-sm mb-2">Semester GPA</p>
                          <p className="text-3xl font-bold">{currentSemesterData.gpa?.toFixed(2) || 'N/A'}</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 min-w-[120px] text-center">
                          <p className="text-sm">Cumulative GPA</p>
                          <p className="text-3xl font-bold">{currentSemesterData.cgpa?.toFixed(2) || 'N/A'}</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 min-w-[120px] text-center">
                          <p className="text-sm">Total Units</p>
                          <p className="text-3xl font-bold">{currentSemesterData.totalUnits || 0}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Academic Standing */}
                {currentSemesterData.remark && (
                  <div className="p-6 bg-gradient-to-r from-gray-50 to-white border-b border-gray-200">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      <div className="flex items-center gap-3">
                        <span className="font-semibold text-gray-900">Academic Remark:</span>
                        <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium ${currentSemesterData.remark === 'excellent' ? 'bg-green-50 text-green-700 border border-green-200' :
                            currentSemesterData.remark === 'good' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                              currentSemesterData.remark === 'probation' ? 'bg-orange-50 text-orange-700 border border-orange-200' :
                                'bg-red-50 text-red-700 border border-red-200'
                          }`}>
                          {currentSemesterData.remark === 'excellent' && <Award className="w-4 h-4" />}
                          {currentSemesterData.remark === 'probation' && <AlertTriangle className="w-4 h-4" />}
                          {currentSemesterData.remark.charAt(0).toUpperCase() + currentSemesterData.remark.slice(1)}
                        </span>
                      </div>

                      {currentSemesterData.carryoverCount > 0 && (
                        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-yellow-50 text-yellow-700 border border-yellow-200">
                          <AlertTriangle className="w-4 h-4" />
                          {currentSemesterData.carryoverCount} carryover course(s)
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Semester Details Toggle */}
                <div className="border-b border-gray-200">
                  <button
                    onClick={() => setIsSemesterInfoOpen(!isSemesterInfoOpen)}
                    className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <span className="font-medium text-gray-900">Semester Details</span>
                    {isSemesterInfoOpen ? (
                      <ChevronUp className="w-5 h-5 text-gray-500" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-500" />
                    )}
                  </button>
                  
                  {isSemesterInfoOpen && (
                    <div className="px-6 pb-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-gray-50 rounded-xl p-4">
                          <p className="text-sm text-gray-500 mb-1">Total Courses</p>
                          <p className="text-2xl font-bold text-gray-900">{currentSemesterData.courses?.length || 0}</p>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-4">
                          <p className="text-sm text-gray-500 mb-1">Total Points</p>
                          <p className="text-2xl font-bold text-gray-900">{currentSemesterData.totalPoints?.toFixed(1) || '0.0'}</p>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-4">
                          <p className="text-sm text-gray-500 mb-1">Average Score</p>
                          <p className="text-2xl font-bold text-gray-90">
                            {currentSemesterData.courses?.reduce((sum, course) => sum + course.score, 0) / (currentSemesterData.courses?.length || 1) || 0}%
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Courses Table */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Course
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Title
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Credits
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Score
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Grade
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Points
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {currentSemesterData.courses?.map((course, index) => (
                        <tr
                          key={course.courseId?._id || index}
                          className="hover:bg-gray-50/50 transition-colors"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="font-semibold text-gray-900">
                              {course.courseId?.courseCode || course.courseCode}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-gray-900">{course.courseId?.title || course.courseName}</div>
                            {course.isCoreCourse && (
                              <span className="inline-block mt-1 px-2.5 py-0.5 text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200 rounded-lg">
                                Core Course
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="font-medium text-gray-900 bg-gray-50 px-3 py-1.5 rounded-lg">
                              {course.courseUnit}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="font-semibold text-gray-900">{course.score}%</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-3 py-1.5 rounded-lg text-sm font-semibold ${getGradeColor(course.grade)}`}>
                              {course.grade}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="font-semibold text-gray-900 bg-gray-50 px-3 py-1.5 rounded-lg">
                              {(course.gradePoint * course.courseUnit).toFixed(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {course.isCarryover ? (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-yellow-50 text-yellow-700 border border-yellow-200">
                                <AlertTriangle className="w-3 h-3" />
                                Carryover
                              </span>
                            ) : (
                              <span className="inline-flex px-3 py-1.5 rounded-lg text-sm font-medium bg-green-50 text-green-700 border border-green-200">
                                Regular
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-gradient-to-r from-gray-50 to-white">
                      <tr>
                        <td colSpan="2" className="px-6 py-4 text-right font-semibold text-gray-700">
                           Totals &rarr;
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-bold text-gray-900 text-lg">{currentSemesterData.totalUnits}</span>
                        </td>
                        <td className="px-6 py-4"></td>
                        <td className="px-6 py-4"></td>
                        <td className="px-6 py-4">
                          <span className="font-bold text-gray-900 text-lg">{currentSemesterData.totalPoints?.toFixed(1) || '0.0'}</span>
                        </td>
                        <td className="px-6 py-4">
                          {currentSemesterData.carryoverCount > 0 ? (
                            <span className="text-sm text-yellow-600 font-medium">
                              {currentSemesterData.carryoverCount} carryover course(s)
                            </span>
                          ) : (
                            <span className="text-sm text-green-600 font-medium">All cleared ✓</span>
                          )}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                {/* Legend */}
                <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-white border-t border-gray-200">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <span className="font-semibold text-gray-700">Grade Legend:</span>
                    <div className="flex flex-wrap items-center gap-3">
                      {['A', 'B', 'C', 'D', 'F'].map(grade => (
                        <div key={grade} className="flex items-center gap-2">
                          <span className={`w-3 h-3 rounded-full ${getGradeColor(grade).split(' ')[0].replace('bg-', 'bg-').replace('100', '500')}`}></span>
                          <span className="text-gray-600 text-sm">
                            {grade} ({grade === 'A' ? '5' : grade === 'B' ? '4' : grade === 'C' ? '3' : grade === 'D' ? '2' : '0'} points)
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : selectedSemester && !currentSemesterData && !loadingResults ? (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-12 text-center">
                <FileText className="w-16 h-16 mx-auto mb-6 text-gray-300" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No results found</h3>
                <p className="text-gray-600">No results available for the selected semester</p>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </>
  );
}