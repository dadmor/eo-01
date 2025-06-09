import { jsx as _jsx } from "react/jsx-runtime";
export const Avatar = ({ name, size = 'md', className = "" }) => {
    const sizes = {
        sm: "w-8 h-8 text-sm",
        md: "w-12 h-12 text-lg",
        lg: "w-16 h-16 text-2xl"
    };
    const initial = name?.charAt(0)?.toUpperCase() || "?";
    return (_jsx("div", { className: `bg-slate-900 text-white rounded-full flex items-center justify-center font-semibold ${sizes[size]} ${className}`, children: initial }));
};
