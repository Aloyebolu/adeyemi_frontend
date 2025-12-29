"use client";

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import DynamicIcon from './DynamicIcon';
import { getMenuForRole } from '@/data';
import { IconName } from '@/data/sidebar/icons';

interface MobileSidebarProps {
  role: string;
  isOpen: boolean;
  onClose: () => void;
}

const MobileSidebar: React.FC<MobileSidebarProps> = React.memo(({ 
  role, 
  isOpen, 
  onClose 
}) => {
  const pathname = usePathname();
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());
  
  const menuItems = React.useMemo(() => getMenuForRole(role), [role]);

  const toggleItem = useCallback((name: string) => {
    setOpenItems(prev => {
      const newSet = new Set(prev);
      newSet.has(name) ? newSet.delete(name) : newSet.add(name);
      return newSet;
    });
  }, []);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-900 shadow-xl z-50 lg:hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
              <h1 className="text-lg font-bold text-gray-900 dark:text-white">
                AFUED Portal
              </h1>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                aria-label="Close menu"
              >
                <DynamicIcon name="chevronLeft" size={20} />
              </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
              {/* Dashboard Link */}
              <Link
                href={`/dashboard/${role}`}
                onClick={onClose}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium
                  ${pathname === `/dashboard/${role}`
                    ? 'bg-primary/20 text-primary font-semibold'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-primary'
                  }
                `}
              >
                <DynamicIcon name="dashboard" size={20} />
                <span>Dashboard</span>
              </Link>

              {/* Role-specific menu */}
              <div className="px-3 py-1 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mt-4 mb-2">
                {role.charAt(0).toUpperCase() + role.slice(1)} Tools
              </div>

              {menuItems.map((item) => {
                const isItemOpen = openItems.has(item.name);
                const isActive = item.href === pathname || 
                  (item.children?.some(child => child.href === pathname));

                if (item.children && item.children.length > 0) {
                  return (
                    <div key={item.name} className="space-y-1">
                      <button
                        type="button"
                        onClick={() => toggleItem(item.name)}
                        className={`
                          flex items-center justify-between w-full px-3 py-2.5 rounded-lg font-medium
                          ${isActive
                            ? 'bg-primary/20 text-primary font-semibold'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-primary'
                          }
                        `}
                      >
                        <div className="flex items-center gap-3">
                          {item.icon && <DynamicIcon name={item.icon} size={20} />}
                          <span>{item.name}</span>
                        </div>
                        <motion.span
                          animate={{ rotate: isItemOpen ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <DynamicIcon name="chevronDown" size={16} />
                        </motion.span>
                      </button>

                      <AnimatePresence>
                        {isItemOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden ml-9 space-y-1"
                          >
                            {item.children.map((child) => (
                              <Link
                                key={child.href}
                                href={child.href}
                                onClick={onClose}
                                className={`
                                  flex items-center gap-2 px-3 py-2 text-sm rounded-lg font-medium
                                  ${pathname === child.href
                                    ? 'bg-primary/10 text-primary'
                                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-primary'
                                  }
                                `}
                              >
                                {child.icon && <DynamicIcon name={child.icon} size={16} />}
                                <span>{child.name}</span>
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                }

                return (
                  <Link
                    key={item.name}
                    href={item.href!}
                    onClick={onClose}
                    className={`
                      flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium
                      ${isActive
                        ? 'bg-primary/20 text-primary font-semibold'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-primary'
                      }
                    `}
                  >
                    {item.icon && <DynamicIcon name={item.icon} size={20} />}
                    <span>{item.name}</span>
                  </Link>
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
                <DynamicIcon name="logout" size={20} />
                <span>Logout</span>
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}, (prev, next) => {
  return (
    prev.role === next.role &&
    prev.isOpen === next.isOpen
  );
});

MobileSidebar.displayName = 'MobileSidebar';

export default MobileSidebar;