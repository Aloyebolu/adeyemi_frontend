'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/Badge';
import { Table } from '@/components/ui/table/Table2';
import { toast } from 'sonner';
import { Loader2, Settings, BookOpen, Save, Eye, Building, Users, Calendar, BarChart3, GraduationCap, BookText, Activity } from 'lucide-react';
import { useDataFetcher } from '@/lib/dataFetcher';

interface LevelSetting {
  level: number;
  minUnits?: number;
  maxUnits?: number;
}

interface Semester {
  _id: string;
  name: string;
  session: string;
  department: {
    _id: string;
    name: string;
    code: string;
  };
  isActive: boolean;
  isRegistrationOpen: boolean;
  isResultsPublished: boolean;
  levelSettings: LevelSetting[];
  startDate: string;
  endDate?: string;
}

interface Department {
  _id: string;
  name: string;
  code: string;
  hod_name?: string;
  total_students?: number;
  total_lecturers?: number;
  total_courses?: number;

}

interface Faculty {
  _id: string;
  name: string;
  code: string;
  dean: string;
  departments: Department[];
}

interface Stats {
  totalDepartments: number;
  totalStudents: number;
  totalLecturers: number;
  activeSemesters: number;
  pendingRegistrations?: number;
}

export default function DeanOverviewPage() {
  const [faculty, setFaculty] = useState<Faculty | null>(null);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [activeSemesters, setActiveSemesters] = useState<Semester[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalDepartments: 0,
    totalStudents: 0,
    totalLecturers: 0,
    activeSemesters: 0
  });
  const [loading, setLoading] = useState(true);
  const [togglingRegistration, setTogglingRegistration] = useState<string | null>(null);
  const [togglingResults, setTogglingResults] = useState<string | null>(null);
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');

  const { fetchData } = useDataFetcher();

  useEffect(() => {
    fetchDeanData();
}, []);

  const fetchDeanData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchFaculty(),
        fetchDepartments(),
      ]);
    } catch (error) {
      console.error('Error fetching dean data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const fetchFaculty = async () => {
    try {
      const result = await fetchData('faculty/my-faculty', 'GET');
      if (Array.isArray(result.data)) {
        setFaculty(result.data[0] || null);
      } else {
        setFaculty(result.data || null);
      }
    } catch (error: any) {
      console.error('Error fetching faculty:', error);
      if (!error.message?.includes('No faculty assigned')) {
        toast.error(error.message || 'Failed to fetch faculty information');
      }
    }
  };

  const fetchDepartments = async () => {
    try {
      const result = await fetchData('department/stats', 'GET');
      let facultyDepartments = result.data || [];
      // If result.data is an array of arrays, pick the first array
      if (Array.isArray(facultyDepartments) && Array.isArray(facultyDepartments[0])) {
        facultyDepartments = facultyDepartments[0];
      }
      setDepartments(facultyDepartments);
      
      // Calculate stats
      const totalStudents = facultyDepartments.reduce((sum: number, dept: Department) => sum + (dept.total_students || 0), 0);
      const totalLecturers = facultyDepartments.reduce((sum: number, dept: Department) => sum + (dept.total_lecturers || 0), 0);
      
      setStats(prev => ({
        ...prev,
        totalDepartments: facultyDepartments.length,
        totalStudents,
        totalLecturers
      }));

      if (facultyDepartments.length > 0) {
        setSelectedDepartment(facultyDepartments[0]._id);
      }
    } catch (error: any) {
      console.error('Error fetching departments:', error);
      toast.error('Failed to fetch departments');
    }
  };


  const toggleRegistration = async (departmentId: string, status: boolean) => {
    setTogglingRegistration(departmentId);
    try {
      await fetchData('semester/registration', 'PUT', { 
        status,
        departmentId 
      });
      
      // Update local state
      setActiveSemesters(prev => 
        prev.map(sem => 
          sem.department._id === departmentId 
            ? { ...sem, isRegistrationOpen: status }
            : sem
        )
      );
      
      toast.success(`Course registration ${status ? 'opened' : 'closed'} for department`);
    } catch (error: any) {
      toast.error(error.message || 'Failed to update registration status');
    } finally {
      setTogglingRegistration(null);
    }
  };

  const toggleResultPublication = async (departmentId: string, status: boolean) => {
    setTogglingResults(departmentId);
    try {
      await fetchData('semester/results', 'PUT', { 
        status,
        departmentId 
      });
      
      // Update local state
      setActiveSemesters(prev => 
        prev.map(sem => 
          sem.department._id === departmentId 
            ? { ...sem, isResultsPublished: status }
            : sem
        )
      );
      
      toast.success(`Result publication ${status ? 'opened' : 'closed'} for department`);
    } catch (error: any) {
      toast.error(error.message || 'Failed to update result publication status');
    } finally {
      setTogglingResults(null);
    }
  };

  const getDepartmentSemester = (departmentId: string) => {
    return activeSemesters.find(sem => sem.department._id === departmentId);
  };

  // Table columns for departments
  const departmentColumns = [
    {
      accessorKey: "name",
      header: "Department",
      cell: ({ row }: { row: any }) => (
        <div className="flex items-center gap-2">
          <Building className="w-4 h-4 text-muted-foreground" />
          <span className="font-medium">{row.original.name}</span>
          <Badge variant="outline" className="text-xs">{row.original.code}</Badge>
        </div>
      )
    },
    {
      accessorKey: "hod_name",
      header: "Head of Department",
      cell: ({ row }: { row: any }) => (
        row.original.hod_name ? (
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-muted-foreground" />
            <span>{row.original.hod_name} </span>
          </div>
        ) : (
          <Badge variant="secondary" className="text-xs">Not Assigned</Badge>
        )
      )
    },
    {
      accessorKey: "total_students",
      header: "Students",
      cell: ({ row }: { row: any }) => (
        <div className="flex items-center gap-2">
          <GraduationCap className="w-4 h-4 text-muted-foreground" />
          <span>{row.original.total_students || 0}</span>
        </div>
      )
    },
    {
      accessorKey: "lecturerCount",
      header: "Lecturers",
      cell: ({ row }: { row: any }) => (
        <div className="flex items-center gap-2">
          <BookText className="w-4 h-4 text-muted-foreground" />
          <span>{row.original.total_lecturers || 0}</span>
        </div>
      )
    },

    {
      accessorKey: "actions",
      header: "Actions",
      cell: ({ row }: { row: any }) => {
        const semester = getDepartmentSemester(row.original._id);
        return (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => toggleRegistration(row.original._id, !semester.isRegistrationOpen)}
              disabled={togglingRegistration === row.original._id}
            >
              {semester?.isRegistrationOpen ? 'Close Reg' : 'Open Reg'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => toggleResultPublication(row.original._id, !semester.isResultsPublished)}
              disabled={togglingResults === row.original._id}
            >
              {semester?.isResultsPublished ? 'Close Results' : 'Publish Results'}
            </Button>
          </div>
        );
      }
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!faculty) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="flex items-center justify-center min-h-[400px]">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
                <Building className="w-8 h-8 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">No Faculty Assigned</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  You are not currently assigned as Dean of any faculty. 
                  Please contact the administration for faculty assignment.
                </p>
              </div>
              <Badge variant="secondary">Awaiting Assignment</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Faculty Dean Dashboard</h1>
          <p className="text-muted-foreground">
            Overview and management for {faculty.name} ({faculty.code})
          </p>
        </div>
        <Button
          variant="outline"
          onClick={fetchDeanData}
        >
          <Eye className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Departments</CardTitle>
            <Building className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalDepartments}</div>
            <p className="text-xs text-muted-foreground">
              Departments in faculty
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <GraduationCap className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalStudents.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Across all departments
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Lecturers</CardTitle>
            <BookText className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalLecturers}</div>
            <p className="text-xs text-muted-foreground">
              Teaching staff
            </p>
          </CardContent>
        </Card>


      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Faculty Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="w-5 h-5" />
              Faculty Overview
            </CardTitle>
            <CardDescription>
              {faculty.name} ({faculty.code}) - Department Summary
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium">Faculty Name</Label>
                <p className="text-lg font-semibold">{faculty.name}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Faculty Code</Label>
                <p className="text-lg font-semibold">{faculty.code}</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Department Distribution</Label>
              <div className="space-y-2">
                {departments.map((dept) => (
                  <div key={dept._id} className="flex items-center justify-between p-2 border rounded-lg">
                    <div className="flex items-center gap-2">
                      <Building className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">{dept.name}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{dept.total_students || 0} students</span>
                      <span>{dept.total_lecturers || 0} lecturers</span>

                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>


      </div>

      {/* Departments Table */}
      <Card>
        <CardHeader>
          <CardTitle>Department Management</CardTitle>
          <CardDescription>
            Manage all departments in {faculty.name}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table
            columns={departmentColumns}
            data={departments}
            enableSearch={true}
            enableSort={true}
            enablePagination={true}
            pageSize={10}
            enableFilter={true}
            enableSelection={false}
            enableExport={true}
            // variant="monochrome"
            showNumbering={true}
            tableEmptyMessage="No departments found in your faculty"
          />
        </CardContent>
      </Card>

      {/* Recent Activity / Notifications */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Faculty Activity</CardTitle>
          <CardDescription>
            Latest updates and notifications across your faculty
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activeSemesters.length > 0 ? (
              activeSemesters.map((semester) => (
                <div key={semester._id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${
                      semester.isRegistrationOpen ? 'bg-green-500' : 'bg-gray-300'
                    }`} />
                    <div>
                      <p className="font-medium">
                        {semester.department.name} - {semester.name} {semester.session}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Registration: {semester.isRegistrationOpen ? 'Open' : 'Closed'} • 
                        Results: {semester.isResultsPublished ? 'Published' : 'Closed'}
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    Started {new Date(semester.startDate).toLocaleDateString()}
                  </Badge>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Activity className="w-8 h-8 mx-auto mb-2" />
                <p>No recent activity</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}