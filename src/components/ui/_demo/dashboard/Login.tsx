// src/pages/auth/Login.tsx
import React, { FormEvent, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSimpleForm } from "@/hooks/useSimpleForm";
import { useAuth } from "@/hooks/useAuth";

export const Login: React.FC = () => {
  const { getFormData } = useSimpleForm();
  const { login, user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // przekierowanie po zalogowaniu
  useEffect(() => {
    if (user) {
      if (user.role === "admin") navigate("/admin/dashboard");
      else if (user.role === "contractor") navigate("/dashboard");
      else navigate("/");
    }
  }, [user, navigate]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const { email, password } = getFormData(e.currentTarget);

    try {
      setLoading(true);
      await login(email, password);
      // jeśli logowanie nie rzuci error, useEffect zajmie się redirectem
    } catch (err: any) {
      // złapany SupabaseError ma pole .message
      setError(err.message || "Coś poszło nie tak przy logowaniu");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <form
        onSubmit={handleSubmit}
        className="card w-full max-w-sm bg-base-100 shadow-lg p-6 space-y-4"
      >
        <h2 className="text-2xl font-bold text-center">Logowanie</h2>

        {error && (
          <div className="alert alert-error">
            <span>{error}</span>
          </div>
        )}

        <div className="form-control">
          <label className="label">
            <span className="label-text">Email</span>
          </label>
          <input
            type="email"
            name="email"
            required
            placeholder="twoj@email.pl"
            className="input input-bordered"
            disabled={authLoading || loading}
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Hasło</span>
          </label>
          <input
            type="password"
            name="password"
            required
            placeholder="••••••••"
            className="input input-bordered"
            disabled={authLoading || loading}
          />
        </div>

        <button
          type="submit"
          className={`btn btn-primary w-full ${loading ? "loading" : ""}`}
          disabled={authLoading || loading}
        >
          Zaloguj
        </button>
      </form>
    </div>
  );
};
