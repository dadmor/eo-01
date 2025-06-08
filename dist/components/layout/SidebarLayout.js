import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { NavLink } from "react-router-dom";
import { Users, FileText, Shield, MessageSquare, Store, PlusCircle, Briefcase, FolderOpen, ClipboardList, User, Phone, UserCheck, } from "lucide-react";
const menuItems = {
    operator: [
        {
            path: "/operator/contacts",
            label: "Kontakty Beneficjentów",
            icon: Users,
        },
        { path: "/operator/moderation", label: "Panel Moderacji", icon: Shield },
        { path: "/operator/reports", label: "Raporty", icon: FileText },
        {
            path: "/operator/requests",
            label: "Zapytania do Weryfikacji",
            icon: MessageSquare,
        },
    ],
    auditor: [
        { path: "/auditor/marketplace", label: "Marketplace", icon: Store },
        { path: "/auditor/offer/new", label: "Nowa Oferta", icon: PlusCircle },
        { path: "/auditor/offers", label: "Moje Oferty", icon: Briefcase },
        { path: "/auditor/portfolio", label: "Portfolio", icon: FolderOpen },
    ],
    beneficiary: [
        {
            path: "/beneficiary/audit-request",
            label: "Zapytanie o Audyt",
            icon: UserCheck,
        },
        {
            path: "/beneficiary/my-requests",
            label: "Moje Zapytania",
            icon: ClipboardList,
        },
        {
            path: "/beneficiary/operator-contact",
            label: "Kontakt z Operatorem",
            icon: Phone,
        },
        {
            path: "/beneficiary/service-request",
            label: "Zapytanie o Usługę",
            icon: MessageSquare,
        },
    ],
    contractor: [
        { path: "/contractor/marketplace", label: "Marketplace", icon: Store },
        {
            path: "/contractor/offersform",
            label: "Formularz Oferty",
            icon: PlusCircle,
        },
        { path: "/contractor/offers", label: "Moje Oferty", icon: Briefcase },
        { path: "/contractor/portfolio", label: "Portfolio", icon: FolderOpen },
    ],
};
export const SidebarLayout = ({ children, userRole = "operator", }) => {
    const currentMenuItems = menuItems[userRole] || [];
    return (_jsxs("div", { className: "flex min-h-screen bg-slate-50", children: [_jsx("div", { className: "w-64 bg-white border-r border-slate-200 flex-shrink-0", children: _jsxs("div", { className: "p-6", children: [_jsxs("div", { className: "flex items-center gap-3 mb-8", children: [_jsx("div", { className: "w-10 h-10 bg-slate-900 text-white rounded-lg flex items-center justify-center", children: _jsx(User, { className: "w-6 h-6" }) }), _jsxs("div", { children: [_jsx("h2", { className: "font-semibold text-slate-900 capitalize", children: userRole }), _jsx("p", { className: "text-sm text-slate-600", children: "Panel U\u017Cytkownika" })] })] }), _jsx("nav", { className: "space-y-2", children: currentMenuItems.map((item) => {
                                const Icon = item.icon;
                                return (_jsxs(NavLink, { to: item.path, className: ({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive
                                        ? "bg-slate-900 text-white"
                                        : "text-slate-700 hover:bg-slate-100"}`, children: [_jsx(Icon, { className: "w-5 h-5" }), item.label] }, item.path));
                            }) })] }) }), _jsx("div", { className: "flex-1 flex flex-col", children: children })] }));
};
