"use client";
import { PageProvider } from "@/hooks/usePage";
import DashboardPage from "@/components/DashboardPage";
import { TooltipProvider } from "@/components/ui/Tooltip";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <PageProvider>
      <TooltipProvider>

      <DashboardPage>{children}</DashboardPage>
      </TooltipProvider>
    </PageProvider>
  );
}
