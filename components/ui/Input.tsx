import React from 'react';
import clsx from 'clsx';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input: React.FC<InputProps> = ({ className, ...props }) => {
  // Define your default styles
  const defaultStyles = "border border-border bg-background text-text p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500";

  // Use clsx to merge default styles with any incoming className
  const combinedClassName = clsx(defaultStyles, className);

  return (
    <input className={combinedClassName} {...props} />
  );
};
