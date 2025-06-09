import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export const InfoField = ({ label, value, className = "", }) => {
    return (_jsxs("div", { className: `space-y-2 ${className}`, children: [_jsx("label", { className: "text-sm font-medium text-slate-700", children: label }), _jsx("div", { className: "text-slate-900 font-mono text-sm bg-slate-50 px-3 py-2 rounded border", children: value })] }));
};
