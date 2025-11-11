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
    if (typeof window === "undefined") return null; // ✅ Avoid SSR crash
    if (dev_mode) return dev_data;

    return {
      role: localStorage.getItem("role"),
      access_token: localStorage.getItem("access_token"),
      name: localStorage.getItem("name"),
      matric_no: localStorage.getItem("matric_no"),
      admin_id: localStorage.getItem("admin_id"),
      staff_id: localStorage.getItem("staff_id"),
      id: localStorage.getItem("_id"),
    };
  });

  // Optional: update user when localStorage changes dynamically
  useEffect(() => {
    if (dev_mode) return; // 🧠 skip in dev mode
    const updateUser = () => {
      setUser({
        role: localStorage.getItem("role"),
        access_token: localStorage.getItem("access_token"),
        name: localStorage.getItem("name"),
        matric_no: localStorage.getItem("matric_no"),
        admin_id: localStorage.getItem("admin_id"),
        staff_id: localStorage.getItem("staff_id"),
        id: localStorage.getItem("_id"),
      });
    };

    window.addEventListener("storage", updateUser);
    return () => window.removeEventListener("storage", updateUser);
  }, []);

  return { user };
}
