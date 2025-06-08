// src/routes/AuthRoutes.tsx
import { Route } from "react-router-dom";
import BaseDemo from "./BaseDemo";

export const UiKitRoutes = () => (
  <>
    <Route path="/uikit/dashboard" element={<BaseDemo />} />
  </>
);
