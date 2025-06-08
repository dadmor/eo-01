import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const FormTextarea = ({ showCount = false, className = '', maxLength, value, ...props }) => {
    const baseClasses = "w-full px-3 py-2 border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent resize-vertical";
    const currentLength = typeof value === 'string' ? value.length : 0;
    return (_jsxs("div", { className: "space-y-1", children: [_jsx("textarea", { className: `${baseClasses} ${className}`, value: value, maxLength: maxLength, ...props }), showCount && maxLength && (_jsxs("div", { className: "text-xs text-slate-500 text-right", children: [currentLength, "/", maxLength, " znak\u00F3w"] }))] }));
};
export default FormTextarea;
