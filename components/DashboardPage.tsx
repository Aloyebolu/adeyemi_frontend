"use client";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/Topbar";
import { usePage } from "@/hooks/usePage";
import { useSidebar } from "@/hooks/useSidebar";
import useUser from "@/hooks/useUser";
import { useEffect, useState } from "react";

export default function DashboardPage({ children }: { children: React.ReactNode }) {
  const { user } = useUser();
  const { page, component } = usePage();
  const currentPage = page;
  const { open } = useSidebar();
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  
  if (!hydrated) {
    console.log("SSR user role:", user?.role);
    return null;
  }

  return (
    // Remove overflow-hidden from here - this was causing the cut-off
    <div className="light flex min-h-screen bg-background">
      <Sidebar role={user?.role || "student"} open={open} />
      
      {/* Apply constraints only to the main content area */}
      <div className="flex flex-col flex-1 min-w-0"> {/* Add min-w-0 here */}
        <TopBar role={user?.role || "student"} page={currentPage} component={component} />
        
        {/* Apply overflow control only to the main content if needed */}
        <main className="flex-1 overflow-x-auto"> {/* Or overflow-x-auto for horizontal scrolling */}
          <div className="min-w-0"> {/* Add this wrapper to constrain children */}
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}