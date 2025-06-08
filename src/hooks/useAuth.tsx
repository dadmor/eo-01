// src/hooks/useAuth.tsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { supabase } from "@/utility";

export type User = {
  id: string;
  email: string;
  role: string;
};

type AuthContextType = {
  user: User | null;
  delegatedUser: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  resendConfirmationEmail: (
    email: string,
    options?: { emailRedirectTo?: string }
  ) => Promise<void>;
  setDelegatedUser: (user: User | null) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [delegatedUser, setDelegatedUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  async function fetchUser(id: string) {
    const { data, error } = await supabase
      .from("users")
      .select("id, email, role, first_name, last_name")
      .eq("id", id)
      .maybeSingle();
    if (error) throw error;
    if (data) {
      setUser(data);
    } else {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user) {
        const authUser = session.user as any;
        setUser({
          id: authUser.id,
          email: authUser.email ?? "",
          role: authUser.role ?? "user",
        });
      }
    }
  }

  async function fetchDelegatedUser(id: string): Promise<User | null> {
    const { data, error } = await supabase
      .from("users")
      .select("id, email, role")
      .eq("id", id)
      .maybeSingle();
    if (error) {
      console.error("Error fetching delegated user:", error);
      return null;
    }
    return data;
  }

  const handleSetDelegatedUser = async (userToDelegate: User | null) => {
    if (userToDelegate) {
      const canDelegate = await checkDelegationPermissions(
        user?.id,
        userToDelegate.id
      );
      if (canDelegate) setDelegatedUser(userToDelegate);
      else throw new Error("Brak uprawnień do delegacji dla tego użytkownika");
    } else {
      setDelegatedUser(null);
    }
  };

  async function checkDelegationPermissions(
    delegatorId?: string,
    targetUserId?: string
  ): Promise<boolean> {
    if (!delegatorId || !targetUserId) return false;
    const { data, error } = await supabase
      .from("user_delegations")
      .select("*")
      .eq("delegator_id", delegatorId)
      .eq("target_user_id", targetUserId)
      .eq("is_active", true)
      .maybeSingle();
    if (error) {
      console.error("Error checking delegation permissions:", error);
      return false;
    }
    return !!data;
  }

  useEffect(() => {
    (async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user) await fetchUser(session.user.id);
      setLoading(false);
    })();

    const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
      if (session?.user) fetchUser(session.user.id);
      else {
        setUser(null);
        setDelegatedUser(null);
      }
    });
    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  async function login(email: string, password: string) {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        console.log("Login error from Supabase:", error);
        throw error;
      }
      if (data.session?.user) await fetchUser(data.session.user.id);
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setUser(null);
    setDelegatedUser(null);
  }

  async function resendConfirmationEmail(
    email: string,
    options?: { emailRedirectTo?: string }
  ) {
    const { error } = await supabase.auth.resend({
      type: "signup",
      email,
      options: {
        emailRedirectTo: options?.emailRedirectTo || window.location.origin,
      },
    });
    if (error) throw error;
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        delegatedUser,
        loading,
        login,
        logout,
        resendConfirmationEmail,
        setDelegatedUser: handleSetDelegatedUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
