"use client";

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import DynamicIcon from './DynamicIcon';
import { IconName } from '@/data/sidebar/icons';

interface SidebarDropdownProps {
  item: {
    name: string;
    icon?: IconName;
    children?: Array<{
      name: string;
      href: string;
      icon?: IconName;
    }>;
  };
  isActive: boolean;
  isExpanded: boolean;
  pathname: string;
}

const SidebarDropdown: React.FC<SidebarDropdownProps> = React.memo(({ 
  item, 
  isActive, 
  isExpanded,
  pathname 
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = useCallback(() => {
    if (isExpanded) {
      setIsOpen(prev => !prev);
    }
  }, [isExpanded]);

  return (
    <div className="space-y-1">
      <button
        type="button"
        onClick={toggleOpen}
        className={`
          flex items-center justify-between w-full px-3 py-2.5 rounded-lg font-medium
          transition-colors hover:transition-none
          ${isActive
            ? 'bg-primary/20 text-primary font-semibold'
            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-primary'
          }
        `}
      >
        <div className="flex items-center gap-3 min-w-0">
          {item.icon && (
            <DynamicIcon 
              name={item.icon} 
              size={20} 
              className="flex-shrink-0" 
            />
          )}
          <span
            className={`
              overflow-hidden whitespace-nowrap transition-all duration-200 truncate
              ${isExpanded ? 'opacity-100 max-w-[140px]' : 'opacity-0 max-w-0'}
            `}
          >
            {item.name}
          </span>
        </div>
        {isExpanded && (
          <motion.span
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="flex-shrink-0"
          >
            <DynamicIcon name="chevronDown" size={16} />
          </motion.span>
        )}
      </button>

      <AnimatePresence>
        {isExpanded && isOpen && item.children && item.children.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden ml-9 space-y-1"
          >
            {item.children.map((child) => {
              const isChildActive = pathname === child.href;
              return (
                <Link
                  key={child.href}
                  href={child.href}
                  className={`
                    flex items-center gap-2 px-3 py-2 text-sm rounded-lg font-medium
                    transition-colors hover:transition-none
                    ${isChildActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-primary'
                    }
                  `}
                >
                  {child.icon && (
                    <DynamicIcon 
                      name={child.icon} 
                      size={16} 
                      className="flex-shrink-0" 
                    />
                  )}
                  <span className="truncate">{child.name}</span>
                </Link>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}, (prev, next) => {
  return (
    prev.item.name === next.item.name &&
    prev.isActive === next.isActive &&
    prev.isExpanded === next.isExpanded &&
    prev.pathname === next.pathname
  );
});

SidebarDropdown.displayName = 'SidebarDropdown';

export default SidebarDropdown;