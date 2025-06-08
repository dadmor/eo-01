// src/routes/BeneficiaryRoutes.tsx
import { Route } from "react-router-dom";
import { AuditRequestForm, MyRequests, OperatorContact, RequestDetail, ServiceRequestForm } from ".";


export const BeneficiaryRoutes = () => (
  <>
    <Route path="/beneficiary/audit-request" element={<AuditRequestForm />} />
    <Route path="/beneficiary/my-requests" element={<MyRequests />} />
    <Route path="/beneficiary/operator-contact" element={<OperatorContact />} />
    <Route path="/beneficiary/requests/:id" element={<RequestDetail />} />
    <Route path="/beneficiary/service-request" element={<ServiceRequestForm />} />
  </>
);
