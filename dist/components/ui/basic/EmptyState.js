import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Card } from "../basic/Card";
import { Button } from "../basic/Button";
export const EmptyState = ({ icon, title, message, actionLabel, onAction, }) => (_jsx(Card, { children: _jsxs("div", { className: "p-12 text-center", children: [_jsx("div", { className: "w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4", children: icon }), _jsx("h3", { className: "text-lg font-semibold text-slate-900 mb-2", children: title }), _jsx("p", { className: "text-slate-600 mb-4", children: message }), actionLabel && onAction && (_jsx(Button, { variant: "primary", onClick: onAction, children: actionLabel }))] }) }));
