// src/routes/SharedRoutes.tsx
import { Route } from "react-router-dom";

import { UserProfile } from "./UserProfile";
import { PointsHistory } from "./PointsHistory";
import { NotFound } from "./NotFound";
import ProtectedRoute from "@/components/ProtectedRoute";

export const SharedRoutes = () => (
  <>
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
        <ProtectedRoute>
          <PointsHistory />
        </ProtectedRoute>
      }
    />
    <Route path="*" element={<NotFound />} />
  </>
);
