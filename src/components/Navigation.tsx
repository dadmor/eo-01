// src/components/Navigation.tsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, User, Settings, BarChart3 } from "lucide-react";
import { Button } from "./ui/basic/Button";
import { Avatar } from "./ui/basic/Avatar";
import AuthDropdown from "./AuthDropdown";

const Navigation: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      {/* Main Navigation Bar */}
      <nav className="bg-white border-b border-slate-200 border-red-300 p-3 px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-8 h-8 bg-slate-900 text-white rounded-lg flex items-center justify-center">
                <span className="font-bold text-sm">MA</span>
              </div>
              <span className="text-xl font-semibold text-slate-900">
                Moja Aplikacja
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-2">
            <Link to="/beneficiary/my-requests">
              <Button variant="ghost" icon={<User className="w-4 h-4" />}>
                Beneficjent
              </Button>
            </Link>
            <Link to="/auditor/marketplace">
              <Button variant="ghost" icon={<User className="w-4 h-4" />}>
                Audytor
              </Button>
            </Link>
            <Link to="/operator/contacts">
              <Button variant="ghost" icon={<User className="w-4 h-4" />}>
                Operator
              </Button>
            </Link>
            <Link to="/profile">
              <Button variant="ghost" icon={<User className="w-4 h-4" />}>
                Profil
              </Button>
            </Link>

            <Link to="/admin/users">
              <Button variant="ghost" icon={<Settings className="w-4 h-4" />}>
                Użytkownicy
              </Button>
            </Link>

            <Link to="/dashboard">
              <Button variant="ghost" icon={<BarChart3 className="w-4 h-4" />}>
                Dashboard
              </Button>
            </Link>
          </div>

          {/* Right side - Auth + Mobile Menu */}
          <div className="flex items-center gap-3">
            <AuthDropdown />

            {/* Mobile menu button */}
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
              <Link
                to="/profile"
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <User className="w-4 h-4" />
                Profil
              </Link>

              <Link
                to="/admin/users"
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Settings className="w-4 h-4" />
                Użytkownicy
              </Link>

              <Link
                to="/dashboard"
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <BarChart3 className="w-4 h-4" />
                Dashboard
              </Link>
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
