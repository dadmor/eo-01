// src/App.tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navigation from "./components/Navigation";
import ProtectedRoute from "./components/ProtectedRoute";

import { Login } from "./pages/auth/Login";
import { Register } from "./pages/auth/Register";

import { AdminUsers } from "./pages/admin/AdminUsers";
import { AdminSettings } from "./pages/admin/AdminSettings";
import { AdminLogs } from "./pages/admin/AdminLogs";

import { UserProfile } from "./pages/shared/UserProfile";
import { PointsHistory } from "./pages/shared/PointsHistory";
import { NotFound } from "./pages/shared/NotFound";

import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

// Konfiguracja React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minut
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Navigation />
        <div className="pt-16 bg-gray-50 min-h-screen">
          <Routes>
            {/* Publiczne */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Dashboard - główna strona dla zalogowanych */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <>__</>
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <>__</>
                </ProtectedRoute>
              }
            />

            {/* Admin - na razie bez sprawdzania ról */}
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute>
                  <AdminUsers />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/settings"
              element={
                <ProtectedRoute>
                  <AdminSettings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/logs"
              element={
                <ProtectedRoute>
                  <AdminLogs />
                </ProtectedRoute>
              }
            />

            {/* Wspólne */}
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <UserProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/points"
              element={
                <ProtectedRoute>
                  <PointsHistory />
                </ProtectedRoute>
              }
            />

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>

        <ReactQueryDevtools />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
