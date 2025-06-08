// src/routes/ContractorRoutes.tsx
import { Route } from "react-router-dom";

import ProtectedRoute from "@/components/ProtectedRoute";
import { ContractorMarketplace } from "./ContractorMarketplace";
import { ContractorOfferForm } from "./ContractorOfferForm";

import { ContractorPortfolio } from "./ContractorPortfolio";
import { ContractorOffers } from ".";
import { SidebarLayout } from "@/components/layout/SidebarLayout";
import Navigation from "@/components/Navigation";

export const ContractorRoutes = () => (
  <>
    <Route
      path="/contractor/marketplace"
      element={
        <ProtectedRoute>
          <SidebarLayout userRole="contractor">
            <Navigation />
            <ContractorMarketplace />
          </SidebarLayout>
        </ProtectedRoute>
      }
    />
    <Route
      path="/contractor/offersform"
      element={
        <ProtectedRoute>
          <SidebarLayout userRole="contractor">
            <Navigation />
            <ContractorOfferForm />
          </SidebarLayout>
        </ProtectedRoute>
      }
    />
    <Route
      path="/contractor/offers"
      element={
        <ProtectedRoute>
          <SidebarLayout userRole="contractor">
            <Navigation />
            <ContractorOffers />
          </SidebarLayout>
        </ProtectedRoute>
      }
    />
    <Route
      path="/contractor/portfolio"
      element={
     
        <ProtectedRoute>
          <SidebarLayout userRole="contractor">
            <Navigation />
            <ContractorPortfolio />
          </SidebarLayout>
        </ProtectedRoute>
      }
    />
  </>
);
