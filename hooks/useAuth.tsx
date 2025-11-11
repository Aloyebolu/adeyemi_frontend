"use client";

import { useDataFetcher } from "@/lib/dataFetcher";
import { useState } from "react";
// import { useDataFetcher } from "@/hooks/useDataFetcher";

type AdminLoginPayload = {
  admin_id?: string;
  email?: string;
  password: string;
};

type StudentLoginPayload = {
  matric_no?: string;
  email?: string;
  password: string;
};

type LecturerLoginPayload = {
  staff_id?: string; // or whatever field your backend uses
  email?: string;
  password: string;
};

export default function useAuth() {
  const { fetchData } = useDataFetcher();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 🔹 Helper to handle all login types consistently
  const handleLogin = async (path: string, payload: any) => {
    setLoading(true);
    setError(null);

    try {
      const result = await fetchData(path, "POST", payload);
      console.log("✅ Login success:", result);
      return result?.data ?? result;
    } catch (err: any) {
      console.error("❌ Login error:", err);
      setError(err.message || "Login failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // 👑 Admin Login
  const adminLogin = async (payload: AdminLoginPayload) => {
    return handleLogin("user/signin/admin", payload);
  };

  // 🎓 Student Login
  const studentLogin = async (payload: StudentLoginPayload) => {
    return handleLogin("user/signin/student", payload);
  };

  // 👨‍🏫 Lecturer Login
  const lecturerLogin = async (payload: LecturerLoginPayload) => {
    return handleLogin("user/signin/lecturer", payload);
  };

  return {
    adminLogin,
    studentLogin,
    lecturerLogin,
    loading,
    error,
  };
}