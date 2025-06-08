import { jsx as _jsx } from "react/jsx-runtime";
export const Card = ({ children, className = "" }) => {
    return (_jsx("div", { className: `bg-white rounded-lg border border-slate-200 shadow-sm ${className}`, children: children }));
};
