// src/routes/ContractorRoutes.tsx
import { Route } from "react-router-dom";

import ProtectedRoute from "@/components/ProtectedRoute";
import { ContractorMarketplace } from "./ContractorMarketplace";
import { ContractorOfferForm } from "./ContractorOfferForm";

import { ContractorPortfolio } from "./ContractorPortfolio";
import { ContractorOffers } from ".";

export const ContractorRoutes = () => (
  <>
    <Route
      path="/contractor/marketplace"
      element={
        <ProtectedRoute>
          <ContractorMarketplace />
        </ProtectedRoute>
      }
    />
    <Route
      path="/contractor/offersform"
      element={
        <ProtectedRoute>
          <ContractorOfferForm />
        </ProtectedRoute>
      }
    />
    <Route
      path="/contractor/offers"
      element={
        <ProtectedRoute>
          <ContractorOffers />
        </ProtectedRoute>
      }
    />
     <Route
      path="/contractor/portfolio"
      element={
        <ProtectedRoute>
          <ContractorPortfolio />
        </ProtectedRoute>
      }
    />
  </>
);
