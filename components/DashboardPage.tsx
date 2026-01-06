"use client";

import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/Topbar";
import { usePage } from "@/hooks/usePage";
import { useSidebar } from "@/hooks/useSidebar";
import useUser from "@/hooks/useUser";
import { useEffect, useState } from "react";
import PerformanceCheckModal from "@/components/PerformanceCheckModal";
import { usePerformance } from "@/context/PerformanceContext";

export default function DashboardPage({ children }: { children: React.ReactNode }) {
  const { user } = useUser();
  const { page, component } = usePage();
  const currentPage = page;
  const { open } = useSidebar();

  const [hydrated, setHydrated] = useState(false);
  const [showPerformanceModal, setShowPerformanceModal] = useState(false);
  const { profile } = usePerformance();

  useEffect(() => setHydrated(true), []);

  useEffect(() => {
    if (!hydrated) return;

    const stored = localStorage.getItem("performance_profile");
    if (!stored) {
      setShowPerformanceModal(true);
      console.log("No performance profile found, showing modal.");
    }
  }, [hydrated]);

  if (!hydrated) {
    console.log("SSR user role:", user?.role);
    return null;
  }

  return (
    <>
      {/* {showPerformanceModal && (
        <PerformanceCheckModal
          onClose={() => setShowPerformanceModal(false)}
        />
      )} */}

      <div className="light flex min-h-screen bg-background">
        <Sidebar role={user?.role || "student"} open={open} />

        <div className="flex flex-col flex-1 min-w-0">
          <TopBar
            role={user?.role || "student"}
            page={currentPage}
            component={component}
          />

          <main className="flex-1 overflow-x-auto">
            <div
              className={`min-w-0 ${
                profile?.lowEndDevice ? "low-performance" : ""
              }`}
            >
              {children}
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
