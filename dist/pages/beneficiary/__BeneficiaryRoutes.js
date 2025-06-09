import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
// src/routes/BeneficiaryRoutes.tsx
import { Route } from "react-router-dom";
import { AuditRequestForm, MyRequests, OperatorContact, RequestDetail, ServiceRequestForm, } from ".";
import { SidebarLayout } from "@/components/layout/SidebarLayout";
import Navigation from "@/components/Navigation";
export const BeneficiaryRoutes = () => (_jsxs(_Fragment, { children: [_jsx(Route, { path: "/beneficiary/audit-request", element: _jsxs(SidebarLayout, { userRole: "beneficiary", children: [_jsx(Navigation, {}), _jsx(AuditRequestForm, {})] }) }), _jsx(Route, { path: "/beneficiary/my-requests", element: _jsxs(SidebarLayout, { userRole: "beneficiary", children: [_jsx(Navigation, {}), _jsx(MyRequests, {})] }) }), _jsx(Route, { path: "/beneficiary/operator-contact", element: _jsxs(SidebarLayout, { userRole: "beneficiary", children: [_jsx(Navigation, {}), _jsx(OperatorContact, {})] }) }), _jsx(Route, { path: "/beneficiary/requests/:id", element: _jsx(RequestDetail, {}) }), _jsx(Route, { path: "/beneficiary/service-request", element: _jsxs(SidebarLayout, { userRole: "beneficiary", children: [_jsx(Navigation, {}), _jsx(ServiceRequestForm, {})] }) })] }));
