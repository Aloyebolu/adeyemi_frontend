"use client";

import { useState, useEffect } from "react";
import { usePage } from "@/hooks/usePage";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useNotifications } from "@/hooks/useNotification";
import { Badge } from "@/components/ui/Badge";
import {
  Calendar,
  Edit,
  Save,
  X,
  Clock,
  Building,
  GraduationCap,
  Lock,
  LockOpen,
  Eye,
  EyeOff,
  AlertTriangle,
  CheckCircle,
  Loader2,
  ChevronDown,
  ChevronUp,
  Settings,
  Info,
} from "lucide-react";
import { useDataFetcher } from "@/lib/dataFetcher";
import NotesCard from "@/components/ui/card/NotesCard";

interface LevelSettings {
  level: number; // 100, 200, 300, 400
  minUnits: number;
  maxUnits: number;
  minCourses: number;
  maxCourses: number;
}

interface Semester {
  _id: string;
  name: "first" | "second" | "summer";
  session: string; // "2024/2025"
  academicSemester: {
    _id: string;
    name: string;
    year: string;
  };
  department: {
    _id: string;
    name: string;
    code: string;
  };
  levelSettings: LevelSettings[];
  startDate: string;
  endDate?: string;
  isActive: boolean;
  isRegistrationOpen: boolean;
  isResultsPublished: boolean;
  registrationDeadline?: string;
  lateRegistrationDate?: string;
  createdBy?: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface UpdateSemesterForm {
  levelSettings: LevelSettings[];
  registrationDeadline: string;
  lateRegistrationDate: string;
  isRegistrationOpen?: boolean;
}

export default function SemesterManagementPage() {
  const { setPage } = usePage();
  const { addNotification } = useNotifications();
  const { fetchData } = useDataFetcher();

  const [currentSemester, setCurrentSemester] = useState<Semester | null>(null);
  const [upcomingSemesters, setUpcomingSemesters] = useState<Semester[]>([]);
  const [pastSemesters, setPastSemesters] = useState<Semester[]>([]);
  const [currentDepartment, setCurrentDepartment] = useState<{ name: string; code: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editingSettings, setEditingSettings] = useState(false);
  const [expandedSemester, setExpandedSemester] = useState<string | null>(null);

  const [formData, setFormData] = useState<UpdateSemesterForm>({
    levelSettings: [
      { level: 100, minUnits: 12, maxUnits: 24, minCourses: 4, maxCourses: 6 },
      { level: 200, minUnits: 12, maxUnits: 24, minCourses: 4, maxCourses: 6 },
      { level: 300, minUnits: 12, maxUnits: 24, minCourses: 4, maxCourses: 6 },
      { level: 400, minUnits: 12, maxUnits: 24, minCourses: 4, maxCourses: 6 },
    ],
    registrationDeadline: "",
    lateRegistrationDate: "",
  });

  useEffect(() => {
    setPage("Semester Settings");
    loadSemesterData();
  }, [setPage]);

  const loadSemesterData = async () => {
    setLoading(true);
    try {
      // Load department's semester settings
      const semesterData = await fetchData('semester/active');
      
      if (semesterData.data) {
        const allSemesters: Semester = semesterData.data;
        
        // Find current active semester
        const activeSemester = allSemesters;
        if (activeSemester) {
          setCurrentSemester(activeSemester);
          setCurrentDepartment(activeSemester.department);
          
          // Initialize form data with current semester settings
          setFormData({
            levelSettings: activeSemester.levelSettings,
            registrationDeadline: activeSemester.registrationDeadline 
              ? activeSemester.registrationDeadline.split('T')[0] 
              : "",
            lateRegistrationDate: activeSemester.lateRegistrationDate 
              ? activeSemester.lateRegistrationDate.split('T')[0] 
              : "",
          });
        }
        
        // Categorize other semesters
        const now = new Date();
        // const upcoming: Semester[] = [];
        // const past: Semester[] = [];
        
        // allSemesters.forEach(semester => {
        //   if (semester._id !== activeSemester?._id) {
        //     const startDate = new Date(semester.startDate);
        //     if (startDate > now) {
        //       upcoming.push(semester);
        //     } else {
        //       past.push(semester);
        //     }
        //   }
        // });
        
        // // Sort by start date
        // upcoming.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
        // past.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
        
        // setUpcomingSemesters(upcoming);
        // setPastSemesters(past);
      }
    } catch (error) {
      console.error('Error loading semester data:', error);
      addNotification({
        variant: "error",
        message: "Failed to load semester settings",
      });
    } finally {
      setLoading(false);
    }
  };

  const validateDates = () => {
    const errors: string[] = [];
    
    if (!currentSemester) return errors;

    const startDate = new Date(currentSemester.startDate);
    const endDate = currentSemester.endDate ? new Date(currentSemester.endDate) : null;

    if (formData.registrationDeadline) {
      const regDeadline = new Date(formData.registrationDeadline);
      
      if (regDeadline < startDate) {
        errors.push("Registration deadline cannot be before semester start date");
      }
      
      if (endDate && regDeadline > endDate) {
        errors.push("Registration deadline cannot be after semester end date");
      }
    }

    if (formData.lateRegistrationDate && formData.registrationDeadline) {
      const lateRegDate = new Date(formData.lateRegistrationDate);
      const regDeadline = new Date(formData.registrationDeadline);
      
      if (lateRegDate <= regDeadline) {
        errors.push("Late registration date must be after registration deadline");
      }
      
      if (endDate && lateRegDate > endDate) {
        errors.push("Late registration date cannot be after semester end date");
      }
    }

    // Validate level settings
    formData.levelSettings.forEach(setting => {
      if (setting.minUnits > setting.maxUnits) {
        errors.push(`Level ${setting.level}: Minimum units cannot be greater than maximum units`);
      }
      if (setting.minCourses > setting.maxCourses) {
        errors.push(`Level ${setting.level}: Minimum courses cannot be greater than maximum courses`);
      }
      if (setting.minUnits < 1 || setting.maxUnits < 1) {
        errors.push(`Level ${setting.level}: Units must be at least 1`);
      }
      if (setting.minCourses < 1 || setting.maxCourses < 1) {
        errors.push(`Level ${setting.level}: Courses must be at least 1`);
      }
    });

    return errors;
  };

  const handleUpdateSettings = async () => {
    if (!currentSemester) return;

    const errors = validateDates();
    if (errors.length > 0) {
      errors.forEach(error => {
        addNotification({
          variant: "error",
          message: error,
        });
      });
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetchData(`semester/settings`, "PATCH", formData);

        addNotification({
          variant: "success",
          message: "Semester settings updated successfully",
        });
        setEditingSettings(false);
        loadSemesterData(); // Reload data
    } catch (error) {
      console.error('Error updating settings:', error);
      addNotification({
        variant: "error",
        message: error instanceof Error ? error.message : "Failed to update settings",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleRegistration = async () => {
    if (!currentSemester) return;

    try {
      const response = await fetchData(`semester/toggle-registration`, "PATCH", {
        isRegistrationOpen: !currentSemester.isRegistrationOpen,
      });

        addNotification({
          variant: "success",
          message: response.message || "Registration status updated successfully",
        });
        loadSemesterData(); // Reload data

    } catch (error) {
      console.error('Error toggling registration status:', error);
      addNotification({
        variant: "error",
        message: error instanceof Error ? error.message : "Failed to update registration status",
      });
    }
  };

  const handleLevelSettingChange = (level: number, field: keyof LevelSettings, value: number) => {
    setFormData(prev => ({
      ...prev,
      levelSettings: prev.levelSettings.map(setting => 
        setting.level === level ? { ...setting, [field]: value } : setting
      ),
    }));
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Not set";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getSemesterStatus = (semester: Semester) => {
    const now = new Date();
    const startDate = new Date(semester.startDate);
    const endDate = semester.endDate ? new Date(semester.endDate) : null;
    
    if (now < startDate) return "Upcoming";
    if (endDate && now > endDate) return "Completed";
    return "Ongoing";
  };

  const toggleExpandSemester = (semesterId: string) => {
    setExpandedSemester(expandedSemester === semesterId ? null : semesterId);
  };

  const startEditSettings = () => {
    if (currentSemester) {
      setFormData({
        levelSettings: currentSemester.levelSettings,
        registrationDeadline: currentSemester.registrationDeadline 
          ? currentSemester.registrationDeadline.split('T')[0] 
          : "",
        lateRegistrationDate: currentSemester.lateRegistrationDate 
          ? currentSemester.lateRegistrationDate.split('T')[0] 
          : "",
      });
      setEditingSettings(true);
    }
  };

  const cancelEdit = () => {
    setEditingSettings(false);
    if (currentSemester) {
      setFormData({
        levelSettings: currentSemester.levelSettings,
        registrationDeadline: currentSemester.registrationDeadline 
          ? currentSemester.registrationDeadline.split('T')[0] 
          : "",
        lateRegistrationDate: currentSemester.lateRegistrationDate 
          ? currentSemester.lateRegistrationDate.split('T')[0] 
          : "",
      });
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-text2">Loading semester settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 min-h-screen space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Settings className="text-primary w-6 h-6" />
          <div>
            <h1 className="text-2xl font-bold text-primary">
              Semester Settings
            </h1>
            <p className="text-text2 text-sm">
              {currentDepartment?.name} • Manage Registration Settings
            </p>
          </div>
        </div>
        
        {currentSemester && !editingSettings && (
          <Button
            onClick={startEditSettings}
            variant="outline"
            className="border-primary text-primary hover:bg-primary hover:text-white"
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit Settings
          </Button>
        )}
      </div>

      {/* Current Semester Card */}
      {currentSemester ? (
        <>
          <Card className="border-2 border-primary">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold text-primary">
                      Current Semester
                    </h3>
                    <Badge variant="success">Active</Badge>
                    <Badge variant={currentSemester.isRegistrationOpen ? "success" : "neutral"}>
                      {currentSemester.isRegistrationOpen ? "Registration Open" : "Registration Closed"}
                    </Badge>
                  </div>
                  
                  <div className="text-lg font-semibold">
                    {currentSemester.name.charAt(0).toUpperCase() + currentSemester.name.slice(1)} Semester • {currentSemester.session}
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-text2 mt-2">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {formatDate(currentSemester.startDate)} - {formatDate(currentSemester.endDate)}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      Academic: {currentSemester.academicSemester?.name} {currentSemester.academicSemester?.year}
                    </span>
                  </div>
                </div>
                
                {/* {!editingSettings && ( */}
                {false && (

                  <Button
                    onClick={handleToggleRegistration}
                    variant={currentSemester.isRegistrationOpen ? "outline" : "default"}
                    size="sm"
                  >
                    {currentSemester.isRegistrationOpen ? (
                      <>
                        <Lock className="w-4 h-4 mr-2" />
                        Close Registration
                      </>
                    ) : (
                      <>
                        <LockOpen className="w-4 h-4 mr-2" />
                        Open Registration
                      </>
                    )}
                  </Button>
                )}
              </div>

              {/* Edit Form */}
              {editingSettings ? (
                <div className="space-y-6">
                  <div className="p-4 bg-primary bg-opacity-5 rounded-lg">
                    <div className="flex items-center gap-2 text-primary mb-2">
                      <Info className="w-4 h-4" />
                      <span className="text-sm font-medium">Edit Registration Settings</span>
                    </div>
                    <p className="text-sm text-text2">
                      Configure registration deadlines and course limits for each level. These settings affect student course registration.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Registration Dates */}
                    {/* <div className="space-y-4">
                      <h4 className="font-semibold text-primary">Registration Dates</h4>
                      
                      <div>
                        <label className="block text-sm font-medium text-text2 mb-2">
                          Registration Deadline
                        </label>
                        <input
                          type="date"
                          disabled
                          value={formData.registrationDeadline}
                          onChange={(e) => setFormData({...formData, registrationDeadline: e.target.value})}
                          min={currentSemester.startDate.split('T')[0]}
                          max={currentSemester.endDate?.split('T')[0]}
                          className="w-full border border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        <p className="text-xs text-text2 mt-1">
                          Students cannot register after this date without permission
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-text2 mb-2">
                          Late Registration Date
                        </label>
                        <input
                          type="date"
                          disabled
                          value={formData.lateRegistrationDate}
                          onChange={(e) => setFormData({...formData, lateRegistrationDate: e.target.value})}
                          min={formData.registrationDeadline || currentSemester.startDate.split('T')[0]}
                          max={currentSemester.endDate?.split('T')[0]}
                          className="w-full border border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        <p className="text-xs text-text2 mt-1">
                          Students can register with penalty until this date
                        </p>
                      </div>
                    </div> */}

                    {/* Level Settings */}
                    <div>
                      <h4 className="font-semibold text-primary mb-4 flex items-center gap-2">
                        <GraduationCap className="w-5 h-5" />
                        Level Settings
                      </h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {formData.levelSettings.map((setting) => (
                          <Card key={setting.level} className="border border-border">
                            <CardContent className="p-4">
                              <h5 className="font-semibold text-center mb-3">Level {setting.level}</h5>
                              
                              <div className="space-y-3">
                                <div>
                                  <label className="block text-xs text-text2 mb-1">Min Units</label>
                                  <input
                                    type="number"
                                    min="1"
                                    max="50"
                                    value={setting.minUnits}
                                    onChange={(e) => handleLevelSettingChange(setting.level, 'minUnits', parseInt(e.target.value))}
                                    className="w-full border border-border rounded px-2 py-1 text-sm"
                                  />
                                </div>
                                
                                <div>
                                  <label className="block text-xs text-text2 mb-1">Max Units</label>
                                  <input
                                    type="number"
                                    min="1"
                                    max="50"
                                    value={setting.maxUnits}
                                    onChange={(e) => handleLevelSettingChange(setting.level, 'maxUnits', parseInt(e.target.value))}
                                    className="w-full border border-border rounded px-2 py-1 text-sm"
                                  />
                                </div>
                                
                                <div>
                                  <label className="block text-xs text-text2 mb-1">Min Courses</label>
                                  <input
                                    type="number"
                                    min="1"
                                    max="20"
                                    value={setting.minCourses}
                                    onChange={(e) => handleLevelSettingChange(setting.level, 'minCourses', parseInt(e.target.value))}
                                    className="w-full border border-border rounded px-2 py-1 text-sm"
                                  />
                                </div>
                                
                                <div>
                                  <label className="block text-xs text-text2 mb-1">Max Courses</label>
                                  <input
                                    type="number"
                                    min="1"
                                    max="20"
                                    value={setting.maxCourses}
                                    onChange={(e) => handleLevelSettingChange(setting.level, 'maxCourses', parseInt(e.target.value))}
                                    className="w-full border border-border rounded px-2 py-1 text-sm"
                                  />
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-border">
                    <Button
                      variant="outline"
                      onClick={cancelEdit}
                      disabled={submitting}
                    >
                      Cancel
                    </Button>
                    
                    <Button
                      onClick={handleUpdateSettings}
                      disabled={submitting}
                      className="bg-primary text-white hover:bg-primary/90 min-w-32"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              ) : (
                /* View Mode - Current Settings */
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Registration Dates */}
                    <div>
                      <h4 className="font-semibold text-primary mb-4">Registration Dates</h4>
                      
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-text2">Registration Deadline:</p>
                          <p className="font-semibold">
                            {currentSemester.registrationDeadline 
                              ? formatDate(currentSemester.registrationDeadline)
                              : "Not set"}
                          </p>
                        </div>
                        
                        <div>
                          <p className="text-sm text-text2">Late Registration Date:</p>
                          <p className="font-semibold">
                            {currentSemester.lateRegistrationDate 
                              ? formatDate(currentSemester.lateRegistrationDate)
                              : "Not set"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Level Settings Summary */}
                    <div>
                      <h4 className="font-semibold text-primary mb-4">Course Registration Limits</h4>
                      
                      <div className="grid grid-cols-2 gap-4">
                        {currentSemester.levelSettings.map((setting) => (
                          <Card key={setting.level} className="border border-border">
                            <CardContent className="p-3">
                              <h5 className="font-semibold text-center text-lg mb-2">Level {setting.level}</h5>
                              
                              <div className="space-y-1 ">
                                <div className="flex justify-between">
                                  <span className="text-text">Units:</span>
                                  <span>{setting.minUnits}-{setting.maxUnits}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-text">Courses:</span>
                                  <span>{setting.minCourses}-{setting.maxCourses}</span>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Results Status */}
                  {/* <div className="pt-6 border-t border-border">
                    <h4 className="font-semibold text-primary mb-4">Results & Publication</h4>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-text2 mb-1">Results Published</p>
                        <Badge variant={currentSemester.isResultsPublished ? "success" : "neutral"}>
                          {currentSemester.isResultsPublished ? "Published" : "Not Published"}
                        </Badge>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-sm text-text2">Created By Admin</p>
                        <p className="text-sm font-medium">
                          {currentSemester.createdBy?.name || "System Admin"}
                        </p>
                      </div>
                    </div>
                  </div> */}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Upcoming Semesters */}
          {upcomingSemesters.length > 0 && (
            <Card>
              <CardContent className="p-0">
                <div className="p-6 border-b border-border">
                  <h3 className="text-xl font-semibold text-primary">Upcoming Semesters</h3>
                  <p className="text-text2 text-sm">Future semesters scheduled for your department</p>
                </div>

                <div className="divide-y divide-border">
                  {upcomingSemesters.map((semester) => (
                    <SemesterItem 
                      key={semester._id}
                      semester={semester}
                      expanded={expandedSemester === semester._id}
                      onToggleExpand={() => toggleExpandSemester(semester._id)}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Past Semesters */}
          {pastSemesters.length > 0 && (
            <Card>
              <CardContent className="p-0">
                <div className="p-6 border-b border-border">
                  <h3 className="text-xl font-semibold text-primary">Past Semesters</h3>
                  <p className="text-text2 text-sm">Completed semesters for reference</p>
                </div>

                <div className="divide-y divide-border">
                  {pastSemesters.map((semester) => (
                    <SemesterItem 
                      key={semester._id}
                      semester={semester}
                      expanded={expandedSemester === semester._id}
                      onToggleExpand={() => toggleExpandSemester(semester._id)}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      ) : (
        /* No Active Semester */
        <Card className="border-2 border-border">
          <CardContent className="p-12 text-center">
            <Calendar className="w-16 h-16 text-text2 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-primary mb-2">No Active Semester</h3>
            <p className="text-text2 mb-6">
              There is currently no active semester for your department.
              <br />
              The semester will be created automatically by the administrator.
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-text2">
              <Info className="w-4 h-4" />
              <span>Contact the administrator to start a new semester</span>
            </div>
          </CardContent>
        </Card>
      )}

      <NotesCard
  title="Important Notes for HOD"
  notes={[
    { text: "Semesters are created automatically by the administrator - you cannot create new ones", type: "success" },
    { text: "You can edit registration settings, deadlines, and course limits for active semesters", type: "success" },
    { text: "Opening/closing registration controls student access to course registration", type: "success" },
    { text: "Level settings determine how many courses and units students can register for", type: "success" },
    { text: "Late registration allows students to register with penalties after the deadline", type: "success" },
    { text: "Results publication is controlled by the examination office", type: "success" },
  ]}
/>

    </div>
  );
}

// Reusable Semester Item Component
function SemesterItem({ 
  semester, 
  expanded, 
  onToggleExpand 
}: { 
  semester: Semester; 
  expanded: boolean; 
  onToggleExpand: () => void;
}) {
  const getSemesterStatus = (sem: Semester) => {
    const now = new Date();
    const startDate = new Date(sem.startDate);
    const endDate = sem.endDate ? new Date(sem.endDate) : null;
    
    if (now < startDate) return "Upcoming";
    if (endDate && now > endDate) return "Completed";
    return "Ongoing";
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Not set";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const status = getSemesterStatus(semester);

  return (
    <div className="p-6 hover:bg-background2 transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h4 className="font-semibold text-primary">
              {semester.name.charAt(0).toUpperCase() + semester.name.slice(1)} Semester • {semester.session}
            </h4>
            
            <Badge variant={semester.isActive ? "success" : "neutral"}>
              {semester.isActive ? "Active" : "Inactive"}
            </Badge>
            
            <Badge variant={
              status === "Upcoming" ? "info" :
              status === "Ongoing" ? "warning" : "neutral"
            }>
              {status}
            </Badge>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-text2">
            <span>
              {formatDate(semester.startDate)} - {formatDate(semester.endDate)}
            </span>
            <span>•</span>
            <span>Registration: {semester.isRegistrationOpen ? "Open" : "Closed"}</span>
            <span>•</span>
            <span>Results: {semester.isResultsPublished ? "Published" : "Not Published"}</span>
          </div>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleExpand}
        >
          {expanded ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </Button>
      </div>

      {expanded && (
        <div className="mt-6 pt-6 border-t border-border">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h5 className="font-semibold text-primary mb-3">Registration Settings</h5>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-text2">Registration Deadline:</span>
                  <span>{formatDate(semester.registrationDeadline)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text2">Late Registration:</span>
                  <span>{formatDate(semester.lateRegistrationDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text2">Academic Semester:</span>
                  <span>{semester.academicSemester?.name} {semester.academicSemester?.year}</span>
                </div>
              </div>
            </div>

            <div>
              <h5 className="font-semibold text-primary mb-3">Course Limits</h5>
              
              <div className="grid grid-cols-2 gap-3">
                {semester.levelSettings.map((setting) => (
                  <div key={setting.level} className="border border-border rounded p-3">
                    <div className="font-semibold text-center text-sm mb-2">Level {setting.level}</div>
                    <div className="text-xs text-center">
                      {setting.minUnits}-{setting.maxUnits} units • {setting.minCourses}-{setting.maxCourses} courses
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {semester.createdBy && (
            <div className="mt-6 pt-6 border-t border-border">
              <p className="text-sm text-text2">
                Created by: {semester.createdBy.name} ({semester.createdBy.email})
              </p>
              <p className="text-sm text-text2">
                Created on: {new Date(semester.createdAt).toLocaleDateString()}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}