// src/routes/AuditorRoutes.tsx
import { Route } from "react-router-dom";
import {
  AuditorMarketplace,
  AuditorOfferForm,
  AuditorOffers,
  AuditorPortfolio,
  AuditRequestDetail,
} from ".";
import { SidebarLayout } from "@/components/layout/SidebarLayout";
import Navigation from "@/components/Navigation";


export const AuditorRoutes = () => (
  <>
    <Route
      path="/auditor/marketplace"
      element={
        <SidebarLayout userRole="auditor">
          <Navigation />
          <AuditorMarketplace />
        </SidebarLayout>
      }
    />
    <Route
      path="/auditor/offer/new"
      element={
        <SidebarLayout userRole="auditor">
          <Navigation />
          <AuditorOfferForm />
        </SidebarLayout>
      }
    />
    <Route
      path="/auditor/offers"
      element={
        <SidebarLayout userRole="auditor">
          <Navigation />
          <AuditorOffers />
        </SidebarLayout>
      }
    />
    <Route
      path="/auditor/portfolio"
      element={
        <SidebarLayout userRole="auditor">
          <Navigation />
          <AuditorPortfolio />
        </SidebarLayout>
      }
    />
    <Route
      path="/auditor/marketplace/:id"
      element={
        <SidebarLayout userRole="auditor">
          <Navigation />
          <AuditRequestDetail />
        </SidebarLayout>
      }
    />
  </>
);
