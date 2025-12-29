"use client";

import React from 'react';
import DynamicIcon from './DynamicIcon';

interface MobileToggleButtonProps {
  isOpen: boolean;
  onClick: () => void;
}

const MobileToggleButton: React.FC<MobileToggleButtonProps> = React.memo(({ 
  isOpen, 
  onClick 
}) => {
  return (
    <button
      onClick={onClick}
      className="lg:hidden fixed top-4 left-4 z-50 bg-primary text-white p-2.5 rounded-lg shadow-lg hover:bg-primary/90 transition-colors active:scale-95"
      aria-label={isOpen ? "Close menu" : "Open menu"}
    >
      <DynamicIcon name="menu" size={22} />
    </button>
  );
});

MobileToggleButton.displayName = 'MobileToggleButton';

export default MobileToggleButton;