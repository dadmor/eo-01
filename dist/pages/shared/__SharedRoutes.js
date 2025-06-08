import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
// src/routes/SharedRoutes.tsx
import { Route } from "react-router-dom";
import { UserProfile } from "./UserProfile";
import { PointsHistory } from "./PointsHistory";
import { NotFound } from "./NotFound";
import ProtectedRoute from "@/components/ProtectedRoute";
export const SharedRoutes = () => (_jsxs(_Fragment, { children: [_jsx(Route, { path: "/profile", element: _jsx(ProtectedRoute, { children: _jsx(UserProfile, {}) }) }), _jsx(Route, { path: "/points", element: _jsx(ProtectedRoute, { children: _jsx(PointsHistory, {}) }) }), _jsx(Route, { path: "*", element: _jsx(NotFound, {}) })] }));
