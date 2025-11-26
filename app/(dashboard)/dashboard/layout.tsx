"use client"
// app/(dashboard)/dashboard/layout.tsx
import useUser from "@/hooks/useUser";
import { useRouter } from "next/navigation";
// import { Router, useRouter } from "next/router";
import React from "react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const {user} = useUser()
  const router = useRouter()
  if(!user?.access_token){
    // router.push('/')
  }
  return (
    <div className="min-h-screen p-4  ">
      {/* Optional: you can include your sidebar or nav here */}
      {children}
    </div>
  );
}
