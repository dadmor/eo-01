// src/routes/AuthRoutes.tsx
import { Route } from "react-router-dom";
import { Login } from "./Login";
import { Register } from "./Register";

export const AuthRoutes = () => (
  <>
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
  </>
);
