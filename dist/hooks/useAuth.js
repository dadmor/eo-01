import { jsx as _jsx } from "react/jsx-runtime";
// src/hooks/useAuth.tsx
import { createContext, useContext, useState, useEffect, } from "react";
import { supabase } from "@/utility";
const AuthContext = createContext(undefined);
export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [delegatedUser, setDelegatedUser] = useState(null);
    const [loading, setLoading] = useState(true);
    async function fetchUser(id) {
        const { data, error } = await supabase
            .from("users")
            .select("id, email, role, first_name, last_name")
            .eq("id", id)
            .maybeSingle();
        if (error)
            throw error;
        if (data) {
            setUser(data);
        }
        else {
            const { data: { session }, } = await supabase.auth.getSession();
            if (session?.user) {
                const authUser = session.user;
                setUser({
                    id: authUser.id,
                    email: authUser.email ?? "",
                    role: authUser.role ?? "user",
                });
            }
        }
    }
    async function fetchDelegatedUser(id) {
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
    const handleSetDelegatedUser = async (userToDelegate) => {
        if (userToDelegate) {
            const canDelegate = await checkDelegationPermissions(user?.id, userToDelegate.id);
            if (canDelegate)
                setDelegatedUser(userToDelegate);
            else
                throw new Error("Brak uprawnień do delegacji dla tego użytkownika");
        }
        else {
            setDelegatedUser(null);
        }
    };
    async function checkDelegationPermissions(delegatorId, targetUserId) {
        if (!delegatorId || !targetUserId)
            return false;
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
        // ✅ Poprawione - async funkcja w środku
        const initializeAuth = async () => {
            const { data: { session }, } = await supabase.auth.getSession();
            if (session?.user)
                await fetchUser(session.user.id);
            setLoading(false);
        };
        initializeAuth();
        // ✅ Poprawione - callback nie zwraca Promise
        const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
            if (session?.user) {
                // Nie await'ujemy tutaj - fetchUser wykona się asynchronicznie
                fetchUser(session.user.id).catch(console.error);
            }
            else {
                setUser(null);
                setDelegatedUser(null);
            }
        });
        return () => {
            listener.subscription.unsubscribe();
        };
    }, []);
    async function login(email, password) {
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
            if (data.session?.user)
                await fetchUser(data.session.user.id);
        }
        finally {
            setLoading(false);
        }
    }
    async function logout() {
        const { error } = await supabase.auth.signOut();
        if (error)
            throw error;
        setUser(null);
        setDelegatedUser(null);
    }
    async function resendConfirmationEmail(email, options) {
        const { error } = await supabase.auth.resend({
            type: "signup",
            email,
            options: {
                emailRedirectTo: options?.emailRedirectTo ||
                    import.meta.env.VITE_SITE_URL + '/auth/callback' ||
                    window.location.origin + '/auth/callback',
            },
        });
        if (error)
            throw error;
    }
    return (_jsx(AuthContext.Provider, { value: {
            user,
            delegatedUser,
            loading,
            login,
            logout,
            resendConfirmationEmail,
            setDelegatedUser: handleSetDelegatedUser,
        }, children: children }));
}
export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx)
        throw new Error("useAuth must be used within AuthProvider");
    return ctx;
}
