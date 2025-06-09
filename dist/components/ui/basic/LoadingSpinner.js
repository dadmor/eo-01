import { jsx as _jsx } from "react/jsx-runtime";
export const LoadingSpinner = ({ size = 'md', className = "" }) => {
    const sizes = {
        sm: "w-4 h-4",
        md: "w-8 h-8",
        lg: "w-12 h-12"
    };
    return (_jsx("div", { className: `border-2 border-slate-200 border-t-slate-900 rounded-full animate-spin ${sizes[size]} ${className}` }));
};
