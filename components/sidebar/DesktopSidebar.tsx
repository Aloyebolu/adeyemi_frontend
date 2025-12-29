"use client";

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { useSidebar } from '@/hooks/useSidebar';
import SidebarLink from './SidebarLink';
import SidebarDropdown from './SidebarDropdown';
import DynamicIcon from './DynamicIcon';
import { getMenuForRole } from '@/data';
import { IconName } from '@/data/sidebar/icons';

interface DesktopSidebarProps {
  role: string;
}

const DesktopSidebar: React.FC<DesktopSidebarProps> = React.memo(({ role }) => {
  const pathname = usePathname();
  const { isOpen, toggleSidebar } = useSidebar();

  const menuItems = useMemo(() => getMenuForRole(role), [role]);

  const isItemActive = useMemo(() => {
    const activeMap = new Map();
    
    const checkItem = (item: any) => {
      if (item.href) {
        activeMap.set(item.name, pathname === item.href);
      }
      if (item.children) {
        item.children.forEach(checkItem);
        activeMap.set(item.name, item.children.some((child: any) => pathname === child.href));
      }
    };
    
    menuItems.forEach(checkItem);
    return (itemName: string) => activeMap.get(itemName) || false;
  }, [pathname, menuItems]);

  return (
    <motion.aside
      initial={false}
      animate={{ width: isOpen ? 256 : 80 }}
      transition={{ duration: 0.2, ease: 'easeInOut' }}
      className="h-screen sticky top-0 hidden lg:flex flex-col border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 z-40 flex-none overflow-hidden select-none"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-8 h-8 rounded-full bg-primary flex-shrink-0" />
          {isOpen && (
            <h1 className="text-lg font-bold text-gray-900 dark:text-white truncate">
              AFUED Portal
            </h1>
          )}
        </div>
        <button
          onClick={toggleSidebar}
          className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex-shrink-0"
          aria-label={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          <DynamicIcon 
            name={isOpen ? 'chevronLeft' : 'chevronRight'} 
            size={20} 
            className="text-gray-700 dark:text-gray-300" 
          />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
        {/* Dashboard Link */}
        <SidebarLink
          item={{
            name: 'Dashboard',
            href: `/dashboard/${role}`,
            icon: 'dashboard' as IconName
          }}
          isActive={pathname === `/dashboard/${role}`}
          isExpanded={isOpen}
        />

        {/* Role-specific menu */}
        {isOpen && (
          <div className="px-3 py-1 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mt-4 mb-2">
            {role.charAt(0).toUpperCase() + role.slice(1)} Tools
          </div>
        )}

        {menuItems.map((item) => {
          const isActive = isItemActive(item.name);
          
          if (item.children && item.children.length > 0) {
            return (
              <SidebarDropdown
                key={item.name}
                item={item}
                isActive={isActive}
                isExpanded={isOpen}
                pathname={pathname}
              />
            );
          }

          return (
            <SidebarLink
              key={item.name}
              item={{
                name: item.name,
                href: item.href!,
                icon: item.icon
              }}
              isActive={isActive}
              isExpanded={isOpen}
            />
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-800">
        <button
          onClick={() => {
            localStorage.clear();
            window.location.href = '/';
          }}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-primary w-full transition-colors"
          aria-label="Logout"
        >
          <DynamicIcon name="logout" size={20} className="flex-shrink-0" />
          {isOpen && <span className="truncate">Logout</span>}
        </button>
      </div>
    </motion.aside>
  );
}, (prev, next) => prev.role === next.role);

DesktopSidebar.displayName = 'DesktopSidebar';

export default DesktopSidebar;