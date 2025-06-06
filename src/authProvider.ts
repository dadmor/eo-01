// src/authProvider.ts
import { AuthProvider } from "@pankod/refine-core";
import { supabase } from "./utility";

const authProvider: AuthProvider = {
  login: async ({ email, password, redirectPath }) => {
    const { user, error } = await supabase.auth.signIn({
      email,
      password,
    });
    
    if (error) {
      return Promise.reject(error);
    }
    
    return Promise.resolve(redirectPath || "/");
  },

  register: async ({ email, password }) => {
    const { user, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });
    
    if (signUpError) {
      return Promise.reject(signUpError);
    }
    
    if (user) {
      const { error: profileError } = await supabase.from("profiles").insert([
        {
          id: user.id,
          role: "beneficiary",
        },
      ]);
      
      if (profileError) {
        return Promise.reject(profileError);
      }
    }
    
    return Promise.resolve("/");
  },

  forgotPassword: async ({ email }) => {
    const { error } = await supabase.auth.api.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/update-password`,
    });
    
    if (error) {
      return Promise.reject(error);
    }
    
    return Promise.resolve();
  },

  updatePassword: async ({ password }) => {
    const { error } = await supabase.auth.update({ password });
    
    if (error) {
      return Promise.reject(error);
    }
    
    return Promise.resolve();
  },

  logout: async () => {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      return Promise.reject(error);
    }
    
    return Promise.resolve("/login");
  },

  checkError: () => Promise.resolve(),

  checkAuth: async () => {
    const session = supabase.auth.session();
    return session?.user ? Promise.resolve() : Promise.reject();
  },

  getPermissions: async () => {
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
  },

  getUserIdentity: async () => {
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
  },
};

export default authProvider;