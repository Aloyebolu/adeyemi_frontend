"use client";
import { useEffect, useState } from "react";

export default function useUser() {
  const dev_mode = false;

  const dev_data = {
    role: "admin",
    access_token: "dev_override",
    matric_no: "4353",
    name: "DevBreakthrough",
    admin_id: "ADM/23_DEV",
    staff_id: "STF/23_DEV",
    id: "DEV_001",
  };

  const [user, setUser] = useState(() => {
    if (typeof window === "undefined") return null; // Avoid SSR crash
    if (dev_mode) return dev_data;

    return {
      role: localStorage.getItem("role") || null,
      access_token: localStorage.getItem("access_token") || null,
      name: localStorage.getItem("name") || null,
      matric_no: localStorage.getItem("matric_no") || null,
      admin_id: localStorage.getItem("admin_id") || null,
      staff_id: localStorage.getItem("staff_id") || null,
      id: localStorage.getItem("_id") || null,
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
        id: localStorage.getItem("_id") || null,
      });
    };

    window.addEventListener("storage", updateUser);
    return () => window.removeEventListener("storage", updateUser);
  }, []);

  const clearUser = () => {
    ["role", "access_token", "name", "matric_no", "admin_id", "staff_id", "_id"].forEach(
      (key) => localStorage.removeItem(key)
    );
    setUser(null);
  };

  return { user, clearUser };
}
