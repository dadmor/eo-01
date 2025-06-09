import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
// src/components/Navigation.tsx
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Menu, X, User, Settings, BarChart3 } from "lucide-react";
import { Button } from "./ui/basic/Button";
import AuthDropdown from "./AuthDropdown";
const Navigation = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };
    // wspólna funkcja do klasy aktywnego linku
    const linkClass = ({ isActive }) => isActive
        ? "bg-slate-100 text-slate-900 rounded-lg"
        : "text-slate-700 hover:bg-slate-50 rounded-lg";
    return (_jsxs(_Fragment, { children: [_jsxs("nav", { className: "bg-white border-b border-slate-200 p-3 px-6", children: [_jsxs("div", { className: "flex justify-between items-center h-16", children: [_jsx("div", { className: "flex items-center", children: _jsxs(NavLink, { to: "/", className: "flex items-center gap-3", children: [_jsx("div", { className: "min-w-8 w-8 h-8 bg-slate-900 text-white rounded-lg flex items-center justify-center", children: _jsx("span", { className: "font-bold text-sm", children: "MA" }) }), _jsx("span", { className: "text-xl font-semibold text-slate-900", children: "eOperator" })] }) }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsx(AuthDropdown, {}), _jsx("div", { className: "lg:hidden", children: _jsx(Button, { variant: "ghost", onClick: toggleMobileMenu, icon: isMobileMenuOpen ? (_jsx(X, { className: "w-5 h-5" })) : (_jsx(Menu, { className: "w-5 h-5" })), children: undefined }) })] })] }), isMobileMenuOpen && (_jsx("div", { className: "lg:hidden border-t border-slate-200 bg-white", children: _jsxs("div", { className: "px-4 py-3 space-y-2", children: [_jsxs(NavLink, { to: "/beneficiary/my-requests", className: linkClass, onClick: () => setIsMobileMenuOpen(false), children: [_jsx(User, { className: "w-4 h-4" }), "Beneficjent"] }), _jsxs(NavLink, { to: "/admin/users", className: linkClass, onClick: () => setIsMobileMenuOpen(false), children: [_jsx(Settings, { className: "w-4 h-4" }), "U\u017Cytkownicy"] }), _jsxs(NavLink, { to: "/dashboard", className: linkClass, onClick: () => setIsMobileMenuOpen(false), children: [_jsx(BarChart3, { className: "w-4 h-4" }), "Dashboard"] })] }) }))] }), _jsx("div", { className: "h-16" })] }));
};
export default Navigation;
