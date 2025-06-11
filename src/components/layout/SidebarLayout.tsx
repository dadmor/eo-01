// src/components/layout/SidebarLayout.tsx
import React from "react";
import { NavLink } from "react-router-dom";
import {
  Users,
  FileText,
  Shield,
  MessageSquare,
  Store,
  PlusCircle,
  Briefcase,
  FolderOpen,
  ClipboardList,
  User,
  Phone,
  Eye,
  UserCheck,
} from "lucide-react";
import { Card } from "../ui/basic/Card";

interface SidebarLayoutProps {
  children: React.ReactNode;
  userRole?: "operator" | "auditor" | "beneficiary" | "contractor" | "admin";
}

const menuItems = {
  admin: [{ path: "/admin/users", label: "Użytkownicy", icon: Users }],
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

export const SidebarLayout: React.FC<SidebarLayoutProps> = ({
  children,
  userRole = "operator",
}) => {
  const currentMenuItems = menuItems[userRole] || [];

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-slate-200 flex-shrink-0">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-slate-900 text-white rounded-lg flex items-center justify-center">
              <User className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-semibold text-slate-900 capitalize">
                {userRole}
              </h2>
              <p className="text-sm text-slate-600">Panel Użytkownika</p>
            </div>
          </div>

          <nav className="space-y-2">
            {currentMenuItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-slate-900 text-white"
                        : "text-slate-700 hover:bg-slate-100"
                    }`
                  }
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </NavLink>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">{children}</div>
    </div>
  );
};
