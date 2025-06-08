import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from "react-router-dom";
import { CheckCircle, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/basic/Card";
import { Button } from "@/components/ui/basic/Button";
export const LoginSuccessStep = ({ user, onGoToDashboard, onBackToLogin }) => {
    // Funkcja do określenia nazwy dashboardu na podstawie roli
    const getDashboardName = (role) => {
        switch (role) {
            case "admin":
                return "Panel Administratora";
            case "contractor":
                return "Dashboard Wykonawcy";
            case "auditor":
                return "Panel Audytora";
            default:
                return "Strona Główna";
        }
    };
    return (_jsx("div", { className: "min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4", children: _jsx("div", { className: "w-full max-w-md", children: _jsxs(Card, { className: "shadow-xl p-8", children: [_jsxs("div", { className: "text-center mb-8", children: [_jsx("div", { className: "w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4", children: _jsx(CheckCircle, { className: "w-8 h-8 text-green-600" }) }), _jsx("h1", { className: "text-2xl font-bold text-gray-900", children: "Zalogowano pomy\u015Blnie!" }), _jsxs("p", { className: "text-gray-600 mt-2", children: ["Witaj, ", user.first_name || user.email] })] }), _jsx("div", { className: "bg-gray-50 rounded-lg p-4 mb-6", children: _jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-sm text-gray-600", children: "Email:" }), _jsx("span", { className: "text-sm font-medium text-gray-900", children: user.email })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-sm text-gray-600", children: "Rola:" }), _jsx("span", { className: "text-sm font-medium text-gray-900 capitalize", children: user.role })] })] }) }), _jsxs(Button, { variant: "primary", size: "lg", fullWidth: true, onClick: onGoToDashboard, icon: _jsx(ArrowRight, { className: "w-4 h-4" }), className: "mb-4", children: ["Przejd\u017A do ", getDashboardName(user.role)] }), _jsxs("div", { className: "text-center space-y-2", children: [_jsx("p", { className: "text-sm text-gray-600", children: "Lub przejd\u017A do:" }), _jsxs("div", { className: "flex flex-col space-y-2", children: [user.role !== "admin" && (_jsx(Link, { to: "/", className: "text-sm text-blue-600 hover:text-blue-500 transition-colors", children: "Strona g\u0142\u00F3wna" })), _jsx("button", { onClick: onBackToLogin, className: "text-sm text-gray-500 hover:text-gray-700 transition-colors", children: "Wr\u00F3\u0107 do formularza logowania" })] })] })] }) }) }));
};
