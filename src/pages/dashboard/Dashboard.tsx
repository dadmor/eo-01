// src/pages/Dashboard.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface UserIdentity {
  id: string;
  email: string;
  name?: string;
}

export const Dashboard: React.FC = () => {
  console.log("Dashboard");

  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [identity, setIdentity] = useState<UserIdentity | null>(null);

  // Simulate loading user data
  useEffect(() => {
    const loadUserData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock user data - replace with actual API call
        const userData: UserIdentity = {
          id: "user_123",
          email: "user@example.com",
          name: "Jan Kowalski"
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
    navigate(path);
  };

  if (error) {
    return (
      <div className="alert alert-error m-6">
        <span>{error}</span>
        <button className="btn btn-sm" onClick={handleRetry}>
          Spróbuj ponownie
        </button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <span className="loading loading-spinner loading-lg"></span>
          <p className="mt-4 text-base-content/70">Ładowanie danych...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 min-h-screen bg-base-200/30">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="text-sm text-base-content/70">
          {new Date().toLocaleDateString('pl-PL', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </div>
      </div>
      
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <h2 className="card-title text-primary">
            Witaj{identity?.name ? `, ${identity.name}` : ''}! 👋
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <p className="text-sm text-base-content/70">Email:</p>
              <p className="font-semibold">{identity?.email || "Brak danych"}</p>
            </div>
            <div>
              <p className="text-sm text-base-content/70">ID użytkownika:</p>
              <p className="font-semibold font-mono text-sm">{identity?.id || "Brak danych"}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
          <div className="card-body">
            <h3 className="card-title text-secondary">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Szybkie akcje
            </h3>
            <div className="space-y-2">
              <button 
                className="btn btn-outline btn-sm w-full justify-start"
                onClick={() => handleNavigation('/profile')}
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Mój profil
              </button>
              <button 
                className="btn btn-outline btn-sm w-full justify-start"
                onClick={() => handleNavigation('/tickets/new')}
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Nowe zgłoszenie
              </button>
              <button 
                className="btn btn-outline btn-sm w-full justify-start"
                onClick={() => handleNavigation('/tickets')}
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Moje zgłoszenia
              </button>
            </div>
          </div>
        </div>
        
        <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
          <div className="card-body">
            <h3 className="card-title text-accent">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Ostatnia aktywność
            </h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-success rounded-full"></div>
                <span className="text-base-content/70">Zalogowano się dzisiaj</span>
              </div>
              <div className="text-sm text-base-content/50">
                Brak innych aktywności
              </div>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
          <div className="card-body">
            <h3 className="card-title text-info">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Statystyki
            </h3>
            <div className="stats-desc">
              <div className="stat">
                <div className="stat-title">Otwarte zgłoszenia</div>
                <div className="stat-value text-primary">0</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Dodatkowa sekcja z przydatnymi linkami */}
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <h3 className="card-title">Przydatne linki</h3>
          <div className="flex flex-wrap gap-2">
            <div className="badge badge-outline cursor-pointer hover:badge-primary" onClick={() => handleNavigation('/help')}>
              Pomoc
            </div>
            <div className="badge badge-outline cursor-pointer hover:badge-secondary" onClick={() => handleNavigation('/settings')}>
              Ustawienia
            </div>
            <div className="badge badge-outline cursor-pointer hover:badge-accent" onClick={() => handleNavigation('/contact')}>
              Kontakt
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;