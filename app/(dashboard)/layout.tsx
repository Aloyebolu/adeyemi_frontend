"use client";
import { PageProvider } from "@/hooks/usePage";
import DashboardPage from "@/components/DashboardPage";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <PageProvider>
      <DashboardPage>{children}</DashboardPage>
    </PageProvider>
  );
}
