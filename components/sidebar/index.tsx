"use client";

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useSidebar } from '@/hooks/useSidebar';

// Dynamic imports for better performance
const DesktopSidebar = dynamic(() => import('./DesktopSidebar'), {
  ssr: false,
  loading: () => (
    <div className="h-screen w-20 bg-gray-100 dark:bg-gray-900 hidden lg:block" />
  ),
});

const MobileSidebar = dynamic(() => import('./MobileSidebar'), {
  ssr: false,
});

const MobileToggleButton = dynamic(() => import('./MobileToggleButton'), {
  ssr: false,
  loading: () => (
    <button className="lg:hidden fixed top-4 left-4 z-50 bg-primary text-white p-2 rounded-md shadow-md">
      <div className="w-6 h-6" />
    </button>
  ),
});

interface SidebarProps {
  role: "student" | "lecturer" | "admin" | "parent" | "hod" | "dean";
}

const Sidebar: React.FC<SidebarProps> = React.memo(({ role }) => {
  const [isMounted, setIsMounted] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isOpen } = useSidebar();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      {/* Mobile Toggle Button */}
      <MobileToggleButton 
        isOpen={mobileOpen}
        onClick={() => setMobileOpen(!mobileOpen)}
      />

      {/* Desktop Sidebar */}
      <DesktopSidebar role={role} />

      {/* Mobile Sidebar */}
      <MobileSidebar
        role={role}
        isOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />
    </>
  );
});

Sidebar.displayName = 'Sidebar';

export default Sidebar;