"use client";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/label";
import { ShieldCheck, Plus, Save } from "lucide-react";
import theme from "@/styles/theme";
import { usePage } from "@/hooks/usePage";

/**
 * Admin Roles & Permissions Page
 * Consumes: theme.colors.primary, accent, surfaceElevated, textOnPrimary
 */
export default function RolesPage() {
  const [roles, setRoles] = useState<any[]>([]);
  const [newRole, setNewRole] = useState("");
  const [loading, setLoading] = useState(false);
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const {setPage} = usePage()

  // Mock permission list
  const allPermissions = [
    "start_semester",
    "approve_results",
    "manage_courses",
    "manage_users",
    "generate_transcript",
    "update_settings",
    "view_logs",
  ];

  // 🔹 Fetch roles
  const fetchRoles = async () => {
    try {
      const res = await fetch("/api/roles", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setRoles(data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    setPage('Roles & Permissions')
    fetchRoles();
  }, []);

  // 🔹 Add new role
  const addRole = async () => {
    if (!newRole.trim()) return alert("Enter a valid role name");
    setLoading(true);
    try {
      const res = await fetch("/api/roles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: newRole }),
      });
      if (!res.ok) throw new Error("Failed to create role");
      alert("New role added ✅");
      setNewRole("");
      fetchRoles();
    } catch (err) {
      console.error(err);
      alert("Error creating role");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Toggle permission
  const togglePermission = (roleId: string, permission: string) => {
    const updated = roles.map((r) =>
      r._id === roleId
        ? {
            ...r,
            permissions: r.permissions.includes(permission)
              ? r.permissions.filter((p) => p !== permission)
              : [...r.permissions, permission],
          }
        : r
    );
    setRoles(updated);
  };

  // 🔹 Save all updates
  const saveChanges = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/roles", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(roles),
      });
      if (!res.ok) throw new Error("Failed to update roles");
      alert("Permissions updated successfully ✅");
      fetchRoles();
    } catch (err) {
      console.error(err);
      alert("Error updating roles");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-6xl mx-auto min-h-screen">


      {/* Add Role */}
      <Card className="mb-6 rounded-xl shadow-md">
        <CardContent className="p-4 flex flex-col sm:flex-row items-center gap-3">
          <Input
            value={newRole}
            onChange={(e) => setNewRole(e.target.value)}
            placeholder="Enter new role name..."
            className="flex-1"
          />
          <Button
            onClick={addRole}
            disabled={loading}
            className="bg-primary text-on-primary min-h-[2.5rem]"
          >
            <Plus size={16} className="mr-2" />
            Add Role
          </Button>
        </CardContent>
      </Card>

      {/* Roles Table */}
      {roles.length === 0 ? (
        <p className="text-gray-500 text-sm">No roles found.</p>
      ) : (
        roles.map((role) => (
          <Card key={role._id} className="mb-6 rounded-xl shadow-md">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-primary capitalize">
                  {role.name}
                </h2>
                <span className="text-xs text-gray-500">
                  {role.permissions.length} permissions
                </span>
              </div>

              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
                {allPermissions.map((perm) => (
                  <label
                    key={perm}
                    className="flex items-center gap-2 text-sm cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={role.permissions.includes(perm)}
                      onChange={() => togglePermission(role._id, perm)}
                      className="w-4 h-4 accent-primary"
                    />
                    {perm.replace(/_/g, " ")}
                  </label>
                ))}
              </div>
            </CardContent>
          </Card>
        ))
      )}

      {/* Save Button */}
      {roles.length > 0 && (
        <div className="flex justify-end mt-4">
          <Button
            onClick={saveChanges}
            disabled={loading}
            className="bg-primary text-on-primary min-h-[2.5rem]"
          >
            <Save size={16} className="mr-2" />
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      )}
    </main>
  );
}
