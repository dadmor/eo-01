import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
// src/routes/DashboardRoutes.tsx
import ProtectedRoute from "@/components/ProtectedRoute";
import { Route } from "react-router-dom";
import { Dashboard } from "./Dashboard";
export const DashboardRoutes = () => (_jsx(_Fragment, { children: _jsx(Route, { path: "/dashboard", element: _jsx(ProtectedRoute, { children: _jsx(Dashboard, {}) }) }) }));
