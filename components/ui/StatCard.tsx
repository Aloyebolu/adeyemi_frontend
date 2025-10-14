'use client';

import React from 'react';

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  color?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ icon, label, value, color = 'blue' }) => {
  const colors : any = {
    blue: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
    green: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
    yellow: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400',
    red: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
  };

  return (
    <div className={`p-4 rounded-xl border border-gray-200 dark:border-gray-700 ${colors[color]} flex items-center gap-4`}>
      <div className="p-2 rounded-full bg-white dark:bg-gray-800">
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  );
};