import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Button } from "./Button";
import { Card } from "./Card";
export const ActionCard = ({ icon, title, actions, color = 'blue' }) => {
    const colors = {
        blue: "bg-blue-100 text-blue-600",
        green: "bg-green-100 text-green-600",
        purple: "bg-purple-100 text-purple-600",
        red: "bg-red-100 text-red-600",
        yellow: "bg-yellow-100 text-yellow-600"
    };
    return (_jsx(Card, { children: _jsxs("div", { className: "p-6", children: [_jsxs("div", { className: "flex items-center gap-3 mb-6", children: [_jsx("div", { className: `w-10 h-10 rounded-lg flex items-center justify-center ${colors[color]}`, children: icon }), _jsx("h2", { className: "text-lg font-semibold text-slate-900", children: title })] }), _jsx("div", { className: "space-y-3", children: actions.map((action, index) => (_jsx(Button, { variant: action.variant || 'outline', onClick: action.onClick, fullWidth: true, icon: action.icon, className: "justify-start", children: action.label }, index))) })] }) }));
};
