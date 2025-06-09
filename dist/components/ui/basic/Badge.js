import { jsx as _jsx } from "react/jsx-runtime";
export const Badge = ({ children, variant = 'primary', className = '' }) => {
    const variants = {
        primary: 'bg-slate-100 text-slate-800',
        secondary: 'bg-slate-200 text-slate-900',
        success: 'bg-green-100 text-green-800',
        warning: 'bg-yellow-100 text-yellow-800',
        danger: 'bg-red-100 text-red-800',
        info: 'bg-blue-100 text-blue-800'
    };
    const baseClasses = 'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium';
    const variantClasses = variants[variant];
    return (_jsx("span", { className: `${baseClasses} ${variantClasses} ${className}`, children: children }));
};
