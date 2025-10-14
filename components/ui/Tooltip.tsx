'use client'

import React, { useState } from 'react';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
}

export const Tooltip: React.FC<TooltipProps> = ({ content, children }) => {
  const [isVisible, setIsVisible] = useState(false);
  return (
    <div className="relative inline-block"
         onMouseEnter={() => setIsVisible(true)}
         onMouseLeave={() => setIsVisible(false)}>
      {children}
      {isVisible && (
        <div className="absolute z-10 bg-gray-800 text-white text-sm rounded p-2 -top-10 left-1/2 transform -translate-x-1/2">
          {content}
        </div>
      )}
    </div>
  );
};
