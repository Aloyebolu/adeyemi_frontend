import React, { useEffect, useState } from 'react';

interface AlertProps {
  variant: 'success' | 'error' | 'info' | 'warning';
  message: string;
  onClose: () => void;
  duration?: number;
}

export const Alert: React.FC<AlertProps> = ({ variant, message, onClose, duration = 5000 }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger enter animation
    const enter = setTimeout(() => setIsVisible(true), 50);

    // Trigger exit animation
    const exit = setTimeout(() => setIsVisible(false), duration);

    return () => {
      clearTimeout(enter);
      clearTimeout(exit);
    };
  }, [duration]);

  // Call onClose after exit animation
  useEffect(() => {
    if (!isVisible) {
      const timer = setTimeout(() => onClose(), 300); // match CSS transition duration
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  const colors = {
    success: 'bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-100',
    error: 'bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-100',
    info: 'bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-100',
    warning: 'bg-yellow-100 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-100',
  };

  return (
    <div
      className={`p-4 rounded-lg shadow-md mb-4 max-w-sm w-full border border-opacity-50
        transform transition-all duration-300
        ${colors[variant]}
        ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'}
      `}
    >
      {message}
    </div>
  );
};
