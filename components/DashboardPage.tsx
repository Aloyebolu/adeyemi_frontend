"use client";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/Topbar";
import { usePage } from "@/hooks/usePage";
import { useSidebar } from "@/hooks/useSidebar";
import useUser from "@/hooks/useUser";
import { useEffect, useState } from "react";

export default function DashboardPage({ children }: { children: React.ReactNode }) {
  const { user } = useUser();
  const { page, component } = usePage(); // ✅ works now because provider wraps this
  const currentPage = page;
  const { open } = useSidebar();
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  
  if (!hydrated) {
    console.log("SSR user role:", user?.role);
    // Prevent SSR mismatch (server won’t render the wrong role)
    return null;
  }

  return (
    <div className="light flex min-h-screen bg-background ">
      <Sidebar role={user?.role || "student"} open={open} />
      <div className="flex flex-col flex-1">
        <TopBar role={user?.role || "student"} page={currentPage} component={component} />
        <main className=" flex-1">{children}</main>
      </div>
    </div>
  );
}
