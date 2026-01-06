"use client";
import { PageProvider } from "@/hooks/usePage";
import DashboardPage from "@/components/DashboardPage";
import { TooltipProvider } from "@/components/ui/Tooltip";
import { NotificationContextProvider } from "@/context/NotificationContext";
import { PerformanceProvider } from "@/context/PerformanceContext";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <PerformanceProvider>

      <TooltipProvider>
    <PageProvider>
      <NotificationContextProvider>

      <DashboardPage>{children}</DashboardPage>
    </NotificationContextProvider>
    </PageProvider>
      </TooltipProvider>
    </PerformanceProvider>
  );
}
