"use client";
import { PageProvider } from "@/hooks/usePage";
import DashboardPage from "@/components/DashboardPage";
import { TooltipProvider } from "@/components/ui/Tooltip";
import { NotificationContextProvider } from "@/context/NotificationContext";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
      <TooltipProvider>
    <PageProvider>
      <NotificationContextProvider>

      <DashboardPage>{children}</DashboardPage>
    </NotificationContextProvider>
    </PageProvider>
      </TooltipProvider>
  );
}
