// src/routes/AuthRoutes.tsx
import { Route } from "react-router-dom";
import { Login } from "./Login";



export const UiKitRoutes = () => (
  <>
    <Route path="/uikit/dashboard" element={<Login />} />
  </>
);
