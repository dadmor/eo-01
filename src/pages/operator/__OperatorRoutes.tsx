// src/routes/OperatorRoutes.tsx
import { Route } from "react-router-dom";
import {
  OperatorContacts,
  OperatorModeration,
  OperatorReports,
  OperatorRequests,
} from ".";
import { SidebarLayout } from "@/components/layout/SidebarLayout";
import Navigation from "@/components/Navigation";

export const OperatorRoutes = () => (
  <>
    <Route
      path="/operator/contacts"
      element={
        <SidebarLayout userRole="operator">
          <Navigation />
          <OperatorContacts />
        </SidebarLayout>
      }
    />
    <Route
      path="/operator/moderation"
      element={
        <SidebarLayout userRole="operator">
          <Navigation />
          <OperatorModeration />
        </SidebarLayout>
      }
    />
    <Route
      path="/operator/reports"
      element={
        <SidebarLayout userRole="operator">
          <Navigation />
          <OperatorReports />
        </SidebarLayout>
      }
    />
    <Route
      path="/operator/requests"
      element={
        <SidebarLayout userRole="operator">
          <Navigation />
          <OperatorRequests />
        </SidebarLayout>
      }
    />
  </>
);
