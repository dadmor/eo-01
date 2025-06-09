import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
// src/routes/ContractorRoutes.tsx
import { Route } from "react-router-dom";
import ProtectedRoute from "@/components/ProtectedRoute";
import { ContractorMarketplace } from "./ContractorMarketplace";
import { ContractorOfferForm } from "./ContractorOfferForm";
import { ContractorPortfolio } from "./ContractorPortfolio";
import { ContractorOffers } from ".";
import { SidebarLayout } from "@/components/layout/SidebarLayout";
import Navigation from "@/components/Navigation";
export const ContractorRoutes = () => (_jsxs(_Fragment, { children: [_jsx(Route, { path: "/contractor/marketplace", element: _jsx(ProtectedRoute, { children: _jsxs(SidebarLayout, { userRole: "contractor", children: [_jsx(Navigation, {}), _jsx(ContractorMarketplace, {})] }) }) }), _jsx(Route, { path: "/contractor/offersform", element: _jsx(ProtectedRoute, { children: _jsxs(SidebarLayout, { userRole: "contractor", children: [_jsx(Navigation, {}), _jsx(ContractorOfferForm, {})] }) }) }), _jsx(Route, { path: "/contractor/offers", element: _jsx(ProtectedRoute, { children: _jsxs(SidebarLayout, { userRole: "contractor", children: [_jsx(Navigation, {}), _jsx(ContractorOffers, {})] }) }) }), _jsx(Route, { path: "/contractor/portfolio", element: _jsx(ProtectedRoute, { children: _jsxs(SidebarLayout, { userRole: "contractor", children: [_jsx(Navigation, {}), _jsx(ContractorPortfolio, {})] }) }) })] }));
