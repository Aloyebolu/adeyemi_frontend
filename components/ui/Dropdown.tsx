'use client'
import React, { useState } from 'react';

interface DropdownProps {
  items: { label: string; onClick: () => void }[];
  trigger: React.ReactNode;
}

export const Dropdown: React.FC<DropdownProps> = ({ items, trigger }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="relative">
      <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>
      {isOpen && (
        <ul className="absolute bg-white shadow-lg rounded mt-2">
          {items.map((item, index) => (
            <li key={index} className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => { item.onClick(); setIsOpen(false); }}>
              {item.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
