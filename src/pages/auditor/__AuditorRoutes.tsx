// src/routes/AuditorRoutes.tsx
import { Route } from "react-router-dom";
import { AuditorMarketplace, AuditorOfferForm, AuditorOffers, AuditorPortfolio } from ".";


export const AuditorRoutes = () => (
  <>
    <Route path="/auditor/marketplace" element={<AuditorMarketplace />} />
    <Route path="/auditor/offer/new" element={<AuditorOfferForm />} />
    <Route path="/auditor/offers" element={<AuditorOffers />} />
    <Route path="/auditor/portfolio" element={<AuditorPortfolio />} />
  </>
);
