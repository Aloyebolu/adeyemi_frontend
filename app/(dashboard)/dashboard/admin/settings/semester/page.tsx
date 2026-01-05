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
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/dialog/alert-dialog';
import { Alert } from '@/components/ui/Alert';
import { toast } from 'sonner';
import {
  Loader2,
  Play,
  Pause,
  Settings,
  BookOpen,
  Building,
  Calendar,
  Users,
  FileText,
  PlusCircle,
  Info,
  AlertTriangle,
  History,
  Undo2,
  RotateCcw
} from 'lucide-react';
import { useDataFetcher } from '@/lib/dataFetcher';
import { useNotifications } from '@/hooks/useNotification';
import { formatSemesterName } from '@/utils/semesterNameFormatter';

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

interface NewSemesterPreview {
  name: string;
  session: string;
  generatedName: string;
}

interface RollbackInfo {
  canRollback: boolean;
  currentSemester?: string;
  currentSession?: string;
  previousSemester?: string;
  previousSession?: string;
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
  const { addNotification } = useNotifications();

  // New state for modal and preview
  const [showNewSemesterModal, setShowNewSemesterModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [newSemesterPreview, setNewSemesterPreview] = useState<NewSemesterPreview | null>(null);
  const [creatingSemester, setCreatingSemester] = useState(false);

  // Rollback states
  const [rollbackInfo, setRollbackInfo] = useState<RollbackInfo | null>(null);
  const [showRollbackModal, setShowRollbackModal] = useState(false);
  const [rollingBack, setRollingBack] = useState(false);
  const [checkingRollback, setCheckingRollback] = useState(false);

  const { fetchData, get, post, put, patch } = useDataFetcher();

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
        fetchSettings(),
        fetchRollbackInfo()
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

  const fetchRollbackInfo = async () => {
    setCheckingRollback(true);
    try {
      const result = await get('semester/can-rollback');
      if (result.data) {
        setRollbackInfo(result.data);
      } else {
        setRollbackInfo(null);
      }
    } catch (error: any) {
      console.error('Error fetching rollback info:', error);
      setRollbackInfo(null);
    } finally {
      setCheckingRollback(false);
    }
  };

  const performRollback = async () => {
    setRollingBack(true);
    try {
      const result = await post('semester/rollback', {});

      // Refresh all data
      await Promise.all([
        fetchActiveSemester(),
        fetchAllSemesters(),
        fetchSettings(),
        fetchRollbackInfo()
      ]);

      setShowRollbackModal(false);
      addNotification.success('Semester rollback completed successfully');

    } catch (error: any) {
      addNotification.error(error.message || 'Failed to rollback semester');
    } finally {
      setRollingBack(false);
    }
  };

  const getNextSemesterName = (currentName: string): string => {
    const semesterMap: Record<string, string> = {
      'second': 'first',
      'first': 'second',
    };

    return semesterMap[currentName] || 'First Semester';
  };

  const getNextSession = (currentSession: string): string => {
    // Parse session like "2023/2024" and increment
    const parts = currentSession.split('/');
    if (parts.length === 2) {
      const start = parseInt(parts[0]);
      const end = parseInt(parts[1]);
      return `${start + 1}/${end + 1}`;
    }
    return currentSession;
  };

  const handleNewSemesterClick = async () => {
    try {
      // Fetch current semester data to determine next semester
      const [currentSemesterRes, settingsRes] = await Promise.all([
        get('semester/active'),
        get('settings')
      ]);

      const currentSemester = currentSemesterRes.data;
      const currentSettings = settingsRes.data;

      if (currentSemester) {
        const nextSemesterName = getNextSemesterName(currentSemester.name);
        const nextSession = getNextSession(currentSemester.session || currentSettings?.currentSession || '2024/2025');

        setNewSemesterPreview({
          name: nextSemesterName,
          session: nextSession,
          generatedName: `${nextSession} - ${formatSemesterName(nextSemesterName)}`
        });
      } else {
        addNotification.error('Error while resolving semester data');
      }

      setShowNewSemesterModal(true);
    } catch (error: any) {
      console.error('Error fetching current semester:', error);
      addNotification.error('Failed to load current semester data');
    }
  };

  const createNewSemester = async () => {
    if (!newSemesterPreview) return;

    setCreatingSemester(true);
    try {
      // Single request with no data - backend auto-generates based on current semester
      const result = await post('semester/start', {});

      setShowNewSemesterModal(false);
      setShowConfirmModal(false);

      // Refresh data
      await Promise.all([
        fetchActiveSemester(),
        fetchAllSemesters(),
        fetchSettings(),
        fetchRollbackInfo()
      ]);

      addNotification.success('New semester created successfully for the entire school');
    } catch (error: any) {
      addNotification.error(error.message || 'Failed to create new semester');
    } finally {
      setCreatingSemester(false);
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
      await patch('semester/registration', { status });

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
      await patch('semester/results', { status });

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
    <div className="container mx-auto p-6 space-y-6 bg-background ">
      {/* Header with New Semester Button */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Semester Management</h1>
          <p className="text-text2">
            Manage academic semesters for the entire university
          </p>
        </div>
        <div className="flex gap-2">
          {/* Rollback Button (conditionally shown) */}
          {rollbackInfo?.canRollback && (
            <Button
              onClick={() => setShowRollbackModal(true)}
              variant="destructive"
              className="bg-error hover:bg-error-hover text-text-on-error"
            >
              <Undo2 className="w-4 h-4 mr-2" />
              Rollback Semester
            </Button>
          )}

          {/* Existing New Semester Button */}
          <Button
            onClick={handleNewSemesterClick}
            className="bg-primary hover:bg-primary-hover text-text-on-primary"
          >
            <PlusCircle className="w-4 h-4 mr-2" />
            New Semester
          </Button>
        </div>
      </div>

      {/* New Semester Preview Modal */}
      <Dialog open={showNewSemesterModal} onOpenChange={setShowNewSemesterModal}>
        <DialogContent className="sm:max-w-md bg-surface border-border">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <PlusCircle className="w-5 h-5" />
              Create New Semester
            </DialogTitle>
            <DialogDescription>
              This will create a new semester based on the current academic calendar.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-text2">Auto-generated Semester Details</Label>
              <div className="p-4 border border-border rounded-lg bg-background2">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-text2">Semester:</span>
                    <span className="font-semibold text-text-primary">
                      {formatSemesterName(newSemesterPreview?.name) || 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-text2">Session:</span>
                    <span className="font-semibold text-text-primary">
                      {newSemesterPreview?.session || 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-border">
                    <span className="text-sm text-text2">Full Name:</span>
                    <span className="font-bold text-primary">
                      {formatSemesterName(newSemesterPreview?.generatedName) || 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 p-3 bg-warning/10 border border-warning/20 rounded-lg">
              <Info className="w-4 h-4 text-warning flex-shrink-0" />
              <p className="text-sm text-warning">
                This action will automatically create a new semester with appropriate settings.
                The backend will determine the next semester based on the current academic year.
              </p>
            </div>
          </div>

          <DialogFooter className="flex gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setShowNewSemesterModal(false)}
              disabled={creatingSemester}
            >
              Cancel
            </Button>
            <Button
              onClick={() => setShowConfirmModal(true)}
              disabled={creatingSemester}
              className="bg-primary hover:bg-primary-hover text-text-on-primary"
            >
              {creatingSemester ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <PlusCircle className="w-4 h-4 mr-2" />
              )}
              Create Semester
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmation Modal */}
      <Dialog open={showConfirmModal} onOpenChange={setShowConfirmModal}>
        <DialogContent >
          <DialogHeader>
            <DialogTitle>Confirm New Semester Creation</DialogTitle>
            <DialogDescription className="text-left">
              Are you sure you want to create a new semester? This action will:
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Create a new {newSemesterPreview?.name} for {newSemesterPreview?.session}</li>
                <li>Auto-generate appropriate semester settings</li>
                <li>Close the current active semester (if any)</li>
                <li>Initialize level unit requirements with default values</li>
              </ul>
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="flex gap-2 sm:gap-0">
            <DialogClose asChild>
              <Button
                variant="outline"
                disabled={creatingSemester}
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              onClick={createNewSemester}
              disabled={creatingSemester}
              className="bg-primary hover:bg-primary-hover text-text-on-primary"
            >
              {creatingSemester ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Semester'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rollback Confirmation Modal */}
      <Dialog open={showRollbackModal} onOpenChange={setShowRollbackModal}>
        <DialogContent className="sm:max-w-md bg-surface border-border">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-error">
              <AlertTriangle className="w-5 h-5" />
              Rollback Semester
            </DialogTitle>
            <DialogDescription className="text-left">
              <div className="space-y-3">
                <p>This action will revert to the previous semester:</p>

                <div className="p-3 bg-background2 border border-border rounded-lg">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-text2">From:</p>
                      <p className="font-semibold text-text-primary">
                        {formatSemesterName(rollbackInfo?.currentSemester)} {rollbackInfo?.currentSession}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-text2">To:</p>
                      <p className="font-semibold text-text-primary">
                        {formatSemesterName(rollbackInfo?.previousSemester)} {rollbackInfo?.previousSession}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-error/10 border border-error/20 rounded-lg flex gap-2">
                  <AlertTriangle className="h-4 w-4 text-error flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-error">
                    This operation cannot be undone. Ensure you have a backup and consider:
                    <ul className="list-disc pl-4 mt-2 space-y-1">
                      <li>No student registrations have been made</li>
                      <li>No results have been published</li>
                      <li>This is being done soon after semester creation</li>
                    </ul>
                  </span>
                </div>

                <div className="p-3 bg-warning/10 border border-warning/20 rounded-lg">
                  <Info className="w-4 h-4 text-warning inline mr-2" />
                  <span className="text-sm text-warning">
                    Student levels and probation status will be reverted.
                  </span>
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="flex gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setShowRollbackModal(false)}
              disabled={rollingBack}
            >
              Cancel
            </Button>
            <Button
              onClick={performRollback}
              disabled={rollingBack}
              className="bg-error hover:bg-error-hover text-text-on-error"
            >
              {rollingBack ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Rolling Back...
                </>
              ) : (
                <>
                  <Undo2 className="w-4 h-4 mr-2" />
                  Confirm Rollback
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Current Active Semester Card */}
        <Card className="bg-surface border-border">
          <CardHeader className="bg-primary text-text-on-primary">
            <CardTitle className="flex items-center gap-2 text-text-on-primary">
              <Calendar className="w-5 h-5 " />
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
                    <Badge variant="default" >
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

        {/* Rollback Status Card */}
        <Card className={`border ${rollbackInfo?.canRollback ? 'border-warning' : 'border-border'} bg-surface`}>
          <CardHeader className={`${rollbackInfo?.canRollback ? 'bg-warning/20' : 'bg-surface-elevated'} border-b border-border`}>
            <CardTitle className="flex items-center gap-2">
              <History className="w-5 h-5" />
              Rollback Status
              {checkingRollback && (
                <Loader2 className="w-4 h-4 animate-spin" />
              )}
            </CardTitle>
            <CardDescription>
              {rollbackInfo?.canRollback
                ? 'Semester rollback is available'
                : 'No previous semester available for rollback'}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            {rollbackInfo?.canRollback ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-background2 rounded-lg">
                    <p className="text-sm text-text2">Current Semester</p>
                    <p className="font-bold text-lg text-text-primary">
                      {formatSemesterName(rollbackInfo.currentSemester)}
                    </p>
                    <p className="text-sm">{rollbackInfo.currentSession}</p>
                  </div>
                  <div className="text-center p-3 bg-background2 rounded-lg">
                    <p className="text-sm text-text2">Previous Semester</p>
                    <p className="font-bold text-lg text-text-primary">
                      {formatSemesterName(rollbackInfo.previousSemester)}
                    </p>
                    <p className="text-sm">{rollbackInfo.previousSession}</p>
                  </div>
                </div>
                <Button
                  onClick={() => setShowRollbackModal(true)}
                  variant="destructive"
                  className="w-full bg-error hover:bg-error-hover text-text-on-error"
                >
                  <Undo2 className="w-4 h-4 mr-2" />
                  Rollback to Previous Semester
                </Button>
                <p className="text-xs text-text2 text-center">
                  Use this only if you created the current semester by mistake
                </p>
              </div>
            ) : (
              <div className="text-center py-4">
                <History className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="text-text2">Rollback not available</p>
                <p className="text-sm text-text2">
                  Either this is the first semester or insufficient history exists
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Manual Semester Setup Card */}
      <Card className="bg-surface border-border">
        <CardHeader className="bg-secondary text-gray">
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Manual Semester Setup
          </CardTitle>
          <CardDescription className="text-gray-200">
            Advanced: Manually configure and start a new semester
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
                  <SelectItem value="first">First Semester</SelectItem>
                  <SelectItem value="second">Second Semester</SelectItem>
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
              className="w-full bg-accent hover:bg-accent-hover text-text-on-primary"
            >
              {startingSemester ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Settings className="w-4 h-4 mr-2" />
              )}
              Manually Start Semester
            </Button>
          </form>
        </CardContent>
      </Card>

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
          />
        </CardContent>
      </Card>
    </div>
  );
}