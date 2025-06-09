import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
// src/routes/OperatorRoutes.tsx
import { Route } from "react-router-dom";
import { OperatorContacts, OperatorModeration, OperatorReports, OperatorRequests, } from ".";
import { SidebarLayout } from "@/components/layout/SidebarLayout";
import Navigation from "@/components/Navigation";
export const OperatorRoutes = () => (_jsxs(_Fragment, { children: [_jsx(Route, { path: "/operator/contacts", element: _jsxs(SidebarLayout, { userRole: "operator", children: [_jsx(Navigation, {}), _jsx(OperatorContacts, {})] }) }), _jsx(Route, { path: "/operator/moderation", element: _jsxs(SidebarLayout, { userRole: "operator", children: [_jsx(Navigation, {}), _jsx(OperatorModeration, {})] }) }), _jsx(Route, { path: "/operator/reports", element: _jsxs(SidebarLayout, { userRole: "operator", children: [_jsx(Navigation, {}), _jsx(OperatorReports, {})] }) }), _jsx(Route, { path: "/operator/requests", element: _jsxs(SidebarLayout, { userRole: "operator", children: [_jsx(Navigation, {}), _jsx(OperatorRequests, {})] }) })] }));
