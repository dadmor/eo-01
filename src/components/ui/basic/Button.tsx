// Button Component
interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
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
  onClick,
  className = "",
  icon,
  fullWidth = false,
  disabled = false,
}) => {
  const baseClasses =
    "inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";

  const variants = {
    primary: "bg-slate-900 text-white hover:bg-slate-800 focus:ring-slate-500",
    outline:
      "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 focus:ring-slate-500",
    ghost: "text-slate-700 hover:bg-slate-100 focus:ring-slate-500",
  };

  const disabledVariants = {
    primary: "bg-slate-400 text-slate-300 cursor-not-allowed",
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
  
  const variantClasses = disabled ? disabledVariants[variant] : variants[variant];
  const focusClasses = disabled ? "" : "focus:ring-2 focus:ring-offset-2";

  return (
    <button
      className={`${baseClasses} ${variantClasses} ${sizes[size]} ${widthClass} ${iconGap} ${focusClasses} ${className}`}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
    >
      {icon}
      {children}
    </button>
  );
};