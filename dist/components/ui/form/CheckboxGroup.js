import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const CheckboxGroup = ({ options, value = [], onChange, name, className = "", layout = "vertical" // "vertical" | "horizontal" | "grid"
 }) => {
    const handleChange = (optionValue, checked) => {
        if (checked) {
            const newValue = [...value, optionValue];
            onChange?.(newValue);
        }
        else {
            const newValue = value.filter(v => v !== optionValue);
            onChange?.(newValue);
        }
    };
    const layoutClasses = {
        vertical: "flex flex-col gap-2",
        horizontal: "flex flex-wrap gap-4",
        grid: "grid grid-cols-2 gap-2"
    };
    return (_jsx("div", { className: `${layoutClasses[layout]} ${className}`, children: options.map((option) => (_jsxs("label", { className: "flex items-center gap-2 cursor-pointer", children: [_jsx("input", { type: "checkbox", name: name, value: option.value, checked: value.includes(option.value), onChange: (e) => handleChange(option.value, e.target.checked), className: "rounded border-slate-300 text-slate-900 focus:ring-slate-500" }), _jsx("span", { className: "text-sm text-slate-700", children: option.label })] }, option.value))) }));
};
export default CheckboxGroup;
