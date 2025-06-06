// src/pages/auth/Login.tsx
import React from "react";
import { useLogin } from "@pankod/refine-core";
import { Link, useSearchParams } from "react-router-dom";
import { useSimpleForm } from "../../hooks/useSimpleForm";

export const Login: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { mutate: login, isLoading } = useLogin();
  const { getFormData } = useSimpleForm();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = getFormData(e.currentTarget);
    
    login({
      email: data.email,
      password: data.password,
      redirectPath: searchParams.get("to") || "/",
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          Zaloguj się do swojego konta
        </h2>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <input
            name="email"
            type="email"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Adres email"
          />
          <input
            name="password"
            type="password"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Hasło"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
          >
            {isLoading ? "Logowanie..." : "Zaloguj się"}
          </button>
          <div className="text-center">
            <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
              Nie masz konta? Zarejestruj się
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};
