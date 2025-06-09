import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const FormField = ({ label, error, required, help, className = "", children, }) => {
    return (_jsxs("div", { className: `space-y-1 ${className}`, children: [label && (_jsxs("label", { className: "block text-sm font-medium text-slate-700", children: [label, required && _jsx("span", { className: "text-red-500 ml-1", children: "*" })] })), children, error && _jsx("div", { className: "text-sm text-red-600", children: error }), help && !error && _jsx("div", { className: "text-sm text-slate-500", children: help })] }));
};
export default FormField;
