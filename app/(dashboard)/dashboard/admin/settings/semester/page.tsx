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
import { Loader2, Play, Pause, Settings, BookOpen, Building, Calendar, Users, FileText } from 'lucide-react';
import { useDataFetcher } from '@/lib/dataFetcher';
import { useNotifications } from '@/hooks/useNotification';

interface LevelSetting {
  level: number;
  minUnits?: number;
  maxUnits?: number;
}

interface Semester {
  _id: string;
  name: string;
  session: string;
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
  const [settings, setSettings] = useState<GlobalSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [startingSemester, setStartingSemester] = useState(false);
  const [togglingRegistration, setTogglingRegistration] = useState(false);
  const [togglingResults, setTogglingResults] = useState(false);
  const [editingLevelSettings, setEditingLevelSettings] = useState<LevelSetting[]>([]);
  const [savingLevelSettings, setSavingLevelSettings] = useState(false);
  const {addNotification} = useNotifications()

  const { fetchData, get, post, put } = useDataFetcher();

  // New semester form state
  const [newSemester, setNewSemester] = useState({
    name: '',
    session: '',
    levelSettings: [
      { level: 100, minUnits: 12, maxUnits: 24 },
      { level: 200, minUnits: 12, maxUnits: 24 },
      { level: 300, minUnits: 12, maxUnits: 24 },
      { level: 400, minUnits: 12, maxUnits: 24 }
    ]
  });

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchActiveSemester(),
        fetchAllSemesters(),
        fetchSettings()
      ]);
    } catch (error) {
      console.error('Error fetching initial data:', error);
      addNotification.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const fetchActiveSemester = async () => {
    try {
      const result = await get('semester/active');
      if (result.data) {
        setActiveSemester(result.data);
        setEditingLevelSettings(result.data.levelSettings || []);
      } else {
        setActiveSemester(null);
        setEditingLevelSettings([]);
      }
    } catch (error: any) {
      console.error('Error fetching active semester:', error);
      setActiveSemester(null);
      setEditingLevelSettings([]);
    }
  };

  const fetchAllSemesters = async () => {
    try {
      const result = await get('semester');
      setAllSemesters(result.data || []);
    } catch (error: any) {
      console.error('Error fetching all semesters:', error);
      setAllSemesters([]);
    }
  };

  const fetchSettings = async () => {
    try {
      const result = await get('settings');
      setSettings(result.data);
    } catch (error: any) {
      console.error('Error fetching settings:', error);
      setSettings(null);
    }
  };

  const startNewSemester = async (e: React.FormEvent) => {
    e.preventDefault();
    setStartingSemester(true);

    try {
      const result = await post('semester/start', newSemester);

      setActiveSemester(result.data.semester);
      await fetchAllSemesters();
      await fetchActiveSemester();

      setNewSemester({
        name: '',
        session: '',
        levelSettings: [
          { level: 100, minUnits: 12, maxUnits: 24 },
          { level: 200, minUnits: 12, maxUnits: 24 },
          { level: 300, minUnits: 12, maxUnits: 24 },
          { level: 400, minUnits: 12, maxUnits: 24 }
        ]
      });

      addNotification.success('New semester started successfully for the entire school');
    } catch (error: any) {
      addNotification.error(error.message || 'Failed to start semester');
    } finally {
      setStartingSemester(false);
    }
  };

  const toggleRegistration = async (status: boolean) => {
    setTogglingRegistration(true);
    try {
      await put('semester/registration', { status });
      
      setActiveSemester(prev => prev ? { ...prev, isRegistrationOpen: status } : null);
      setAllSemesters(prev => prev.map(sem => 
        sem.isActive ? { ...sem, isRegistrationOpen: status } : sem
      ));

      addNotification.success(`Course registration ${status ? 'opened' : 'closed'} for the entire school`);
    } catch (error: any) {
      addNotification.error(error.message || 'Failed to update registration status');
    } finally {
      setTogglingRegistration(false);
    }
  };

  const toggleResultPublication = async (status: boolean) => {
    setTogglingResults(true);
    try {
      await put('semester/results', { status });
      
      setActiveSemester(prev => prev ? { ...prev, isResultsPublished: status } : null);
      setAllSemesters(prev => prev.map(sem => 
        sem.isActive ? { ...sem, isResultsPublished: status } : sem
      ));

      addNotification.success(`Result publication ${status ? 'opened' : 'closed'} for the entire school`);
    } catch (error: any) {
      addNotification.error(error.message || 'Failed to update result publication status');
    } finally {
      setTogglingResults(false);
    }
  };

  const deactivateSemester = async (semesterId: string) => {
    try {
      await post(`semester/end`, { semesterId });
      
      setAllSemesters(prev => prev.map(sem =>
        sem._id === semesterId ? { ...sem, isActive: false, endDate: new Date().toISOString() } : sem
      ));

      if (activeSemester && activeSemester._id === semesterId) {
        setActiveSemester(null);
      }

      addNotification.success('Semester deactivated successfully');
    } catch (error: any) {
      addNotification.error(error.message || 'Failed to deactivate semester');
    }
  };

  const updateLevelSettings = async () => {
    if (!activeSemester) return;

    setSavingLevelSettings(true);
    try {
      const result = await put('semester/level-settings', { levelSettings: editingLevelSettings });
      
      setActiveSemester(prev => prev ? { ...prev, levelSettings: editingLevelSettings } : null);
      addNotification.success('Level settings updated for the entire school');
    } catch (error: any) {
      addNotification.error(error.message || 'Failed to update level settings');
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
      accessorKey: "isActive",
      header: "Status",
      cell: ({ row }: { row: any }) => (
        <Badge variant={row.original.isActive ? "default" : "secondary"} 
               className={row.original.isActive ? "bg-success" : "bg-background2"}>
          {row.original.isActive ? "Active" : "Inactive"}
        </Badge>
      )
    },
    {
      accessorKey: "isRegistrationOpen",
      header: "Registration",
      cell: ({ row }: { row: any }) => (
        <Badge variant={row.original.isRegistrationOpen ? "default" : "secondary"}
               className={row.original.isRegistrationOpen ? "bg-success" : "bg-error"}>
          {row.original.isRegistrationOpen ? "Open" : "Closed"}
        </Badge>
      )
    },
    {
      accessorKey: "isResultsPublished",
      header: "Results",
      cell: ({ row }: { row: any }) => (
        <Badge variant={row.original.isResultsPublished ? "default" : "secondary"}
               className={row.original.isResultsPublished ? "bg-success" : "bg-warning"}>
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
                className="border-error text-error hover:bg-error hover:text-on-brand"
              >
                <Pause className="w-4 h-4" />
                Deactivate
              </Button>
            </>
          )}
        </div>
      )
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6 bg-background text-text-primary">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Semester Management</h1>
          <p className="text-text2">
            Manage academic semesters for the entire university
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Current Active Semester Card */}
        <Card className="bg-surface border-border">
          <CardHeader className="bg-primary text-text-on-primary">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Current Active Semester
            </CardTitle>
            <CardDescription className="text-primary-20">
              {activeSemester ? `Managing ${activeSemester.name}` : 'No active semester'}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            {activeSemester ? (
              <>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-background2 rounded-lg">
                    <span className="font-semibold">Semester:</span>
                    <Badge variant="default" className="bg-primary">
                      {activeSemester.name}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-background2 rounded-lg">
                    <span className="font-semibold">Session:</span>
                    <span>{activeSemester.session}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-background2 rounded-lg">
                    <span className="font-semibold">Status:</span>
                    <Badge variant="default" className="bg-success">
                      Active
                    </Badge>
                  </div>
                </div>

                {/* Control Toggles */}
                <div className="space-y-4 pt-4 border-t border-border">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Users className="w-5 h-5 text-text2" />
                      <div>
                        <Label htmlFor="registration-toggle" className="font-semibold">
                          Course Registration
                        </Label>
                        <p className="text-sm text-text2">
                          {activeSemester.isRegistrationOpen ? 'Open for students' : 'Closed for students'}
                        </p>
                      </div>
                    </div>
                    <Switch
                      id="registration-toggle"
                      checked={activeSemester.isRegistrationOpen}
                      onCheckedChange={toggleRegistration}
                      disabled={togglingRegistration}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-text2" />
                      <div>
                        <Label htmlFor="results-toggle" className="font-semibold">
                          Result Publication
                        </Label>
                        <p className="text-sm text-text2">
                          {activeSemester.isResultsPublished ? 'Results published' : 'Results hidden'}
                        </p>
                      </div>
                    </div>
                    <Switch
                      id="results-toggle"
                      checked={activeSemester.isResultsPublished}
                      onCheckedChange={toggleResultPublication}
                      disabled={togglingResults}
                    />
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-8 text-text2">
                <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No active semester</p>
                <p className="text-sm">Start a new semester to begin management</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Start New Semester */}
        <Card className="bg-surface border-border">
          <CardHeader className="bg-accent text-text-on-primary">
            <CardTitle className="flex items-center gap-2">
              <Play className="w-5 h-5" />
              Start New Semester
            </CardTitle>
            <CardDescription className="text-primary-20">
              Begin a new semester for all departments
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={startNewSemester} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="semester-name">Semester</Label>
                <Select
                  value={newSemester.name}
                  onValueChange={(value) => setNewSemester(prev => ({ ...prev, name: value }))}
                >
                  <SelectTrigger className="bg-background border-border">
                    <SelectValue placeholder="Select semester" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="First Semester">First Semester</SelectItem>
                    <SelectItem value="Second Semester">Second Semester</SelectItem>
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
                  className="bg-background border-border"
                />
              </div>

              <Button 
                type="submit" 
                disabled={startingSemester || !newSemester.name || !newSemester.session}
                className="w-full bg-primary hover:bg-primary-hover text-text-on-primary"
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

      {/* Level Settings */}
      {activeSemester && (
        <Card className="bg-surface border-border">
          <CardHeader className="bg-surface-elevated border-b border-border">
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Level Unit Requirements
            </CardTitle>
            <CardDescription>
              Configure minimum and maximum units for each level
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {editingLevelSettings.map((level, index) => (
                  <div key={index} className="border border-border rounded-lg p-4 bg-background2">
                    <h4 className="font-semibold mb-3 text-text-primary">Level {level.level}</h4>
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor={`min-units-${level.level}`} className="text-xs text-text2">Min Units</Label>
                        <Input
                          id={`min-units-${level.level}`}
                          type="number"
                          min="0"
                          value={level.minUnits || ''}
                          onChange={(e) => updateLevelSettingValue(level.level, 'minUnits', e.target.value)}
                          placeholder="0"
                          className="bg-background border-border"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`max-units-${level.level}`} className="text-xs text-text2">Max Units</Label>
                        <Input
                          id={`max-units-${level.level}`}
                          type="number"
                          min="0"
                          value={level.maxUnits || ''}
                          onChange={(e) => updateLevelSettingValue(level.level, 'maxUnits', e.target.value)}
                          placeholder="0"
                          className="bg-background border-border"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Button
                onClick={updateLevelSettings}
                disabled={savingLevelSettings}
                className="bg-primary hover:bg-primary-hover text-text-on-primary"
              >
                {savingLevelSettings ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Settings className="w-4 h-4 mr-2" />
                )}
                Save Level Settings
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* All Semesters Table */}
      <Card className="bg-surface border-border">
        <CardHeader className="bg-surface-elevated border-b border-border">
          <CardTitle>All Semesters</CardTitle>
          <CardDescription>
            View and manage all academic semesters
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <Table
            columns={semesterColumns}
            data={allSemesters}
            enableSearch={true}
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