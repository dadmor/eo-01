import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const RadioGroup = ({ options, value, onChange, name, className = "", layout = "vertical" }) => {
    const handleChange = (e) => {
        onChange?.(e.target.value);
    };
    const layoutClasses = {
        vertical: "flex flex-col gap-2",
        horizontal: "flex flex-wrap gap-4",
        grid: "grid grid-cols-2 gap-2"
    };
    return (_jsx("div", { className: `${layoutClasses[layout]} ${className}`, children: options.map((option) => (_jsxs("label", { className: "flex items-center gap-2 cursor-pointer", children: [_jsx("input", { type: "radio", name: name, value: option.value, checked: value === option.value, onChange: handleChange, className: "border-slate-300 text-slate-900 focus:ring-slate-500" }), _jsx("span", { className: "text-sm text-slate-700", children: option.label })] }, option.value))) }));
};
export default RadioGroup;
