"use client";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/label";
import { Save, Settings as SettingsIcon } from "lucide-react";
import { usePage } from "@/hooks/usePage";
import { useDataFetcher } from "@/lib/dataFetcher";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const {fetchData} = useDataFetcher();
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const { setPage } = usePage();

  // 🟢 Fetch Settings
  const fetchSettings = async () => {
    setLoading(true);
    try {
      const {data} = await fetchData("settings");
      if (data?.data) setSettings(data.data) 
        else {setSettings(data);}
    } catch (err) {
      console.error("Error fetching settings:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage("University Settings");
    fetchSettings();
  }, []);

  // 🟡 Handle Input Changes
  const handleChange = (field: string, value: any) => {
    setSettings((prev: any) => ({ ...prev, [field]: value }));
  };

  // 🟣 Handle Nested Field (Grading System)
  const handleGradingChange = (grade: string, key: string, value: number) => {
    setSettings((prev: any) => ({
      ...prev,
      gradingSystem: {
        ...prev.gradingSystem,
        [grade]: {
          ...prev.gradingSystem[grade],
          [key]: Number(value),
        },
      },
    }));
  };

  // 🧩 Handle Notification Settings
  const handleNotificationChange = (key: string, value: boolean) => {
    setSettings((prev: any) => ({
      ...prev,
      notificationSettings: {
        ...prev.notificationSettings,
        [key]: value,
      },
    }));
  };

  // 💾 Save Settings
  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(settings),
      });
      if (!res.ok) throw new Error("Failed to update settings");
      alert("Settings updated successfully ✅");
      fetchSettings();
    } catch (err) {
      console.error(err);
      alert("Failed to update settings ❌");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !settings) {
    return <p className="text-center py-10">Loading settings...</p>;
  }

  return (
    <main className="max-w-5xl mx-auto min-h-screen py-6 space-y-8">
      {/* 🏛️ General Information */}
      <Card className="rounded-2xl shadow">
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <SettingsIcon size={18} /> General Information
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label>University Name</Label>
              <Input
                value={settings.universityName || ""}
                onChange={(e) => handleChange("universityName", e.target.value)}
              />
            </div>
            <div>
              <Label>Motto</Label>
              <Input
                value={settings.motto || ""}
                onChange={(e) => handleChange("motto", e.target.value)}
              />
            </div>
            <div>
              <Label>School Email</Label>
              <Input
                value={settings.schoolEmail || ""}
                onChange={(e) => handleChange("schoolEmail", e.target.value)}
              />
            </div>
            <div>
              <Label>Phone</Label>
              <Input
                value={settings.schoolPhone || ""}
                onChange={(e) => handleChange("schoolPhone", e.target.value)}
              />
            </div>
            <div>
              <Label>Address</Label>
              <Input
                value={settings.address || ""}
                onChange={(e) => handleChange("address", e.target.value)}
              />
            </div>
            <div>
              <Label>Website URL</Label>
              <Input
                value={settings.websiteUrl || ""}
                onChange={(e) => handleChange("websiteUrl", e.target.value)}
              />
            </div>
            <div>
              <Label>Logo URL</Label>
              <Input
                value={settings.logoUrl || ""}
                onChange={(e) => handleChange("logoUrl", e.target.value)}
              />
            </div>
            <div>
              <Label>Theme Color</Label>
              <Input
                type="color"
                value={settings.themeColor || "#006400"}
                onChange={(e) => handleChange("themeColor", e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 📘 Session Control */}
      <Card className="rounded-2xl shadow">
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold mb-4">Session Control</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label>Current Session</Label>
              <Input
                value={settings.currentSession || ""}
                onChange={(e) => handleChange("currentSession", e.target.value)}
              />
            </div>
            <div>
              <Label>Current Semester</Label>
{/* 🎓 Current Semester */}
<Select
  value={settings.currentSemester || ""}
  onValueChange={(value) => handleChange("currentSemester", value)}
>
  <SelectTrigger className="w-full mt-1">
    <SelectValue placeholder="Select Semester" />
  </SelectTrigger>

  <SelectContent>
    <SelectGroup>
      <SelectLabel>Current Semester</SelectLabel>
      <SelectItem value="First Semester">First Semester</SelectItem>
      <SelectItem value="Second Semester">Second Semester</SelectItem>
      <SelectItem value="Summer Semester">Summer Semester</SelectItem>
    </SelectGroup>
  </SelectContent>
</Select>
            </div>
            <div>
              <Label>Session Start Date</Label>
              <Input
                type="date"
                value={settings.sessionStartDate ? settings.sessionStartDate.slice(0,10) : ""}
                onChange={(e) => handleChange("sessionStartDate", e.target.value)}
              />
            </div>
            <div>
              <Label>Session End Date</Label>
              <Input
                type="date"
                value={settings.sessionEndDate ? settings.sessionEndDate.slice(0,10) : ""}
                onChange={(e) => handleChange("sessionEndDate", e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={!!settings.isSemesterActive}
                onChange={(e) => handleChange("isSemesterActive", e.target.checked)}
              />
              <Label>Semester Active</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 🎓 Course & Lecturer Management */}
      <Card className="rounded-2xl shadow">
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold mb-4">Course & Lecturer Management</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={!!settings.courseAssignmentOpen}
                onChange={(e) => handleChange("courseAssignmentOpen", e.target.checked)}
              />
              <Label>Course Assignment Open</Label>
            </div>
            <div>
              <Label>Max Courses Per Lecturer</Label>
              <Input
                type="number"
                value={settings.maxCoursesPerLecturer || 4}
                onChange={(e) => handleChange("maxCoursesPerLecturer", Number(e.target.value))}
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={!!settings.allowCrossDepartmentAssignment}
                onChange={(e) => handleChange("allowCrossDepartmentAssignment", e.target.checked)}
              />
              <Label>Allow Cross Department Assignment</Label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={!!settings.requireHodApprovalForAssignment}
                onChange={(e) => handleChange("requireHodApprovalForAssignment", e.target.checked)}
              />
              <Label>Require HOD Approval For Assignment</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 🧾 Student Registration Settings */}
      <Card className="rounded-2xl shadow">
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold mb-4">Student Registration Settings</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={!!settings.registrationOpen}
                onChange={(e) => handleChange("registrationOpen", e.target.checked)}
              />
              <Label>Registration Open</Label>
            </div>
            <div>
              <Label>Registration Deadline</Label>
              <Input
                type="date"
                value={settings.registrationDeadline ? settings.registrationDeadline.slice(0,10) : ""}
                onChange={(e) => handleChange("registrationDeadline", e.target.value)}
              />
            </div>
            <div>
              <Label>Late Registration Fee</Label>
              <Input
                type="number"
                value={settings.lateRegistrationFee || 0}
                onChange={(e) => handleChange("lateRegistrationFee", Number(e.target.value))}
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={!!settings.autoLockAfterDeadline}
                onChange={(e) => handleChange("autoLockAfterDeadline", e.target.checked)}
              />
              <Label>Auto Lock After Deadline</Label>
            </div>
            <div>
              <Label>Max Credit Units Per Semester</Label>
              <Input
                type="number"
                value={settings.maxCreditUnitsPerSemester || 24}
                onChange={(e) => handleChange("maxCreditUnitsPerSemester", Number(e.target.value))}
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={!!settings.requireDepartmentalClearance}
                onChange={(e) => handleChange("requireDepartmentalClearance", e.target.checked)}
              />
              <Label>Require Departmental Clearance</Label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={!!settings.requirePaymentBeforeRegistration}
                onChange={(e) => handleChange("requirePaymentBeforeRegistration", e.target.checked)}
              />
              <Label>Require Payment Before Registration</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 💰 Payment & Finance */}
      <Card className="rounded-2xl shadow">
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold mb-4">Payment & Finance</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={!!settings.enablePaymentPortal}
                onChange={(e) => handleChange("enablePaymentPortal", e.target.checked)}
              />
              <Label>Enable Payment Portal</Label>
            </div>
            <div>
              <Label>Accepted Payment Methods (comma separated)</Label>
              <Input
                value={settings.acceptedPaymentMethods ? settings.acceptedPaymentMethods.join(", ") : ""}
                onChange={(e) => handleChange("acceptedPaymentMethods", e.target.value.split(",").map((s: string) => s.trim()))}
              />
            </div>
            <div>
              <Label>Currency</Label>
              <Input
                value={settings.currency || "NGN"}
                onChange={(e) => handleChange("currency", e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={!!settings.autoGenerateInvoice}
                onChange={(e) => handleChange("autoGenerateInvoice", e.target.checked)}
              />
              <Label>Auto Generate Invoice</Label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={!!settings.requireReceiptVerification}
                onChange={(e) => handleChange("requireReceiptVerification", e.target.checked)}
              />
              <Label>Require Receipt Verification</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 🎓 Grading System */}
      <Card className="rounded-2xl shadow">
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold mb-4">Grading System</h2>
          <div className="overflow-x-auto">
            <table className="w-full border text-sm">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="p-2">Grade</th>
                  <th className="p-2">Minimum Score</th>
                  <th className="p-2">Points</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(settings.gradingSystem || {}).map(
                  ([grade, values]: any) => (
                    <tr key={grade} className="border-t">
                      <td className="p-2 font-medium">{grade}</td>
                      <td className="p-2">
                        <Input
                          type="number"
                          value={values.min}
                          onChange={(e) =>
                            handleGradingChange(
                              grade,
                              "min",
                              Number(e.target.value)
                            )
                          }
                        />
                      </td>
                      <td className="p-2">
                        <Input
                          type="number"
                          value={values.points}
                          onChange={(e) =>
                            handleGradingChange(
                              grade,
                              "points",
                              Number(e.target.value)
                            )
                          }
                        />
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
          <div className="grid sm:grid-cols-2 gap-4 mt-4">
            <div>
              <Label>CGPA Scale</Label>
              <Input
                type="number"
                value={settings.cgpaScale || 5.0}
                onChange={(e) => handleChange("cgpaScale", Number(e.target.value))}
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={!!settings.allowHodToEditResults}
                onChange={(e) => handleChange("allowHodToEditResults", e.target.checked)}
              />
              <Label>Allow HOD to Edit Results</Label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={!!settings.requireExaminerApproval}
                onChange={(e) => handleChange("requireExaminerApproval", e.target.checked)}
              />
              <Label>Require Examiner Approval</Label>
            </div>
            <div>
              <Label>Max Result Correction Days</Label>
              <Input
                type="number"
                value={settings.maxResultCorrectionDays || 7}
                onChange={(e) => handleChange("maxResultCorrectionDays", Number(e.target.value))}
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={!!settings.resultPublicationOpen}
                onChange={(e) => handleChange("resultPublicationOpen", e.target.checked)}
              />
              <Label>Result Publication Open</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 🔐 Access & Security */}
      <Card className="rounded-2xl shadow">
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold mb-4">Access & Security</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={!!settings.enable2FAForAdmins}
                onChange={(e) => handleChange("enable2FAForAdmins", e.target.checked)}
              />
              <Label>Enable 2FA for Admins</Label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={!!settings.allowHodToCreateCourses}
                onChange={(e) => handleChange("allowHodToCreateCourses", e.target.checked)}
              />
              <Label>Allow HOD to Create Courses</Label>
            </div>
            <div>
              <Label>Super Admin Emails (comma separated)</Label>
              <Input
                value={settings.superAdminEmails ? settings.superAdminEmails.join(", ") : ""}
                onChange={(e) => handleChange("superAdminEmails", e.target.value.split(",").map((s: string) => s.trim()))}
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={!!settings.autoAssignDefaultRoles}
                onChange={(e) => handleChange("autoAssignDefaultRoles", e.target.checked)}
              />
              <Label>Auto Assign Default Roles</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 📚 Academic Operations */}
      <Card className="rounded-2xl shadow">
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold mb-4">Academic Operations</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={!!settings.enableElectives}
                onChange={(e) => handleChange("enableElectives", e.target.checked)}
              />
              <Label>Enable Electives</Label>
            </div>
            <div>
              <Label>Min Students for Course Activation</Label>
              <Input
                type="number"
                value={settings.minStudentsForCourseActivation || 10}
                onChange={(e) => handleChange("minStudentsForCourseActivation", Number(e.target.value))}
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={!!settings.autoGenerateExamTimetable}
                onChange={(e) => handleChange("autoGenerateExamTimetable", e.target.checked)}
              />
              <Label>Auto Generate Exam Timetable</Label>
            </div>
            <div>
              <Label>Attendance Mode</Label>
<Select
  value={settings.attendanceMode || "QR"}
  onValueChange={(value) => handleChange("attendanceMode", value)}
>
  <SelectTrigger className="w-full mt-1">
    <SelectValue placeholder="Select Attendance Mode" />
  </SelectTrigger>

  <SelectContent>
    <SelectGroup>
      <SelectLabel>Attendance Mode</SelectLabel>
      <SelectItem value="QR">QR</SelectItem>
      <SelectItem value="Biometric">Biometric</SelectItem>
      <SelectItem value="Manual">Manual</SelectItem>
    </SelectGroup>
  </SelectContent>
</Select>
            </div>
            <div>
              <Label>Exam Mode</Label>
<Select
  value={settings.examMode || "CBT"}
  onValueChange={(value) => handleChange("examMode", value)}
>
  <SelectTrigger className="w-full mt-1">
    <SelectValue placeholder="Select Exam Mode" />
  </SelectTrigger>

  <SelectContent>
    <SelectGroup>
      <SelectLabel>Exam Mode</SelectLabel>
      <SelectItem value="CBT">CBT</SelectItem>
      <SelectItem value="Written">Written</SelectItem>
    </SelectGroup>
  </SelectContent>
</Select>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={!!settings.enableProjectSupervisionTracking}
                onChange={(e) => handleChange("enableProjectSupervisionTracking", e.target.checked)}
              />
              <Label>Enable Project Supervision Tracking</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 🏠 Hostel & Facilities */}
      <Card className="rounded-2xl shadow">
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold mb-4">Hostel & Facilities</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={!!settings.hostelAllocationOpen}
                onChange={(e) => handleChange("hostelAllocationOpen", e.target.checked)}
              />
              <Label>Hostel Allocation Open</Label>
            </div>
            <div>
              <Label>Max Occupants Per Room</Label>
              <Input
                type="number"
                value={settings.maxOccupantsPerRoom || 4}
                onChange={(e) => handleChange("maxOccupantsPerRoom", Number(e.target.value))}
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={!!settings.maintenanceRequestEnabled}
                onChange={(e) => handleChange("maintenanceRequestEnabled", e.target.checked)}
              />
              <Label>Maintenance Request Enabled</Label>
            </div>
<Select
  value={settings.electricityBillPolicy || "included"}
  onValueChange={(value) => handleChange("electricityBillPolicy", value)}
>
  <SelectTrigger className="w-full mt-1">
    <SelectValue placeholder="Select Policy" />
  </SelectTrigger>

  <SelectContent>
    <SelectGroup>
      <SelectLabel>Electricity Bill Policy</SelectLabel>
      <SelectItem value="included">Included</SelectItem>
      <SelectItem value="separate">Separate</SelectItem>
    </SelectGroup>
  </SelectContent>
</Select>
          </div>
        </CardContent>
      </Card>

      {/* 🕹️ System Settings */}
      <Card className="rounded-2xl shadow">
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold mb-4">System Settings</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label>Backup Frequency</Label>
<Select
  value={settings.backupFrequency || "weekly"}
  onValueChange={(value) => handleChange("backupFrequency", value)}
>
  <SelectTrigger className="w-full mt-1">
    <SelectValue placeholder="Select Backup Frequency" />
  </SelectTrigger>

  <SelectContent>
    <SelectGroup>
      <SelectLabel>Backup Frequency</SelectLabel>
      <SelectItem value="daily">Daily</SelectItem>
      <SelectItem value="weekly">Weekly</SelectItem>
      <SelectItem value="manual">Manual</SelectItem>
    </SelectGroup>
  </SelectContent>
</Select>
            </div>
            <div>
              <Label>Auto Logout Timeout (minutes)</Label>
              <Input
                type="number"
                value={settings.autoLogoutTimeout || 30}
                onChange={(e) => handleChange("autoLogoutTimeout", Number(e.target.value))}
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={!!settings.maintenanceMode}
                onChange={(e) => handleChange("maintenanceMode", e.target.checked)}
              />
              <Label>Maintenance Mode</Label>
            </div>
            <div>
              <Label>Audit Logs Retention Days</Label>
              <Input
                type="number"
                value={settings.auditLogsRetentionDays || 180}
                onChange={(e) => handleChange("auditLogsRetentionDays", Number(e.target.value))}
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={!!settings.sendEmailNotifications}
                onChange={(e) => handleChange("sendEmailNotifications", e.target.checked)}
              />
              <Label>Send Email Notifications</Label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={!!settings.smsGatewayEnabled}
                onChange={(e) => handleChange("smsGatewayEnabled", e.target.checked)}
              />
              <Label>SMS Gateway Enabled</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 🔔 Notification Settings */}
      <Card className="rounded-2xl shadow">
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold mb-4">Notification Settings</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {Object.entries(settings.notificationSettings || {}).map(
              ([key, value]: any) =>
                typeof value === "boolean" ? (
                  <div
                    key={key}
                    className="flex items-center justify-between border p-3 rounded-lg"
                  >
                    <Label className="capitalize">
                      {key.replace(/([A-Z])/g, " $1")}
                    </Label>
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={(e) =>
                        handleNotificationChange(key, e.target.checked)
                      }
                      className="w-5 h-5 accent-primary cursor-pointer"
                    />
                  </div>
                ) : null
            )}
          </div>
        </CardContent>
      </Card>

      {/* 📩 Message Templates */}
      <Card className="rounded-2xl shadow">
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold mb-4">Message Templates</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {Object.entries(settings.messageTemplates || {}).map(
              ([key, value]: any) => (
                <div key={key}>
                  <Label className="capitalize">{key.replace(/([A-Z])/g, " $1")}</Label>
                  <Input
                    value={value || ""}
                    onChange={(e) => handleChange(`messageTemplates.${key}`, e.target.value)}
                  />
                </div>
              )
            )}
          </div>
        </CardContent>
      </Card>

      {/* 💾 Save Button */}
      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          disabled={saving}
          className="bg-primary text-white px-6 py-2"
        >
          <Save size={16} className="mr-2" />
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </main>
  );
}
