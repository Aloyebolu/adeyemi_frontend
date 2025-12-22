"use client";

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/Button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Users, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle, 
  XCircle, 
  Award,
  Clock,
  User,
  GraduationCap,
  FileText,
  BarChart3,
  History,
  Calendar,
  Filter,
  RefreshCw,
  ExternalLink,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import toast from 'react-hot-toast';
import { useDataFetcher } from '@/lib/dataFetcher';
// import { useToast } from '@/components/ui/use-toast';

// Types based on API structure
interface ComputationSummary {
  _id: string;
  semester: {
    _id: string;
    name: string;
    isActive: boolean;
  };
  totalStudents: number;
  studentsWithResults: number;
  studentsProcessed: number;
  averageGPA: number;
  highestGPA: number;
  lowestGPA: number;
  gradeDistribution: {
    firstClass: number;
    secondClassUpper: number;
    secondClassLower: number;
    thirdClass: number;
    fail: number;
  };
  carryoverStats: {
    totalCarryovers: number;
    affectedStudentsCount: number;
    affectedStudents: Array<{
      studentId: string | null;
      matricNumber: string;
      name: string;
      courses: string[];
      notes: string;
      _id: string;
    }>;
  };
  status: 'processing' | 'completed' | 'failed';
  startedAt: string;
  completedAt: string;
  computedBy: {
    _id: string;
    name: string;
    email: string;
    role: string;
  };
  terminationList: Array<{
    studentId: string | null;
    matricNumber: string;
    name: string;
    reason: string;
    remarks: string;
    _id: string;
  }>;
  duration: number;
}

interface ComputationHistoryItem {
  _id: string;
  semester: {
    _id: string;
    name: string;
  };
  status: string;
  totalStudents: number;
  averageGPA: number;
  startedAt: string;
  completedAt: string;
  computedBy: {
    name: string;
  };
}

interface Semester {
  _id: string;
  name: string;
  isActive: boolean;
  academicYear: string;
}

// Fallback data
const fallbackSummary: ComputationSummary = {
  _id: "693adee538c99c7dc0f7d3ae",
  semester: {
    _id: "693a35ec41d3b37602b85457",
    name: "first",
    isActive: true
  },
  totalStudents: 20,
  studentsWithResults: 1,
  studentsProcessed: 0,
  averageGPA: 0,
  highestGPA: 0,
  lowestGPA: 5,
  gradeDistribution: {
    firstClass: 0,
    secondClassUpper: 0,
    secondClassLower: 0,
    thirdClass: 0,
    fail: 1
  },
  carryoverStats: {
    totalCarryovers: 1,
    affectedStudentsCount: 1,
    affectedStudents: [
      {
        studentId: null,
        matricNumber: "CSC/2024/0001D",
        name: "Adewale Ojo",
        courses: ["692fb82c1cddeff2e93a32c9"],
        notes: "Failed 1 course(s)",
        _id: "693adee738c99c7dc0f7d648"
      }
    ]
  },
  status: "completed",
  startedAt: "2025-12-11T15:10:29.923Z",
  completedAt: "2025-12-11T15:10:31.999Z",
  computedBy: {
    _id: "690c70aa423136f152398166",
    name: "Mike Ross",
    email: "mike@school.edu",
    role: "admin"
  },
  terminationList: [
    {
      studentId: null,
      matricNumber: "CSC/2024/0001D",
      name: "Adewale Ojo",
      reason: "Excessive carryovers or poor performance",
      remarks: "terminated_carryover_limit",
      _id: "693adee738c99c7dc0f7d647"
    }
  ],
  duration: 2076
};

// Status badge component
const StatusBadge = ({ status }: { status: string }) => {
  const statusConfig: Record<string, { variant: "default" | "secondary" | "destructive" | "outline" | "success", label: string, icon: any }> = {
    processing: { variant: "secondary", label: "Processing", icon: RefreshCw },
    completed: { variant: "success", label: "Completed", icon: CheckCircle },
    failed: { variant: "destructive", label: "Failed", icon: XCircle },
  };
  
  const config = statusConfig[status] || { variant: "default", label: status, icon: null };
  const Icon = config.icon;
  
  return (
    <Badge variant={config.variant} className="capitalize gap-1">
      {Icon && <Icon className="h-3 w-3" />}
      {config.label}
    </Badge>
  );
};

