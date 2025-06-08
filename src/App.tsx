// src/App.jsx
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { BrowserRouter, Routes } from 'react-router-dom';
import Navigation from './components/Navigation';
import ThemeSwitcher from './daisyModule/ThemeSwitcher';
import { AuthProvider } from '@/hooks/useAuth';
import { AuthRoutes } from '@/pages/auth';
import { DashboardRoutes } from '@/pages/dashboard';
import { AdminRoutes } from '@/pages/admin';
import { SharedRoutes } from '@/pages/shared';
import { ContractorRoutes } from '@/pages/contractor/__ContractorRoutes';

function App() {
  const queryClient = new QueryClient({
    // tutaj możesz dodać opcje, np. defaultOptions
  });

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Navigation />
          <main className="pt-16 min-h-screen">
            <Routes>
              {AuthRoutes()}
              {DashboardRoutes()}
              {AdminRoutes()}
              {SharedRoutes()}
              {ContractorRoutes()}
            </Routes>
            <div className="fixed bottom-4 right-4 z-40">
              <ThemeSwitcher />
            </div>
          </main>
        </BrowserRouter>
      </AuthProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
