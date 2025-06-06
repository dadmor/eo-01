// src/hooks/useAuth.tsx - ultra kompaktowa wersja
import { useGetIdentity, useLogout } from "@pankod/refine-core";

export const useAuth = () => {
  const { data: user, isLoading } = useGetIdentity();
  const { mutate: logout } = useLogout();

  return {
    user,
    isLoading,
    logout: () => logout(),
    isAuthenticated: !!user,
  };
};