// Stat card component
const StatCard = ({ 
  title, 
  value, 
  icon: Icon, 
  description, 
  color = "primary",
  loading = false
}: { 
  title: string; 
  value: string | number; 
  icon: any; 
  description?: string;
  color?: string;
  loading?: boolean;
}) => (
  <Card className="relative overflow-hidden hover:shadow-medium transition-all duration-200">
    <CardHeader className="pb-2">
      <div className="flex items-center justify-between">
        <CardTitle className="text-sm font-medium text-text2">{title}</CardTitle>
        <div className={`p-2 rounded-lg bg-${color}-10`}>
          <Icon className={`h-4 w-4 text-${color}`} />
        </div>
      </div>
    </CardHeader>
    <CardContent>
      {loading ? (
        <Skeleton className="h-8 w-24 mb-2" />
      ) : (
        <div className="text-2xl font-bold text-text-primary">{value}</div>
      )}
      {description && (
        <p className="text-xs text-text2 mt-1">{description}</p>
      )}
    </CardContent>
  </Card>
);

export default function HODComputationDashboard() {
  const [activeView, setActiveView] = useState<'summary' | 'history'>('summary');
  const [selectedSummaryId, setSelectedSummaryId] = useState<string | null>(null);
  const [selectedSemester, setSelectedSemester] = useState<string>('');
  const [summaryData, setSummaryData] = useState<ComputationSummary | null>(null);
  const [historyData, setHistoryData] = useState<ComputationHistoryItem[]>([]);
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [loading, setLoading] = useState({
    summary: false,
    history: false,
    semesters: false
  });
  const [error, setError] = useState<string | null>(null);
  const [useFallback, setUseFallback] = useState(false);
  const {fetchData} = useDataFetcher()
//   const { toast } = useToast();

  // Fetch semesters
  const fetchSemesters = useCallback(async () => {
    try {
      setLoading(prev => ({ ...prev, semesters: true }));
      const response = await fetchData('/computation/hod/semesters')
  
      const data = await response
      setSemesters(data.data || []);
      if (data.data?.length > 0) {
        setSelectedSemester(data.data[0]._id);
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to load semesters",
        variant: "destructive"
      });
      setError('Failed to load semesters');
    } finally {
      setLoading(prev => ({ ...prev, semesters: false }));
    }
  }, [toast]);

  // Fetch computation summary
  const fetchSummary = useCallback(async (semesterId?: string) => {
    try {
      setLoading(prev => ({ ...prev, summary: true }));
      setError(null);
      setUseFallback(false);
      
      const url = semesterId 
        ? `/computation/hod/summary?semester=${semesterId}`
        : '/computation/hod/summary';
      
      const response = await fetchData(url);
      
      
      const data = await response
      setSummaryData(data.data?.summary || fallbackSummary);
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to load computation summary",
        variant: "destructive"
      });
      setError('Using fallback data due to API error');
      setUseFallback(true);
      setSummaryData(fallbackSummary);
    } finally {
      setLoading(prev => ({ ...prev, summary: false }));
    }
  }, [toast]);

  // Fetch computation history
  const fetchHistory = useCallback(async () => {
    try {
      setLoading(prev => ({ ...prev, history: true }));
      const response = await fetchData('/computation/hod/history');
      const data = await response
      setHistoryData(data.data || []);
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to load computation history",
        variant: "destructive"
      });
      setError('Failed to load history');
    } finally {
      setLoading(prev => ({ ...prev, history: false }));
    }
  }, [toast]);

  // Fetch specific summary details
  const fetchSummaryDetails = useCallback(async (summaryId: string) => {
    try {
      setLoading(prev => ({ ...prev, summary: true }));
      const response = await fetchData(`/computation/hod/summary/${summaryId}`);

      const data = await response
      setSummaryData(data.data?.summary || fallbackSummary);
      setActiveView('summary');
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to load computation details",
        variant: "destructive"
      });
    } finally {
      setLoading(prev => ({ ...prev, summary: false }));
    }
  }, [toast]);

  // Initial data fetch
  useEffect(() => {
    fetchSemesters();
    fetchSummary();
    fetchHistory();
  }, [fetchSemesters, fetchSummary, fetchHistory]);

  // Handle semester change
  useEffect(() => {
    if (selectedSemester) {
      fetchSummary(selectedSemester);
    }
  }, [selectedSemester, fetchSummary]);

  // Handle refresh
  const handleRefresh = () => {
    if (activeView === 'summary') {
      fetchSummary(selectedSemester);
    } else {
      fetchHistory();
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Format duration
  const formatDuration = (ms: number) => {
    return `${(ms / 1000).toFixed(2)} seconds`;
  };

  const data = summaryData || fallbackSummary;
  const gradeDistribution = data.gradeDistribution;

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header with Navigation */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-text-primary">Computation Dashboard</h1>
            <p className="text-text2 mt-2">
              Academic computation results and history for HOD review
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            {/* View Toggle */}
            <div className="flex rounded-lg border border-border overflow-hidden">
              <Button
                variant={activeView === 'summary' ? 'default' : 'ghost'}
                className={`rounded-none ${activeView === 'summary' ? 'bg-primary text-text-on-primary' : ''}`}
                onClick={() => setActiveView('summary')}
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                Summary
              </Button>
              <Button
                variant={activeView === 'history' ? 'default' : 'ghost'}
                className={`rounded-none ${activeView === 'history' ? 'bg-primary text-text-on-primary' : ''}`}
                onClick={() => setActiveView('history')}
              >
                <History className="h-4 w-4 mr-2" />
                History
              </Button>
            </div>
            
            <Button variant="outline" onClick={handleRefresh} disabled={loading.summary || loading.history}>
              <RefreshCw className={`h-4 w-4 mr-2 ${loading.summary || loading.history ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Error Banner */}
        {error && (
          <Card className="border-error/20 bg-error/5">
            <CardContent className="p-4 flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-error" />
              <div className="flex-1">
                <p className="text-error font-medium">{error}</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => setError(null)}>
                Dismiss
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Semester Filter (Summary View Only) */}
        {activeView === 'summary' && semesters.length > 0 && (
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-text2" />
                  <div>
                    <p className="font-medium text-text-primary">Select Semester</p>
                    <p className="text-sm text-text2">View computation results for specific semesters</p>
                  </div>
                </div>
                <Select value={selectedSemester} onValueChange={setSelectedSemester} disabled={loading.semesters}>
                  <SelectTrigger className="w-full sm:w-[280px]">
                    <SelectValue placeholder="Select semester" />
                  </SelectTrigger>
                  <SelectContent>
                    {semesters.map((semester) => (
                      <SelectItem key={semester._id} value={semester._id}>
                        <div className="flex items-center justify-between">
                          <span className="capitalize">{semester.name} Semester</span>
                          {semester.isActive && (
                            <Badge variant="outline" className="ml-2">Active</Badge>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Content Area */}
        {activeView === 'summary' ? (
          // Summary View
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                title="Total Students"
                value={data.totalStudents}
                icon={Users}
                color="primary"
                loading={loading.summary}
              />
              <StatCard
                title="Students With Results"
                value={data.studentsWithResults}
                icon={FileText}
                description={`${((data.studentsWithResults / data.totalStudents) * 100).toFixed(1)}% of total`}
                color="info"
                loading={loading.summary}
              />
              <StatCard
                title="Average GPA"
                value={data.averageGPA.toFixed(2)}
                icon={TrendingUp}
                color="success"
                loading={loading.summary}
              />
              <StatCard
                title="Processing Time"
                value={formatDuration(data.duration)}
                icon={Clock}
                color="warning"
                loading={loading.summary}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Grade Distribution */}
              <div className="lg:col-span-2 space-y-6">
                {/* Grade Distribution Card */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Grade Distribution
                    </CardTitle>
                    <CardDescription>Classification of students based on GPA</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { label: "First Class", value: gradeDistribution.firstClass, color: "bg-success" },
                        { label: "Second Class Upper", value: gradeDistribution.secondClassUpper, color: "bg-info" },
                        { label: "Second Class Lower", value: gradeDistribution.secondClassLower, color: "bg-primary" },
                        { label: "Third Class", value: gradeDistribution.thirdClass, color: "bg-warning" },
                        { label: "Fail", value: gradeDistribution.fail, color: "bg-error" },
                      ].map((grade) => {
                        const percentage = data.totalStudents > 0 
                          ? (grade.value / data.totalStudents) * 100 
                          : 0;
                        
                        return (
                          <div key={grade.label} className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-text-primary">{grade.label}</span>
                              <span className="text-text2">{grade.value} students ({percentage.toFixed(1)}%)</span>
                            </div>
                            <Progress value={percentage} className={`h-2 ${grade.color}`} />
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                {/* Carryover Statistics */}
                {data.carryoverStats.affectedStudents.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <AlertCircle className="h-5 w-5" />
                        Carryover Statistics
                      </CardTitle>
                      <CardDescription>Students with pending courses</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-surface-elevated p-4 rounded-lg">
                            <div className="text-2xl font-bold text-text-primary">
                              {data.carryoverStats.totalCarryovers}
                            </div>
                            <div className="text-sm text-text2">Total Carryovers</div>
                          </div>
                          <div className="bg-surface-elevated p-4 rounded-lg">
                            <div className="text-2xl font-bold text-text-primary">
                              {data.carryoverStats.affectedStudentsCount}
                            </div>
                            <div className="text-sm text-text2">Affected Students</div>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <h4 className="font-medium text-text-primary">Affected Students:</h4>
                          <div className="space-y-2">
                            {data.carryoverStats.affectedStudents.map((student) => (
                              <div
                                key={student._id}
                                className="flex items-center justify-between p-3 bg-surface rounded-lg border border-border"
                              >
                                <div>
                                  <div className="font-medium text-text-primary">{student.name}</div>
                                  <div className="text-sm text-text2">{student.matricNumber}</div>
                                </div>
                                <Badge variant="secondary">{student.notes}</Badge>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Right Column - Meta Information */}
              <div className="space-y-6">
                {/* Computation Info Card */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Computation Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-text2">Semester:</span>
                        <Badge variant="outline" className="capitalize">
                          {data.semester.name}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text2">Status:</span>
                        <StatusBadge status={data.status} />
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text2">Started:</span>
                        <span className="text-text-primary">{formatDate(data.startedAt)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text2">Completed:</span>
                        <span className="text-text-primary">{formatDate(data.completedAt)}</span>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-border">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary-10 rounded-lg">
                          <User className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium text-text-primary">{data.computedBy.name}</div>
                          <div className="text-sm text-text2">{data.computedBy.role}</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Termination List */}
                {data.terminationList.length > 0 && (
                  <Card className="border-error/20">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-error">
                        <XCircle className="h-5 w-5" />
                        Terminated Students
                      </CardTitle>
                      <CardDescription>Students facing termination</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {data.terminationList.map((student) => (
                          <div
                            key={student._id}
                            className="p-3 bg-error/5 rounded-lg border border-error/20"
                          >
                            <div className="font-medium text-text-primary">{student.name}</div>
                            <div className="text-sm text-text2">{student.matricNumber}</div>
                            <div className="text-sm text-error mt-1">{student.reason}</div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* GPA Range Card */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="h-5 w-5" />
                      GPA Statistics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-3 gap-3">
                        <div className="text-center p-3 bg-surface-elevated rounded-lg">
                          <div className="text-lg font-bold text-success">{data.highestGPA.toFixed(2)}</div>
                          <div className="text-xs text-text2">Highest</div>
                        </div>
                        <div className="text-center p-3 bg-surface-elevated rounded-lg">
                          <div className="text-lg font-bold text-primary">{data.averageGPA.toFixed(2)}</div>
                          <div className="text-xs text-text2">Average</div>
                        </div>
                        <div className="text-center p-3 bg-surface-elevated rounded-lg">
                          <div className="text-lg font-bold text-error">{data.lowestGPA.toFixed(2)}</div>
                          <div className="text-xs text-text2">Lowest</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </>
        ) : (
          // History View
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                Computation History
              </CardTitle>
              <CardDescription>Previous computation runs and their results</CardDescription>
            </CardHeader>
            <CardContent>
              {loading.history ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="h-3 w-24" />
                        </div>
                        <Skeleton className="h-6 w-24" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : historyData.length > 0 ? (
                <div className="space-y-3">
                  {historyData.map((item) => (
                    <div
                      key={item._id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-surface rounded-lg border border-border hover:border-primary/20 transition-colors cursor-pointer"
                      onClick={() => fetchSummaryDetails(item._id)}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-text-primary capitalize">
                            {item.semester.name} Semester
                          </h3>
                          <StatusBadge status={item.status} />
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-text2">Students: </span>
                            <span className="font-medium">{item.totalStudents}</span>
                          </div>
                          <div>
                            <span className="text-text2">Avg GPA: </span>
                            <span className="font-medium">{item.averageGPA.toFixed(2)}</span>
                          </div>
                          <div>
                            <span className="text-text2">Started: </span>
                            <span className="font-medium">{formatDate(item.startedAt)}</span>
                          </div>
                          <div>
                            <span className="text-text2">By: </span>
                            <span className="font-medium">{item.computedBy.name}</span>
                          </div>
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="mt-3 sm:mt-0 sm:ml-4"
                        onClick={(e) => {
                          e.stopPropagation();
                          fetchSummaryDetails(item._id);
                        }}
                      >
                        View Details
                        <ExternalLink className="h-3 w-3 ml-2" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <History className="h-12 w-12 mx-auto text-text2 mb-4" />
                  <h3 className="text-lg font-medium text-text-primary mb-2">No Computation History</h3>
                  <p className="text-text2">No previous computation runs found.</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Fallback Data Notice */}
        {useFallback && (
          <Card className="border-warning/20">
            <CardContent className="p-4 flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-warning" />
              <div className="flex-1">
                <p className="font-medium text-warning">Displaying Fallback Data</p>
                <p className="text-sm text-text2">Unable to fetch live data. Showing cached results.</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}