import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { AlertCircle } from "lucide-react";
import { Card } from "./Card";
import { Button } from "./Button";
export const Alert = ({ type = 'info', title, message, onRetry, className = "" }) => {
    const variants = {
        error: {
            container: "border-red-200 bg-red-50",
            icon: "bg-red-100 text-red-600",
            title: "text-red-800",
            message: "text-red-600"
        },
        success: {
            container: "border-green-200 bg-green-50",
            icon: "bg-green-100 text-green-600",
            title: "text-green-800",
            message: "text-green-600"
        },
        warning: {
            container: "border-yellow-200 bg-yellow-50",
            icon: "bg-yellow-100 text-yellow-600",
            title: "text-yellow-800",
            message: "text-yellow-600"
        },
        info: {
            container: "border-blue-200 bg-blue-50",
            icon: "bg-blue-100 text-blue-600",
            title: "text-blue-800",
            message: "text-blue-600"
        }
    };
    const variant = variants[type];
    return (_jsx(Card, { className: `${variant.container} ${className}`, children: _jsxs("div", { className: "p-4", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: `w-6 h-6 rounded-full flex items-center justify-center ${variant.icon}`, children: _jsx(AlertCircle, { className: "w-4 h-4" }) }), _jsxs("div", { className: "flex-1", children: [_jsx("h3", { className: `font-semibold ${variant.title}`, children: title }), _jsx("p", { className: `text-sm mt-1 ${variant.message}`, children: message })] })] }), onRetry && (_jsx("div", { className: "mt-4", children: _jsx(Button, { variant: "outline", size: "sm", onClick: onRetry, children: "Spr\u00F3buj ponownie" }) }))] }) }));
};
