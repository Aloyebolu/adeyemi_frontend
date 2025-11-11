"use client";

import { useEffect, useState } from "react";
import { usePage } from "@/hooks/usePage";
import { Card, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/label";
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
} from "lucide-react";

interface UserProfile {
  name: string;
  email: string;
  department?: string;
  staff_id?: string;
  matric_no?: string;
  role: string;
}

export default function ProfilePage() {
  const { setPage } = usePage();
  const [profile, setProfile] = useState<UserProfile>({
    name: "",
    email: "",
    department: "",
    staff_id: "",
    matric_no: "",
    role: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // 🧭 Role-based quick actions
  const roleControls: Record<string, { label: string; icon: JSX.Element }[]> = {
    Lecturer: [
      { label: "Upload Results", icon: <Upload className="w-4 h-4" /> },
      { label: "View Courses", icon: <ClipboardList className="w-4 h-4" /> },
    ],
    Student: [
      { label: "View Grades", icon: <GraduationCap className="w-4 h-4" /> },
      { label: "Edit Profile", icon: <Settings className="w-4 h-4" /> },
    ],
    HOD: [
      { label: "Manage Departments", icon: <Building2 className="w-4 h-4" /> },
      { label: "View Lecturers", icon: <Users className="w-4 h-4" /> },
    ],
    Admin: [
      { label: "User Management", icon: <Users className="w-4 h-4" /> },
      { label: "System Settings", icon: <Settings className="w-4 h-4" /> },
    ],
  };

  useEffect(() => {
    setPage("Profile");
    setTimeout(() => {
      setProfile({
        name: "Aloye Breakthrough",
        email: "breakthrough@afued.edu.ng",
        department: "Computer Science",
        staff_id: "AFUED/CS/LEC/015",
        role: "Lecturer", // 🔄 Change to test different roles
      });
      setLoading(false);
    }, 600);
  }, [setPage]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      alert("✅ Profile updated successfully!");
    }, 1000);
  };

  if (loading)
    return (
      <div className="max-w-6xl mx-auto p-6 text-center text-muted">
        Loading profile...
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-b from-background-light to-surface p-6">
      <Card className="rounded-2xl shadow-xl border border-border bg-surface/80 backdrop-blur max-w-2xl mx-auto">
        <CardContent className="p-8">
          {/* 🧠 Profile Header */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-10">
            <div className="relative w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center shadow-inner">
              <UserCircle2 className="w-12 h-12 text-primary" />
              <button className="absolute bottom-1 right-1 bg-primary text-white p-1 rounded-full text-xs shadow">
                ✏️
              </button>
            </div>
            <div className="text-center sm:text-left">
              <h1 className="text-2xl font-bold text-primary">{profile.name}</h1>
              <p className="text-muted capitalize">{profile.role}</p>
            </div>
          </div>

          {/* 🧾 Profile Info */}
          <div className="space-y-5">
              <Label className="text-muted">Full Name</Label>
            <div className="flex items-center gap-2 mt-1">
                <Mail className="w-4 h-4 text-muted" />

              <Input
                name="name"
                value={profile.name}
                onChange={handleChange}
                className="mt-1"
              />
            </div>

            <div>
              <Label className="text-muted">Email Address</Label>
              <div className="flex items-center gap-2 mt-1">
                <Mail className="w-4 h-4 text-muted" />
                <Input
                  name="email"
                  value={profile.email}
                  onChange={handleChange}
                  type="email"
                />
                
              </div>
            </div>

            {profile.department && (
              <div>
                <Label className="text-muted">Department</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Building2 className="w-4 h-4 text-muted" />
                  <Input
                    name="department"
                    value={profile.department}
                    onChange={handleChange}
                  />
                </div>
              </div>
            )}

            {profile.staff_id && (
              <div>
                <Label className="text-muted">Staff ID</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Hash className="w-4 h-4 text-muted" />
                  <Input
                    name="staff_id"
                    value={profile.staff_id}
                    disabled
                    className="opacity-70"
                  />
                </div>
              </div>
            )}

            {profile.matric_no && (
              <div>
                <Label className="text-muted">Matric Number</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Hash className="w-4 h-4 text-muted" />
                  <Input
                    name="matric_no"
                    value={profile.matric_no}
                    disabled
                    className="opacity-70"
                  />
                </div>
              </div>
            )}
          </div>

          {/* 💾 Save Button */}
          <div className="mt-8 flex justify-end">
            <Button onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>

          {/* 🧩 Role-Based Controls */}
          {profile.role && (
            <div className="mt-10 border-t border-border pt-6">
              <h2 className="text-lg font-semibold text-primary mb-3">
                Quick Actions
              </h2>
              <div className="flex flex-wrap gap-3">
                {roleControls[profile.role]?.map((control, i) => (
                  <Button
                    key={i}
                    variant="outline"
                    className="flex items-center gap-2 text-sm"
                  >
                    {control.icon} {control.label}
                  </Button>
                )) || (
                  <p className="text-muted text-sm">No actions available</p>
                )}
              </div>
            </div>
          )}

          {/* 🔒 Change Password */}
          <div className="mt-10 border-t border-border pt-6">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-medium text-primary">
                Change Password
              </h2>
            </div>
            <div className="space-y-3">
              <Input type="password" placeholder="Current Password" />
              <Input type="password" placeholder="New Password" />
              <Input type="password" placeholder="Confirm New Password" />
            </div>
            <div className="mt-4 flex justify-end">
              <Button variant="outline">Update Password</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
