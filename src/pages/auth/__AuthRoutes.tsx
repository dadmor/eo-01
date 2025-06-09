// src/routes/AuthRoutes.tsx
import { Route } from "react-router-dom";
import { Login } from "./Login";
import { Register } from "./Register";
import { AuthCallback } from "./AuthCallback";

export const AuthRoutes = () => (
  <>
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="/auth/callback" element={<AuthCallback />} />
    <Route
      path="/"
      element={
        <Login />
      }
    />
  </>
);
