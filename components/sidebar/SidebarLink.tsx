"use client";

import React from 'react';
import Link from 'next/link';
import DynamicIcon from './DynamicIcon';
import { IconName } from '@/data/sidebar/icons';

interface SidebarLinkProps {
  item: {
    name: string;
    href: string;
    icon?: IconName;
  };
  isActive: boolean;
  isExpanded: boolean;
  onClick?: () => void;
}

const SidebarLink: React.FC<SidebarLinkProps> = React.memo(({ 
  item, 
  isActive, 
  isExpanded,
  onClick 
}) => {
  return (
    <Link
      href={item.href}
      prefetch={false}
      onClick={onClick}
      className={`
        flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium
        transition-all duration-200 hover:transition-none
        ${isActive
          ? 'bg-primary/20 text-primary font-semibold'
          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-primary'
        }
      `}
    >
      {item.icon && (
        <DynamicIcon 
          name={item.icon} 
          size={20} 
          className="flex-shrink-0" 
        />
      )}
      <span
        className={`
          overflow-hidden whitespace-nowrap transition-all duration-200
          ${isExpanded ? 'opacity-100 max-w-[200px]' : 'opacity-0 max-w-0'}
        `}
      >
        {item.name}
      </span>
    </Link>
  );
}, (prev, next) => {
  // Custom comparison function for React.memo
  return (
    prev.item.href === next.item.href &&
    prev.isActive === next.isActive &&
    prev.isExpanded === next.isExpanded
  );
});

SidebarLink.displayName = 'SidebarLink';

export default SidebarLink;