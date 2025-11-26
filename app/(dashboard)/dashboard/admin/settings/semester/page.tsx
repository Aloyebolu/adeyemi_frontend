'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/Badge';
import { Table } from '@/components/ui/table/Table';
import { toast } from 'sonner';
import { Loader2, Play, Pause, Settings, BookOpen, Eye, Edit, Save, X, Building } from 'lucide-react';
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
  createdBy?: {
    _id: string;
    firstName: string;
    lastName: string;
  };
}

interface Department {
  _id: string;
  name: string;
  code: string;
}

interface GlobalSettings {
  currentSession: string;
  currentSemester: string;
  registrationOpen: boolean;
  resultPublicationOpen: boolean;
  activeSemesterId: string;
}

export default function SuperAdminSemesterPage() {
  const [activeSemester, setActiveSemester] = useState<Semester | null>(null);
  const [allSemesters, setAllSemesters] = useState<Semester[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');
  const [settings, setSettings] = useState<GlobalSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [startingSemester, setStartingSemester] = useState(false);
  const [togglingRegistration, setTogglingRegistration] = useState(false);
  const [togglingResults, setTogglingResults] = useState(false);
  const [editingLevelSettings, setEditingLevelSettings] = useState<LevelSetting[]>([]);
  const [savingLevelSettings, setSavingLevelSettings] = useState(false);
  const [filters, setFilters] = useState({
    session: '',
    department: '',
    active: ''
  });

  const { fetchData } = useDataFetcher();

  // New semester form state
  const [newSemester, setNewSemester] = useState({
    name: '',
    session: '',
    departmentId: '',
    levelSettings: [
      { level: 100, minUnits: 12, maxUnits: 24 },
      { level: 200, minUnits: 12, maxUnits: 24 },
      { level: 300, minUnits: 12, maxUnits: 24 },
      { level: 400, minUnits: 12, maxUnits: 24 }
    ]
  });

  useEffect(() => {
    // fetchInitialData();
            fetchDepartments(),
        fetchAllSemesters(),
        fetchSettings()
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchDepartments(),
        fetchAllSemesters(),
        fetchSettings()
      ]);
    } catch (error) {
      console.error('Error fetching initial data:', error.message);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const result = await fetchData('department/all');
      setDepartments(result.data || []);
      if (result.data && result.data.length > 0) {
        setSelectedDepartment(result.data[0]._id);
        setNewSemester(prev => ({ ...prev, departmentId: result.data[0]._id }));
      }
    } catch (error: any) {
      // console.error('Error fetching departments:', error.message);
      // toast.error('Failed to fetch departments');
    }
  };

  const fetchActiveSemester = async (departmentId?: string) => {
    try {
      const deptId = departmentId || selectedDepartment;
      if (!deptId) return;

      const result = await fetchData(`semester/active?departmentId=${deptId}`, 'GET');
      setActiveSemester(result.data);
      if (result.data) {
        setEditingLevelSettings(result.data.levelSettings || []);
      }
    } catch (error: any) {
      console.error('Error fetching active semester:', error);
      setActiveSemester(null);
      setEditingLevelSettings([]);
    }
  };

  const fetchAllSemesters = async () => {
    try {
      const result = await fetchData('semester/all', 'GET');
      setAllSemesters(result.data || []);
    } catch (error: any) {
      console.error('Error fetching all semesters:', error);
      setAllSemesters([]);
    }
  };

  const fetchSettings = async () => {
    try {
      const result = await fetchData('settings', 'GET');
      setSettings(result.data);
    } catch (error: any) {
      console.error('Error fetching settings:', error);
      setSettings(null);
    }
  };

  const fetchSemestersByDepartment = async (departmentId: string) => {
    try {
      const result = await fetchData(`semester/department/${departmentId}`, 'GET');
      return result.data || [];
    } catch (error: any) {
      console.error('Error fetching department semesters:', error);
      return [];
    }
  };

  const startNewSemester = async (e: React.FormEvent) => {
    e.preventDefault();
    setStartingSemester(true);

    try {
      const result = await fetchData('semester/start', 'POST', newSemester);
      
      setActiveSemester(result.data.semester);
      await fetchAllSemesters(); // Refresh the list
      await fetchActiveSemester(newSemester.departmentId); // Refresh active semester for the department
      
      setNewSemester(prev => ({ 
        ...prev, 
        name: '', 
        session: '',
        // Keep the same department selected
      }));
      
      toast.success(`New semester started successfully for ${getDepartmentName(newSemester.departmentId)}`);
    } catch (error: any) {
      toast.error(error.message || 'Failed to start semester');
    } finally {
      setStartingSemester(false);
    }
  };

  const toggleRegistration = async (status: boolean, semesterId?: string, departmentId?: string) => {
    setTogglingRegistration(true);
    try {
      const payload: any = { status };
      
      if (departmentId) {
        payload.departmentId = departmentId;
      } else if (semesterId) {
        // For specific semester, we need to get its department
        const semester = allSemesters.find(s => s._id === semesterId);
        if (semester) {
          payload.departmentId = semester.department._id;
        }
      } else if (activeSemester) {
        payload.departmentId = activeSemester.department._id;
      }

      const result = await fetchData('semester/registration', 'PUT', payload);
      
      if (semesterId) {
        // Update specific semester in the list
        setAllSemesters(prev => prev.map(sem => 
          sem._id === semesterId ? { ...sem, isRegistrationOpen: status } : sem
        ));
      } else if (activeSemester) {
        // Update active semester
        setActiveSemester(prev => prev ? { ...prev, isRegistrationOpen: status } : null);
      }
      
      toast.success(`Course registration ${status ? 'opened' : 'closed'} for ${getDepartmentName(payload.departmentId)}`);
    } catch (error: any) {
      toast.error(error.message || 'Failed to update registration status');
    } finally {
      setTogglingRegistration(false);
    }
  };

  const toggleResultPublication = async (status: boolean, semesterId?: string, departmentId?: string) => {
    setTogglingResults(true);
    try {
      const payload: any = { status };
      
      if (departmentId) {
        payload.departmentId = departmentId;
      } else if (semesterId) {
        const semester = allSemesters.find(s => s._id === semesterId);
        if (semester) {
          payload.departmentId = semester.department._id;
        }
      } else if (activeSemester) {
        payload.departmentId = activeSemester.department._id;
      }

      const result = await fetchData('semester/results', 'PUT', payload);
      
      if (semesterId) {
        setAllSemesters(prev => prev.map(sem => 
          sem._id === semesterId ? { ...sem, isResultsPublished: status } : sem
        ));
      } else if (activeSemester) {
        setActiveSemester(prev => prev ? { ...prev, isResultsPublished: status } : null);
      }
      
      toast.success(`Result publication ${status ? 'opened' : 'closed'} for ${getDepartmentName(payload.departmentId)}`);
    } catch (error: any) {
      toast.error(error.message || 'Failed to update result publication status');
    } finally {
      setTogglingResults(false);
    }
  };

  const deactivateSemester = async (semesterId: string) => {
    try {
      await fetchData(`semester/deactivate/${semesterId}`, 'POST');
      
      // Update the specific semester in the table
      setAllSemesters(prev => prev.map(sem => 
        sem._id === semesterId ? { ...sem, isActive: false, endDate: new Date().toISOString() } : sem
      ));

      // If this was the active semester we're viewing, clear it
      if (activeSemester && activeSemester._id === semesterId) {
        setActiveSemester(null);
      }
      
      toast.success('Semester deactivated successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to deactivate semester');
    }
  };

  const updateLevelSettings = async () => {
    if (!activeSemester) return;
    
    setSavingLevelSettings(true);
    try {
      const result = await fetchData(
        `semester/${activeSemester.department._id}/level-settings`, 
        'PUT', 
        { levelSettings: editingLevelSettings }
      );

      setActiveSemester(result.data);
      toast.success(`Level settings updated for ${activeSemester.department.name}`);
    } catch (error: any) {
      toast.error(error.message || 'Failed to update level settings');
    } finally {
      setSavingLevelSettings(false);
    }
  };

  const updateLevelSettingValue = (level: number, field: 'minUnits' | 'maxUnits', value: string) => {
    const numValue = value === '' ? undefined : parseInt(value);
    setEditingLevelSettings(prev => 
      prev.map(setting => 
        setting.level === level 
          ? { ...setting, [field]: numValue }
          : setting
      )
    );
  };

  const getDepartmentName = (departmentId: string) => {
    const dept = departments.find(d => d._id === departmentId);
    return dept ? dept.name : 'Unknown Department';
  };

  // Filter semesters based on current filters
  const filteredSemesters = allSemesters.filter(semester => {
    if (filters.session && !semester.session.includes(filters.session)) return false;
    if (filters.department && !semester.department.name.toLowerCase().includes(filters.department.toLowerCase())) return false;
    if (filters.active !== '') {
      const isActive = filters.active === 'true';
      if (semester.isActive !== isActive) return false;
    }
    return true;
  });

  // Table columns for all semesters
  const semesterColumns = [
    {
      accessorKey: "name",
      header: "Semester",
    },
    {
      accessorKey: "session",
      header: "Session",
    },
    {
      accessorKey: "department.name",
      header: "Department",
      cell: ({ row }: { row: any }) => (
        <Badge variant="outline">
          <Building className="w-3 h-3 mr-1" />
          {row.original.department.name}
        </Badge>
      )
    },
    {
      accessorKey: "isActive",
      header: "Active",
      cell: ({ row }: { row: any }) => (
        <Badge variant={row.original.isActive ? "default" : "secondary"}>
          {row.original.isActive ? "Active" : "Inactive"}
        </Badge>
      )
    },
    {
      accessorKey: "isRegistrationOpen",
      header: "Registration",
      cell: ({ row }: { row: any }) => (
        <Badge variant={row.original.isRegistrationOpen ? "default" : "secondary"}>
          {row.original.isRegistrationOpen ? "Open" : "Closed"}
        </Badge>
      )
    },
    {
      accessorKey: "isResultsPublished",
      header: "Results",
      cell: ({ row }: { row: any }) => (
        <Badge variant={row.original.isResultsPublished ? "default" : "secondary"}>
          {row.original.isResultsPublished ? "Published" : "Closed"}
        </Badge>
      )
    },
    {
      accessorKey: "startDate",
      header: "Start Date",
      cell: ({ row }: { row: any }) => new Date(row.original.startDate).toLocaleDateString()
    },
    {
      accessorKey: "endDate",
      header: "End Date",
      cell: ({ row }: { row: any }) => 
        row.original.endDate ? new Date(row.original.endDate).toLocaleDateString() : 'N/A'
    },
    {
      accessorKey: "actions",
      header: "Actions",
      cell: ({ row }: { row: any }) => (
        <div className="flex gap-2">
          {row.original.isActive && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => deactivateSemester(row.original._id)}
              >
                <Pause className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => toggleRegistration(!row.original.isRegistrationOpen, row.original._id)}
                disabled={togglingRegistration}
              >
                {row.original.isRegistrationOpen ? 'Close Reg' : 'Open Reg'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => toggleResultPublication(!row.original.isResultsPublished, row.original._id)}
                disabled={togglingResults}
              >
                {row.original.isResultsPublished ? 'Close Results' : 'Publish Results'}
              </Button>
            </>
          )}
          {!row.original.isActive && (
            <Button
              variant="outline"
              size="sm"
              disabled
            >
              Inactive
            </Button>
          )}
        </div>
      )
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin - Semester Management</h1>
          <p className="text-muted-foreground">
            Manage academic semesters across all departments
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Current Semester Status for Selected Department */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Department Semester
            </CardTitle>
            <CardDescription>
              View and manage semester for selected department
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Department Selection */}
            <div className="space-y-2">
              <Label htmlFor="department-select">Select Department</Label>
              <Select
                value={selectedDepartment}
                onValueChange={async (value) => {
                  setSelectedDepartment(value);
                  setNewSemester(prev => ({ ...prev, departmentId: value }));
                  await fetchActiveSemester(value);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept._id} value={dept._id}>
                      {dept.name} ({dept.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {activeSemester ? (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Semester</Label>
                    <p className="text-lg font-semibold">{activeSemester.name}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Session</Label>
                    <p className="text-lg font-semibold">{activeSemester.session}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Department</Label>
                    <Badge variant="default">
                      <Building className="w-3 h-3 mr-1" />
                      {activeSemester.department.name}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <Label>Start Date</Label>
                    <span className="text-sm">{new Date(activeSemester.startDate).toLocaleDateString()}</span>
                  </div>

                  {activeSemester.endDate && (
                    <div className="flex items-center justify-between">
                      <Label>End Date</Label>
                      <span className="text-sm">{new Date(activeSemester.endDate).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2 pt-2 border-t">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="registration-toggle">Course Registration</Label>
                    <div className="flex items-center gap-2">
                      <Badge variant={activeSemester.isRegistrationOpen ? "default" : "secondary"}>
                        {activeSemester.isRegistrationOpen ? "Open" : "Closed"}
                      </Badge>
                      <Switch
                        id="registration-toggle"
                        checked={activeSemester.isRegistrationOpen}
                        onCheckedChange={(status) => toggleRegistration(status)}
                        disabled={togglingRegistration}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="results-toggle">Result Publication</Label>
                    <div className="flex items-center gap-2">
                      <Badge variant={activeSemester.isResultsPublished ? "default" : "secondary"}>
                        {activeSemester.isResultsPublished ? "Open" : "Closed"}
                      </Badge>
                      <Switch
                        id="results-toggle"
                        checked={activeSemester.isResultsPublished}
                        onCheckedChange={(status) => toggleResultPublication(status)}
                        disabled={togglingResults}
                      />
                    </div>
                  </div>
                </div>

                <Button
                  variant="outline"
                  onClick={() => deactivateSemester(activeSemester._id)}
                  className="w-full"
                >
                  <Pause className="w-4 h-4 mr-2" />
                  Deactivate Semester
                </Button>
              </>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">No active semester for selected department</p>
                <Badge variant="secondary">No Active Semester</Badge>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Start New Semester */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Play className="w-5 h-5" />
              Start New Semester
            </CardTitle>
            <CardDescription>
              Begin a new academic semester for a department
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={startNewSemester} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Select
                  value={newSemester.departmentId}
                  onValueChange={(value) => setNewSemester(prev => ({ ...prev, departmentId: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept._id} value={dept._id}>
                        {dept.name} ({dept.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="semester-name">Semester Name</Label>
                <Select
                  value={newSemester.name}
                  onValueChange={(value) => setNewSemester(prev => ({ ...prev, name: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select semester" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="First Semester">First Semester</SelectItem>
                    <SelectItem value="Second Semester">Second Semester</SelectItem>
                    <SelectItem value="Summer Semester">Summer Semester</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="session">Academic Session</Label>
                <Input
                  id="session"
                  placeholder="2024/2025"
                  value={newSemester.session}
                  onChange={(e) => setNewSemester(prev => ({ ...prev, session: e.target.value }))}
                  pattern="^\d{4}/\d{4}$"
                />
                <p className="text-xs text-muted-foreground">Format: YYYY/YYYY</p>
              </div>

              <Button
                type="submit"
                disabled={startingSemester || !newSemester.name || !newSemester.session || !newSemester.departmentId}
                className="w-full"
              >
                {startingSemester ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Play className="w-4 h-4 mr-2" />
                )}
                Start New Semester
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Department Level Settings */}
      {activeSemester && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Level Settings for {activeSemester.department.name}
            </CardTitle>
            <CardDescription>
              Configure unit requirements for {activeSemester.department.name}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {editingLevelSettings.map((level, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <h4 className="font-semibold mb-3">Level {level.level}</h4>
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor={`min-units-${level.level}`} className="text-xs">Min Units</Label>
                        <Input
                          id={`min-units-${level.level}`}
                          type="number"
                          min="0"
                          value={level.minUnits || ''}
                          onChange={(e) => updateLevelSettingValue(level.level, 'minUnits', e.target.value)}
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`max-units-${level.level}`} className="text-xs">Max Units</Label>
                        <Input
                          id={`max-units-${level.level}`}
                          type="number"
                          min="0"
                          value={level.maxUnits || ''}
                          onChange={(e) => updateLevelSettingValue(level.level, 'maxUnits', e.target.value)}
                          placeholder="0"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <Button
                onClick={updateLevelSettings}
                disabled={savingLevelSettings}
                className="w-full md:w-auto"
              >
                {savingLevelSettings ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                Save Level Settings
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* All Semesters Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Semesters</CardTitle>
          <CardDescription>
            View and manage all academic semesters across departments
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <Label htmlFor="session-filter">Session</Label>
              <Input
                id="session-filter"
                placeholder="Filter by session..."
                value={filters.session}
                onChange={(e) => setFilters(prev => ({ ...prev, session: e.target.value }))}
              />
            </div>
            <div className="flex-1">
              <Label htmlFor="department-filter">Department</Label>
              <Input
                id="department-filter"
                placeholder="Filter by department..."
                value={filters.department}
                onChange={(e) => setFilters(prev => ({ ...prev, department: e.target.value }))}
              />
            </div>
            <div className="flex-1">
              <Label htmlFor="active-filter">Status</Label>
              <Select
                value={filters.active}
                onValueChange={(value) => setFilters(prev => ({ ...prev, active: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All</SelectItem>
                  <SelectItem value="true">Active</SelectItem>
                  <SelectItem value="false">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Table
            columns={semesterColumns}
            data={filteredSemesters}
            enableSearch={false}
            enableSort={true}
            enablePagination={true}
            pageSize={10}
            enableFilter={false}
            enableSelection={false}
            enableExport={true}
            variant="corporate"
            showNumbering={true}
            tableEmptyMessage="No semesters found"
          />
        </CardContent>
      </Card>
    </div>
  );
}