"use client";
import { useEffect, useState } from "react";

interface UserData {
  role: string | null;
  access_token: string | null;
  name: string | null;
  matric_no: string | null;
  admin_id: string | null;
  staff_id: string | null;
  department: string | null;
  id: string | null;
  extra_roles: string[]; // ✅ Added extra_roles
}

export default function useUser() {
  const dev_mode = false;

  const dev_data: UserData = {
    role: "admin",
    access_token: "dev_override",
    matric_no: "4353",
    name: "DevBreakthrough",
    admin_id: "ADM/23_DEV",
    staff_id: "STF/23_DEV",
    id: "DEV_001",
    department: "IT Department",
    extra_roles: ["hod", "course_coordinator"] // ✅ Added example extra roles
  };

  // Helper function to parse extra_roles from localStorage
  const getExtraRolesFromStorage = (): string[] => {
    if (typeof window === "undefined") return [];
    
    const extraRolesStr = localStorage.getItem("extra_roles");
    if (!extraRolesStr) return [];
    
    try {
      return JSON.parse(extraRolesStr);
    } catch (error) {
      console.error("Error parsing extra_roles:", error);
      return [];
    }
  };

  const [user, setUser] = useState<UserData | null>(() => {
    if (typeof window === "undefined") return null; // Avoid SSR crash
    if (dev_mode) return dev_data;

    return {
      role: localStorage.getItem("role") || null,
      access_token: localStorage.getItem("access_token") || null,
      name: localStorage.getItem("name") || null,
      matric_no: localStorage.getItem("matric_no") || null,
      admin_id: localStorage.getItem("admin_id") || null,
      staff_id: localStorage.getItem("staff_id") || null,
      department: localStorage.getItem("department") || null,
      id: localStorage.getItem("_id") || null,
      extra_roles: getExtraRolesFromStorage() // ✅ Added extra_roles
    };
  });

  // Keep user in sync with localStorage changes
  useEffect(() => {
    if (dev_mode) return;

    const updateUser = () => {
      setUser({
        role: localStorage.getItem("role") || null,
        access_token: localStorage.getItem("access_token") || null,
        name: localStorage.getItem("name") || null,
        matric_no: localStorage.getItem("matric_no") || null,
        admin_id: localStorage.getItem("admin_id") || null,
        staff_id: localStorage.getItem("staff_id") || null,
        department: localStorage.getItem("department") || null,
        id: localStorage.getItem("_id") || null,
        extra_roles: getExtraRolesFromStorage() // ✅ Added extra_roles
      });
    };

    window.addEventListener("storage", updateUser);
    return () => window.removeEventListener("storage", updateUser);
  }, []);

  // Optional: Add a manual refresh function
  const refreshUser = () => {
    if (dev_mode) return;
    
    setUser({
      role: localStorage.getItem("role") || null,
      access_token: localStorage.getItem("access_token") || null,
      name: localStorage.getItem("name") || null,
      matric_no: localStorage.getItem("matric_no") || null,
      admin_id: localStorage.getItem("admin_id") || null,
      staff_id: localStorage.getItem("staff_id") || null,
      department: localStorage.getItem("department") || null,
      id: localStorage.getItem("_id") || null,
      extra_roles: getExtraRolesFromStorage()
    });
  };

  const clearUser = () => {
    [
      "role",
      "access_token", 
      "name", 
      "matric_no", 
      "admin_id", 
      "staff_id", 
      "department", 
      "_id",
      "extra_roles" // ✅ Added extra_roles to cleanup
    ].forEach((key) => localStorage.removeItem(key));
    
    setUser(null);
  };

  // ✅ Helper methods for extra roles
  const hasExtraRole = (role: string): boolean => {
    if (!user?.extra_roles) return false;
    return user.extra_roles.includes(role);
  };

  const getAllRoles = (): string[] => {
    if (!user) return [];
    const roles = user.role ? [user.role] : [];
    return [...roles, ...user.extra_roles];
  };

  return { 
    user, 
    clearUser, 
    refreshUser, 
    hasExtraRole, 
    getAllRoles 
  };
}