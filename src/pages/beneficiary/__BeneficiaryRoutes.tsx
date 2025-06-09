// src/routes/BeneficiaryRoutes.tsx
import { Route } from "react-router-dom";
import {
  AuditRequestForm,
  MyRequests,
  OperatorContact,
  RequestDetail,
  ServiceRequestForm,
} from ".";
import { SidebarLayout } from "@/components/layout/SidebarLayout";
import Navigation from "@/components/Navigation";

export const BeneficiaryRoutes = () => (
  <>
    <Route
      path="/beneficiary/audit-request"
      element={
        <SidebarLayout userRole="beneficiary">
          <Navigation />
          <AuditRequestForm />
        </SidebarLayout>
      }
    />
    <Route
      path="/beneficiary/my-requests"
      element={
        <SidebarLayout userRole="beneficiary">
          <Navigation />
          <MyRequests />
        </SidebarLayout>
      }
    />
    <Route
      path="/beneficiary/operator-contact"
      element={
        <SidebarLayout userRole="beneficiary">
          <Navigation />
          <OperatorContact />
        </SidebarLayout>
      }
    />
    <Route path="/beneficiary/requests/:id" element={ <SidebarLayout userRole="beneficiary">
          <Navigation />
          <RequestDetail />
        </SidebarLayout>} />
   
    <Route
      path="/beneficiary/service-request"
      element={
        <SidebarLayout userRole="beneficiary">
          <Navigation />
          <ServiceRequestForm />
        </SidebarLayout>
      }
    />
  </>
);
