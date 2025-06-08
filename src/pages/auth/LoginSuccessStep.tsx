// src/pages/auth/LoginSuccessStep.tsx
import React from "react";
import { Link } from "react-router-dom";
import { CheckCircle, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/basic/Card";
import { Button } from "@/components/ui/basic/Button";

interface User {
  email: string;
  first_name?: string;
  role: string;
}

interface LoginSuccessStepProps {
  user: User;
  onGoToDashboard: () => void;
  onBackToLogin: () => void;
}

export const LoginSuccessStep: React.FC<LoginSuccessStepProps> = ({
  user,
  onGoToDashboard,
  onBackToLogin
}) => {
  // Funkcja do określenia nazwy dashboardu na podstawie roli
  const getDashboardName = (role: string) => {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-xl p-8">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Zalogowano pomyślnie!</h1>
            <p className="text-gray-600 mt-2">
              Witaj, {user.first_name || user.email}
            </p>
          </div>

          {/* User Info */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Email:</span>
                <span className="text-sm font-medium text-gray-900">{user.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Rola:</span>
                <span className="text-sm font-medium text-gray-900 capitalize">{user.role}</span>
              </div>
            </div>
          </div>

          {/* Dashboard Button */}
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={onGoToDashboard}
            icon={<ArrowRight className="w-4 h-4" />}
            className="mb-4"
          >
            Przejdź do {getDashboardName(user.role)}
          </Button>

          {/* Alternative Links */}
          <div className="text-center space-y-2">
            <p className="text-sm text-gray-600">Lub przejdź do:</p>
            <div className="flex flex-col space-y-2">
              {user.role !== "admin" && (
                <Link
                  to="/"
                  className="text-sm text-blue-600 hover:text-blue-500 transition-colors"
                >
                  Strona główna
                </Link>
              )}
              <button
                onClick={onBackToLogin}
                className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                Wróć do formularza logowania
              </button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};