"use client";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/Topbar";
import { usePage } from "@/hooks/usePage";
import { useSidebar } from "@/hooks/useSidebar";
import useUser from "@/hooks/useUser";

export default function DashboardPage({ children }: { children: React.ReactNode }) {
  const { user } = useUser();
  const { page } = usePage(); // ✅ works now because provider wraps this
  const currentPage = page;
  const { open } = useSidebar();

  return (
    <div className="light flex min-h-screen bg-background-light dark:bg-background-dark">
      <Sidebar role={user?.role || "student"} open={open} />
      <div className="flex flex-col flex-1">
        <TopBar role={user?.role || "student"} page={currentPage} />
        <main className="p-6 flex-1">{children}</main>
      </div>
    </div>
  );
}
