import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
// src/routes/AdminRoutes.tsx
import { Route } from "react-router-dom";
import { AdminUsers } from "./AdminUsers";
import { AdminSettings } from "./AdminSettings";
import { AdminLogs } from "./AdminLogs";
import ProtectedRoute from "@/components/ProtectedRoute";
export const AdminRoutes = () => (_jsxs(_Fragment, { children: [_jsx(Route, { path: "/admin/users", element: _jsx(ProtectedRoute, { children: _jsx(AdminUsers, {}) }) }), _jsx(Route, { path: "/admin/settings", element: _jsx(ProtectedRoute, { children: _jsx(AdminSettings, {}) }) }), _jsx(Route, { path: "/admin/logs", element: _jsx(ProtectedRoute, { children: _jsx(AdminLogs, {}) }) })] }));
