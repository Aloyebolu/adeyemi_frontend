'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/Badge';
import { Table } from '@/components/ui/table/Table2';
import { toast } from 'sonner';
import { Loader2, Settings, BookOpen, Save, Eye, Building, Users, Calendar } from 'lucide-react';
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

export default function HODSemesterPage() {
  const [activeSemester, setActiveSemester] = useState<Semester | null>(null);
  const [loading, setLoading] = useState(true);
  const [savingSettings, setSavingSettings] = useState(false);
  const [togglingRegistration, setTogglingRegistration] = useState(false);
  const [togglingResults, setTogglingResults] = useState(false);
  const [levelSettings, setLevelSettings] = useState<LevelSetting[]>([]);

  const { fetchData } = useDataFetcher();

  // Define columns for the AFUED Table
  const columns = [
    {
      accessorKey: "level",
      header: "Level",
      cell: ({ row }: { row: any }) => `Level ${row.original.level}`
    },
    {
      accessorKey: "minUnits",
      header: "Minimum Units",
      editable: true,
      cell: ({ row }: { row: any }) => row.original.minUnits || 'Not set'
    },
    {
      accessorKey: "maxUnits",
      header: "Maximum Units",
      editable: true,
      cell: ({ row }: { row: any }) => row.original.maxUnits || 'Not set'
    }
  ];

  // Transform level settings for table data
  const tableData = levelSettings.map(setting => ({
    id: setting.level.toString(),
    level: setting.level,
    minUnits: setting.minUnits,
    maxUnits: setting.maxUnits
  }));

  useEffect(() => {
    fetchActiveSemester();
  }, []);

  const fetchActiveSemester = async () => {
    try {
      const result = await fetchData('semester/active', 'GET');
      setActiveSemester(result.data);
      if (result.data) {
        setLevelSettings(result.data.levelSettings || []);
      }
    } catch (error: any) {
      console.error('Error fetching active semester:', error);
      // Don't show error toast if no active semester - that's normal
      if (error.message && !error.message.includes('No active semester')) {
        toast.error(error.message || 'Failed to fetch active semester');
      }
      setActiveSemester(null);
      setLevelSettings([]);
    } finally {
      setLoading(false);
    }
  };

  const updateLevelSettings = async () => {
    if (!activeSemester) return;
    
    setSavingSettings(true);
    try {
      const result = await fetchData(
        `semester/${activeSemester.department._id}/level-settings`,
        'PUT', 
        { levelSettings }
      );

      setActiveSemester(result.data);
      toast.success('Level settings updated successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update level settings');
    } finally {
      setSavingSettings(false);
    }
  };

  const toggleRegistration = async (status: boolean) => {
    if (!activeSemester) return;
    
    setTogglingRegistration(true);
    try {
      const result = await fetchData('semester/registration', 'PUT', { 
        status,
        departmentId: activeSemester.department._id 
      });
      
      setActiveSemester(prev => prev ? { ...prev, isRegistrationOpen: status } : null);
      toast.success(`Course registration ${status ? 'opened' : 'closed'}`);
    } catch (error: any) {
      toast.error(error.message || 'Failed to update registration status');
    } finally {
      setTogglingRegistration(false);
    }
  };

  const toggleResultPublication = async (status: boolean) => {
    if (!activeSemester) return;
    
    setTogglingResults(true);
    try {
      const result = await fetchData('semester/results', 'PUT', { 
        status,
        departmentId: activeSemester.department._id 
      });
      
      setActiveSemester(prev => prev ? { ...prev, isResultsPublished: status } : null);
      toast.success(`Result publication ${status ? 'opened' : 'closed'}`);
    } catch (error: any) {
      toast.error(error.message || 'Failed to update result publication status');
    } finally {
      setTogglingResults(false);
    }
  };

  // Handle cell edits from the table
  const handleCellEdit = (rowIndex: number, columnId: string, newValue: any) => {
    const updatedSettings = [...levelSettings];
    const field = columnId as 'minUnits' | 'maxUnits';
    
    if (updatedSettings[rowIndex]) {
      updatedSettings[rowIndex] = {
        ...updatedSettings[rowIndex],
        [field]: newValue === '' ? undefined : parseInt(newValue)
      };
      setLevelSettings(updatedSettings);
    }
  };

  // Manual input handlers for level settings (alternative to table editing)
  const updateLevelSettingValue = (level: number, field: 'minUnits' | 'maxUnits', value: string) => {
    const numValue = value === '' ? undefined : parseInt(value);
    setLevelSettings(prev => 
      prev.map(setting => 
        setting.level === level 
          ? { ...setting, [field]: numValue }
          : setting
      )
    );
  };

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
          <h1 className="text-3xl font-bold tracking-tight">Department Semester Management</h1>
          <p className="text-muted-foreground">
            Manage semester settings for your department
          </p>
        </div>
        <Button
          variant="outline"
          onClick={fetchActiveSemester}
        >
          <Eye className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {activeSemester ? (
        <>
          <div className="grid gap-6 md:grid-cols-2">
            {/* Current Semester Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Current Semester
                </CardTitle>
                <CardDescription>
                  Active semester information for your department
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
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
                    <Label className="flex items-center gap-2">
                      <Building className="w-4 h-4" />
                      Department
                    </Label>
                    <Badge variant="default">{activeSemester.department.name}</Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <Label className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Start Date
                    </Label>
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
                    <Label htmlFor="hod-registration-toggle" className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Course Registration
                    </Label>
                    <div className="flex items-center gap-2">
                      <Badge variant={activeSemester.isRegistrationOpen ? "default" : "secondary"}>
                        {activeSemester.isRegistrationOpen ? "Open" : "Closed"}
                      </Badge>
                      <Switch
                        id="hod-registration-toggle"
                        checked={activeSemester.isRegistrationOpen}
                        onCheckedChange={toggleRegistration}
                        disabled={togglingRegistration}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="hod-results-toggle">Result Publication</Label>
                    <div className="flex items-center gap-2">
                      <Badge variant={activeSemester.isResultsPublished ? "default" : "secondary"}>
                        {activeSemester.isResultsPublished ? "Open" : "Closed"}
                      </Badge>
                      <Switch
                        id="hod-results-toggle"
                        checked={activeSemester.isResultsPublished}
                        onCheckedChange={toggleResultPublication}
                        disabled={togglingResults}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Level Settings Management */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Level Unit Settings
                </CardTitle>
                <CardDescription>
                  Configure minimum and maximum units for each level
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Table View for Level Settings */}
                  <div className="border rounded-lg">
                    <Table
                      columns={columns}
                      data={tableData}
                      enableSearch={false}
                      enableSort={true}
                      enablePagination={false}
                      enableFilter={false}
                      enableSelection={false}
                      enableExport={false}
                      variant="corporate"
                      showNumbering={true}
                      numberingType="(1)"
                      numberingText="Level"
                      onCellEdit={handleCellEdit}
                      tableEmptyMessage="No level settings configured"
                      controls={false}
                    />
                  </div>
                  
                  {/* Alternative: Manual Input Form */}
                  <div className="space-y-3">
                    <Label>Quick Edit Level Settings:</Label>
                    <div className="grid grid-cols-2 gap-4">
                      {levelSettings.map((level, index) => (
                        <div key={index} className="border rounded-lg p-3">
                          <h4 className="font-semibold mb-2 text-sm">Level {level.level}</h4>
                          <div className="space-y-2">
                            <div>
                              <Label htmlFor={`min-${level.level}`} className="text-xs">Min Units</Label>
                              <Input
                                id={`min-${level.level}`}
                                type="number"
                                min="0"
                                value={level.minUnits || ''}
                                onChange={(e) => updateLevelSettingValue(level.level, 'minUnits', e.target.value)}
                                placeholder="0"
                                className="h-8 text-sm"
                              />
                            </div>
                            <div>
                              <Label htmlFor={`max-${level.level}`} className="text-xs">Max Units</Label>
                              <Input
                                id={`max-${level.level}`}
                                type="number"
                                min="0"
                                value={level.maxUnits || ''}
                                onChange={(e) => updateLevelSettingValue(level.level, 'maxUnits', e.target.value)}
                                placeholder="0"
                                className="h-8 text-sm"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button
                    onClick={updateLevelSettings}
                    disabled={savingSettings || !activeSemester}
                    className="w-full"
                  >
                    {savingSettings ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4 mr-2" />
                    )}
                    Save Level Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Frequently used semester management actions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                <Button
                  variant="outline"
                  onClick={() => toggleRegistration(true)}
                  disabled={togglingRegistration || activeSemester.isRegistrationOpen}
                >
                  Open Registration
                </Button>
                <Button
                  variant="outline"
                  onClick={() => toggleRegistration(false)}
                  disabled={togglingRegistration || !activeSemester.isRegistrationOpen}
                >
                  Close Registration
                </Button>
                <Button
                  variant="outline"
                  onClick={() => toggleResultPublication(true)}
                  disabled={togglingResults || activeSemester.isResultsPublished}
                >
                  Publish Results
                </Button>
                <Button
                  variant="outline"
                  onClick={() => toggleResultPublication(false)}
                  disabled={togglingResults || !activeSemester.isResultsPublished}
                >
                  Close Results
                </Button>
              </div>
            </CardContent>
          </Card>
        </>
      ) : (
        // No Active Semester State
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              No Active Semester
            </CardTitle>
            <CardDescription>
              Current semester status for your department
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
                <Calendar className="w-8 h-8 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">No Active Semester</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  There is currently no active semester for your department. 
                  Please contact the administration to start a new semester.
                </p>
              </div>
              <Badge variant="secondary" className="mt-2">Department Inactive</Badge>
              
              <div className="pt-4">
                <Button
                  variant="outline"
                  onClick={fetchActiveSemester}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Check Again
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}