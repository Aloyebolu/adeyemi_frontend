"use client";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/label";
import theme from "@/styles/theme";
import { Settings, Save } from "lucide-react";
import { usePage } from "@/hooks/usePage";

/**
 * Admin System Settings Page
 * Consumes: theme.colors.primary, accent, surfaceElevated, textOnPrimary
 */
export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<any>({
    schoolName: "",
    currentSession: "",
    gradingScale: { A: 70, B: 60, C: 50, D: 45, E: 40, F: 0 },
    maintenanceMode: false,
    emailNotifications: true,
  });
  const [loading, setLoading] = useState(false);
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const {setPage} = usePage()
  // 🔹 Fetch settings
  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/settings", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setSettings(data || settings);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    setPage("System Settings")
    fetchSettings();
  }, []);

  // 🔹 Save settings
  const handleSave = async () => {
    setLoading(true);
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
      alert("Error updating settings");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Handle grading scale changes
  const handleGradeChange = (grade: string, value: string) => {
    const newScale = { ...settings.gradingScale, [grade]: Number(value) };
    setSettings({ ...settings, gradingScale: newScale });
  };

  return (
    <main className="max-w-4xl mx-auto  min-h-screen">

      {/* General Settings */}
      <Card className="mb-6 rounded-xl shadow-md">
        <CardContent className="p-4">
          <h2 className="text-lg font-semibold mb-4">General Information</h2>
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div>
              <Label>School Name</Label>
              <Input
                value={settings.schoolName}
                onChange={(e) =>
                  setSettings({ ...settings, schoolName: e.target.value })
                }
                placeholder="e.g. Adeyemi Federal University of Education, Ondo"
              />
            </div>
            <div>
              <Label>Current Session</Label>
              <Input
                value={settings.currentSession}
                onChange={(e) =>
                  setSettings({ ...settings, currentSession: e.target.value })
                }
                placeholder="e.g. 2025/2026"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Grading Scale */}
      <Card className="mb-6 rounded-xl shadow-md">
        <CardContent className="p-4">
          <h2 className="text-lg font-semibold mb-4">Grading Scale (Scores ≥)</h2>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mb-4">
            {Object.entries(settings.gradingScale).map(([grade, value]) => (
              <div key={grade}>
                <Label>{grade}</Label>
                <Input
                  type="number"
                  min={0}
                  max={100}
                  value={value}
                  onChange={(e) => handleGradeChange(grade, e.target.value)}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Toggles */}
      <Card className="mb-6 rounded-xl shadow-md">
        <CardContent className="p-4">
          <h2 className="text-lg font-semibold mb-4">System Toggles</h2>
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="flex items-center justify-between w-full sm:w-1/2">
              <Label>Maintenance Mode</Label>
              <input
                type="checkbox"
                checked={settings.maintenanceMode}
                onChange={(e) =>
                  setSettings({ ...settings, maintenanceMode: e.target.checked })
                }
                className="w-5 h-5 accent-primary cursor-pointer"
              />
            </div>
            <div className="flex items-center justify-between w-full sm:w-1/2">
              <Label>Email Notifications</Label>
              <input
                type="checkbox"
                checked={settings.emailNotifications}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    emailNotifications: e.target.checked,
                  })
                }
                className="w-5 h-5 accent-primary cursor-pointer"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          disabled={loading}
          className="bg-primary text-on-primary min-h-[2.5rem]"
        >
          <Save size={16} className="mr-2" />
          {loading ? "Saving..." : "Save Settings"}
        </Button>
      </div>
    </main>
  );
}
