import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const FormInput = ({ icon, wrapperClassName = '', className = '', ...props }) => {
    const baseClasses = "w-full px-3 py-2 border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent";
    const withIconClasses = icon ? "pl-10" : "";
    if (icon) {
        return (_jsxs("div", { className: `relative ${wrapperClassName}`, children: [_jsx("div", { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none", children: icon }), _jsx("input", { className: `${baseClasses} ${withIconClasses} ${className}`, ...props })] }));
    }
    return (_jsx("input", { className: `${baseClasses} ${className}`, ...props }));
};
export default FormInput;
