import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export const Hero = ({ title, subtitle, center = false }) => (_jsxs("div", { className: center ? 'text-center' : '', children: [_jsx("h1", { className: "text-3xl font-bold text-slate-900", children: title }), subtitle && _jsx("p", { className: "text-slate-600 mt-1", children: subtitle })] }));
