// src/authProvider.ts - poprawiona wersja
import { AuthProvider } from "@pankod/refine-core";
import { supabase } from "./utility";

const authProvider: AuthProvider = {
  login: async ({ email, password, redirectPath }) => {
    try {
      const { user, error } = await supabase.auth.signIn({
        email,
        password,
      });

      if (error) {
        return Promise.reject(error);
      }

      if (user) {
        // Wymuś odświeżenie danych użytkownika
        window.location.href = redirectPath || "/";
        return Promise.resolve(redirectPath || "/");
      }

      return Promise.reject(new Error("Login failed"));
    } catch (error) {
      return Promise.reject(error);
    }
  },

  register: async ({ email, password }) => {
    try {
      const { user, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (signUpError) {
        return Promise.reject(signUpError);
      }
      
      if (user) {
        const { error: profileError } = await supabase
          .from("users")
          .insert({
            id: user.id,
            email: user.email,
            role: "beneficiary", 
            name: user.email
          });
        
        if (profileError) {
          console.warn("Profile creation failed:", profileError);
          // Nie blokuj rejestracji jeśli tworzenie profilu się nie powiodło
        }
      }
      
      return Promise.resolve("/");
    } catch (error) {
      return Promise.reject(error);
    }
  },

  forgotPassword: async ({ email }) => {
    try {
      const { error } = await supabase.auth.api.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/update-password`,
      });

      if (error) {
        return Promise.reject(error);
      }

      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  },

  updatePassword: async ({ password }) => {
    try {
      const { error } = await supabase.auth.update({ password });

      if (error) {
        return Promise.reject(error);
      }

      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  },

  logout: async () => {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        return Promise.reject(error);
      }

      // Wyczyść cache i przekieruj
      window.location.href = "/login";
      return Promise.resolve("/login");
    } catch (error) {
      return Promise.reject(error);
    }
  },

  checkError: () => Promise.resolve(),

  checkAuth: async () => {
    try {
      // Pobierz aktualną sesję z Supabase
      const session = supabase.auth.session();
      
      // Sprawdź czy token nie wygasł
      if (session?.access_token) {
        const currentTime = Math.floor(Date.now() / 1000);
        if (session.expires_at && session.expires_at > currentTime) {
          return Promise.resolve();
        }
      }

      // Jeśli nie ma sesji lub wygasła, sprawdź czy to strona publiczna
      const currentPath = window.location.pathname;
      const publicPaths = ["/login", "/register", "/forgot-password"];
      
      if (publicPaths.includes(currentPath)) {
        return Promise.resolve();
      }

      // Dla chronionych stron wymagaj autentykacji
      return Promise.reject(new Error("Not authenticated"));
    } catch (error) {
      return Promise.reject(error);
    }
  },

  getPermissions: async () => {
    try {
      const user = supabase.auth.user();

      if (!user) {
        return Promise.resolve(null);
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      return Promise.resolve(profile?.role || "beneficiary");
    } catch (error) {
      console.warn("Failed to get permissions:", error);
      return Promise.resolve("beneficiary");
    }
  },

  getUserIdentity: async () => {
    try {
      const user = supabase.auth.user();

      if (!user) {
        return Promise.resolve(null);
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      return Promise.resolve({
        id: user.id,
        name: user.email || "User",
        email: user.email,
        role: profile?.role || "beneficiary",
      });
    } catch (error) {
      console.warn("Failed to get user identity:", error);
      return Promise.resolve(null);
    }
  },
};

export default authProvider;