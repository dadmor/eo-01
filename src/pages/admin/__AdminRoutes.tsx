// src/routes/AdminRoutes.tsx
import { Route } from "react-router-dom";

import { AdminUsers } from "./AdminUsers";
import { AdminSettings } from "./AdminSettings";
import { AdminLogs } from "./AdminLogs";
import ProtectedRoute from "@/components/ProtectedRoute";

export const AdminRoutes = () => (
  <>
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
  </>
);
