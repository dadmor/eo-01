// src/components/ui/basic/Badge.tsx
import React from 'react';

type BadgeVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';

interface BadgeProps {
  /** zawartość badge */
  children: React.ReactNode;
  /** wariant kolorystyczny */
  variant?: BadgeVariant;
  /** dodatkowe klasy Tailwind */
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'primary',
  className = ''
}) => {
  const variants: Record<BadgeVariant, string> = {
    primary: 'bg-slate-100 text-slate-800',
    secondary: 'bg-slate-200 text-slate-900',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800'
  };

  const baseClasses = 'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium';
  const variantClasses = variants[variant];

  return (
    <span className={`${baseClasses} ${variantClasses} ${className}`}>
      {children}
    </span>
  );
};