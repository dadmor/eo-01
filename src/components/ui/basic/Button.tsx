// src/components/Button.tsx
import React from "react";

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
  className?: string;
  icon?: React.ReactNode;
  fullWidth?: boolean;
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "outline",
  size = "md",
  type = "submit",
  onClick,
  className = "",
  icon,
  fullWidth = false,
  disabled = false,
}) => {
  const baseClasses =
    "inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none";

  const variants = {
    primary: "bg-slate-900 text-white hover:bg-slate-800 focus:ring-2 focus:ring-offset-2 focus:ring-slate-500",
    secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200 focus:ring-2 focus:ring-offset-2 focus:ring-slate-500",
    outline: "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 focus:ring-2 focus:ring-offset-2 focus:ring-slate-500",
    ghost: "text-slate-700 hover:bg-slate-100 focus:ring-2 focus:ring-offset-2 focus:ring-slate-500",
  };

  const disabledVariants = {
    primary: "bg-slate-400 text-slate-300 cursor-not-allowed",
    secondary: "bg-slate-50 text-slate-400 cursor-not-allowed",
    outline: "border border-slate-200 bg-slate-50 text-slate-400 cursor-not-allowed",
    ghost: "text-slate-400 cursor-not-allowed",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  const widthClass = fullWidth ? "w-full" : "";
  const iconGap = icon ? "gap-2" : "";
  const focusClasses = disabled ? "" : "focus:ring-2 focus:ring-offset-2";

  const variantClasses = disabled ? disabledVariants[variant] : variants[variant];

  return (
    <button
      type={type}
      className={`${baseClasses} ${variantClasses} ${sizes[size]} ${widthClass} ${iconGap} ${className}`}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
    >
      {icon}
      {children}
    </button>
  );
};