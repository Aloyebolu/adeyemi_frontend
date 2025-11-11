"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import theme from "@/styles/theme";
import { useNotifications } from "@/hooks/useNotification";
import useUser from "@/hooks/useUser";

interface PlatformSettings {
  universityName: string;
  currentSession: string;
  currentSemester: string;
  gradingSystem: { [key: string]: number };
  cgpaScale: number;
  registrationOpen: boolean;
  resultPublicationOpen: boolean;
  maxCreditUnitsPerSemester: number;
  admissionOpen: boolean;
  portalMaintenanceMode: boolean;
  emailNotificationsEnabled: boolean;
  allowStudentProfileEdit: boolean;
  minimumAttendancePercentage: number;
  updatedBy?: string;
}

/**
 * 🎓 University Platform Settings Dashboard
 * Global configuration page for administrators.
 */
export default function PlatformSettingsPage() {
  const [settings, setSettings] = useState<PlatformSettings | null>(null);
  const [loading, setLoading] = useState(false);
  const {user} = useUser()
  const {addNotification} = useNotifications()
  const router = useRouter();
  const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT
  console.log(API_ENDPOINT)

  // const token =
  //   typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const token = user.access_token
  const defaultSettings: PlatformSettings = {
    universityName: "Adeyemi Federal University of Education",
    currentSession: "2025/2026",
    currentSemester: "First Semester",
    gradingSystem: { A: 70, B: 60, C: 50, D: 45, E: 40, F: 0 },
    cgpaScale: 5.0,
    registrationOpen: false,
    resultPublicationOpen: false,
    maxCreditUnitsPerSemester: 24,
    admissionOpen: false,
    portalMaintenanceMode: false,
    emailNotificationsEnabled: true,
    allowStudentProfileEdit: true,
    minimumAttendancePercentage: 75,
  };

  // 🧩 Fetch current settings
  const getSettings = async () => {
    try {
      const res = await fetch(`${API_ENDPOINT}/settings`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setSettings((data || defaultSettings) as PlatformSettings);
    } catch {
      console.error("Failed to load settings");
      setSettings(defaultSettings);
    }
  };

  useEffect(() => {
    getSettings();
  }, [token]);

  // 📝 Handle setting changes
  const handleChange = (key: keyof PlatformSettings, value: any) => {
    setSettings((prev) => ({
      ...prev!,
      [key]: value,
    }));
  };

  // 🔄 Toggle boolean values
  const handleToggle = (key: keyof PlatformSettings) => {
    setSettings((prev) => ({
      ...prev!,
      [key]: !prev![key],
    }));
  };

  // 💾 Save settings to backend
  const saveSettings = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_ENDPOINT}/settings/update`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      setSettings(data as PlatformSettings);
      alert("✅ Settings updated successfully!");
    } catch (err) {
      console.error(err);
      addNotification({message: "Error Updating Settings", variant: "error"})
    } finally {
      setLoading(false);
    }
  };

  if (!settings)
    return (
      <p className="text-center mt-10 text-textSecondary">
        Loading platform settings...
      </p>
    );

  return (
    <main className="min-h-screen bg-background ">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* 🏛 University Info */}
        <section className="bg-surface border-border shadow-md rounded-xl p-6">
          <h2 className="text-xl font-semibold text-textPrimary mb-4">
            University Information
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label>University Name</Label>
              <Input
                value={settings.universityName}
                onChange={(e) =>
                  handleChange("universityName", e.target.value)
                }
              />
            </div>

            <div>
              <Label>Current Session</Label>
              <Input
                value={settings.currentSession}
                onChange={(e) =>
                  handleChange("currentSession", e.target.value)
                }
              />
            </div>

            <div>
              <Label>Current Semester</Label>
              <Select
                value={settings.currentSemester}
                onValueChange={(v) => handleChange("currentSemester", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select semester" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="First Semester">First Semester</SelectItem>
                  <SelectItem value="Second Semester">
                    Second Semester
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Max Credit Units Per Semester</Label>
              <Input
                type="number"
                value={settings.maxCreditUnitsPerSemester}
                onChange={(e) =>
                  handleChange(
                    "maxCreditUnitsPerSemester",
                    Number(e.target.value)
                  )
                }
              />
            </div>
          </div>
        </section>

        {/* ⚙️ Portal Controls */}
        <section className="bg-surface border-border shadow-md rounded-xl p-6">
          <h2 className="text-xl font-semibold text-textPrimary mb-4">
            Portal & Access Controls
          </h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {[
              ["registrationOpen", "Course Registration"],
              ["resultPublicationOpen", "Result Publication"],
              ["admissionOpen", "Admission Portal"],
              ["portalMaintenanceMode", "Maintenance Mode"],
              ["emailNotificationsEnabled", "Email Notifications"],
              ["allowStudentProfileEdit", "Allow Student Profile Edit"],
            ].map(([key, label]) => (
              <div
                key={key}
                className="flex justify-between items-center border-b pb-2"
              >
                <span className="text-textPrimary font-medium">{label}</span>
                <Switch
                  checked={(settings as any)[key]}
                  onCheckedChange={() => handleToggle(key as keyof PlatformSettings)}
                />
              </div>
            ))}
          </div>
        </section>

        {/* 🎯 Academic Configuration */}
        <section className="bg-surface border-border shadow-md rounded-xl p-6">
          <h2 className="text-xl font-semibold text-textPrimary mb-4">
            Academic Configuration
          </h2>

{/* 🎓 Grading */}
<div className="grid grid-cols-3 sm:grid-cols-6 gap-4 mb-4">
  {settings.gradingSystem &&
    Object.entries(settings.gradingSystem).map(([grade, value]) => (
      <div key={grade} className="text-center">
        <p className="font-semibold text-textPrimary">{grade}</p>
        <Input
          type="number"
          value={value}
          onChange={(e) =>
            handleChange("gradingSystem", {
              ...settings.gradingSystem,
              [grade]: Number(e.target.value),
            })
          }
          className="mt-1"
        />
      </div>
    ))}
</div>


          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label>CGPA Scale</Label>
              <Input
                type="number"
                step="0.1"
                value={settings.cgpaScale}
                onChange={(e) =>
                  handleChange("cgpaScale", Number(e.target.value))
                }
              />
            </div>
            <div>
              <Label>Minimum Attendance (%)</Label>
              <Input
                type="number"
                value={settings.minimumAttendancePercentage}
                onChange={(e) =>
                  handleChange(
                    "minimumAttendancePercentage",
                    Number(e.target.value)
                  )
                }
              />
            </div>
          </div>
        </section>

        {/* 💾 Save */}
        <div className="flex justify-end">
          <Button onClick={saveSettings} disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </main>
  );
}
