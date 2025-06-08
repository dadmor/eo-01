import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Card } from "./Card";
export const StatCard = ({ icon, title, value, subtitle, color = "blue", }) => {
    // Każdy wpis to [bgClass, textClass]
    const colorMap = {
        blue: ["bg-blue-100", "text-blue-600"],
        green: ["bg-green-100", "text-green-600"],
        purple: ["bg-purple-100", "text-purple-600"],
        red: ["bg-red-100", "text-red-600"],
        yellow: ["bg-yellow-100", "text-yellow-600"],
    };
    // Jeśli ktoś przekaże nieprawidłowy kolor, zawsze fallback do blue
    const [bgClass, textClass] = colorMap[color] || colorMap.blue;
    return (_jsx(Card, { children: _jsxs("div", { className: "p-6", children: [_jsxs("div", { className: "flex items-center gap-3 mb-6", children: [_jsx("div", { className: `w-10 h-10 rounded-lg flex items-center justify-center ${bgClass} ${textClass}`, children: icon }), _jsx("h2", { className: "text-lg font-semibold text-slate-900", children: title })] }), _jsxs("div", { className: "text-center space-y-2", children: [_jsx("div", { className: `w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${bgClass} bg-opacity-20`, children: _jsx("span", { className: `text-2xl font-bold ${textClass}`, children: value }) }), subtitle && _jsx("p", { className: "text-sm text-slate-600", children: subtitle })] })] }) }));
};
