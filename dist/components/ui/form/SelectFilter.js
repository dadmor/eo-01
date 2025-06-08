import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ChevronDown } from 'lucide-react';
const SelectFilter = ({ options, value, onChange, placeholder = 'Wybierz...', multiple = false, name, className = '' }) => {
    const handleChange = (e) => {
        if (multiple) {
            const selected = Array.from(e.target.selectedOptions).map(o => o.value);
            onChange?.(selected);
        }
        else {
            onChange?.(e.target.value);
        }
    };
    if (multiple) {
        return (_jsxs("div", { className: `relative ${className}`, children: [_jsx("select", { name: name, multiple: true, value: Array.isArray(value) ? value : [], onChange: handleChange, className: "w-full px-3 py-2 border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent min-h-[2.5rem] max-h-32", size: Math.min(options.length, 6), children: options.map(opt => (_jsx("option", { value: opt.value, children: opt.label }, opt.value))) }), _jsx("div", { className: "absolute top-2 right-2 pointer-events-none", children: _jsx(ChevronDown, { className: "w-4 h-4 text-slate-400" }) }), Array.isArray(value) && value.length > 0 && (_jsxs("div", { className: "mt-1 text-xs text-slate-600", children: ["Wybrano: ", value.length, " ", value.length === 1 ? 'element' : 'elementów'] }))] }));
    }
    return (_jsxs("div", { className: `relative ${className}`, children: [_jsxs("select", { name: name, value: typeof value === 'string' ? value : '', onChange: handleChange, className: "w-full px-3 py-2 border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent appearance-none pr-10", children: [_jsx("option", { value: "", children: placeholder }), options.map(opt => (_jsx("option", { value: opt.value, children: opt.label }, opt.value)))] }), _jsx("div", { className: "absolute top-1/2 right-3 transform -translate-y-1/2 pointer-events-none", children: _jsx(ChevronDown, { className: "w-4 h-4 text-slate-400" }) })] }));
};
export default SelectFilter;
