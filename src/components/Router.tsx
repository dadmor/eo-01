// src/Router.tsx
import { Routes, Route } from "react-router-dom";
import Navigation from "./Navigation";
import { Login } from "@/pages/auth/Login";
import { AdminUsers, AdminSettings, AdminLogs } from "@/pages/admin";
import { AuditorMarketplace, AuditorPortfolio, AuditorOffers, AuditorOfferForm } from "@/pages/auditor";
import { Register } from "@/pages/auth/Register";
import { OperatorContact, ServiceRequestForm, AuditRequestForm, MyRequests, RequestDetail } from "@/pages/beneficiary";
import { ContractorMarketplace, ContractorPortfolio, ContractorOffers, ContractorOfferForm } from "@/pages/contractor";
import { Dashboard } from "@/pages/Dashboard";
import { OperatorRequests, OperatorModeration, OperatorReports, OperatorContacts } from "@/pages/operator";
import { UserProfile, PointsHistory, NotFound } from "@/pages/shared";
import ProtectedRoute from "./ProtectedRoute";


function Router() {
  return (
    <>
      <Navigation />
      <div className="mt-16 bg-gray-50 min-h-screen">
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          {/* Protected routes - Dashboard */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          {/* BENEFICIARY ROUTES */}
          <Route
            path="/operator-contact"
            element={
              <ProtectedRoute allowedRoles={["beneficiary"]}>
                <OperatorContact />
              </ProtectedRoute>
            }
          />
          <Route
            path="/service-request"
            element={
              <ProtectedRoute allowedRoles={["beneficiary"]}>
                <ServiceRequestForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/audit-request"
            element={
              <ProtectedRoute allowedRoles={["beneficiary"]}>
                <AuditRequestForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-requests"
            element={
              <ProtectedRoute allowedRoles={["beneficiary"]}>
                <MyRequests />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-requests/:id"
            element={
              <ProtectedRoute allowedRoles={["beneficiary"]}>
                <RequestDetail />
              </ProtectedRoute>
            }
          />
          {/* CONTRACTOR ROUTES */}
          <Route
            path="/contractor-marketplace"
            element={
              <ProtectedRoute allowedRoles={["contractor"]}>
                <ContractorMarketplace />
              </ProtectedRoute>
            }
          />
          <Route
            path="/contractor-portfolio"
            element={
              <ProtectedRoute allowedRoles={["contractor"]}>
                <ContractorPortfolio />
              </ProtectedRoute>
            }
          />
          <Route
            path="/contractor-offers"
            element={
              <ProtectedRoute allowedRoles={["contractor"]}>
                <ContractorOffers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/contractor-offer/:requestId"
            element={
              <ProtectedRoute allowedRoles={["contractor"]}>
                <ContractorOfferForm />
              </ProtectedRoute>
            }
          />
          {/* AUDITOR ROUTES */}
          <Route
            path="/auditor-marketplace"
            element={
              <ProtectedRoute allowedRoles={["auditor"]}>
                <AuditorMarketplace />
              </ProtectedRoute>
            }
          />
          <Route
            path="/auditor-portfolio"
            element={
              <ProtectedRoute allowedRoles={["auditor"]}>
                <AuditorPortfolio />
              </ProtectedRoute>
            }
          />
          <Route
            path="/auditor-offers"
            element={
              <ProtectedRoute allowedRoles={["auditor"]}>
                <AuditorOffers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/auditor-offer/:requestId"
            element={
              <ProtectedRoute allowedRoles={["auditor"]}>
                <AuditorOfferForm />
              </ProtectedRoute>
            }
          />
          {/* OPERATOR ROUTES */}
          <Route
            path="/operator/requests"
            element={
              <ProtectedRoute allowedRoles={["operator", "admin"]}>
                <OperatorRequests />
              </ProtectedRoute>
            }
          />
          <Route
            path="/operator/moderation"
            element={
              <ProtectedRoute allowedRoles={["operator", "admin"]}>
                <OperatorModeration />
              </ProtectedRoute>
            }
          />
          <Route
            path="/operator/reports"
            element={
              <ProtectedRoute allowedRoles={["operator", "admin"]}>
                <OperatorReports />
              </ProtectedRoute>
            }
          />
          <Route
            path="/operator/contacts"
            element={
              <ProtectedRoute allowedRoles={["operator", "admin"]}>
                <OperatorContacts />
              </ProtectedRoute>
            }
          />
          {/* ADMIN ROUTES */}
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminUsers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/settings"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminSettings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/logs"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminLogs />
              </ProtectedRoute>
            }
          />
          {/* SHARED ROUTES - dostępne dla wszystkich zalogowanych */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <UserProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/points"
            element={
              <ProtectedRoute allowedRoles={["contractor", "auditor"]}>
                <PointsHistory />
              </ProtectedRoute>
            }
          />
          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </>
    // </BrowserRouter> USUNIĘTY STĄD
  );
}
export default Router;