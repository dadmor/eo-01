// src/routes/DashboardRoutes.tsx
import ProtectedRoute from "@/components/ProtectedRoute";
import { Route } from "react-router-dom";
import { Dashboard } from "./Dashboard";

export const DashboardRoutes = () => (
  <>
    <Route
      path="/"
      element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      }
    />
    <Route
      path="/dashboard"
      element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      }
    />
  </>
);
