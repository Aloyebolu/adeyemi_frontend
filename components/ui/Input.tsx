import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input: React.FC<InputProps> = ({ ...props }) => {
  return <input className="border border-gray-300 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500" {...props} />;
};
