// components/ui/button.tsx
import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({ children, className = "", ...props }) => {
  return (
    <button
      {...props}
      className={`bg-purple-700 hover:bg-purple-800 text-white font-semibold rounded-full px-6 py-2 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 ${className}`}
    >
      {children}
    </button>
  );
};
