import React, { useState, useEffect } from "react";
import { User, Zap, Clock, BarChart3, Plus, FileText, Settings, Users, Database } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface UserIdentity {
  id: string;
  email: string;
  name?: string;
}

export const Dashboard: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [identity, setIdentity] = useState<UserIdentity | null>(null);
  const navigate = useNavigate();

  // Simulate loading user data
  useEffect(() => {
    const loadUserData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 150));

        // Mock user data
        const userData: UserIdentity = {
          id: "user_123",
          email: "jan.kowalski@example.com",
          name: "Jan Kowalski",
        };

        setIdentity(userData);
      } catch (err) {
        setError("Nie udało się załadować danych użytkownika");
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, []);

  const handleRetry = () => {
    window.location.reload();
  };

  const handleNavigation = (path: string) => {
    navigate(path)

  };

  if (error) {
    return (
      <div className="min-h-screen bg-base-200 p-6">
        <div className="max-w-md mx-auto">
          <div className="shadcn-card p-6 border-red-200">
            <div className="flex items-center gap-3 text-red-600">
              <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center">
                <span className="text-sm font-bold">!</span>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">Wystąpił błąd</h3>
                <p className="text-sm text-red-500 mt-1">{error}</p>
              </div>
            </div>
            <div className="mt-4">
              <button 
                className="btn btn-sm shadcn-outline"
                onClick={handleRetry}
              >
                Spróbuj ponownie
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-2 border-slate-200 border-t-slate-900 rounded-full animate-spin mx-auto"></div>
          <p className="text-slate-600">Ładowanie danych...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200">
      <div className="container mx-auto p-6 space-y-6 max-w-7xl">
        
        {/* Header z informacjami o użytkowniku */}
        <div className="shadcn-card">
          <div className="p-6 border-b border-slate-200">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-slate-900 text-white rounded-full flex items-center justify-center font-semibold text-lg">
                {identity?.name?.charAt(0) || "U"}
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-slate-900">
                  Witaj, {identity?.name || "Użytkowniku"}!
                </h1>
                <p className="text-slate-600">Panel zarządzania kontem</p>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Email</label>
                <div className="text-slate-900 font-mono text-sm bg-slate-50 px-3 py-2 rounded border">
                  {identity?.email || "Brak danych"}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">ID użytkownika</label>
                <div className="text-slate-900 font-mono text-sm bg-slate-50 px-3 py-2 rounded border">
                  {identity?.id || "Brak danych"}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Główne funkcje */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Szybkie akcje */}
          <div className="shadcn-card">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-blue-600" />
                </div>
                <h2 className="text-lg font-semibold text-slate-900">Szybkie akcje</h2>
              </div>
              
              <div className="space-y-3">
                <button
                  className="w-full shadcn-outline flex items-center gap-3 justify-start px-4 py-3"
                  onClick={() => handleNavigation("/profile")}
                >
                  <User className="w-4 h-4" />
                  <span>Mój profil</span>
                </button>
                
                <button
                  className="w-full btn-primary flex items-center gap-3 justify-start px-4 py-3 bg-slate-900 text-white hover:bg-slate-800 border-0"
                  onClick={() => handleNavigation("/tickets/new")}
                >
                  <Plus className="w-4 h-4" />
                  <span>Nowe zgłoszenie</span>
                </button>
                
                <button
                  className="w-full shadcn-outline flex items-center gap-3 justify-start px-4 py-3"
                  onClick={() => handleNavigation("/tickets")}
                >
                  <FileText className="w-4 h-4" />
                  <span>Moje zgłoszenia</span>
                </button>
              </div>
            </div>
          </div>

          {/* Ostatnia aktywność */}
          <div className="shadcn-card">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-green-600" />
                </div>
                <h2 className="text-lg font-semibold text-slate-900">Ostatnia aktywność</h2>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-green-800">Zalogowano się dzisiaj</p>
                    <p className="text-xs text-green-600 mt-1">
                      {new Date().toLocaleString('pl-PL')}
                    </p>
                  </div>
                </div>
                
                <div className="text-sm text-slate-500 text-center py-4">
                  Brak innych aktywności
                </div>
              </div>
            </div>
          </div>

          {/* Statystyki */}
          <div className="shadcn-card">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-purple-600" />
                </div>
                <h2 className="text-lg font-semibold text-slate-900">Statystyki</h2>
              </div>
              
              <div className="text-center space-y-2">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-purple-600">0</span>
                </div>
                <p className="font-medium text-slate-900">Otwarte zgłoszenia</p>
                <p className="text-sm text-slate-600">Wszystko załatwione! 🎉</p>
              </div>
            </div>
          </div>
        </div>

        {/* Przydatne linki */}
        <div className="shadcn-card">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-6">Przydatne linki</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-slate-700 mb-3 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Autoryzacja
                </h3>
                <div className="flex flex-wrap gap-2">
                  <button className="btn btn-sm shadcn-outline">
                    Logowanie
                  </button>
                  <button className="btn btn-sm shadcn-outline">
                    Rejestracja
                  </button>
                </div>
              </div>
              
              <div className="border-t border-slate-200 pt-6">
                <h3 className="text-sm font-medium text-slate-700 mb-3 flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Panel administratora
                </h3>
                <div className="flex flex-wrap gap-2">
                  <button 
                    className="btn btn-sm shadcn-outline flex items-center gap-2"
                    onClick={() => handleNavigation("/admin/logs")}
                  >
                    <Database className="w-3 h-3" />
                    Logi systemu
                  </button>
                  <button 
                    className="btn btn-sm shadcn-outline flex items-center gap-2"
                    onClick={() => handleNavigation("/admin/settings")}
                  >
                    <Settings className="w-3 h-3" />
                    Ustawienia
                  </button>
                  <button 
                    className="btn btn-sm shadcn-outline flex items-center gap-2"
                    onClick={() => handleNavigation("/admin/users")}
                  >
                    <Users className="w-3 h-3" />
                    Zarządzanie użytkownikami
                  </button>
                  <button 
                    className="btn btn-sm shadcn-outline flex items-center gap-2"
                    onClick={() => handleNavigation("/uikit/dashboard")}
                  >
                    <Users className="w-3 h-3" />
                    UiKit
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}