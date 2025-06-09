import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
// src/routes/AuditorRoutes.tsx
import { Route } from "react-router-dom";
import { AuditorMarketplace, AuditorOfferForm, AuditorOffers, AuditorPortfolio, } from ".";
import { SidebarLayout } from "@/components/layout/SidebarLayout";
import Navigation from "@/components/Navigation";
export const AuditorRoutes = () => (_jsxs(_Fragment, { children: [_jsx(Route, { path: "/auditor/marketplace", element: _jsxs(SidebarLayout, { userRole: "auditor", children: [_jsx(Navigation, {}), _jsx(AuditorMarketplace, {})] }) }), _jsx(Route, { path: "/auditor/offer/new", element: _jsxs(SidebarLayout, { userRole: "auditor", children: [_jsx(Navigation, {}), _jsx(AuditorOfferForm, {})] }) }), _jsx(Route, { path: "/auditor/offers", element: _jsxs(SidebarLayout, { userRole: "auditor", children: [_jsx(Navigation, {}), _jsx(AuditorOffers, {})] }) }), _jsx(Route, { path: "/auditor/portfolio", element: _jsxs(SidebarLayout, { userRole: "auditor", children: [_jsx(Navigation, {}), _jsx(AuditorPortfolio, {})] }) })] }));
