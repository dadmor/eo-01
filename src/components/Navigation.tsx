// src/components/Navigation.tsx
import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { Menu, X, User, Settings, BarChart3 } from "lucide-react";
import { Button } from "./ui/basic/Button";
import AuthDropdown from "./AuthDropdown";

const Navigation: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // wspólna funkcja do klasy aktywnego linku
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? "bg-slate-100 text-slate-900 rounded-lg"
      : "text-slate-700 hover:bg-slate-50 rounded-lg";

  return (
    <>
      {/* Main Navigation Bar */}
      <nav className="bg-white border-b border-slate-200 p-3 px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <NavLink to="/" className="flex items-center gap-3">
              <div className="min-w-8 w-8 h-8 bg-slate-900 text-white rounded-lg flex items-center justify-center">
                <span className="font-bold text-sm">MA</span>
              </div>
              <span className="text-xl font-semibold text-slate-900">
                eOperator
              </span>
            </NavLink>
          </div>

          

          {/* Right side - Auth + Mobile Menu */}
          <div className="flex items-center gap-3">
            <AuthDropdown />
            <div className="lg:hidden">
              <Button
                variant="ghost"
                onClick={toggleMobileMenu}
                icon={
                  isMobileMenuOpen ? (
                    <X className="w-5 h-5" />
                  ) : (
                    <Menu className="w-5 h-5" />
                  )
                }
                children={undefined}
              />
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white">
            <div className="px-4 py-3 space-y-2">
              <NavLink
                to="/beneficiary/my-requests"
                className={linkClass}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <User className="w-4 h-4" />
                Beneficjent
              </NavLink>
              <NavLink
                to="/admin/users"
                className={linkClass}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Settings className="w-4 h-4" />
                Użytkownicy
              </NavLink>
              <NavLink
                to="/dashboard"
                className={linkClass}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <BarChart3 className="w-4 h-4" />
                Dashboard
              </NavLink>
            </div>
          </div>
        )}
      </nav>

      {/* Spacer to prevent content from going under fixed navbar */}
      <div className="h-16"></div>
    </>
  );
};

export default Navigation;
