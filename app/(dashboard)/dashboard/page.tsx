// app/(dashboard)/dashboard/layout.tsx
"use client";

import { useRouter } from "next/navigation";
import useUser from "@/hooks/useUser";
import React, { useEffect } from "react";

export default function MainPage() {
  const router = useRouter();
  const { user, loading } = useUser(); // assuming your hook provides loading state

  useEffect(() => {
if (!loading && user?.role) {
  // 🧭 Check role and adjust if HOD
  const targetRole = user.role === 'hod' ? 'lecturer' : user.role;

  // 🚀 Redirect accordingly
  router.push(`/dashboard/${targetRole}`); // redirects to /lecturer, /admin, /student, etc.
}

  }, [user, loading, router]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 flex items-center justify-center">
      <p>Redirecting you to your dashboard...</p>
    </div>
  );
}
