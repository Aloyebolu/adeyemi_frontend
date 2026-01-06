"use client";

import { useEffect, useState } from "react";
import { usePage } from "@/hooks/usePage";
import { Card, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/Badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import {
  User,
  Mail,
  Shield,
  UserCircle2,
  Building2,
  Hash,
  Settings,
  Upload,
  GraduationCap,
  ClipboardList,
  Users,
  Lock,
  Eye,
  EyeOff,
  Bell,
  Globe,
  Phone,
  Calendar,
  BookOpen,
  CheckCircle2,
  Clock,
  AlertCircle,
  Flag,
  KeyRound,
  AlertTriangle,
  RefreshCw,
  CheckCircle,
  XCircle,
  Info,
} from "lucide-react";
import { useDataFetcher } from "@/lib/dataFetcher";
import useUser from "@/hooks/useUser";

interface UserProfile {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  department?: string;
  faculty?: string;
  staff_id?: string;
  matric_no?: string;
  role: "Student" | "Lecturer" | "HOD" | "Dean" | "Admin";
  admin_id?: string;
  level?: string;
  session?: string;
  lastPasswordChange: string | Date;
  passwordAgeDays: number;
  passwordExpiryDays: number;
  passwordStrength: "weak" | "medium" | "strong";
  passwordStatus?: {
    passwordAgeDays: number;
    passwordExpiryDays: number;
    daysRemaining: number;
    expiryDate: string;
    lastPasswordChange: string;
    passwordStrength: "weak" | "medium" | "strong";
    urgency: "none" | "low" | "medium" | "high" | "critical";
    needsChange: boolean;
    message: string;
  };
}

interface RoleSpecificSettings {
  notifications: boolean;
  emailAlerts: boolean;
  darkMode: boolean;
  resultSMS?: boolean;
  feeReminders?: boolean;
  uploadNotifications?: boolean;
  gradingDeadlineAlerts?: boolean;
  systemAlerts?: boolean;
  userApprovalAlerts?: boolean;
}

interface PasswordStatus {
  needsChange: boolean;
  urgency: "none" | "low" | "medium" | "high" | "critical";
  message: string;
  color: string;
  progress: number;
}

export default function ProfilePage() {
  const { setPage } = usePage();
  const [profile, setProfile] = useState<UserProfile>({
    _id: "",
    name: "",
    email: "",
    department: "",
    faculty: "",
    staff_id: "",
    matric_no: "",
    admin_id: "",
    role: "Student",
    lastPasswordChange: new Date(),
    passwordAgeDays: 0,
    passwordExpiryDays: 90,
    passwordStrength: "medium",
  });
  
  const [settings, setSettings] = useState<RoleSpecificSettings>({
    notifications: true,
    emailAlerts: true,
    darkMode: false,
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const { user } = useUser();
  const _id = user?.id;
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const { fetchData } = useDataFetcher();

  const roleConfig = {
    student: {
      color: "bg-blue-100 text-blue-800 border-blue-200",
      icon: <GraduationCap className="w-5 h-5" />,
      quickActions: [
        { label: "View Results", icon: <ClipboardList className="w-4 h-4" />, action: () => window.location.href = "/results" },
        { label: "Course Registration", icon: <BookOpen className="w-4 h-4" />, action: () => window.location.href = "/courses" },
        { label: "Fee Payment", icon: <CheckCircle2 className="w-4 h-4" />, action: () => window.location.href = "/fees" },
      ],
    },
    lecturer: {
      color: "bg-purple-100 text-purple-800 border-purple-200",
      icon: <User className="w-5 h-5" />,
      quickActions: [
        { label: "Upload Results", icon: <Upload className="w-4 h-4" />, action: () => window.location.href = "/upload" },
        { label: "Manage Courses", icon: <ClipboardList className="w-4 h-4" />, action: () => window.location.href = "/courses" },
        { label: "Attendance", icon: <Calendar className="w-4 h-4" />, action: () => window.location.href = "/attendance" },
      ],
    },
    hod: {
      color: "bg-green-100 text-green-800 border-green-200",
      icon: <Users className="w-5 h-5" />,
      quickActions: [
        { label: "Department Dashboard", icon: <Building2 className="w-4 h-4" />, action: () => window.location.href = "/department" },
        { label: "Staff Management", icon: <Users className="w-4 h-4" />, action: () => window.location.href = "/staff" },
        { label: "Course Allocation", icon: <ClipboardList className="w-4 h-4" />, action: () => window.location.href = "/allocation" },
      ],
    },
    dean: {
      color: "bg-orange-100 text-orange-800 border-orange-200",
      icon: <Building2 className="w-5 h-5" />,
      quickActions: [
        { label: "Faculty Overview", icon: <Globe className="w-4 h-4" />, action: () => window.location.href = "/faculty" },
        { label: "Approve Requests", icon: <CheckCircle2 className="w-4 h-4" />, action: () => window.location.href = "/approvals" },
        { label: "Reports", icon: <ClipboardList className="w-4 h-4" />, action: () => window.location.href = "/reports" },
      ],
    },
    admin: {
      color: "bg-red-100 text-red-800 border-red-200",
      icon: <Shield className="w-5 h-5" />,
      quickActions: [
        { label: "User Management", icon: <Users className="w-4 h-4" />, action: () => window.location.href = "/users" },
        { label: "System Settings", icon: <Settings className="w-4 h-4" />, action: () => window.location.href = "/settings" },
        { label: "Audit Logs", icon: <Clock className="w-4 h-4" />, action: () => window.location.href = "/audit" },
      ],
    },
  };

  useEffect(() => {
    setPage("Profile");
    fetchUserProfile();
  }, [setPage, _id]);

  const fetchUserProfile = async () => {
    try {
      const response = await fetchData(`/user/profile`);
      if (response.data) {
        setProfile(response.data);
        setSettings(response.data.settings || settings);
      }
    } catch (error) {
      console.error("Failed to fetch profile:", error);
      // Fallback mock data
      setProfile({
        _id: _id || "",
        name: "Aloye Breakthrough",
        email: "breakthrough@afued.edu.ng",
        phone: "+234 801 234 5678",
        department: "Computer Science",
        faculty: "Faculty of Science",
        staff_id: "AFUED/CS/LEC/015",
        role: "Student",
        lastPasswordChange: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000), // 45 days ago
        passwordAgeDays: 45,
        passwordExpiryDays: 90,
        passwordStrength: "medium",
      });
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStatus = (): PasswordStatus => {
    // Use backend-provided passwordStatus if available
    if (profile.passwordStatus) {
      const status = profile.passwordStatus;
      const percentage = 100 - (status.daysRemaining / status.passwordExpiryDays * 100);
      
      return {
        needsChange: status.needsChange,
        urgency: status.urgency,
        message: status.message,
        color: getColorByUrgency(status.urgency),
        progress: Math.min(Math.max(percentage, 0), 100),
      };
    }
    
    // Fallback calculation
    const daysRemaining = profile.passwordExpiryDays - profile.passwordAgeDays;
    const percentage = (profile.passwordAgeDays / profile.passwordExpiryDays) * 100;

    if (daysRemaining <= 0) {
      return {
        needsChange: true,
        urgency: "critical",
        message: "Password has expired! Change immediately.",
        color: "bg-red-500",
        progress: 100,
      };
    } else if (daysRemaining <= 7) {
      return {
        needsChange: true,
        urgency: "high",
        message: "Password expires in less than a week",
        color: "bg-orange-500",
        progress: 85,
      };
    } else if (daysRemaining <= 30) {
      return {
        needsChange: true,
        urgency: "medium",
        message: "Consider changing your password soon",
        color: "bg-yellow-500",
        progress: 70,
      };
    } else if (profile.passwordStrength === "weak") {
      return {
        needsChange: true,
        urgency: "low",
        message: "Weak password detected. Consider strengthening.",
        color: "bg-yellow-300",
        progress: 50,
      };
    } else {
      return {
        needsChange: false,
        urgency: "none",
        message: "Password is secure",
        color: "bg-green-500",
        progress: Math.min(percentage, 100),
      };
    }
  };

  const getColorByUrgency = (urgency: string): string => {
    switch (urgency) {
      case "critical": return "bg-red-500";
      case "high": return "bg-orange-500";
      case "medium": return "bg-yellow-500";
      case "low": return "bg-yellow-300";
      default: return "bg-green-500";
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");

    if (!passwords.current || !passwords.new || !passwords.confirm) {
      setPasswordError("All password fields are required");
      return;
    }

    if (passwords.new !== passwords.confirm) {
      setPasswordError("New passwords do not match");
      return;
    }

    if (passwords.new.length < 8) {
      setPasswordError("Password must be at least 8 characters long");
      return;
    }

    setPasswordSaving(true);

    try {
      await fetchData(`/auth/password`, "PUT", {
        currentPassword: passwords.current,
        newPassword: passwords.new,
      });

      setPasswordSuccess("✅ Password changed successfully!");
      
      // Reset form
      setPasswords({ current: "", new: "", confirm: "" });
      
      // Refresh profile to get updated password info
      await fetchUserProfile();
      
      // Clear success message after 5 seconds
      setTimeout(() => setPasswordSuccess(""), 5000);
    } catch (error: any) {
      setPasswordError(error.message || "Failed to change password");
    } finally {
      setPasswordSaving(false);
    }
  };

  const handleSettingChange = async (key: keyof RoleSpecificSettings, value: boolean) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);

    try {
      await fetchData(`/user/settings`, "PUT", { [key]: value });
    } catch (error) {
      console.error("Failed to save settings:", error);
      // Revert on error
      setSettings({ ...settings, [key]: !value });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted">Loading your profile...</p>
        </div>
      </div>
    );
  }

  const currentRoleConfig = roleConfig[profile.role];
  // const currentRoleConfig = roleConfig;

  const passwordStatus = getPasswordStatus();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f8f9fa] to-[#e9ecef] p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header with Nigerian Theme */}
        <div className="flex items-center justify-between mb-6 p-4 bg-white rounded-xl shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-600 to-white flex items-center justify-center shadow">
              <Flag className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">AFUED Profile</h1>
              <p className="text-sm text-muted">Adeyemi Federal University of Education</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge className={`px-4 py-2 ${currentRoleConfig?.color} border`}>
              <div className="flex items-center gap-2">
                {currentRoleConfig.icon}
                <span className="font-medium">{profile.role}</span>
              </div>
            </Badge>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => window.location.href = "/edit-profile"}
            >
              Edit Personal Info
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information Card (Locked) */}
            <Card className="rounded-2xl shadow-lg border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <UserCircle2 className="w-6 h-6 text-primary" />
                    Personal Information
                  </h2>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => window.location.href = "/edit-profile"}
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Edit in Settings
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Full Name</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <User className="w-4 h-4 text-muted" />
                        <Input
                          value={profile.name}
                          disabled
                          className="bg-gray-100 opacity-70 cursor-not-allowed"
                        />
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-gray-700">Email Address</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Mail className="w-4 h-4 text-muted" />
                        <Input
                          value={profile.email}
                          disabled
                          className="bg-gray-100 opacity-70 cursor-not-allowed"
                        />
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-gray-700">Phone Number</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Phone className="w-4 h-4 text-muted" />
                        <Input
                          value={profile.phone || ""}
                          disabled
                          className="bg-gray-100 opacity-70 cursor-not-allowed"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {profile.department && (
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Department</Label>
                        <div className="flex items-center gap-2 mt-1">
                          <Building2 className="w-4 h-4 text-muted" />
                          <Input
                            value={profile.department}
                            disabled
                            className="bg-gray-100 opacity-70 cursor-not-allowed"
                          />
                        </div>
                      </div>
                    )}

                    {profile.faculty && (
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Faculty</Label>
                        <div className="flex items-center gap-2 mt-1">
                          <Building2 className="w-4 h-4 text-muted" />
                          <Input
                            value={profile.faculty}
                            disabled
                            className="bg-gray-100 opacity-70 cursor-not-allowed"
                          />
                        </div>
                      </div>
                    )}

                    {profile.staff_id && (
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Staff ID</Label>
                        <div className="flex items-center gap-2 mt-1">
                          <Hash className="w-4 h-4 text-muted" />
                          <Input
                            value={profile.staff_id}
                            disabled
                            className="bg-gray-100 opacity-70 cursor-not-allowed"
                          />
                        </div>
                      </div>
                    )}

                    {profile.matric_no && (
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Matric Number</Label>
                        <div className="flex items-center gap-2 mt-1">
                          <Hash className="w-4 h-4 text-muted" />
                          <Input
                            value={profile.matric_no}
                            disabled
                            className="bg-gray-100 opacity-70 cursor-not-allowed"
                          />
                        </div>
                      </div>
                    )}

                    {profile.admin_id && (
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Admin ID</Label>
                        <div className="flex items-center gap-2 mt-1">
                          <Hash className="w-4 h-4 text-muted" />
                          <Input
                            value={profile.admin_id}
                            disabled
                            className="bg-gray-100 opacity-70 cursor-not-allowed"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-500">
                    Personal information can only be edited on the{' '}
                    <a href="/edit-profile" className="text-primary hover:underline font-medium">
                      Edit Profile page
                    </a>
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Password Status & Management Card */}
            <Card className="rounded-2xl shadow-lg border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <KeyRound className="w-6 h-6 text-primary" />
                    Password Security
                  </h2>
                  {passwordStatus.needsChange && (
                    <Badge 
                      variant={
                        passwordStatus.urgency === "critical" ? "destructive" :
                        passwordStatus.urgency === "high" ? "default" : "outline"
                      }
                      className="animate-pulse"
                    >
                      <AlertTriangle className="w-3 h-3 mr-1" />
                      {passwordStatus.urgency.toUpperCase()}
                    </Badge>
                  )}
                </div>

                {/* Password Status Indicator */}
                <div className="mb-8 p-4 rounded-xl bg-gray-50">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Shield className={`w-5 h-5 ${
                        passwordStatus.urgency === "critical" ? "text-red-600" :
                        passwordStatus.urgency === "high" ? "text-orange-600" :
                        passwordStatus.urgency === "medium" ? "text-yellow-600" : "text-green-600"
                      }`} />
                      <span className="font-medium">Password Health</span>
                    </div>
                    <span className="text-sm text-gray-600">
                      Changed {profile.passwordAgeDays} days ago
                    </span>
                  </div>
                  
                  <Progress value={passwordStatus.progress} className="h-2 mb-3" />
                  
                  <div className={`flex items-center gap-2 p-3 rounded-lg ${
                    passwordStatus.urgency === "critical" ? "bg-red-50 text-red-800 border border-red-200" :
                    passwordStatus.urgency === "high" ? "bg-orange-50 text-orange-800 border border-orange-200" :
                    passwordStatus.urgency === "medium" ? "bg-yellow-50 text-yellow-800 border border-yellow-200" :
                    "bg-green-50 text-green-800 border border-green-200"
                  }`}>
                    {passwordStatus.urgency === "critical" ? (
                      <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    ) : passwordStatus.urgency === "none" ? (
                      <CheckCircle className="w-5 h-5 flex-shrink-0" />
                    ) : (
                      <Info className="w-5 h-5 flex-shrink-0" />
                    )}
                    <p className="text-sm font-medium">{passwordStatus.message}</p>
                  </div>
                </div>

                {/* Password Change Form */}
                <form onSubmit={handlePasswordChange}>
                  {passwordError && (
                    <div className="mb-4 p-3 bg-red-50 text-red-800 rounded-lg flex items-center gap-2">
                      <XCircle className="w-5 h-5" />
                      <p className="text-sm">{passwordError}</p>
                    </div>
                  )}

                  {passwordSuccess && (
                    <div className="mb-4 p-3 bg-green-50 text-green-800 rounded-lg flex items-center gap-2">
                      <CheckCircle className="w-5 h-5" />
                      <p className="text-sm">{passwordSuccess}</p>
                    </div>
                  )}

                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Current Password</Label>
                      <div className="relative">
                        <Input
                          type={showPassword.current ? "text" : "password"}
                          value={passwords.current}
                          onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                          className="pr-10"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword({ ...showPassword, current: !showPassword.current })}
                          className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
                        >
                          {showPassword.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-gray-700">New Password</Label>
                      <div className="relative">
                        <Input
                          type={showPassword.new ? "text" : "password"}
                          value={passwords.new}
                          onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                          className="pr-10"
                          required
                          minLength={8}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword({ ...showPassword, new: !showPassword.new })}
                          className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
                        >
                          {showPassword.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Must be at least 8 characters long
                      </p>
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-gray-700">Confirm New Password</Label>
                      <div className="relative">
                        <Input
                          type={showPassword.confirm ? "text" : "password"}
                          value={passwords.confirm}
                          onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                          className="pr-10"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword({ ...showPassword, confirm: !showPassword.confirm })}
                          className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
                        >
                          {showPassword.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="pt-4">
                      <Button 
                        type="submit" 
                        disabled={passwordSaving}
                        className="w-full"
                      >
                        {passwordSaving ? (
                          <>
                            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                            Changing Password...
                          </>
                        ) : (
                          "Change Password"
                        )}
                      </Button>
                    </div>
                  </div>
                </form>

                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div className="text-sm text-blue-700">
                      <p className="font-medium">Password Policy</p>
                      <ul className="list-disc list-inside mt-1 space-y-1">
                        <li>Minimum 8 characters</li>
                        <li>Change every 90 days recommended</li>
                        <li>Do not reuse previous passwords</li>
                        <li>Use a combination of letters, numbers, and symbols</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Quick Actions Card */}
            {/* <Card className="rounded-2xl shadow-lg border-0">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <Settings className="w-6 h-6 text-primary" />
                  Quick Actions
                </h2>
                <div className="space-y-3">
                  {currentRoleConfig.quickActions.map((action, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="w-full justify-start text-left h-auto py-3 px-4 hover:bg-gray-50 transition-colors"
                      onClick={action.action}
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-100 rounded-lg">
                          {action.icon}
                        </div>
                        <span className="font-medium">{action.label}</span>
                      </div>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card> */}

            {/* Notification Settings Card */}
            {/* <Card className="rounded-2xl shadow-lg border-0">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <Bell className="w-6 h-6 text-primary" />
                  Notification Settings
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="font-medium text-gray-700">Push Notifications</Label>
                      <p className="text-sm text-gray-500">In-app notifications</p>
                    </div>
                    <Switch
                      checked={settings.notifications}
                      onCheckedChange={(checked) => handleSettingChange("notifications", checked)}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="font-medium text-gray-700">Email Alerts</Label>
                      <p className="text-sm text-gray-500">Important updates via email</p>
                    </div>
                    <Switch
                      checked={settings.emailAlerts}
                      onCheckedChange={(checked) => handleSettingChange("emailAlerts", checked)}
                    />
                  </div>

                  {profile.role === "Student" && (
                    <>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="font-medium text-gray-700">Result SMS Alerts</Label>
                          <p className="text-sm text-gray-500">Get results via SMS</p>
                        </div>
                        <Switch
                          checked={settings.resultSMS || false}
                          onCheckedChange={(checked) => handleSettingChange("resultSMS", checked)}
                        />
                      </div>
                    </>
                  )}

                  {profile.role === "Lecturer" && (
                    <>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="font-medium text-gray-700">Grading Deadlines</Label>
                          <p className="text-sm text-gray-500">Result submission reminders</p>
                        </div>
                        <Switch
                          checked={settings.gradingDeadlineAlerts || false}
                          onCheckedChange={(checked) => handleSettingChange("gradingDeadlineAlerts", checked)}
                        />
                      </div>
                    </>
                  )}

                  {["Admin", "HOD", "Dean"].includes(profile.role) && (
                    <>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="font-medium text-gray-700">System Alerts</Label>
                          <p className="text-sm text-gray-500">Critical system notifications</p>
                        </div>
                        <Switch
                          checked={settings.systemAlerts || false}
                          onCheckedChange={(checked) => handleSettingChange("systemAlerts", checked)}
                        />
                      </div>
                    </>
                  )}

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="font-medium text-gray-700">Dark Mode</Label>
                      <p className="text-sm text-gray-500">Switch to dark theme</p>
                    </div>
                    <Switch
                      checked={settings.darkMode}
                      onCheckedChange={(checked) => handleSettingChange("darkMode", checked)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card> */}

            {/* Security Status Card */}
            {/* <Card className="rounded-2xl shadow-lg border-0 bg-gradient-to-r from-blue-50 to-indigo-50">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Shield className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">Security Status</h3>
                    <p className="text-sm text-gray-600">Your account protection</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Password Strength</span>
                    <Badge 
                      variant={
                        profile.passwordStrength === "strong" ? "default" :
                        profile.passwordStrength === "medium" ? "outline" : "secondary"
                      }
                      className={
                        profile.passwordStrength === "strong" ? "bg-green-100 text-green-800" :
                        profile.passwordStrength === "medium" ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"
                      }
                    >
                      {profile.passwordStrength.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Days Until Expiry</span>
                    <span className="font-medium">
                      {Math.max(0, profile.passwordExpiryDays - profile.passwordAgeDays)} days
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Last Login</span>
                    <span className="font-medium">Today, 10:30 AM</span>
                  </div>
                  <div className="pt-3">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      onClick={() => window.location.href = "/security"}
                    >
                      View Security Logs
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card> */}
          </div>
        </div>
      </div>
    </div>
  );
}